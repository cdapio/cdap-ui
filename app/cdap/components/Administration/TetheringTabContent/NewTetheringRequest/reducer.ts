/*
 * Copyright © 2022 Cask Data, Inc.
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

import { IAction } from 'services/redux-helpers';
import { TetheringApi } from 'api/tethering';
import { MyNamespaceApi } from 'api/namespace';
import { IApiError, IValidationErrors, INamespace } from '../types';
import { K8S_NS_CPU_LIMITS, K8S_NS_MEMORY_LIMITS, DEFAULT_NS } from './constants';

export interface INewTetheringReqState {
  namespaces: INamespace[];
  selectedNamespaces: string[];
  inputFields: {
    projectName: string;
    region: string;
    instanceName: string;
    instanceUrl: string;
    description: string;
  };
  showAlert: boolean;
  apiError: IApiError;
  validationErrors: IValidationErrors;
}

enum INewTetheringReqActions {
  SET_NAMESPACES,
  SET_INPUT_VALUES,
  SET_ERR,
  SET_ALERT,
  ADD_SELECTED_NAMESPACES,
  REMOVE_SELECTED_NAMESPACES,
  RESET,
  RESET_ERRORS,
}

export const initialState: INewTetheringReqState = {
  namespaces: [],
  selectedNamespaces: [],
  inputFields: {
    projectName: '',
    region: '',
    instanceName: '',
    instanceUrl: '',
    description: '',
  },
  showAlert: false,
  apiError: {},
  validationErrors: {},
};

export const reducer = (state: INewTetheringReqState, action: IAction<INewTetheringReqActions>) => {
  switch (action.type) {
    case INewTetheringReqActions.SET_NAMESPACES:
      return {
        ...state,
        namespaces: [...action.payload.namespaces],
      };
    case INewTetheringReqActions.SET_INPUT_VALUES:
      return {
        ...state,
        inputFields: {
          ...state.inputFields,
          ...action.payload,
        },
      };
    case INewTetheringReqActions.SET_ERR:
      return {
        ...state,
        [action.payload.errType]: action.payload.errVal,
      };
    case INewTetheringReqActions.SET_ALERT:
      return {
        ...state,
        showAlert: action.payload.val,
      };
    case INewTetheringReqActions.ADD_SELECTED_NAMESPACES:
      return {
        ...state,
        selectedNamespaces: [...state.selectedNamespaces, action.payload.ns],
      };
    case INewTetheringReqActions.REMOVE_SELECTED_NAMESPACES:
      return {
        ...state,
        selectedNamespaces: state.selectedNamespaces.filter((ns) => ns !== action.payload.ns),
      };
    case INewTetheringReqActions.RESET_ERRORS:
      return {
        ...state,
        showAlert: false,
        apiError: {},
        validationErrors: {},
      };
    case INewTetheringReqActions.RESET:
      return {
        ...initialState,
        namespaces: state.namespaces,
      };
    default:
      return state;
  }
};

export const updateInputField = (dispatch, updatedField) => {
  dispatch({
    type: INewTetheringReqActions.SET_INPUT_VALUES,
    payload: {
      ...updatedField,
    },
  });
};

export const updateSelectedNamespaces = (dispatch, ns: string, selectedNamespaces: string[]) => {
  const remove = selectedNamespaces.includes(ns);

  if (remove) {
    dispatch({
      type: INewTetheringReqActions.REMOVE_SELECTED_NAMESPACES,
      payload: { ns },
    });
  } else {
    dispatch({
      type: INewTetheringReqActions.ADD_SELECTED_NAMESPACES,
      payload: { ns },
    });
  }
};

export const updateError = (dispatch, { errType, errVal }) => {
  dispatch({
    type: INewTetheringReqActions.SET_ERR,
    payload: {
      errType,
      errVal,
    },
  });
};

export const updateAlertState = (dispatch, val: boolean) => {
  dispatch({
    type: INewTetheringReqActions.SET_ALERT,
    payload: { val },
  });
};

export const reset = (dispatch, hasApiErr) => {
  dispatch({
    type: hasApiErr ? INewTetheringReqActions.RESET_ERRORS : INewTetheringReqActions.RESET,
  });
};

export const fetchNamespaceList = async (dispatch) => {
  const namespaceList = await MyNamespaceApi.list().toPromise();
  const namespaces = [];

  namespaceList.forEach((ns) => {
    if (ns.name === DEFAULT_NS) {
      namespaces.unshift({
        namespace: DEFAULT_NS,
        cpuLimit: ns.config[K8S_NS_CPU_LIMITS],
        memoryLimit: ns.config[K8S_NS_MEMORY_LIMITS],
      });
    } else {
      namespaces.push({
        namespace: ns.name,
        cpuLimit: ns.config[K8S_NS_CPU_LIMITS],
        memoryLimit: ns.config[K8S_NS_MEMORY_LIMITS],
      });
    }
  });

  dispatch({
    type: INewTetheringReqActions.SET_NAMESPACES,
    payload: {
      namespaces,
    },
  });
};

export const createTethering = async (connectionInfo) => {
  return await TetheringApi.createTethering({}, connectionInfo).toPromise();
};
