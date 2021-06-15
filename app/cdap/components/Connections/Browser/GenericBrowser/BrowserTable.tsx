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

const ICON_MAP = {
  directory: <FolderIcon />,
  file: <DescriptionIcon />,
};

const RIGHT_ALIGN_PROP_TYPES = {
  NUMBER: true,
  SIZE_BYTES: true,
};

const useStyle = makeStyle(() => {
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
    emptyMessageContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
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
  const columnTemplate = `repeat(${propertyHeaders.length + 2}, 1fr)`;

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
            return (
              <TableRow
                key={i}
                to={`/ns/${getCurrentNamespace()}/connections/${selectedConnection}?path=${getPath(
                  entity.name
                )}`}
                onClick={() => onExplore(entity)}
              >
                <TableCell>
                  <div className={classes.nameWrapper}>
                    <If condition={ICON_MAP[entity.type]}>{ICON_MAP[entity.type]}</If>
                    <div>{entity.name}</div>
                  </div>
                </TableCell>
                <TableCell>{entity.type}</TableCell>
                {propertyHeaders.map((header) => {
                  const prop = entity.properties[header];
                  return (
                    <TableCell
                      key={header}
                      textAlign={prop && RIGHT_ALIGN_PROP_TYPES[prop.type] ? 'right' : 'left'}
                    >
                      {prop && format(prop.value, prop.type, { concise: true })}
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
