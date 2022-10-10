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
import React from 'react';
import T from 'i18n-react';
import makeStyle from '@material-ui/core/styles/makeStyles';
import { isNilOrEmptyString } from 'services/helpers';
import WidgetWrapper from 'components/shared/ConfigurationGroup/WidgetWrapper';
import Table from 'components/shared/Table';
import TableHeader from 'components/shared/Table/TableHeader';
import TableRow from 'components/shared/Table/TableRow';
import TableCell from 'components/shared/Table/TableCell';
import TableBody from 'components/shared/Table/TableBody';
import Tooltip from '@material-ui/core/Tooltip';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { getSelectedConnectorDisplayName } from '../reducer';

const I18NPREFIX = 'features.DataPrepConnections.AddConnections.ConnectionList';
const COLUMN_TEMPLATE = 'minmax(10rem, 2fr) 6fr 2fr';

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
      gridTemplateColumns: COLUMN_TEMPLATE,
      display: 'grid',
    },
    divider: {
      borderBottom: '1px solid var(--grey06)',
    },
    nestedRow: {
      padding: 0,
    },
    nestedCell: {
      padding: '13px 7px',
    },
    tooltip: {
      fontSize: '0.9rem',
      backgroundColor: theme.palette.grey[100],
    },
  };
});

export function ActiveConnectionTab({
  connector,
  allConnectorsPluginProperties,
  onConnectorSelection,
  search,
  onSearchChange,
}) {
  const classes = useStyle();

  return (
    <div className={classes.root}>
      <WidgetWrapper
        widgetProperty={{
          'widget-type': 'textbox',
          'widget-attributes': {
            placeholder: T.translate(`${I18NPREFIX}.searchPlaceholder`),
          },
          label: `${T.translate(`${I18NPREFIX}.searchLabel`)}`,
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

      <Table columnTemplate={COLUMN_TEMPLATE}>
        <TableHeader>
          <TableRow>
            <TableCell>{T.translate(`${I18NPREFIX}.Columns.name`)}</TableCell>
            <TableCell>{T.translate(`${I18NPREFIX}.Columns.description`)}</TableCell>
            <TableCell>{T.translate(`${I18NPREFIX}.Columns.artifact`)}</TableCell>
          </TableRow>
        </TableHeader>

        <TableBody>
          <List component="nav" disablePadding>
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
                const displayName = getSelectedConnectorDisplayName(
                  conn,
                  allConnectorsPluginProperties
                );
                return (
                  <React.Fragment key={i}>
                    <ListItem
                      divider
                      disableGutters
                      button={true}
                      className={classes.tableRow}
                      onClick={(event: any) => {
                        if (event.target.dataset.cell !== 'version-toggle') {
                          onConnectorSelection(conn);
                        }
                      }}
                      data-cy={`connector-${conn.name}`}
                      data-testid={`connector-${conn.name}`}
                    >
                      <TableCell>{displayName}</TableCell>
                      <TableCell>
                        <Tooltip title={conn.description} classes={{ tooltip: classes.tooltip }}>
                          <span>{conn.description}</span>
                        </Tooltip>
                      </TableCell>
                      <TableCell>{conn.artifact.name}</TableCell>
                    </ListItem>
                  </React.Fragment>
                );
              })}
          </List>
        </TableBody>
      </Table>
    </div>
  );
}
