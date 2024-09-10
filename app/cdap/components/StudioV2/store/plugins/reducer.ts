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

import { ILabeledArtifactSummary } from 'components/StudioV2/types';
import { getArtifactDisaplayName } from 'components/StudioV2/utils/artifactUtils';
import { GLOBALS } from 'services/global-constants';
import { PluginsActions, getTemplatesWithAddedInfo } from './actions';
import { getDefaultVersionForPlugin } from 'components/StudioV2/utils/pluginUtils';

interface IPluginsState {
  pluginTypes: any;
  pluginToVersionMap: any;
  extensions: any[];
}

export const pluginsInitialState: IPluginsState = {
  pluginTypes: {},
  pluginToVersionMap: {},
  extensions: [],
};

export const plugins = (state: IPluginsState = pluginsInitialState, action?): IPluginsState => {
  switch (action.type) {
    case PluginsActions.FETCH_PLUGINS_DEFAULT_VERSIONS: {
      const defaultPluginVersionsMap = action.payload || {};
      const pluginTypesCopy = {};

      if (Object.keys(defaultPluginVersionsMap).length) {
        const pluginTypes = Object.keys(state.pluginTypes);
        // If this is fetched after the all the plugins have been fetched from the backend then we will update them.
        pluginTypes.forEach((pluginType) => {
          const _plugins = state.pluginTypes[pluginType];
          pluginTypesCopy[pluginType] = _plugins
            .map((plugin) => {
              plugin.defaultArtifact = getDefaultVersionForPlugin(plugin, defaultPluginVersionsMap);
              return plugin;
            });
        });

        return {
          ...state,
          pluginTypes: pluginTypesCopy,
          pluginToVersionMap: defaultPluginVersionsMap,
        };
      }
      return state;
    }

    case PluginsActions.CHECK_AND_UPDATE_PLUGIN_DEFAULT_VERSION: {
      console.log({ state });
      const pluginTypesKeys = Object.keys(state.pluginTypes);
      if (!pluginTypesKeys.length) {
        return state;
      }

      const pluginToVersionMap = _cloneDeep(state.pluginToVersionMap);
      console.log({ pluginTypesKeys });
      pluginTypesKeys.forEach((pluginType) => {
        state.pluginTypes[pluginType].forEach((plugin) => {
          if (plugin.pluginTemplate) return;
          const key = `${plugin.name}-${plugin.type}-${plugin.artifact.name}`;
          const isArtifactExistsInBackend = plugin.allArtifacts.filter(
            (plug) => _isEqual(plug.artifact, pluginToVersionMap[key])
          );
          if (!isArtifactExistsInBackend.length) {
            delete pluginToVersionMap[key];
          }
        });
      });
      return { ...state, pluginToVersionMap };
    }

    case PluginsActions.FETCH_PLUGIN_TEMPLATE: {
      const { pipelineType, namespace, templates } = action.payload;
      const templatesList = _get(templates, `${namespace}.${pipelineType}`);                                               
      if (!templatesList) { 
        return state; 
      }

      const stateCopy =  _cloneDeep(state);
      Object.entries(templatesList).forEach(([key, plugins]) => {
        const _templates = Object.values(plugins);
        const _pluginWithoutTemplates = (state.pluginTypes[key] || []).filter( plug => !plug.pluginTemplate);
        stateCopy.pluginTypes[key] = getTemplatesWithAddedInfo(_templates, key).concat(_pluginWithoutTemplates);
      });

      return stateCopy;
    }

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
