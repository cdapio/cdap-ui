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

import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { IWidgetProps } from 'components/AbstractWidget';
import If from 'components/shared/If';
import { ConnectionsApi } from 'api/connections';
import { humanReadableDate, objectQuery } from 'services/helpers';
import { getCurrentNamespace } from 'services/NamespaceStore';
import Table from 'components/shared/Table';
import TableHeader from 'components/shared/Table/TableHeader';
import TableRow from 'components/shared/Table/TableRow';
import TableCell from 'components/shared/Table/TableCell';
import TableBody from 'components/shared/Table/TableBody';
import PipelineModal from 'components/PipelineModal';
import AddConnectionBtnModal from 'components/Connections/AddConnectionBtnModal';
import ImportConnectionBtn from 'components/Connections/ImportConnectionBtn';
import classnames from 'classnames';

const useStyle = makeStyles((theme) => {
  return {
    tableRow: {
      cursor: 'pointer',
    },
    btnContainer: {
      marginBottom: '10px',
      textAlign: 'right',
    },
    btn: {
      marginRight: '10px',
    },
    displayBox: {
      border: `1px solid ${theme.palette.grey[300]}`,
      padding: '3px 7px',
      marginTop: '5px',
    },
    disabled: {
      padding: '5px 0',
    },
  };
});

interface IConnectionWidgetProps {
  connectionType?: string;
}

interface IConnectionProps extends IWidgetProps<IConnectionWidgetProps> {}

const PREFIX = '${conn(';
const SUFFIX = ')}';

const ConnectionsWidget: React.FC<IConnectionProps> = ({
  value,
  onChange,
  widgetProps,
  disabled,
  dataCy,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(false);

  const classes = useStyle();

  const connectionType = objectQuery(widgetProps, 'connectionType');

  function toggleModal() {
    const newState = !isModalOpen;

    if (newState) {
      fetchConnectionsList();
    }

    setIsModalOpen(!isModalOpen);
  }

  function fetchConnectionsList() {
    setLoading(true);

    ConnectionsApi.listConnections({ context: getCurrentNamespace() }).subscribe((res) => {
      let connectionsList = res;

      if (connectionType) {
        connectionsList = res.filter((conn) => conn.connectionType === connectionType);
      }

      setConnections(connectionsList);
      setLoading(false);
    });
  }

  function handleClick(connection) {
    const connectionName = `${PREFIX}${connection.name}${SUFFIX}`;

    onChange(connectionName);
    toggleModal();
  }

  const displayValue = extractConnectionName(value);

  return (
    <React.Fragment>
      <div>
        <div
          className={classnames({
            [classes.displayBox]: !disabled && !!value,
            [classes.disabled]: disabled,
          })}
        >
          <strong data-cy={dataCy}>{displayValue}</strong>
        </div>
        <If condition={!disabled && !!value}>
          <br />
        </If>
        <If condition={!disabled}>
          <Button variant="contained" color="primary" onClick={toggleModal}>
            Browse Connections
          </Button>
        </If>
      </div>

      <PipelineModal
        isOpen={isModalOpen}
        toggle={toggleModal}
        header="Browse Connections"
        loading={loading}
      >
        <div className={classes.btnContainer}>
          <AddConnectionBtnModal className={classes.btn} onCreate={fetchConnectionsList} />
          <ImportConnectionBtn className={classes.btn} onCreate={fetchConnectionsList} />
        </div>
        <Table columnTemplate="2fr 2fr 1fr 1fr">
          <TableHeader>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Installed on</TableCell>
            </TableRow>
          </TableHeader>

          <TableBody>
            {connections.map((conn) => {
              return (
                <TableRow
                  key={conn.name}
                  onClick={() => handleClick(conn)}
                  className={classes.tableRow}
                >
                  <TableCell>{conn.name}</TableCell>
                  <TableCell>{conn.description}</TableCell>
                  <TableCell>{conn.connectionType}</TableCell>
                  <TableCell>{humanReadableDate(conn.createdTimeMillis, true)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </PipelineModal>
    </React.Fragment>
  );
};

export function extractConnectionName(connection) {
  if (!connection) {
    return null;
  }

  const startIndex = connection.indexOf(PREFIX);
  const endIndex = connection.lastIndexOf(SUFFIX);

  if (startIndex === -1 || endIndex === -1) {
    return null;
  }

  return connection.slice(startIndex + PREFIX.length, endIndex);
}

export function isConnection(connection) {
  if (!connection) {
    return false;
  }

  return connection.startsWith(PREFIX) && connection.endsWith(SUFFIX);
}

export default ConnectionsWidget;
