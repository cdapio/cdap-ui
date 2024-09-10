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

import { MyPipelineApi } from 'api/pipeline';
import _get from 'lodash/get';
import StudioV2Store from '..';
import { GLOBALS } from 'services/global-constants';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { PluginsActions } from '../plugins/actions';
import { getDefaultVersionForPlugin, getPluginIcon, getPluginToArtifactMap } from 'components/StudioV2/utils/pluginUtils';
import { camelToTitle } from 'components/StudioV2/utils/stringUtils';
import { findHighestVersion } from 'services/VersionRange/VersionUtilities';
import MySettingsService from 'components/StudioV2/utils/settings';

const PREFIX = 'AVAILABLE_PLUGINS';

export const AvailablePluginsActions = {
  SET_PLUGINS_MAP: `${PREFIX}/SET_PLUGINS_MAP`,
  RESET: `${PREFIX}/RESET`,
};

export function setAvailablePluginsMap(payload) {
  StudioV2Store.dispatch({
    type: AvailablePluginsActions.SET_PLUGINS_MAP,
    payload,
  });
}

export function resetAvailablePluginsMap() {
  StudioV2Store.dispatch({
    type: AvailablePluginsActions.RESET,
  });
}

export interface IFetchExtensionsParams {
  namespace: string;
  pipelineType: string;
  version: string;
};

export interface IFetchPluginsParams extends IFetchExtensionsParams {
  extensionType: string;
}

// TODO: Determine correct type for res.
export function fetchPlugins(extensionsParams: IFetchExtensionsParams) {
  MyPipelineApi.fetchExtensions(extensionsParams).subscribe((res) => {
    const extensionsList = GLOBALS.pluginTypes[extensionsParams.pipelineType];
    const extensionsMap = Object.values(extensionsList);
    const supportedExtensions = res.filter((ext) => extensionsMap.includes(ext));
    fetchPluginsInternal(extensionsParams, supportedExtensions);
  },
  (err) => {
    // TODO: Handle this error properly. In legacy code, it was passed to a defered promise
  });
}

// TODO: Add correct type for supportedExtensions
function fetchPluginsInternal (params: IFetchExtensionsParams, extensions: any[]) {
  const fetchList = extensions.map((ext) => MyPipelineApi.fetchPlugins({ 
    ...params, 
    extensionType: ext,
  }));

  forkJoin(fetchList).subscribe((res) => {
    const pluginTypes = formatPluginsResponse(res, extensions);
    StudioV2Store.dispatch({
      type: PluginsActions.FETCH_ALL_PLUGINS,
      payload: {
        pluginTypes,
        extensions,
      },
    });

    StudioV2Store.dispatch({
      type: PluginsActions.CHECK_AND_UPDATE_PLUGIN_DEFAULT_VERSION
    });

    prepareInfoRequest(params.namespace, res);
    fetchTemplates(params.namespace, params.pipelineType);
  }, 
  (err) => {

  });
}

// TODO: Add types
function formatPluginsResponse (pluginsList, extensions) {
  return extensions.reduce((acc, ext, i) => {
    const plugins = pluginsList[i];
    const pluginToArtifactArrayMap = getPluginToArtifactMap(plugins);
    const pluginsWithAddedInfo = getPluginsWithAddedInfo(plugins, pluginToArtifactArrayMap, ext);
    const versionMap = StudioV2Store.getState().plugins.pluginToVersionMap;

    acc[ext] =  pluginsWithAddedInfo.map((plugin) => ({
      ...plugin,
      defaultArtifact: getDefaultVersionForPlugin(plugin, versionMap),
    }));

    return acc;
  }, {});
}

// TODO: Add types
function getPluginsWithAddedInfo(plugins = [], pluginToArtifactArrayMap = {}, extension = '') {
  if (plugins.length === 0 || extension.length === 0) {
    return plugins;
  }

  // TODO: Add types
  const getExtraProperties = (plugin: any = {}, extension: string = '') => ({
    type: extension,
    icon: getPluginIcon(plugin.name || plugin.pluginName),
    label: camelToTitle(plugin.name || plugin.pluginName),
  });

  // TODO: Add types
  const getAllArtifacts = (_pluginToArtifactArrayMap: any = {}, plugin: any = {}, extension: string = '') => {
    if (Object.keys(_pluginToArtifactArrayMap).length === 0 || Object.keys(plugin).length === 0) {
      return [];
    }

    let _pluginArtifacts = _pluginToArtifactArrayMap[(plugin.name || plugin.pluginName)];
    if (!Array.isArray(_pluginArtifacts)) {
      return [];
    }
    return _pluginArtifacts.map((plug) => ({ 
      ...plug, 
      ...getExtraProperties(plug, extension) 
    }));
  };

  // TODO: Add types
  const getArtifact = (_pluginToArtifactArrayMap: any = {}, plugin: any = {}) => {
    if(!Object.keys(plugin).length) { 
      return {}; 
    }
    const allPluginVersions = _pluginToArtifactArrayMap[plugin.name];
    const highestVersion = findHighestVersion(
      allPluginVersions.map((plugin) => _get(plugin, 'artifact.version')), 
      true
    );
    const latestPluginVersion = allPluginVersions.find(
      (plugin) => _get(plugin, 'artifact.version') === highestVersion
    );
    return latestPluginVersion.artifact;
  };

  return Object.keys(pluginToArtifactArrayMap).map((pluginName) => {
    const [plugin] = pluginToArtifactArrayMap[pluginName];
    return { 
      ...plugin, 
      ...getExtraProperties(plugin, extension), 
      artifact: getArtifact(pluginToArtifactArrayMap, plugin),
      allArtifacts: getAllArtifacts(pluginToArtifactArrayMap, plugin, extension),
    };
  });
}

function prepareInfoRequest(namespace, pluginsList) {
  // Create request body for artifactproperties batch call
  const plugins = [];
  const availablePluginsMap = {};

  pluginsList.forEach((extension) => {
    extension.forEach((plugin) => {
      const pluginInfo = createPluginInfo(plugin);
      availablePluginsMap[pluginInfo.key] = {
        pluginInfo: plugin
      };

      plugins.push(pluginInfo);
    });
  });

  fetchInfo(availablePluginsMap, namespace, plugins);
}

function createPluginInfo(plugin) {
  const pluginKey = `${plugin.name}-${plugin.type}`;
  const availablePluginKey = `${pluginKey}-${getArtifactKey(plugin.artifact)}`;

  const info = {
    ...plugin.artifact,
    properties: [
      `widgets.${pluginKey}`,
      `doc.${pluginKey}`
    ]
  };

  return {
    info,
    key: availablePluginKey
  };
}

function  getArtifactKey(artifact) {
  return `${artifact.name}-${artifact.version}-${artifact.scope}`;
}

function fetchInfo(availablePluginsMap, namespace, plugins) {
  const reqBody = plugins.map((plugin) => plugin.info);

  const getKeyFromPluginProps = (pluginProperties) => {
    const key = _get(pluginProperties, '0');
    return key ? key.split('.')[1] : '';
  };

  MyPipelineApi.fetchAllPluginsProperties({ namespace }, reqBody).subscribe(
    (res) => {
      res.forEach((plugin) => {
        const pluginProperties = Object.keys(plugin.properties);
        if (pluginProperties.length === 0) return;

        const pluginKey = getKeyFromPluginProps(pluginProperties);
        const key = `${pluginKey}-${getArtifactKey(plugin)}`;

        availablePluginsMap[key].doc = plugin.properties[`doc.${pluginKey}`];

        let parsedWidgets;
        const widgets = plugin.properties[`widgets.${pluginKey}`];

        if (widgets) {
          try {
            parsedWidgets = JSON.parse(widgets);
          } catch (e) {
            console.log('failed to parse widgets', e, pluginKey);
          }
        }
        availablePluginsMap[key].widgets = parsedWidgets;
      });

      StudioV2Store.dispatch({
        type: AvailablePluginsActions.SET_PLUGINS_MAP,
        payload: availablePluginsMap,
      });
    });
}

async function fetchTemplates(namespace, pipelineType) {
  const templates = await MySettingsService.getInstance().get('pluginTemplates');
  if (!templates) return;

  StudioV2Store.dispatch({
    type: PluginsActions.FETCH_PLUGIN_TEMPLATE,
    payload: {
      templates,
      pipelineType,
      namespace,
    }
  });
}