/*
 * Copyright © 2025 Cask Data, Inc.
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

import {produce} from 'immer';
import _get from 'lodash/get';
import _cloneDeep from 'lodash/cloneDeep';
import _isEqual from 'lodash/isEqual';

import { PluginsActions } from './actions';
import { 
  checkAndUpdatePluginDefaultVersion_mutating,
  fetchPluginTemplate_mutating,
  fetchPluginsDefaultVersions_mutating 
} from './mutations';
import { IPluginsState } from './types';

export const pluginsInitialState: IPluginsState = {
  pluginTypes: {},
  pluginToVersionMap: {},
  extensions: [],
};

export const plugins = (state: IPluginsState = pluginsInitialState, action?): IPluginsState => {
  switch (action.type) {
    case PluginsActions.FETCH_PLUGINS_DEFAULT_VERSIONS:
      return produce(state, (draft) => 
        fetchPluginsDefaultVersions_mutating(draft, action.payload));

    case PluginsActions.CHECK_AND_UPDATE_PLUGIN_DEFAULT_VERSION:
      return produce(state, checkAndUpdatePluginDefaultVersion_mutating);

    case PluginsActions.FETCH_PLUGIN_TEMPLATE: 
      return produce(state, (draft) => fetchPluginTemplate_mutating(
        draft, 
        action.payload?.pipelineType, 
        action.payload?.namespace, 
        action.payload?.templates
      ));

    case PluginsActions.FETCH_ALL_PLUGINS:
      return {
        ...state,
        pluginTypes: _cloneDeep(action.payload.pluginTypes),
        extensions: _cloneDeep(action.payload.extensions),
      };

    default:
      return state;
  }
};
