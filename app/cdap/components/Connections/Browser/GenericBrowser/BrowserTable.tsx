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
import { humanReadableDate, objectQuery } from 'services/helpers';
import capitalize from 'lodash/capitalize';
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
interface IBrowserTable {
  selectedConnection: string;
  path: string;
  entities: any;
  onExplore: (entityName: string) => void;
  loading: boolean;
}

export function BrowserTable({
  loading,
  selectedConnection,
  path,
  entities,
  onExplore,
}: IBrowserTable) {
  const classes = useStyle();

  const getPath = (suffix) => (path === '/' ? `/${suffix}` : `${path}/${suffix}`);
  const properties = objectQuery(entities, 0, 'properties') || [];

  let headers = ['Name', 'Type'];
  headers = [...headers, ...properties.map((prop) => capitalize(prop.key))];
  const columnTemplate = headers.map(() => '1fr').join(' ');

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
            {headers.map((header) => {
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
                onClick={() => onExplore(entity.name)}
              >
                <TableCell>
                  <div className={classes.nameWrapper}>
                    <If condition={ICON_MAP[entity.type]}>{ICON_MAP[entity.type]}</If>
                    <div>{entity.name}</div>
                  </div>
                </TableCell>
                <TableCell>{entity.type}</TableCell>
                {entity.properties.map((prop) => {
                  return (
                    <TableCell key={prop.value}>
                      {format(prop.value, prop.type, { concise: true })}
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
