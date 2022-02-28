/*
 * Copyright © 2021 Cask Data, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

import * as React from 'react';
import Table from 'components/shared/Table';
import TableHeader from 'components/shared/Table/TableHeader';
import TableRow from 'components/shared/Table/TableRow';
import TableCell from 'components/shared/Table/TableCell';
import TableBody from 'components/shared/Table/TableBody';
import If from 'components/shared/If';
import makeStyle from '@material-ui/core/styles/makeStyles';
import FolderIcon from '@material-ui/icons/Folder';
import DescriptionIcon from '@material-ui/icons/Description';
import Heading, { HeadingTypes } from 'components/shared/Heading';
import LoadingSVG from 'components/shared/LoadingSVG';
import { format } from 'services/DataFormatter';
import IconSVG from 'components/shared/IconSVG';
import Button from '@material-ui/core/Button';
import { getConnectionPath } from 'components/Connections/helper';

const SAMPLE_DEFAULT_TYPE = 'SAMPLE_DEFAULT';

function getIcon(entity, classes) {
  const type = entity.type.toLowerCase();

  switch (type) {
    case 'bucket':
      return <IconSVG name="icon-S3_bucket" className={classes.icon} />;
    case 'directory':
      return <FolderIcon />;
    case 'file':
      return <DescriptionIcon />;
    case 'dataset': // fall-through
    case 'instance': // fall-through
    case 'database':
      return <IconSVG name="icon-database" className={classes.icon} />;
    case 'schema':
      return <IconSVG name="icon-schemaedge" className={classes.icon} />;
    case 'table':
      return <IconSVG name="icon-table" className={classes.icon} />;
    case 'topic':
      return <IconSVG name="icon-kafka" className={classes.icon} />;
  }

  if (entity.canBrowse) {
    return <FolderIcon />;
  }
  return <DescriptionIcon />;
}

const RIGHT_ALIGN_PROP_TYPES = {
  NUMBER: true,
  SIZE_BYTES: true,
};

const useStyle = makeStyle((theme) => {
  return {
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      opacity: 0.5,
      background: 'white',
      position: 'absolute',
      top: 0,
      width: '100%',
    },
    nameWrapper: {
      display: 'flex',
      gap: '5px',
    },
    nameElement: {
      overflowX: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    emptyMessageContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    disabled: {
      color: theme.palette.grey[200],
    },
    icon: {
      height: '1.25rem',
    },
    pointer: {
      cursor: 'pointer',
    },
  };
});
interface IBrowseEntity {
  canBrowse: boolean;
  canSample: boolean;
  name: string;
  type: string;
  path: string;
}
interface IBrowserTable {
  selectedConnection: string;
  path: string;
  entities: any;
  onExplore: (entityName: IBrowseEntity) => void;
  loading: boolean;
  propertyHeaders: string[];
  isSelectMode: boolean;
  loadEntitySpec: (entityName: IBrowseEntity) => void;
}

function getTypesByHeader(headers, entities) {
  const typeMap = {};
  if (!entities || entities.length === 0) {
    return typeMap;
  }

  let foundTypes = 0;
  for (let i = 0; foundTypes < headers.length && i < entities.length; i++) {
    const props = entities[i].properties;
    headers.forEach((h) => {
      if (!typeMap[h] && props[h]) {
        typeMap[h] = props[h].type;
        foundTypes++;
      }
    });
  }
  return typeMap;
}

function removeSampleDefaultHeaders(headers, typeMap) {
  const updatedHeaders = [];
  headers.forEach((h) => {
    if (typeMap[h] !== SAMPLE_DEFAULT_TYPE) {
      updatedHeaders.push(h);
    }
  });
  return updatedHeaders;
}

function getPropertyColumnWidth(type) {
  if (type === 'NUMBER' || type === 'SIZE_BYTES') {
    return '6rem';
  }
  return '1fr';
}

export function BrowserTable({
  loading,
  selectedConnection,
  path,
  propertyHeaders,
  entities,
  onExplore,
  isSelectMode,
  loadEntitySpec,
}: IBrowserTable) {
  const classes = useStyle();
  // Allow partial selection only in studio's browse mode and not in wrangler.
  const hasSelectable = isSelectMode && entities.some((entity: IBrowseEntity) => entity.canBrowse);
  const actionColumnWidth = hasSelectable ? ' 0.5fr' : '';
  const headerTypeMap = getTypesByHeader(propertyHeaders, entities);
  const propertyHeadersToUse = removeSampleDefaultHeaders(propertyHeaders, headerTypeMap);
  const columnTemplate =
    propertyHeadersToUse && propertyHeadersToUse.length > 0
      ? `2fr 1fr ${propertyHeadersToUse
          .map((h) => getPropertyColumnWidth(headerTypeMap[h]))
          .join(' ')}${actionColumnWidth}`
      : `2fr 1fr${actionColumnWidth}`;

  let headers = ['Name', 'Type'];
  headers = [...headers, ...propertyHeadersToUse];

  const onEntitySelect = (entity: IBrowseEntity, event: React.SyntheticEvent) => {
    loadEntitySpec(entity);
    event.preventDefault();
    event.stopPropagation();
  };

  if (!loading && (!Array.isArray(entities) || (Array.isArray(entities) && !entities.length))) {
    return (
      <Heading
        type={HeadingTypes.h4}
        label="No entities available"
        className={classes.emptyMessageContainer}
      />
    );
  }

  return (
    <>
      <Table columnTemplate={columnTemplate} dataCy="connection-browser">
        <TableHeader>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Type</TableCell>
            {propertyHeadersToUse.map((header) => {
              return <TableCell key={header}>{header}</TableCell>;
            })}
            {hasSelectable && <TableCell>Actions</TableCell>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {entities.map((entity, i) => {
            const canInteract = entity.canBrowse || entity.canSample;
            const onClickHandler = canInteract ? () => onExplore(entity) : undefined;
            const toLink = entity.canBrowse
              ? getConnectionPath(selectedConnection, entity.path)
              : undefined;
            return (
              <TableRow
                key={i}
                to={toLink}
                onClick={onClickHandler}
                hover={canInteract}
                className={canInteract ? classes.pointer : classes.disabled}
              >
                <TableCell>
                  <div className={classes.nameWrapper}>
                    {getIcon(entity, classes)}
                    <div className={classes.nameElement}>{entity.name}</div>
                  </div>
                </TableCell>
                <TableCell>{entity.type}</TableCell>
                {propertyHeadersToUse.map((header) => {
                  const prop = entity.properties[header];
                  return (
                    <TableCell
                      key={header}
                      textAlign={RIGHT_ALIGN_PROP_TYPES[headerTypeMap[header]] ? 'right' : 'left'}
                    >
                      {prop ? format(prop.value, prop.type, { concise: true }) : '--'}
                    </TableCell>
                  );
                })}
                {hasSelectable && entity.canBrowse && (
                  <TableCell>
                    <Button variant="contained" onClick={onEntitySelect.bind(null, entity)}>
                      Select
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <If condition={loading}>
        <div className={classes.loadingContainer}>
          <LoadingSVG />
        </div>
      </If>
    </>
  );
}
