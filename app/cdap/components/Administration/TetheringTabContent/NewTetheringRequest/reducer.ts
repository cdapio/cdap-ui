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
import { IApiError, IValidationErrors } from '../types';

export interface INewTetheringReqState {
  inputFields: {
    namespace: string;
    cpuLimit: string;
    memoryLimit: string;
    projectName: string;
    region: string;
    instanceName: string;
  };
  showAlert: boolean;
  apiError: IApiError;
  validationErrors: IValidationErrors;
}

enum INewTetheringReqActions {
  SET_INPUT_VALUES,
  SET_ERR,
  SET_ALERT,
  RESET,
  RESET_ERRORS,
}

export const initialState: INewTetheringReqState = {
  inputFields: {
    namespace: '',
    cpuLimit: '',
    memoryLimit: '',
    projectName: '',
    region: '',
    instanceName: '',
  },
  showAlert: false,
  apiError: {},
  validationErrors: {},
};

export const reducer = (state: INewTetheringReqState, action: IAction<INewTetheringReqActions>) => {
  switch (action.type) {
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
    case INewTetheringReqActions.RESET_ERRORS:
      return {
        ...state,
        showAlert: false,
        apiError: {},
        validationErrors: {},
      };
    case INewTetheringReqActions.RESET:
      return initialState;
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

export const createTethering = async (connectionInfo) => {
  return await TetheringApi.createTethering({}, connectionInfo).toPromise();
};
