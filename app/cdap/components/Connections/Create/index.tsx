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
import { useState, useEffect, useRef, useContext, useReducer } from 'react';
import T from 'i18n-react';
import { CategorizedConnectors } from 'components/Connections/Create/CategorizedConnectors';
import makeStyle from '@material-ui/core/styles/makeStyles';
import { EntityTopPanel } from 'components/EntityTopPanel';
import {
  initStore,
  reducer,
  initialState,
  ICreateConnectionSteps,
  navigateToConfigStep,
  navigateToConnectionCategoryStep,
  navigateToConnectionList,
  fetchConnectionDetails,
  createConnection,
  getConnection,
  testConnection,
  IConnectorDetails,
  getSelectedConnectorDisplayName,
  ILocation,
} from 'components/Connections/Create/reducer';
import LoadingSVGCentered from 'components/shared/LoadingSVGCentered';
import { Redirect } from 'react-router';
import { getCurrentNamespace } from 'services/NamespaceStore';
import { ConnectionConfiguration } from 'components/Connections/Create/ConnectionConfiguration';
import { getConnectionPath } from 'components/Connections/helper';
import { extractErrorMessage, objectQuery } from 'services/helpers';
import Alert from 'components/shared/Alert';
import { ConnectionsContext, IConnectionMode } from 'components/Connections/ConnectionsContext';
import { constructErrors } from 'components/shared/ConfigurationGroup/utilities';
import { ConnectionConfigurationMode } from 'components/Connections/types';
import { useLocation } from 'react-router';

const PREFIX = 'features.DataPrepConnections.ConnectionManagement';

const useStyle = makeStyle(() => {
  return {
    root: {
      display: 'grid',
      gridTemplateRows: '50px minmax(calc(100% - 50px), 1fr)',
      height: '100%',
    },
    topPanel: {
      padding: '0 0 0 20px',
    },
  };
});

export function CreateConnection({
  onToggle = null,
  initialConfig = {},
  onCreate = null,
  mode = ConnectionConfigurationMode.CREATE,
  enableRouting = true,
}) {
  const { mode: connectionMode, disabledTypes } = useContext(ConnectionsContext);
  const classes = useStyle();
  const [loading, setLoading] = useState(true);
  const [state, dispatch] = useReducer(reducer, initialState);
  const activeCategory = useRef(null);
  const [connectionDetails, setConnectionDetails] = useState<IConnectorDetails>({
    connectorWidgetJSON: null,
    connectorProperties: null,
    connectorDoc: null,
    connectorError: null,
  });
  const [initValues, setInitValues] = useState({});
  const [error, setError] = useState(null);
  const [configurationErrors, setConfigurationErrors] = useState(null);
  const [testSucceeded, setTestSucceeded] = useState(false);
  const [testInProgress, setTestInProgress] = useState(false);
  const [testResponseMessages, setTestResponseMessages] = useState(undefined);
  const [redirectUrl, setRedirectUrl] = useState(null);
  const location: ILocation = useLocation();
  const featRequestingFrom = location?.state?.from?.addConnectionRequestFromNewUI;

  const init = async () => {
    try {
      await initStore(dispatch, disabledTypes);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };
  useEffect(() => {
    init();

    if (initialConfig && Object.keys(initialConfig).length > 0) {
      const plugin = objectQuery(initialConfig, 'plugin') || {};
      const selectedConnector = {
        artifact: plugin.artifact,
        category: plugin.category,
        name: plugin.name,
        type: plugin.type,
      };

      setInitValues({
        initName: objectQuery(initialConfig, 'name'),
        initDescription: objectQuery(initialConfig, 'description'),
        initProperties: objectQuery(plugin, 'properties'),
      });
      onConnectorSelection(selectedConnector);
    }
  }, []);

  if (redirectUrl !== null) {
    return <Redirect to={redirectUrl} />;
  }

  if (
    connectionMode === IConnectionMode.ROUTED &&
    state.activeStep === ICreateConnectionSteps.CONNECTOR_LIST &&
    enableRouting
  ) {
    return <Redirect to={`/ns/${getCurrentNamespace()}/connections`} />;
  }

  const onConnectorSelection = async (selectedConnector) => {
    setLoading(true);
    const connDetails = await fetchConnectionDetails(selectedConnector);
    setConnectionDetails(connDetails);
    if (!connDetails.connectorError) {
      navigateToConfigStep(dispatch, selectedConnector);
    }
    setLoading(false);
    setTestResponseMessages(undefined);
    setTestSucceeded(false);
    setError(connDetails.connectorError);
    setConfigurationErrors(null);
  };

  const onConnectionCreate = async (connectionFormData) => {
    const { description, properties, name } = connectionFormData;

    if (name.trim() === '') {
      setError('Connection name must not be empty.');
      return;
    } else if (!new RegExp('^[\\w\\s-]+$').test(name)) {
      setError('Connection name can only include letters, numbers, hypen and underscore.');
      return;
    }

    if (mode === 'CREATE') {
      // validate existing connection name
      try {
        await getConnection(name);
        setError(`Connection '${name}' already exists.`);
        return;
      } catch (e) {
        // no-op. We want the connection to be not found.
      }
    }

    const { selectedConnector } = state;
    const connectionConfiguration = {
      description,
      category: state.selectedConnector.category,
      plugin: {
        ...selectedConnector,
        properties,
      },
    };
    try {
      await createConnection(name, connectionConfiguration);

      if (typeof onCreate === 'function') {
        onCreate();
      }

      if (connectionMode === IConnectionMode.ROUTED && enableRouting) {
        /**
         * This following code is checking whether the add connection request is coming from New UI
         * If the request is from New UI, the redirection is set to New UI URL
         * Otherwise, the redirection is set to Old UI URL as existed
         */
        const value: string | boolean = featRequestingFrom ? featRequestingFrom : false;
        if (value) {
          value === 'home'
            ? setRedirectUrl(`/ns/${getCurrentNamespace()}/wrangle`)
            : setRedirectUrl(`/ns/${getCurrentNamespace()}/datasources/${value}`);
        } else {
          setRedirectUrl(`${getConnectionPath(name)}`);
        }
      }

      if (typeof onToggle === 'function') {
        onToggle();
      }
    } catch (e) {
      const errorMsg = extractErrorMessage(e);
      setError(`A server error occurred when creating this connection. Error: ${errorMsg}`);
    }
  };

  const onConnectionTest = async (connectionFormData) => {
    const { properties } = connectionFormData;
    const { selectedConnector } = state;
    const connectionConfiguration = {
      category: state.selectedConnector.category,
      plugin: {
        ...selectedConnector,
        properties,
      },
    };

    // Clear all test messages
    setTestResponseMessages(undefined);
    setTestSucceeded(false);
    setError(null);
    setConfigurationErrors(null);
    setTestInProgress(true);

    try {
      const testResult = await testConnection(connectionConfiguration);
      setTestResponseMessages(testResult);
      setTestSucceeded(!testResult);

      if (testResult) {
        const configErrors = constructErrors(testResult);
        // All test errors will be shown next to the test button,
        // so don't repeat orphaned errors
        const { orphanErrors, ...assignedErrors } = configErrors.propertyErrors;
        setConfigurationErrors(assignedErrors);
      } else {
        setConfigurationErrors(null);
      }
    } catch (e) {
      const errorMsg = extractErrorMessage(e);
      setError(`A server error occurred when testing the connection. Error: ${errorMsg}`);
    } finally {
      setTestInProgress(false);
    }
  };

  function onClose() {
    if (connectionMode === IConnectionMode.ROUTED && enableRouting) {
      /**
       * This following code is checking whether the add connection request is coming from New UI
       * If the request is from New UI, the redirection is set to New UI URL
       * Otherwise, the redirection is set to Old UI URL as existed
       */

      const value: string | boolean = featRequestingFrom ? featRequestingFrom : false;
      if (value) {
        return value === 'home'
          ? setRedirectUrl(`/ns/${getCurrentNamespace()}/wrangle`)
          : setRedirectUrl(`/ns/${getCurrentNamespace()}/datasources/${value}`);
      } else {
        navigateToConnectionList(dispatch);
        return;
      }
    }

    onToggle();
  }

  let title;
  const displayedConnectionName = getSelectedConnectorDisplayName(
    state.selectedConnector,
    state.allConnectorsPluginProperties
  );
  if (mode === 'EDIT') {
    title = T.translate(`${PREFIX}.editConnection`, {
      connector: displayedConnectionName,
      connectionName: objectQuery(initValues, 'initName'),
    });
  } else if (mode === 'VIEW') {
    title = T.translate(`${PREFIX}.viewConnection`, {
      connector: displayedConnectionName,
      connectionName: objectQuery(initValues, 'initName'),
    });
  } else {
    title = T.translate(`${PREFIX}.createConnection`, {
      connector: displayedConnectionName,
    });
  }

  return (
    <div className={classes.root}>
      {state.activeStep === ICreateConnectionSteps.CONNECTOR_CONFIG && (
        <EntityTopPanel
          historyBack={false}
          breadCrumbAnchorLabel="Select Connection"
          onBreadCrumbClick={() => navigateToConnectionCategoryStep(dispatch)}
          title={title}
          closeBtnAnchorLink={onClose}
          className={classes.topPanel}
          showBreadcrumb={mode === 'CREATE'}
        />
      )}
      {state.activeStep === ICreateConnectionSteps.CONNECTOR_SELECTION && (
        <EntityTopPanel
          title="Add a connection"
          closeBtnAnchorLink={onClose}
          className={classes.topPanel}
        />
      )}
      {loading && <LoadingSVGCentered />}
      {state.activeStep === ICreateConnectionSteps.CONNECTOR_SELECTION && (
        <CategorizedConnectors
          onActiveCategory={(active) => (activeCategory.current = active)}
          connectorsMap={state.categoriesToConnectorsMap}
          allConnectorsPluginProperties={state.allConnectorsPluginProperties}
          onConnectorSelection={onConnectorSelection}
        />
      )}
      {state.activeStep === ICreateConnectionSteps.CONNECTOR_CONFIG && (
        <ConnectionConfiguration
          connectorProperties={connectionDetails.connectorProperties}
          connectorWidgetJSON={connectionDetails.connectorWidgetJSON}
          connectorDoc={connectionDetails.connectorDoc}
          connectorError={connectionDetails.connectorError}
          onConnectionCreate={onConnectionCreate}
          onConnectionTest={onConnectionTest}
          initValues={initValues}
          mode={mode}
          testResults={{
            succeeded: testSucceeded,
            messages: testResponseMessages,
            inProgress: testInProgress,
            configurationErrors,
          }}
        />
      )}

      {!!error && (
        <Alert message={error} type="error" showAlert={true} onClose={() => setError(null)} />
      )}
    </div>
  );
}
