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
import makeStyle from '@material-ui/core/styles/makeStyles';
import { isNilOrEmptyString } from 'services/helpers';
import WidgetWrapper from 'components/ConfigurationGroup/WidgetWrapper';
import Table from 'components/Table';
import TableHeader from 'components/Table/TableHeader';
import TableRow from 'components/Table/TableRow';
import TableCell from 'components/Table/TableCell';
import TableBody from 'components/Table/TableBody';
import TableColumnGroup from 'components/Table/TableColumnGroup';
import ColumnGroup from 'components/Table/ColumnGroup';
import Tooltip from '@material-ui/core/Tooltip';

const useStyle = makeStyle((theme) => {
  return {
    root: {
      display: 'grid',
      gridTemplateRows: '40px auto',
      gridGap: '10px',
      padding: '10px',
      height: '100%',
    },
    tableRow: {
      cursor: 'pointer',
    },
    tooltip: {
      fontSize: '0.9rem',
      backgroundColor: theme.palette.grey[100],
    },
  };
});

export function ActiveConnectionTab({ connector, onConnectorSelection, search, onSearchChange }) {
  const classes = useStyle();

  return (
    <div className={classes.root}>
      <WidgetWrapper
        widgetProperty={{
          'widget-type': 'textbox',
          'widget-attributes': {
            placeholder: 'Search connection type',
          },
          label: 'Search',
          name: 'search',
        }}
        pluginProperty={{
          name: 'search',
          macroSupported: false,
          required: false,
        }}
        value={search}
        onChange={onSearchChange}
      />

      <Table columnTemplate="minmax(10rem, 1fr) 6fr 2fr 1.5fr 1fr">
        <TableHeader>
          <TableColumnGroup>
            <ColumnGroup gridColumn="3 / span 3">Artifact Information</ColumnGroup>
          </TableColumnGroup>

          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Artifact</TableCell>
            <TableCell>Version</TableCell>
            <TableCell>Scope</TableCell>
          </TableRow>
        </TableHeader>

        <TableBody>
          {connector
            .filter((conn) => {
              if (isNilOrEmptyString(search)) {
                return conn;
              }
              if (conn.name.toLowerCase().indexOf(search.toLowerCase()) >= 0) {
                return conn;
              }
              return false;
            })
            .map((conn, i) => {
              return (
                <TableRow
                  key={i}
                  className={classes.tableRow}
                  onClick={() => onConnectorSelection(conn)}
                  data-cy={`connector-${conn.name}`}
                >
                  <TableCell>{conn.name}</TableCell>
                  <TableCell>
                    <Tooltip title={conn.description} classes={classes}>
                      <span>{conn.description}</span>
                    </Tooltip>
                  </TableCell>
                  <TableCell>{conn.artifact.name}</TableCell>
                  <TableCell>{conn.artifact.version}</TableCell>
                  <TableCell>{conn.artifact.scope}</TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </div>
  );
}
