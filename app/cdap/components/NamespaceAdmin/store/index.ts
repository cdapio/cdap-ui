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

import { createStore, Reducer } from 'redux';
import { composeEnhancers } from 'services/helpers';

export const NamespaceAdminActions = {
  setNamespaceInfo: 'SET_NAMESPACE_INFO',
  setPipelinesCount: 'SET_PIPELINES_COUNT',
  setDatasetsCount: 'SET_DATASETS_COUNT',
  setProfilesCount: 'SET_PROFILES_COUNT',
  setPreferences: 'SET_PREFERENCES',
  setDrivers: 'SET_DRIVERS',
  setConnections: 'SET_CONNECTIONS',
  reset: 'NAMESPACE_ADMIN_RESET',
};

export interface IPreference {
  key: string;
  value: string;
  scope: string;
}

export interface IDriver {
  name: string;
  type: string;
  description: string;
  className: string;
  artifact: {
    name: string;
    version: string;
    scope: string;
  };
  creationTime: number;
}

interface IPlugin {
  name: string;
  artifact: {
    name: string;
    version: string;
    scope: string;
  };
  category: string;
  properties: Map<string, string>;
  type: string;
}

// TODO: this should probably be under the Connections component
export interface IConnection {
  connectionType: string;
  createdTimeMillis: number;
  description: string;
  isDefault: boolean;
  name: string;
  preConfigured: boolean;
  updatedTimeMillis: number;
  plugin: IPlugin;
}

interface INamespaceAdmin {
  namespace: string;
  generation: number;
  description: string;
  exploreAsPrincipal: string;
  schedulerQueueName: string;
  pipelinesCount: number;
  datasetsCount: number;
  profilesCount: number;
  preferences: IPreference[];
  drivers: IDriver[];
  connections: IConnection[];
}

type INamespaceAdminState = Partial<INamespaceAdmin>;

const defaultInitialState: Partial<INamespaceAdminState> = {
  namespace: null,
  generation: null,
  description: null,
  exploreAsPrincipal: null,
  schedulerQueueName: null,
  pipelinesCount: 0,
  datasetsCount: 0,
  profilesCount: 0,
  preferences: [],
  drivers: [],
  connections: [],
};

const namespaceAdmin: Reducer<INamespaceAdminState> = (state = defaultInitialState, action) => {
  switch (action.type) {
    case NamespaceAdminActions.setNamespaceInfo:
      return {
        ...state,
        ...action.payload,
      };
    case NamespaceAdminActions.setPipelinesCount:
      return {
        ...state,
        pipelinesCount: action.payload.pipelinesCount,
      };
    case NamespaceAdminActions.setDatasetsCount:
      return {
        ...state,
        datasetsCount: action.payload.datasetsCount,
      };
    case NamespaceAdminActions.setProfilesCount:
      return {
        ...state,
        profilesCount: action.payload.profilesCount,
      };
    case NamespaceAdminActions.setPreferences:
      return {
        ...state,
        preferences: action.payload.preferences,
      };
    case NamespaceAdminActions.setDrivers:
      return {
        ...state,
        drivers: action.payload.drivers,
      };
    case NamespaceAdminActions.setConnections:
      return {
        ...state,
        connections: action.payload.connections,
      };
    case NamespaceAdminActions.reset:
      return {
        ...defaultInitialState,
      };
    default:
      return state;
  }
};

const NamespaceAdminStore = createStore(
  namespaceAdmin,
  defaultInitialState,
  composeEnhancers('NamespaceAdminStore')()
);

export default NamespaceAdminStore;
