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
import Paper from '@material-ui/core/Paper';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Theme } from '@material-ui/core';
import { getCategorizedConnections } from 'components/Connections/Browser/SidePanel/apiHelpers';
import { CategorizedConnections } from 'components/Connections/Browser/SidePanel/CategorizedConnections';
import { fetchConnectors } from 'components/Connections/Create/reducer';
import { CreateConnectionBtn } from 'components/Connections/CreateConnectionBtn';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import IconButton from '@material-ui/core/IconButton';
import { getCurrentNamespace } from 'services/NamespaceStore';
import { orderBy } from 'natural-orderby';
import { ConnectionsContext } from 'components/Connections/ConnectionsContext';

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
}

interface IConnectionBrowserSidePanelProps {
  onSidePanelToggle: () => void;
  onConnectionSelection: (conn: string) => void;
  selectedConnection: string;
}

export function ConnectionsBrowserSidePanel({
  onSidePanelToggle,
  onConnectionSelection,
  selectedConnection,
}: IConnectionBrowserSidePanelProps) {
  const classes = useStyle();
  const boundaryElement = React.useRef(null);
  const [state, setState] = React.useState<IConnectionsBrowserSidePanelState>({
    categorizedConnections: new Map(),
    connectorTypes: [],
  });
  const { disabledTypes } = React.useContext(ConnectionsContext);
  const initState = async () => {
    const categorizedConnections = await getCategorizedConnections();
    let connectorTypes = await fetchConnectors();
    connectorTypes = connectorTypes.filter((conn) => {
      return !disabledTypes[conn.name];
    });

    setState({
      categorizedConnections,
      connectorTypes: orderBy(connectorTypes, ['name'], ['asc']),
    });
  };
  React.useEffect(() => {
    initState();
  }, []);
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
        onConnectionSelection={onConnectionSelection}
        selectedConnection={selectedConnection}
        boundaryElement={boundaryElement}
        fetchConnections={initState}
      />
      <CreateConnectionBtn />
    </Paper>
  );
}
