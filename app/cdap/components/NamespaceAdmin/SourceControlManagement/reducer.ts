/*
 * Copyright © 2023 Cask Data, Inc.
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

import { providers, scmAuthType } from './constants';
import { ISourceControlManagement, ISourceControlManagementConfig } from './types';

export const defaultSourceControlManagement: ISourceControlManagement = {
  loading: false,
  error: null,
  success: false,
  config: {
    provider: providers.github,
    link: '',
    defaultBranch: '',
    pathPrefix: '',
    auth: {
      type: scmAuthType[providers.github][0].id,
      token: '',
      patConfig: {
        passwordName: '',
      },
    },
  },
};

export const sourceControlManagementFormReducer = (state: ISourceControlManagement, action) => {
  switch (action.type) {
    case 'INIT':
      if (action.payload.config) {
        return {
          ...state,
          config: action.payload.config,
        };
      }
      return defaultSourceControlManagement;
    case 'SET_VALUE':
      const newConfig: ISourceControlManagementConfig = { ...state.config };
      newConfig[action.payload.key] = action.payload.value;
      return {
        ...state,
        config: newConfig,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: true,
      };
    case 'SET_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };
    case 'SET_SUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
      };
    case 'RESET_VALIDATE':
      return {
        ...state,
        loading: false,
        error: null,
        success: false,
      };
    case 'RESET':
      return defaultSourceControlManagement;
    default:
      return state;
  }
};
