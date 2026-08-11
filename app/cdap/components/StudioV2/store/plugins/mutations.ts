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

import _cloneDeep from 'lodash/cloneDeep';
import _isEqual from 'lodash/isEqual';
import _get from 'lodash/get';
import { getDefaultVersionForPlugin } from "components/StudioV2/utils/pluginUtils";
import { IPluginTemplatesMap, IPluginToVersionMap, IPluginTypesMap, IPluginsState } from './types';
import { getTemplatesWithAddedInfo } from 'components/StudioV2/utils/pluginUtils';

export function fetchPluginsDefaultVersions_mutating(state: IPluginsState, pluginToVersionMap?: IPluginToVersionMap): IPluginsState {
  const defaultPluginVersionsMap = pluginToVersionMap || {};
  const pluginTypesCopy: IPluginTypesMap = {};

  if (Object.keys(defaultPluginVersionsMap).length) {
    const pluginTypes = Object.keys(state.pluginTypes);
    // If this is fetched after the all the plugins have been fetched from the backend then we will update them.
    pluginTypes.forEach((pluginType) => {
      const _plugins = state.pluginTypes[pluginType];
      pluginTypesCopy[pluginType] = _plugins.map((plugin) => {
      plugin.defaultArtifact = getDefaultVersionForPlugin(plugin, defaultPluginVersionsMap);
        return plugin;
      });
    });

    state.pluginTypes = pluginTypesCopy;
    state.pluginToVersionMap = defaultPluginVersionsMap;
  }
  
  return state;
}

export function checkAndUpdatePluginDefaultVersion_mutating(state: IPluginsState): IPluginsState {
  const pluginTypesKeys = Object.keys(state.pluginTypes);
  if (!pluginTypesKeys.length) {
    return state;
  }

  pluginTypesKeys.forEach((pluginType) => {
    state.pluginTypes[pluginType].forEach((plugin) => {
      if (plugin.pluginTemplate) {
        return;
      }
      const key = `${plugin.name}-${plugin.type}-${plugin.artifact.name}`;
      const isArtifactExistsInBackend = plugin.allArtifacts.filter((plug) =>
        _isEqual(plug.artifact, state.pluginToVersionMap[key])
      );
      if (!isArtifactExistsInBackend.length) {
        delete state.pluginToVersionMap[key];
      }
    });
  });

  return state;
}

export function fetchPluginTemplate_mutating(state: IPluginsState, pipelineType: string, namespace: string, templates: IPluginTemplatesMap): IPluginsState {
  const templatesList = _get(templates, `${namespace}.${pipelineType}`);
  if (!templatesList) {
    return state;
  }

  Object.entries(templatesList).forEach(([key, plugins]) => {
    const _templates = Object.values(plugins);
    const _pluginWithoutTemplates = (state.pluginTypes[key] || []).filter(
      (plug) => !plug.pluginTemplate
    );
    state.pluginTypes[key] = getTemplatesWithAddedInfo(_templates, key).concat(
      _pluginWithoutTemplates
    );
  });

  return state;
}