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
import { Theme } from 'services/ThemeHelper';
import { ConnectionRoutes } from 'components/Connections/Routes';
import { MemoryRouter, Redirect } from 'react-router';
import { Route } from 'react-router-dom';
import { getCurrentNamespace } from 'services/NamespaceStore';
import PipelineMetricsStore from 'services/PipelineMetricsStore';

import {
  IConnectionMode,
  IConnections,
  ConnectionsContext,
} from 'components/Connections/ConnectionsContext';
import makeStyle from '@material-ui/core/styles/makeStyles';
import { useEffect, useRef, useState } from 'react';
import { ConnectionsApi } from 'api/connections';
import LoadingSVGCentered from 'components/shared/LoadingSVGCentered';

const useStyle = makeStyle(() => {
  return {
    container: {
      height: '100%',
      overflow: 'hidden',
    },
  };
});

function RedirectIfDefaultConnection({ path, connectionId, initialConnectionId }) {
  // useRef instead of useState to avoid risk of feedback loop
  const redirected = useRef(false);

  if (
    // nothing provided by parent of <Connections/>
    !connectionId &&
    // but we have a default
    initialConnectionId &&
    // and we've never redirected before
    !redirected.current
  ) {
    redirected.current = true;
    return <Redirect to={path} />;
  } else {
    return <></>;
  }
}

export default function Connections({
  mode = IConnectionMode.ROUTED,
  path,
  workspaceId,
  onWorkspaceCreate,
  connectionId,
  onEntitySelect,
  hideSidePanel,
  initPath,
  connectorType,
  hideAddConnection,
  allowDefaultConnection = true,
  showParsingConfig = true,
}: IConnections) {
  const [initialConnectionId, setInitialConnectionId] = useState(connectionId);
  const [state, setState] = React.useState({
    mode,
    path,
    workspaceId,
    onWorkspaceCreate,
    connectionId,
    onEntitySelect,
    disabledTypes: {},
    connectorType,
    hideSidePanel,
    hideAddConnection,
    selectedPlugin: PipelineMetricsStore.getState().plugin,
    showParsingConfig,
  });
  const classes = useStyle();
  const [loading, setLoading] = useState(true);
  let initialEntry = `/ns/${getCurrentNamespace()}/connections`;

  if (initialConnectionId) {
    initialEntry += `/${initialConnectionId}`;

    if (initPath) {
      initialEntry += `?path=${initPath}`;
    }
  }

  useEffect(() => {
    ConnectionsApi.getSystemApp().subscribe((appInfo) => {
      try {
        let updatedState = { ...state };

        const config = JSON.parse(appInfo.configuration);
        const disabledTypes = config?.connectionConfig?.disabledTypes;
        const def = config?.connectionConfig?.defaultConnection;

        if (def && getCurrentNamespace() === 'default' && allowDefaultConnection && !connectionId) {
          updatedState = {
            ...updatedState,
            connectionId: def,
          };
          setInitialConnectionId(def);
        }

        if (disabledTypes) {
          const disabledTypesMap = {};
          disabledTypes.forEach((type) => {
            disabledTypesMap[type] = true;
          });
          updatedState = { ...updatedState, disabledTypes: disabledTypesMap };
        }
        setState(updatedState);
      } catch (e) {
        // no-op. If app doesn't exist, it will get handled at the top layer
      }

      setLoading(false);
    });
  }, []);

  if (loading) {
    return <LoadingSVGCentered />;
  }

  return (
    <ConnectionsContext.Provider value={state}>
      <div className={classes.container}>
        {mode === IConnectionMode.ROUTED && (
          <>
            <Route exact path="/ns/:namespace/connections">
              <RedirectIfDefaultConnection
                path={initialEntry}
                initialConnectionId={initialConnectionId}
                connectionId={connectionId}
              />
            </Route>
            <ConnectionRoutes />
          </>
        )}
        {(mode === IConnectionMode.INMEMORY || mode === IConnectionMode.ROUTED_WORKSPACE) && (
          <MemoryRouter initialEntries={[initialEntry]}>
            <ConnectionRoutes />
          </MemoryRouter>
        )}
      </div>
    </ConnectionsContext.Provider>
  );
}
