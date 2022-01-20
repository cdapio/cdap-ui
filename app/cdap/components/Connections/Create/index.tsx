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
  IConnectorDetails,
  fetchConnectionDetails,
  createConnection,
  getConnection,
  testConnection,
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
  isEdit = false,
  enableRouting = true,
}) {
  const { mode, disabledTypes } = React.useContext(ConnectionsContext);
  const classes = useStyle();
  const [loading, setLoading] = React.useState(true);
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const activeCategory = React.useRef(null);
  const [connectionDetails, setConnectionDetails] = React.useState<IConnectorDetails>({
    connectorWidgetJSON: null,
    connectorProperties: null,
    connectorDoc: null,
  });
  const [initValues, setInitValues] = React.useState({});
  const [error, setError] = React.useState(null);
  const [configurationErrors, setConfigurationErrors] = React.useState(null);
  const [testSucceeded, setTestSucceeded] = React.useState(false);
  const [testInProgress, setTestInProgress] = React.useState(false);
  const [testResponseMessages, setTestResponseMessages] = React.useState(undefined);
  const [redirectUrl, setRedirectUrl] = React.useState(null);

  const init = async () => {
    try {
      await initStore(dispatch, disabledTypes);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };
  React.useEffect(() => {
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
    mode === IConnectionMode.ROUTED &&
    state.activeStep === ICreateConnectionSteps.CONNECTOR_LIST &&
    enableRouting
  ) {
    return <Redirect to={`/ns/${getCurrentNamespace()}/connections`} />;
  }

  const onConnectorSelection = async (selectedConnector) => {
    navigateToConfigStep(dispatch, selectedConnector);
    setLoading(true);
    const connDetails = await fetchConnectionDetails(selectedConnector);
    setConnectionDetails(connDetails);
    setLoading(false);
    setTestResponseMessages(undefined);
    setTestSucceeded(false);
    setError(null);
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

    if (!isEdit) {
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

      if (mode === IConnectionMode.ROUTED) {
        setRedirectUrl(`${getConnectionPath(name)}`);
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
    if (mode === IConnectionMode.ROUTED && enableRouting) {
      navigateToConnectionList(dispatch);
      return;
    }

    onToggle();
  }
  const editPanelTitle = T.translate(`${PREFIX}.editConnection`, {
    connector: state?.selectedConnector?.name,
    connectionName: objectQuery(initValues, 'initName'),
  });
  const createPanelTitle = T.translate(`${PREFIX}.createConnection`, {
    connector: state?.selectedConnector?.name,
  });
  return (
    <div className={classes.root}>
      {state.activeStep === ICreateConnectionSteps.CONNECTOR_CONFIG && (
        <EntityTopPanel
          historyBack={false}
          breadCrumbAnchorLabel="Select Connection"
          onBreadCrumbClick={() => navigateToConnectionCategoryStep(dispatch)}
          title={`${isEdit ? editPanelTitle : createPanelTitle}`}
          closeBtnAnchorLink={onClose}
          className={classes.topPanel}
          showBreadcrumb={!isEdit}
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
          onConnectorSelection={onConnectorSelection}
        />
      )}
      {state.activeStep === ICreateConnectionSteps.CONNECTOR_CONFIG && (
        <ConnectionConfiguration
          connectorProperties={connectionDetails.connectorProperties}
          connectorWidgetJSON={connectionDetails.connectorWidgetJSON}
          connectorDoc={connectionDetails.connectorDoc}
          onConnectionCreate={onConnectionCreate}
          onConnectionTest={onConnectionTest}
          initValues={initValues}
          isEdit={isEdit}
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
