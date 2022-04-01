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

import { objectQuery } from 'services/helpers';
import { myRemoveCamelCase } from 'services/filters/removeCamelCase';
import { myMultiKeySearch } from 'services/filters/multiKeySearch';

export const generatePluginMapKey = (plugin) => {
  let { name, type } = plugin;
  const { artifact } = plugin;

  if (plugin.pluginTemplate) {
    name = plugin.pluginName;
    type = plugin.pluginType;
  }

  return `${name}-${type}-${artifact.name}-${artifact.version}-${artifact.scope}`;
};

export const generateLabel = (plugin, pluginsMap) => {
  if (plugin.pluginTemplate) {
    return plugin.name;
  }

  const key = generatePluginMapKey(plugin);

  let displayName = objectQuery(pluginsMap, key, 'widgets', 'display-name');

  displayName = displayName || myRemoveCamelCase(plugin.name);

  return displayName;
};

export const filterPlugins = (searchTerm: string, unfilteredPlugins: any) => {
  if (searchTerm === '' || undefined) {
    return unfilteredPlugins;
  }
  // still need to order by ?
  return myMultiKeySearch(unfilteredPlugins, ['name', 'label', 'displayName'], searchTerm);
};

export const shouldShowCustomIcon = (plugin, pluginsMap) => {
  const key = generatePluginMapKey(plugin);
  const iconSourceType = objectQuery(pluginsMap, key, 'widgets', 'icon', 'type');
  return ['inline', 'link'].indexOf(iconSourceType) !== -1;
};

export const getCustomIconSrc = (plugin, pluginsMap) => {
  const key = generatePluginMapKey(plugin);
  const iconSourceType = objectQuery(pluginsMap, key, 'widgets', 'icon', 'type');

  if (iconSourceType === 'inline') {
    return objectQuery(pluginsMap, key, 'widgets', 'icon', 'arguments', 'data');
  }

  return objectQuery(pluginsMap, key, 'widgets', 'icon', 'arguments', 'url');
};
