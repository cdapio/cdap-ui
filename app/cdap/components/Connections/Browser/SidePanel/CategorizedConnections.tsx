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

import React, { useState, useEffect } from 'react';
import MuiAccordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { makeStyles, StyleRules, Theme, withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { getCurrentNamespace } from 'services/NamespaceStore';
import If from 'components/shared/If';
import classnames from 'classnames';
import ActionsPopover, { IAction } from 'components/shared/ActionsPopover';
import { objectQuery } from 'services/helpers';
import DownloadFile from 'services/download-file';
import ConfirmationModal from 'components/shared/ConfirmationModal';
import CreateConnectionModal from 'components/Connections/CreateConnectionModal';
import { ConnectionsApi } from 'api/connections';
import { IConnectorType } from 'components/Connections/Browser/SidePanel';
import { getConnectionPath } from 'components/Connections/helper';
import { ConnectionConfigurationMode } from 'components/Connections/types';
import { getSelectedConnectorDisplayName } from 'components/Connections/Create/reducer';

interface ICategorizedConnectionsProps {
  categorizedConnections: Map<string, any[]>;
  connectorTypes: IConnectorType[];
  mapOfConnectorPluginProperties: { [key: string]: any };
  onConnectionSelection: (conn: string) => void;
  selectedConnection: string;
  boundaryElement: any;
  fetchConnections: () => void;
  hideAddConnection?: boolean;
}
const Accordion = withStyles({
  root: {
    border: '1px solid rgba(0, 0, 0, .125)',
    boxShadow: 'none',
    background: 'transparent',
    borderRight: 0,
    '&:not(:last-child)': {
      borderBottom: 0,
      borderRight: 0,
    },
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
  },
  expanded: {},
})(MuiAccordion);

const CustomAccordionSummary = withStyles((theme) => ({
  root: {
    minHeight: `${theme.spacing(4)}px`,
    '&$expanded': {
      minHeight: `${theme.spacing(4)}px`,
    },
  },
  content: {
    '&$expanded': {
      margin: `${theme.spacing(1.25)}px 0`,
    },
  },
  expanded: {},
}))(AccordionSummary);

const CustomAccordionDetails = withStyles((theme) => ({
  root: {
    padding: 0,
    gap: '10px',
    display: 'flex',
    flexDirection: 'column',
  },
}))(AccordionDetails);

const useStyle = makeStyles<Theme>(
  (theme): StyleRules => {
    return {
      connectionGroup: {
        '& a': {
          width: '249px',
          overflowX: 'hidden',
          '& .connection-name': {
            overflowX: 'hidden',
            textOverflow: 'ellipsis',
          },
        },
        display: 'flex',
        flexDirection: 'row',
        minHeight: `${theme.spacing(4)}px`,
      },
      connection: {
        color: 'black',
        paddingLeft: `${theme.spacing(4)}px`,
        display: 'flex',
        alignItems: 'center',
        '&:hover': {
          textDecoration: 'none',
          color: 'inherit',
        },
        '&:hover > span': {
          fontWeight: 600,
          color: 'black',
        },
      },
      upload: {
        display: 'block',
        padding: '10px 15px',
        color: theme.palette.grey[50],
        '&:hover': {
          textDecoration: 'none',
          color: theme.palette.grey[50],
          fontWeight: 600,
        },
        '&$selectedConnection': {
          fontWeight: 600,
          '&:hover': {
            fontWeight: 600,
          },
        },
      },
      selectedConnection: {
        background: 'white',
        '&:hover': {
          color: theme.palette.primary.main,
          fontWeight: 'normal',
        },
        '& a': {
          color: theme.palette.primary.main,
        },
      },
      actionPopover: {
        // display table to vertically align popoover buttons in the middle
        display: 'table',
        '&:hover': {
          fontWeight: 'normal',
        },
        '& [tag=span]': {
          display: 'table-cell',
          verticalAlign: 'middle',
        },
      },
      delete: {
        color: theme.palette.red[100],
      },
    };
  }
);
function getActiveCategory(selectedConnection: string, categorizedConnections: Map<string, any[]>) {
  const entries = Array.from(categorizedConnections.entries());
  if (!entries || (Array.isArray(entries) && !entries.length)) {
    return null;
  }
  for (const [category, connectors] of entries) {
    const isActive = connectors.find((connector) => connector.name === selectedConnection);
    if (isActive) {
      return category;
    }
  }
  return null;
}

function getConnectionConfig(conn) {
  const connectionConfig = {
    name: conn.name,
    description: conn.description,
    category: conn.plugin.category,
    plugin: conn.plugin,
  };

  return connectionConfig;
}

export function CategorizedConnections({
  categorizedConnections = new Map(),
  connectorTypes = [],
  mapOfConnectorPluginProperties = null,
  onConnectionSelection,
  selectedConnection,
  boundaryElement,
  fetchConnections,
  hideAddConnection,
}: ICategorizedConnectionsProps) {
  const classes = useStyle();
  const activeCategory = selectedConnection
    ? getActiveCategory(selectedConnection, categorizedConnections)
    : null;
  const [currentActiveAccordion, setCurrentActiveAccordion] = useState(activeCategory);
  const [localSelectedConnection, setLocalSelectedConnection] = useState(selectedConnection);
  const [isCreateConnectionOpen, setIsCreateConnectionOpen] = useState(false);
  const [initConnConfig, setInitConnConfig] = useState(null);
  const [connectionToDelete, setConnectionToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [createConnectionMode, setCreateConnectionMode] = useState(
    ConnectionConfigurationMode.CREATE
  );

  useEffect(() => {
    const currentCategory = selectedConnection
      ? getActiveCategory(selectedConnection, categorizedConnections)
      : null;
    setCurrentActiveAccordion(currentCategory);
  }, [categorizedConnections]);

  useEffect(() => {
    setLocalSelectedConnection(selectedConnection);
  }, [selectedConnection]);

  const handleChange = (tabName) => {
    if (currentActiveAccordion === tabName) {
      setCurrentActiveAccordion('');
    } else {
      setCurrentActiveAccordion(tabName);
    }
  };

  function exportConnection(conn) {
    const connectionConfig = getConnectionConfig(conn);
    const artifact = conn?.plugin?.artifact || {};

    DownloadFile(
      connectionConfig,
      null,
      `${conn.name}-connector-${artifact.name}-${artifact.version}`
    );
  }

  function cloneConnection(conn) {
    const config = getConnectionConfig(conn);
    delete config.name;

    openConnectionConfig(config);
  }

  function openConnectionConfig(config) {
    setInitConnConfig(config);
    toggleConnectionCreate();
  }

  function editConnection(conn) {
    const config = getConnectionConfig(conn);
    setCreateConnectionMode(ConnectionConfigurationMode.EDIT);
    openConnectionConfig(config);
  }

  function viewConnection(conn) {
    const config = getConnectionConfig(conn);
    setCreateConnectionMode(ConnectionConfigurationMode.VIEW);
    openConnectionConfig(config);
  }

  function handleConfirmationClose() {
    setConnectionToDelete(null);
    setDeleteError(null);
  }

  function toggleConnectionCreate() {
    const newState = !isCreateConnectionOpen;

    setIsCreateConnectionOpen(newState);

    if (!newState) {
      setInitConnConfig(null);
      setCreateConnectionMode(ConnectionConfigurationMode.CREATE);
    }
  }

  function handleDelete() {
    if (!connectionToDelete) {
      return;
    }

    const params = {
      context: getCurrentNamespace(),
      connectionId: connectionToDelete.name,
    };

    return ConnectionsApi.deleteConnection(params).subscribe(
      () => {
        handleConfirmationClose();
        fetchConnections();
      },
      (err) => {
        setDeleteError(err);
      }
    );
  }

  function getConnectionActions(conn): IAction[] {
    if (!conn.preConfigured) {
      return [
        {
          label: 'Edit',
          actionFn: () => editConnection(conn),
        },
        {
          label: 'Export',
          actionFn: () => exportConnection(conn),
        },
        {
          label: 'Duplicate',
          actionFn: () => cloneConnection(conn),
        },
        {
          label: 'separator',
        },
        {
          label: 'Delete',
          actionFn: () => setConnectionToDelete(conn),
          className: classes.delete,
        },
      ];
    } else {
      return [
        {
          label: 'View',
          actionFn: () => viewConnection(conn),
        },
      ];
    }
  }

  const popperModifiers = {
    preventOverflow: {
      enabled: true,
      boundariesElement: objectQuery(boundaryElement, 'current'),
    },
    hide: {
      enabled: false,
    },
  };

  let confirmDeleteElem;
  if (connectionToDelete) {
    confirmDeleteElem = (
      <div>
        Are you sure you want to delete{' '}
        <strong>
          <em>{connectionToDelete.name}</em>
        </strong>
        ?
      </div>
    );
  }

  return (
    <div>
      <If condition={!hideAddConnection}>
        <Link
          to={`/ns/${getCurrentNamespace()}/connection-upload`}
          className={classnames(classes.upload, {
            [classes.selectedConnection]: !localSelectedConnection,
          })}
        >
          Upload
        </Link>
      </If>
      {connectorTypes.map((connectorType) => {
        const key = connectorType.name;
        const connections = categorizedConnections.get(key) || [];
        const displayName = getSelectedConnectorDisplayName(
          connectorType,
          mapOfConnectorPluginProperties
        );

        return (
          <Accordion
            square
            expanded={currentActiveAccordion === key}
            onChange={() => handleChange(key)}
            key={key}
          >
            <CustomAccordionSummary
              expandIcon={<ExpandMoreIcon />}
              data-cy={`categorized-connection-type-${key}`}
              data-testid={`categorized-connection-type-${key}`}
            >
              {displayName}({connections.length})
            </CustomAccordionSummary>
            <CustomAccordionDetails>
              {connections.map((connection) => {
                const actions = getConnectionActions(connection);

                return (
                  <div
                    className={classnames(classes.connectionGroup, {
                      [classes.selectedConnection]: localSelectedConnection === connection.name,
                    })}
                    data-testid={`connection-container-${key}-${connection.name}`}
                  >
                    <Link
                      to={getConnectionPath(connection.name)}
                      key={connection.name}
                      onClick={() => onConnectionSelection(connection.name)}
                      className={classes.connection}
                    >
                      <If condition={localSelectedConnection === connection.name}>
                        <strong
                          className="connection-name"
                          data-cy={`connection-${key}-${connection.name}`}
                          data-testid={`connection-${key}-${connection.name}`}
                        >
                          {connection.name}
                        </strong>
                      </If>
                      <If condition={localSelectedConnection !== connection.name}>
                        <span
                          className="connection-name"
                          data-cy={`connection-${key}-${connection.name}`}
                          data-testid={`connection-${key}-${connection.name}`}
                        >
                          {connection.name}
                        </span>
                      </If>
                    </Link>

                    <If condition={!hideAddConnection}>
                      <ActionsPopover
                        className={classes.actionPopover}
                        actions={actions}
                        modifiers={popperModifiers}
                      />
                    </If>
                  </div>
                );
              })}
            </CustomAccordionDetails>
          </Accordion>
        );
      })}
      <ConfirmationModal
        headerTitle="Delete connection"
        toggleModal={handleConfirmationClose}
        confirmationElem={confirmDeleteElem}
        confirmButtonText="Delete"
        confirmFn={handleDelete}
        cancelFn={handleConfirmationClose}
        isOpen={!!connectionToDelete}
        errorMessage={!deleteError ? '' : 'Failed to delete connection'}
        extendedMessage={deleteError}
      />

      <CreateConnectionModal
        isOpen={isCreateConnectionOpen}
        onToggle={toggleConnectionCreate}
        initialConfig={initConnConfig}
        onCreate={fetchConnections}
        mode={createConnectionMode}
      />
    </div>
  );
}
