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
import { Observable } from 'rxjs/Observable';
import { findHighestVersion } from 'services/VersionRange/VersionUtilities';
import reject from 'lodash/reject';

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
  connectorError: string;
}

interface ILocationStateFrom {
  addConnectionRequestFromNewUI: string;
}
interface ILocationState {
  from: ILocationStateFrom;
  path: string;
}
export interface ILocation {
  state: ILocationState;
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
  const connectionToVersionsMap = new Map();
  if (!connectionTypes.length) {
    return categoryToConnectionsMap;
  }
  for (const connectionType of connectionTypes) {
    let { category } = connectionType;
    if (!category) {
      category = connectionType.artifact.name;
    }
    let isDuplicate = false;
    const connectionName = `${category}-${connectionType.name}`;
    if (!connectionToVersionsMap.has(connectionName)) {
      connectionToVersionsMap.set(connectionName, [connectionType.artifact]);
    } else {
      isDuplicate = true;
      const existingVersions = connectionToVersionsMap.get(connectionName);
      connectionToVersionsMap.set(connectionName, [...existingVersions, connectionType.artifact]);
    }
    if (!categoryToConnectionsMap.has(category)) {
      categoryToConnectionsMap.set(category, [connectionType]);
      continue;
    }
    if (!isDuplicate) {
      const existingConnections = categoryToConnectionsMap.get(category);
      categoryToConnectionsMap.set(category, [...existingConnections, connectionType]);
    }
  }
  return addVersionInfo(categoryToConnectionsMap, connectionToVersionsMap);
}

function addVersionInfo(categoryToConnectionsMap, versionsMap) {
  const updatedConnectionsMap = new Map();
  for (const [category, connections] of categoryToConnectionsMap.entries()) {
    for (const connection of connections) {
      const allVersions = versionsMap.get(`${category}-${connection.name}`) || [];
      if (allVersions.length < 2) {
        connection.olderVersions = [];
        continue;
      }
      const highestVersion = findHighestVersion(
        allVersions.map((plugin) => plugin.version),
        true
      );
      const latestVersion = allVersions.find((plugin) => plugin.version === highestVersion);
      connection.artifact = latestVersion;
      connection.olderVersions = reject(allVersions, latestVersion);
    }
    updatedConnectionsMap.set(category, connections);
  }
  return updatedConnectionsMap;
}

export async function fetchConnectionDetails(connection) {
  const connDetails: IConnectorDetails = {
    connectorProperties: null,
    connectorWidgetJSON: null,
    connectorDoc: null,
    connectorError: null,
  };
  try {
    const { name: artifactName, version: artifactVersion, scope: artifactScope } =
      connection.artifact || {};
    const cdapVersion = VersionStore.getState().version;
    const connectionProperties$ = ConnectionsApi.fetchConnectorPluginProperties({
      namespace: getCurrentNamespace(),
      datapipelineArtifactVersion: cdapVersion,
      connectionTypeName: connection.name,
      artifactName,
      artifactVersion,
      artifactScope,
    });

    // If we're looking at a pre-configured connection, no version is supplied
    // We need to get the latest version from the backend using
    // fetchConnectorPluginProperties and use that for the
    // docs and widget JSON
    const connectionProperties = await connectionProperties$.toPromise();

    const pluginKey = `${connection.name}-connector`;

    const widgetJSONKey = `widgets.${pluginKey}`;
    const docKey = `doc.${pluginKey}`;
    const connectionArtifactObj = {
      namespace: getCurrentNamespace(),
      artifactname: artifactName,
      artifactversion: artifactVersion || connectionProperties[0].artifact.version,
      scope: artifactScope || connectionProperties[0].artifact.scope,
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

    const [connectionWidgetJSON, connectionDoc] = await Observable.forkJoin(
      connectionWidgetJSON$,
      connectionDoc$
    ).toPromise();
    connDetails.connectorProperties = connectionProperties[0].properties;
    connDetails.connectorWidgetJSON = JSON.parse(connectionWidgetJSON[widgetJSONKey]);
    connDetails.connectorDoc = connectionDoc[docKey];
  } catch (e) {
    connDetails.connectorError = `Error fetching widget json or parsing: '${e.response}'`;
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

export function getMapOfConnectorToPluginProperties(allConnectors) {
  const mapOfConnectorPluginProperties = {};
  for (const connectorProps of allConnectors) {
    const pluginKey = getPluginKey(connectorProps.properties);
    const widgetJSONKey = `widgets.${pluginKey}`;
    const parsedWidgetJson = JSON.parse(connectorProps.properties[widgetJSONKey]);
    const artifactKey = getArtifactKey(connectorProps);
    const parsedWidgetJsonKey = `parsedWidgetJson.${pluginKey}`;
    mapOfConnectorPluginProperties[`${pluginKey}-${artifactKey}`] = {
      ...connectorProps.properties,
      [parsedWidgetJsonKey]: parsedWidgetJson,
    };
  }
  return mapOfConnectorPluginProperties;
}

export function getSelectedConnectorDisplayName(selectedConnector, mapOfConnectorPluginProperties) {
  if (!selectedConnector) {
    return;
  }
  const pluginKey = `${selectedConnector.name}-${selectedConnector.type}`;
  const artifactKey = getArtifactKey(selectedConnector.artifact);
  const parsedwidgetJSONKey = `parsedWidgetJson.${pluginKey}`;

  if (
    mapOfConnectorPluginProperties &&
    `${pluginKey}-${artifactKey}` in mapOfConnectorPluginProperties
  ) {
    const selectedWidgetJSON =
      mapOfConnectorPluginProperties[`${pluginKey}-${artifactKey}`][parsedwidgetJSONKey];
    if (selectedWidgetJSON['display-name']) {
      return selectedWidgetJSON['display-name'];
    }
  }

  return selectedConnector.name;
}

export async function initStore(
  dispatch: Dispatch<IAction<ICreateConnectionActions>>,
  disabledTypes = {}
) {
  try {
    let connectors = await fetchConnectors();
    connectors = connectors.filter((conn) => {
      return !disabledTypes[conn.name];
    });
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
