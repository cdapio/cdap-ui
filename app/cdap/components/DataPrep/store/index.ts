/*
 * Copyright © 2017 Cask Data, Inc.
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

import { combineReducers, createStore } from 'redux';
import DataPrepActions from 'components/DataPrep/store/DataPrepActions';
import { composeEnhancers } from 'services/helpers';

export interface IDataPrepAction {
  type: string;
  action?: string;
  payload?: any;
}

const defaultAction: IDataPrepAction = {
  type: '',
  action: '',
  payload: {},
};

export interface IDataModel {
  uuid: string;
  id: string;
  revision: number;
  name: string;
  description?: string;
  url?: string;
  models?: IModel[];
}

export interface IModel {
  uuid: string;
  id: string;
  name: string;
  description?: string;
  fields?: IModelField[];
}

export interface IModelField {
  uuid: string;
  id: string;
  name: string;
  description?: string;
}

// TODO Replace 'any' types with concrete ones
export interface IDataPrepState {
  initialized?: boolean;
  workspaceId?: string;
  workspaceUri?: string;
  data?: any;
  headers?: any;
  types?: any; // pure column types from backend. Used for display
  typesCheck?: any; // case sensitive column types, Should be used when checking types of column
  selectedHeaders?: any;
  newHeaders: any;
  highlightColumns?: any;
  directives?: any;
  higherVersion?: any;
  loading?: boolean;
  singleWorkspaceMode?: boolean;
  workspaceInfo?: any;
  insights?: any;
  dataModelList?: IDataModel[];
  targetDataModel?: IDataModel;
  targetModel?: IModel;
  supportedSampleTypes?: string[];
  sampleLimit?: number;
  sampleType?: string;
  strata?: string;
  sampleTimeoutMs?: number;
}

const defaultInitialState: IDataPrepState = {
  initialized: false,
  workspaceId: '',
  workspaceUri: '',
  data: [],
  headers: [],
  types: {}, // pure column types from backend. Used for display
  typesCheck: {}, // case sensitive column types, Should be used when checking types of column
  selectedHeaders: [],
  newHeaders: [],
  highlightColumns: {
    directive: null,
    columns: [],
  },
  directives: [],
  higherVersion: null,
  loading: false,
  singleWorkspaceMode: false,
  workspaceInfo: null,
  insights: {},
  dataModelList: null,
  targetDataModel: null,
  targetModel: null,
  supportedSampleTypes: [],
  sampleLimit: 1000, // The number of rows requested for the most recent sample
  sampleType: 'default', // The method used for the most recent sample (default, random, or stratified)
  strata: null,
  sampleTimeoutMs: null,
};

const errorInitialState = {
  showError: null,
  cliError: null,
  dataError: false,
  dataErrorMessage: null,
  workspaceError: null,
};

const columnsInformationInitialState = {
  columns: {},
};

const workspacesInitialState = {
  list: [],
};

const getTypesCheck = (types = {}, headers = []) => {
  const typesCheck = {};
  headers.forEach((head) => {
    const type = types[head] || '';
    typesCheck[head] = type.toLowerCase();
  });
  return typesCheck;
};

const findNewHeaders = (oldHeaders, actionHeaders) => {
  // TODO Do we need to be faster for large numbers of columns?
  if (oldHeaders.length === actionHeaders.length) {
    // Don't treat renames as new columns
    return [];
  }
  const newHeaders = [];
  actionHeaders.forEach((h) => {
    if (!oldHeaders.includes(h)) {
      newHeaders.push(h);
    }
  });
  return newHeaders;
};

const dataprep = (state = defaultInitialState, action = defaultAction) => {
  let stateCopy;

  switch (action.type) {
    case DataPrepActions.setData:
      stateCopy = Object.assign({}, state, {
        data: action.payload.data,
        headers: action.payload.headers,
        loading: false,
      });
      break;
    case DataPrepActions.setDirectives:
      stateCopy = Object.assign({}, state, {
        data: action.payload.data,
        headers: action.payload.headers,
        directives: action.payload.directives,
        loading: false,
        types: action.payload.types || {},
        typesCheck: getTypesCheck(action.payload.types, action.payload.headers),
        // after any directive, remove selected header(s) if they're no longer in
        // the list of headers
        selectedHeaders: state.selectedHeaders.filter((head) => {
          return action.payload.headers.indexOf(head) !== -1;
        }),
        newHeaders: findNewHeaders(state.headers, action.payload.headers),
      });
      break;
    case DataPrepActions.setInsights: {
      const insights = {
        ...state.insights,
        ...action.payload.insights,
      };
      return {
        ...state,
        insights,
      };
    }
    case DataPrepActions.setWorkspaceId:
      stateCopy = Object.assign({}, state, {
        workspaceId: action.payload.workspaceId,
        loading: action.payload.loading,
      });
      break;
    case DataPrepActions.setWorkspace:
      stateCopy = Object.assign({}, state, {
        workspaceId: action.payload.workspaceId,
        workspaceUri: action.payload.workspaceUri,
        headers: action.payload.headers || [],
        directives: action.payload.directives || [],
        data: action.payload.data || [],
        types: action.payload.types || {},
        typesCheck: getTypesCheck(action.payload.types, action.payload.headers),
        insights: action.payload.insights || {},
        initialized: true,
        loading: false,
        selectedHeaders: [],
        workspaceInfo: action.payload.workspaceInfo,
        supportedSampleTypes: action.payload.supportedSampleTypes || [],
        sampleLimit: action.payload.sampleLimit,
        sampleType: action.payload.sampleType || 'default',
        strata: action.payload.strata,
        sampleTimeoutMs: action.payload.sampleTimeoutMs,
      });
      break;
    case DataPrepActions.setSelectedHeaders:
      stateCopy = Object.assign({}, state, {
        selectedHeaders: action.payload.selectedHeaders,
      });
      break;
    case DataPrepActions.setInitialized:
      stateCopy = Object.assign({}, state, { initialized: true });
      break;
    case DataPrepActions.setHigherVersion:
      stateCopy = Object.assign({}, state, {
        higherVersion: action.payload.higherVersion,
      });
      break;
    case DataPrepActions.setWorkspaceMode:
      stateCopy = Object.assign({}, state, {
        singleWorkspaceMode: action.payload.singleWorkspaceMode,
      });
      break;
    case DataPrepActions.setHighlightColumns:
      stateCopy = Object.assign({}, state, {
        highlightColumns: action.payload.highlightColumns,
      });
      break;
    case DataPrepActions.enableLoading:
      stateCopy = Object.assign({}, state, {
        loading: true,
      });
      break;
    case DataPrepActions.setDataError:
    case DataPrepActions.disableLoading:
    case DataPrepActions.setWorkspaceError:
      stateCopy = Object.assign({}, state, {
        loading: false,
      });
      break;
    case DataPrepActions.reset:
      return defaultInitialState;
    case DataPrepActions.setDataModelList:
      stateCopy = Object.assign({}, state, {
        dataModelList: action.payload.dataModelList,
      });
      break;
    case DataPrepActions.setTargetDataModel:
      stateCopy = Object.assign({}, state, {
        targetDataModel: action.payload.targetDataModel,
      });
      break;
    case DataPrepActions.setTargetModel:
      stateCopy = Object.assign({}, state, {
        targetModel: action.payload.targetModel,
      });
      break;
    case DataPrepActions.setMostRecentSample:
      stateCopy = Object.assign({}, state, {
        sampleLimit: action.payload.sampleLimit,
        sampleType: action.payload.sampleType,
        strata: action.payload.strata,
      });
      break;
    default:
      return state;
  }

  return Object.assign({}, state, stateCopy);
};

const error = (state = errorInitialState, action = defaultAction) => {
  let stateCopy;

  switch (action.type) {
    case DataPrepActions.setError:
      stateCopy = Object.assign({}, state, {
        showError: action.payload.message,
        cliError: null,
      });
      break;
    case DataPrepActions.setDataError:
      stateCopy = Object.assign({}, state, {
        dataError: true,
        loading: false,
        dataErrorMessage: action.payload.errorMessage,
      });
      break;
    case DataPrepActions.setCLIError:
      stateCopy = Object.assign({}, state, {
        showError: null,
        cliError: action.payload.message,
      });
      break;
    case DataPrepActions.setWorkspaceError:
      stateCopy = Object.assign({}, state, {
        workspaceError: {
          statusCode: action.payload.workspaceError.statusCode,
          message: action.payload.workspaceError.message,
        },
      });
      break;
    case DataPrepActions.setWorkspace:
    case DataPrepActions.setDirectives:
      stateCopy = Object.assign({}, state, {
        showError: null,
        cliError: null,
        dataError: false,
        workspaceError: null,
      });
      break;
    case DataPrepActions.dismissError:
      stateCopy = Object.assign({}, state, {
        showError: null,
      });
      break;
    case DataPrepActions.setData:
      stateCopy = Object.assign({}, state, {
        dataError: false,
        dataErrorMessage: null,
      });
      break;
    case DataPrepActions.reset:
      return errorInitialState;
    default:
      return state;
  }

  return Object.assign({}, state, stateCopy);
};

const columnsInformation = (state = columnsInformationInitialState, action = defaultAction) => {
  let stateCopy;

  switch (action.type) {
    case DataPrepActions.setColumnsInformation:
      stateCopy = Object.assign({}, state, {
        columns: action.payload.columns,
      });
      break;
    case DataPrepActions.reset:
      return columnsInformationInitialState;
    default:
      return state;
  }

  return Object.assign({}, state, stateCopy);
};

const workspaces = (state = workspacesInitialState, action = defaultAction) => {
  let stateCopy;

  switch (action.type) {
    case DataPrepActions.setWorkspaceList:
      stateCopy = Object.assign({}, state, {
        list: action.payload.list,
      });
      break;
    case DataPrepActions.reset:
      return workspacesInitialState;
    default:
      return state;
  }

  return Object.assign({}, state, stateCopy);
};

const DataPrepStore = createStore(
  combineReducers({
    dataprep,
    error,
    columnsInformation,
    workspaces,
  }),
  {
    dataprep: defaultInitialState,
    error: errorInitialState,
    workspaces: workspacesInitialState,
  },
  composeEnhancers('DataPrepStore')()
);

export default DataPrepStore;
