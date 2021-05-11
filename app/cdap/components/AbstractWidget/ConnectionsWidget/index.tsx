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
import If from 'components/If';
import { ConnectionsApi } from 'api/connections';
import { humanReadableDate, objectQuery } from 'services/helpers';
import { getCurrentNamespace } from 'services/NamespaceStore';
import Table from 'components/Table';
import TableHeader from 'components/Table/TableHeader';
import TableRow from 'components/Table/TableRow';
import TableCell from 'components/Table/TableCell';
import TableBody from 'components/Table/TableBody';
import PipelineModal from 'components/PipelineModal';

const useStyle = makeStyles((theme) => {
  return {
    tableRow: {
      cursor: 'pointer',
    },
  };
});

interface IConnectionWidgetProps {
  connectionType?: string;
}

interface IConnectionProps extends IWidgetProps<IConnectionWidgetProps> {}

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
      setLoading(true);
    }

    setIsModalOpen(!isModalOpen);
  }

  function fetchConnectionsList() {
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
    const PREFIX = '${conn(';
    const SUFFIX = ')}';
    const connectionName = `${PREFIX}${connection.name}${SUFFIX}`;

    onChange(connectionName);
    toggleModal();
  }

  return (
    <React.Fragment>
      <div>
        <div>
          <strong data-cy={dataCy}>{value}</strong>
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
        <Table columnTemplate="2fr 1fr 1fr">
          <TableHeader>
            <TableRow>
              <TableCell>Name</TableCell>
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

export default ConnectionsWidget;
