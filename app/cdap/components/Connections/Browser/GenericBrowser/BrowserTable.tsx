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
import Table from 'components/Table';
import TableHeader from 'components/Table/TableHeader';
import TableRow from 'components/Table/TableRow';
import TableCell from 'components/Table/TableCell';
import TableBody from 'components/Table/TableBody';
import If from 'components/If';
import { getCurrentNamespace } from 'services/NamespaceStore';
import makeStyle from '@material-ui/core/styles/makeStyles';
import FolderIcon from '@material-ui/icons/Folder';
import DescriptionIcon from '@material-ui/icons/Description';
import Heading, { HeadingTypes } from 'components/Heading';
import LoadingSVG from 'components/LoadingSVG';
import { format } from 'services/DataFormatter';
import IconSVG from 'components/IconSVG';

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
}: IBrowserTable) {
  const classes = useStyle();

  const getPath = (suffix) => (path === '/' ? `/${suffix}` : `${path}/${suffix}`);
  const headerTypeMap = getTypesByHeader(propertyHeaders, entities);
  const columnTemplate =
    propertyHeaders && propertyHeaders.length > 0
      ? `2fr 1fr ${propertyHeaders.map((h) => getPropertyColumnWidth(headerTypeMap[h])).join(' ')}`
      : '2fr 1fr';

  let headers = ['Name', 'Type'];
  headers = [...headers, ...propertyHeaders];

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
      <Table columnTemplate={columnTemplate}>
        <TableHeader>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Type</TableCell>
            {propertyHeaders.map((header) => {
              return <TableCell key={header}>{header}</TableCell>;
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {entities.map((entity, i) => {
            const canInteract = entity.canBrowse || entity.canSample;
            const onClickHandler = canInteract ? () => onExplore(entity) : undefined;
            const toLink = entity.canBrowse
              ? `/ns/${getCurrentNamespace()}/connections/${selectedConnection}?path=${getPath(
                  entity.name
                )}`
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
                {propertyHeaders.map((header) => {
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
