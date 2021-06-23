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

import { Dispatch } from 'react';
import { IAction } from 'services/redux-helpers';
import { ConnectionsApi } from 'api/connections';
import { getCurrentNamespace } from 'services/NamespaceStore';
import VersionStore from 'services/VersionStore';
import { IArtifactObj } from 'components/PipelineContextMenu/PipelineTypes';
import { Observable } from 'rxjs/Observable';
import { getConnections } from 'components/NamespaceAdmin/store/ActionCreator';

interface ICategories {
  name: string;
}
export enum ICreateConnectionSteps {
  CONNECTOR_SELECTION = 'ConnectorSelection',
  CONNECTOR_CONFIG = 'ConnectionConfiguration',
  CONNECTOR_LIST = 'ConnectionList',
}
export interface ICreateConnectionState {
  categories: ICategories[];
  categoriesToConnectorsMap: Map<string, any[]>;
  allConnectorsPluginProperties: Record<string, Pick<IConnectorDetails, keyof IConnectorDetails>>;
  selectedConnector: string;
  activeStep: ICreateConnectionSteps;
  error: string;
}

export interface IConnectorDetails {
  connectorProperties: Record<string, any>;
  connectorWidgetJSON: unknown;
  connectorDoc: unknown;
}

enum ICreateConnectionActions {
  INIT,
  SET_CATEGORIES,
  SET_SELECTED_CONNECTOR,
  SET_CATEGORIES_CONNECTIONS_MAP,
  NAVIGATE_TO_CONNECTIONS_CONFIG_STEP,
  NAVIGATE_TO_CONNECTIONS_SELECTION_STEP,
  NAVIGATE_TO_CONNECTIONS_LIST,
  ERROR,
}

export const initialState: ICreateConnectionState = {
  categories: null,
  selectedConnector: null,
  categoriesToConnectorsMap: null,
  allConnectorsPluginProperties: null,
  error: null,
  activeStep: ICreateConnectionSteps.CONNECTOR_SELECTION,
} as const;

export function reducer(state: ICreateConnectionState, action: IAction<ICreateConnectionActions>) {
  switch (action.type) {
    case ICreateConnectionActions.INIT:
      return {
        ...state,
        categories: action.payload.categories,
        categoriesToConnectorsMap: action.payload.categoriesToConnectorsMap,
        allConnectorsPluginProperties: action.payload.allConnectorsPluginProperties,
      };
    case ICreateConnectionActions.SET_CATEGORIES:
      return {
        ...state,
        categories: action.payload.categories,
      };
    case ICreateConnectionActions.SET_SELECTED_CONNECTOR:
      return {
        ...state,
        selectedConnector: action.payload.selectedConnector,
      };
    case ICreateConnectionActions.SET_CATEGORIES_CONNECTIONS_MAP:
      return {
        ...state,
        categories: action.payload.categories,
        categoriesToConnectorsMap: action.payload.categoriesToConnectorsMap,
      };
    case ICreateConnectionActions.ERROR:
      return {
        ...initialState,
        error: action.payload.error,
      };
    case ICreateConnectionActions.NAVIGATE_TO_CONNECTIONS_CONFIG_STEP:
      return {
        ...state,
        selectedConnector: action.payload.selectedConnector,
        activeStep: ICreateConnectionSteps.CONNECTOR_CONFIG,
      };
    case ICreateConnectionActions.NAVIGATE_TO_CONNECTIONS_SELECTION_STEP:
      return {
        ...state,
        connectionProperties: null,
        activeStep: ICreateConnectionSteps.CONNECTOR_SELECTION,
      };
    case ICreateConnectionActions.NAVIGATE_TO_CONNECTIONS_LIST:
      return {
        ...initialState,
        activeStep: ICreateConnectionSteps.CONNECTOR_LIST,
      };
    default:
      return state;
  }
}

export function navigateToConfigStep(dispatch, connector) {
  dispatch({
    type: ICreateConnectionActions.NAVIGATE_TO_CONNECTIONS_CONFIG_STEP,
    payload: {
      activeStep: ICreateConnectionSteps.CONNECTOR_CONFIG,
      selectedConnector: connector,
    },
  });
}

export function navigateToConnectionCategoryStep(dispatch) {
  dispatch({
    type: ICreateConnectionActions.NAVIGATE_TO_CONNECTIONS_SELECTION_STEP,
    payload: {
      activeStep: ICreateConnectionSteps.CONNECTOR_SELECTION,
      connectionProperties: null,
    },
  });
}

export function navigateToConnectionList(dispatch) {
  dispatch({
    type: ICreateConnectionActions.NAVIGATE_TO_CONNECTIONS_LIST,
  });
}

export function fetchConnectors() {
  const cdapVersion = VersionStore.getState().version;
  return ConnectionsApi.listConnectors({
    namespace: getCurrentNamespace(),
    datapipelineArtifactVersion: cdapVersion,
  }).toPromise();
}

export function fetchAllConnectorPluginProperties(connectors) {
  const namespace = getCurrentNamespace();
  const allArtifacts = connectors.map((plugin) => ({
    ...plugin.artifact,
    properties: [`widgets.${plugin.name}-${plugin.type}`, `doc.${plugin.name}-${plugin.type}`],
  }));
  return ConnectionsApi.fetchAllConnectorWidgetJSONAndDoc(
    {
      namespace,
    },
    allArtifacts
  ).toPromise();
}

export function getCategoriesToConnectorsMap(connectionTypes = []) {
  const categoryToConnectionsMap = new Map();
  if (!connectionTypes.length) {
    return categoryToConnectionsMap;
  }
  for (const connectionType of connectionTypes) {
    let { category } = connectionType;
    if (!category) {
      category = connectionType.artifact.name;
    }
    if (!categoryToConnectionsMap.has(category)) {
      categoryToConnectionsMap.set(category, [connectionType]);
      continue;
    }
    const existingConnections = categoryToConnectionsMap.get(category);
    categoryToConnectionsMap.set(category, [...existingConnections, connectionType]);
  }
  return categoryToConnectionsMap;
}

export async function fetchConnectionDetails(connection) {
  const connDetails: IConnectorDetails = {
    connectorProperties: null,
    connectorWidgetJSON: null,
    connectorDoc: null,
  };
  const {
    name: artifactname = 'google-cloud',
    version: artifactversion = '0.18.0-SNAPSHOT',
    scope: artifactscope = 'SYSTEM',
  } = connection.artifact || {};
  const cdapVersion = VersionStore.getState().version;
  const connectionProperties$ = ConnectionsApi.fetchConnectorPluginProperties({
    namespace: getCurrentNamespace(),
    datapipelineArtifactVersion: cdapVersion,
    connectionTypeName: connection.name,
    artifactname,
    artifactversion,
    artifactscope,
  });

  const pluginKey = `${connection.name}-connector`;

  const widgetJSONKey = `widgets.${pluginKey}`;
  const docKey = `doc.${pluginKey}`;
  const connectionArtifactObj = {
    namespace: getCurrentNamespace(),
    artifactname,
    artifactversion,
    scope: artifactscope,
  };
  // TODO: Once we have APIs from backend to get all widget json and docs for
  // connectors we already build a map of it. We should just use that.
  // This is ONLY a temporary workaround to do something in create view.
  const connectionWidgetJSON$ = ConnectionsApi.fetchConnectorArtifactProperty({
    ...connectionArtifactObj,
    keys: widgetJSONKey,
  });
  const connectionDoc$ = ConnectionsApi.fetchConnectorArtifactProperty({
    ...connectionArtifactObj,
    keys: docKey,
  });
  try {
    const [connectionProperties, connectionWidgetJSON, connectionDoc] = await Observable.forkJoin(
      connectionProperties$,
      connectionWidgetJSON$,
      connectionDoc$
    ).toPromise();
    connDetails.connectorProperties = connectionProperties[0].properties;
    connDetails.connectorWidgetJSON = JSON.parse(connectionWidgetJSON[widgetJSONKey]);
    connDetails.connectorDoc = connectionDoc[docKey];
  } catch (e) {
    // tslint:disable-next-line: no-console
    console.log('Error fetching widget json or parsing: ', e);
  }
  return connDetails;
}

function getPluginKey(properties) {
  if (!properties || !Object.keys(properties).length) {
    return;
  }
  return Object.keys(properties)
    .pop()
    .split('.')
    .pop();
}

function getArtifactKey(artifact) {
  return `${artifact.name}-${artifact.version}-${artifact.scope}`;
}

function getMapOfConnectorToPluginProperties(allConnectors) {
  const mapOfConnectorPluginProperties = {};
  for (const connectorProps of allConnectors) {
    const pluginKey = getPluginKey(connectorProps.properties);
    const artifactKey = getArtifactKey(connectorProps);
    mapOfConnectorPluginProperties[`${pluginKey}-${artifactKey}`] = connectorProps.properties;
  }
  return mapOfConnectorPluginProperties;
}

export async function initStore(dispatch: Dispatch<IAction<ICreateConnectionActions>>) {
  try {
    const connectors = await fetchConnectors();
    const allConnectorsPluginProperties = await fetchAllConnectorPluginProperties(connectors);
    const mapOfConnectorPluginProperties = getMapOfConnectorToPluginProperties(
      allConnectorsPluginProperties
    );
    const categoriesToConnectorsMap = getCategoriesToConnectorsMap(connectors as any);
    const categories = Array.from(new Set(connectors.map((conn) => conn.category)));
    dispatch({
      type: ICreateConnectionActions.INIT,
      payload: {
        categories,
        categoriesToConnectorsMap,
        allConnectorsPluginProperties: mapOfConnectorPluginProperties,
      },
    });
  } catch (e) {
    dispatch({
      type: ICreateConnectionActions.ERROR,
      payload: {
        error: e.message,
      },
    });
  }
}

export async function createConnection(name, connectionConfiguration) {
  const createConnection$ = await ConnectionsApi.createConnection(
    {
      context: getCurrentNamespace(),
      connectionid: name,
    },
    connectionConfiguration
  ).toPromise();
}

export function getConnection(name) {
  return ConnectionsApi.getConnection({
    context: getCurrentNamespace(),
    connectionId: name,
  }).toPromise();
}

export async function testConnection(connectionConfiguration) {
  return await ConnectionsApi.testConnection(
    { context: getCurrentNamespace() },
    connectionConfiguration
  ).toPromise();
}
