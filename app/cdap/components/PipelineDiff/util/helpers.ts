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

import { AvailablePluginsMap, DiffIndicator, IPipelineStage, NodeType } from '../types';
import { green, grey, lightGreen, orange, red } from '@material-ui/core/colors';

function _getPluginKey(plugin: IPipelineStage['plugin']) {
  return `${plugin.name}-${plugin.type}`;
}

function _getArtifactKey(artifact: IPipelineStage['plugin']['artifact']) {
  return `${artifact.name}-${artifact.version}-${artifact.scope}`;
}

/**
 * @param pluginProperties extra plugin properties of a plugin received from the backend
 * @returns plugin key (in the format of _getPluginKey)
 */
export const getPluginKeyFromPluginProps = (pluginProperties: any) => {
  return pluginProperties['0']?.split('.')[1] ?? '';
};

/**
 * @param plugin the plugin object
 * @returns available plugins map key for the given plugin
 */
export function getAvailabePluginsMapKeyFromPlugin(plugin: IPipelineStage['plugin']) {
  return `${_getPluginKey(plugin)}-${_getArtifactKey(plugin.artifact)}`;
}

/**
 * @param pluginKey plugin key
 * @param artifact plugin artifact
 * @returns available plugins map key for the plugin
 */
export function getAvailabePluginsMapKeyFromArtifact(
  pluginKey: string,
  artifact: IPipelineStage['plugin']['artifact']
) {
  return `${pluginKey}-${_getArtifactKey(artifact)}`;
}

/**
 * @param pluginsMap available plugins map
 * @param pluginKey plugins map key of the plugin
 * @returns source of the plugin's custom icon, undefined if the plugin does not have a custom icon
 */
export function getCustomIconSrc(pluginsMap: AvailablePluginsMap, pluginKey: string) {
  const iconSourceType = pluginsMap[pluginKey]?.widgets?.icon?.type;

  if (iconSourceType === 'inline') {
    return pluginsMap[pluginKey]?.widgets?.icon?.arguments?.data;
  }
  return pluginsMap[pluginKey]?.widgets?.icon?.arguments?.url;
}

function _showAlertsPort(pluginsMap: AvailablePluginsMap, pluginKey: string) {
  return pluginsMap[pluginKey]?.widgets?.['emit-alerts'];
}

function _showErrorsPort(pluginsMap: AvailablePluginsMap, pluginKey: string) {
  return pluginsMap[pluginKey]?.widgets?.['emit-errors'];
}

/**
 * @param pluginsMap available plugins map
 * @param pluginKey available plugins map key of the plugin
 * @returns reactflow node type of the plugin
 */
export function pluginReactflowNodeType(
  pluginsMap: AvailablePluginsMap,
  pluginKey: string
): NodeType {
  if (_showAlertsPort(pluginsMap, pluginKey) || _showErrorsPort(pluginsMap, pluginKey)) {
    return 'alertErrorNode';
  }
  return 'defaultNode';
}

/**
 * This function is used to create an object representing the plugin and the extra properties needed
 * for it.
 * @param plugin the plugin
 * @returns info object containing list of extra properties to be requested from the backend
 */
export function createPluginInfo(plugin: IPipelineStage['plugin']) {
  const pluginKey = _getPluginKey(plugin);
  const availablePluginKey = getAvailabePluginsMapKeyFromPlugin(plugin);

  return {
    info: {
      ...plugin.artifact,
      properties: [`widgets.${pluginKey}`, `doc.${pluginKey}`],
    },
    key: availablePluginKey,
  };
}

/**
 * @param diffIndicator difference indicator
 * @returns all colors needed for a plugin node to be displayed on canvas that differs between each diff type
 */
export function getPluginDiffColors(diffIndicator: DiffIndicator | undefined) {
  switch (diffIndicator) {
    case DiffIndicator.ADDED:
      return {
        primary: green[600],
        primaryLight: green[400],
        primaryLightest: green[200],
      };
    case DiffIndicator.DELETED:
      return {
        primary: red[600],
        primaryLight: red[400],
        primaryLightest: red[200],
      };
    case DiffIndicator.MODIFIED:
      return {
        primary: orange[500],
        primaryLight: orange[300],
        primaryLightest: orange[200],
      };
    default:
      return {
        primary: grey[900],
        primaryLight: grey[600],
        primaryLightest: grey[400],
      };
  }
}
