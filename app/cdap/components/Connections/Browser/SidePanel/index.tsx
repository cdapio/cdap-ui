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

import React, { useContext, useEffect, useState, useRef } from 'react';
import Paper from '@material-ui/core/Paper';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Theme } from '@material-ui/core';
import { getCategorizedConnections } from 'components/Connections/Browser/SidePanel/apiHelpers';
import { CategorizedConnections } from 'components/Connections/Browser/SidePanel/CategorizedConnections';
import {
  fetchAllConnectorPluginProperties,
  fetchConnectors,
  getMapOfConnectorToPluginProperties,
} from 'components/Connections/Create/reducer';
import { CreateConnectionBtn } from 'components/Connections/CreateConnectionBtn';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import IconButton from '@material-ui/core/IconButton';
import { getCurrentNamespace } from 'services/NamespaceStore';
import { orderBy } from 'natural-orderby';
import { sortedUniqBy } from 'lodash';
import { ConnectionsContext, IConnectionMode } from 'components/Connections/ConnectionsContext';
import AddConnectionBtnModal from 'components/Connections/AddConnectionBtnModal';
import CreateConnectionModal from 'components/Connections/CreateConnectionModal';
import If from 'components/shared/If';

const useStyle = makeStyles<Theme>((theme) => {
  return {
    root: {
      display: 'grid',
      gridTemplateColumns: '100%',
      gridTemplateRows: '50px 1fr auto',
      backgroundColor: theme.palette.grey[600],
      paddingBottom: `${theme.spacing(1)}px`,
      overflowY: 'auto',
      overflowX: 'hidden',
    },
    toggleContainer: {
      padding: `${theme.spacing(2)}px ${theme.spacing(1)}px`,
      fontWeight: 'bold',
      cursor: 'pointer',
    },
    buttonContainer: {
      textAlign: 'center',
      display: 'flex',
      justifyContent: 'center',
      alignContent: 'center',
      padding: '10px',
    },
    addConnectionBtn: {
      width: '100%',
    },
  };
});

export interface IConnectorType {
  name: string;
  type: string;
  category: string;
  description: string;
  artifact: {
    name: string;
    version: string;
    scope: string;
  };
}

interface IConnectionsBrowserSidePanelState {
  categorizedConnections: Map<string, any[]>;
  connectorTypes: IConnectorType[];
  mapOfConnectorPluginProperties: { [key: string]: any };
}

interface IConnectionBrowserSidePanelProps {
  onSidePanelToggle: () => void;
  onConnectionSelection: (conn: string) => void;
  selectedConnection: string;
  selectedConnectorType?: string;
  hideAddConnection?: boolean;
}

export function ConnectionsBrowserSidePanel({
  onSidePanelToggle,
  onConnectionSelection,
  selectedConnection,
  selectedConnectorType,
  hideAddConnection,
}: IConnectionBrowserSidePanelProps) {
  const { mode } = useContext(ConnectionsContext);

  const classes = useStyle();
  const boundaryElement = useRef(null);
  const [state, setState] = useState<IConnectionsBrowserSidePanelState>({
    categorizedConnections: new Map(),
    connectorTypes: [],
    mapOfConnectorPluginProperties: null,
  });
  const { disabledTypes } = useContext(ConnectionsContext);
  const [createConnOpen, setCreateConnOpen] = useState(false);

  const initState = async () => {
    const categorizedConnections = await getCategorizedConnections();
    let connectorTypes = await fetchConnectors();
    connectorTypes = connectorTypes.filter((conn) => {
      return !disabledTypes[conn.name];
    });
    const allConnectorsPluginProperties = await fetchAllConnectorPluginProperties(connectorTypes);
    const mapOfConnectorPluginProperties = getMapOfConnectorToPluginProperties(
      allConnectorsPluginProperties
    );
    if (selectedConnectorType) {
      const connectionTypeLower = selectedConnectorType.toLowerCase();
      const filteredConnectorTypes = connectorTypes.filter((conn) => {
        return connectionTypeLower === conn.name.toLowerCase();
      });
      if (filteredConnectorTypes.length > 0) {
        connectorTypes = filteredConnectorTypes;
      }
    }
    connectorTypes = orderBy(connectorTypes, ['name'], ['asc']);
    connectorTypes = sortedUniqBy(connectorTypes, (ct) => ct.name);

    setState({
      categorizedConnections,
      connectorTypes,
      mapOfConnectorPluginProperties,
    });
  };

  useEffect(() => {
    initState();
  }, []);
  let connectionBtn;
  if (mode === IConnectionMode.ROUTED) {
    connectionBtn = <CreateConnectionBtn />;
  } else {
    connectionBtn = (
      <AddConnectionBtnModal className={classes.addConnectionBtn} onCreate={initState} />
    );
  }
  return (
    <Paper className={classes.root} ref={boundaryElement}>
      <div className={classes.toggleContainer} onClick={onSidePanelToggle}>
        <IconButton size="small">
          <ArrowBackIosIcon fontSize="inherit" />
        </IconButton>
        <span> Connections in "{getCurrentNamespace()}" </span>
      </div>
      <CategorizedConnections
        connectorTypes={state.connectorTypes}
        categorizedConnections={state.categorizedConnections}
        mapOfConnectorPluginProperties={state.mapOfConnectorPluginProperties}
        onConnectionSelection={onConnectionSelection}
        selectedConnection={selectedConnection}
        boundaryElement={boundaryElement}
        fetchConnections={initState}
        hideAddConnection={hideAddConnection}
      />

      <CreateConnectionModal
        isOpen={createConnOpen}
        onToggle={() => setCreateConnOpen(!createConnOpen)}
        initialConfig={null}
        onCreate={initState}
      />

      <If condition={!hideAddConnection}>
        <div className={classes.buttonContainer}>{connectionBtn}</div>
      </If>
    </Paper>
  );
}
