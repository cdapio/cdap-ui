/*
 * Copyright © 2024 Cask Data, Inc.
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

import _get from 'lodash/get';
import _cloneDeep from 'lodash/cloneDeep';
import _isEqual from 'lodash/isEqual';
import _assign from 'lodash/assign';

import { IArtifactSummary, IPipelineConfig } from 'components/StudioV2/types';
import { ConfigActions } from './actions';
import { HYDRATOR_DEFAULT_VALUES } from 'services/global-constants';

export interface IConfigState {
  artifact?: IArtifactSummary;
  __ui__?: {
    nodes?: any[];
  };
  name?: string;
  description?: string;
  change?: {
    description?: string;
  };
  parentVersion?: string;
  config?: IPipelineConfig;

  __defaultState?: IConfigState;
};


export const configInitialState: IConfigState = {
  artifact: {
    name: '',
    scope: 'SYSTEM',
    version: ''
  },
  __ui__: {
    nodes: [],
  },
  description: '',
  name: '',
  change: {
    description: '',
  },
  parentVersion: '',
  config: {
    resources: _cloneDeep(HYDRATOR_DEFAULT_VALUES.resources),
    driverResources: _cloneDeep(HYDRATOR_DEFAULT_VALUES.resources),
    connections: [],
    comments: [],
    postActions: [],
    properties: {},
    processTimingEnabled: true,
    stageLoggingEnabled: HYDRATOR_DEFAULT_VALUES.stageLoggingEnabled,
  },
}

export const config = (state: IConfigState = configInitialState, action?): IConfigState => {
  switch (action.type) {
    case ConfigActions.SET_STATE:
      return _assign(_cloneDeep(state), action.payload);

    default:
      return state;
  }
};
