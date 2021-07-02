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
import If from 'components/If';
import Helmet from 'react-helmet';
import T from 'i18n-react';
import { Theme } from 'services/ThemeHelper';
import { ConnectionRoutes } from 'components/Connections/Routes';
import { MemoryRouter } from 'react-router';
import { getCurrentNamespace } from 'services/NamespaceStore';
const DATAPREP_I18N_PREFIX = 'features.DataPrep.pageTitle';
import {
  IConnectionMode,
  IConnections,
  ConnectionsContext,
} from 'components/Connections/ConnectionsContext';
import makeStyle from '@material-ui/core/styles/makeStyles';
import { useEffect, useState } from 'react';
import { ConnectionsApi } from 'api/connections';
import LoadingSVGCentered from 'components/LoadingSVGCentered';
const useStyle = makeStyle(() => {
  return {
    container: {
      height: '100%',
      overflow: 'hidden',
    },
  };
});

export default function Connections({
  mode = IConnectionMode.ROUTED,
  path,
  workspaceId,
  onWorkspaceCreate,
  connectionId,
  onEntitySelect,
  initPath,
}: IConnections) {
  const [state, setState] = React.useState({
    mode,
    path,
    workspaceId,
    onWorkspaceCreate,
    connectionId,
    onEntitySelect,
    disabledTypes: {},
  });
  const classes = useStyle();
  const [loading, setLoading] = useState(true);
  const featureName = Theme.featureNames.dataPrep;
  const pageTitle = (
    <Helmet
      title={T.translate(DATAPREP_I18N_PREFIX, {
        productName: Theme.productName,
        featureName,
      })}
    />
  );
  const shouldUpdatePageTitle =
    mode === IConnectionMode.ROUTED || mode === IConnectionMode.ROUTED_WORKSPACE;

  let initialEntry = `/ns/${getCurrentNamespace()}/connections`;

  if (connectionId) {
    initialEntry += `/${connectionId}`;

    if (initPath) {
      initialEntry += `?path=${initPath}`;
    }
  }

  useEffect(() => {
    ConnectionsApi.getSystemApp().subscribe((appInfo) => {
      try {
        const config = JSON.parse(appInfo.configuration);

        if (config.disabledTypes) {
          const disabledTypes = {};
          config.disabledTypes.forEach((type) => {
            disabledTypes[type] = true;
          });
          setState({ ...state, disabledTypes });
        }
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
        <If condition={shouldUpdatePageTitle}>{pageTitle}</If>
        <If condition={mode === IConnectionMode.ROUTED}>
          <ConnectionRoutes />
        </If>
        <If
          condition={mode === IConnectionMode.INMEMORY || mode === IConnectionMode.ROUTED_WORKSPACE}
        >
          <MemoryRouter initialEntries={[initialEntry]}>
            <ConnectionRoutes />
          </MemoryRouter>
        </If>
      </div>
    </ConnectionsContext.Provider>
  );
}
