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
import { createAction, createReducer, current } from '@reduxjs/toolkit';
import isEqual from 'lodash/isEqual';
import { getIcon } from '../helpers/DAGhelpers';
import { GLOBALS } from 'services/global-constants';
import { objectQuery } from 'services/helpers';
import { myRemoveCamelCase } from 'services/filters/removeCamelCase';
import { findHighestVersion } from 'services/VersionRange/VersionUtilities';

// originally in hydrator node service
const getPluginToArtifactMap = (plugins: any[] = []) => {
  const typeMap = {};
  plugins.forEach((plugin) => {
    typeMap[plugin.name] = typeMap[plugin.name] || [];
    typeMap[plugin.name].push(plugin);
  });
  return typeMap;
};

// originally in hydrator node service
const getDefaultVersionForPlugin = (plugin: any, defaultVersionMap = {}) => {
  if (!Object.keys(plugin).length) {
    return {};
  }
  const defaultVersionsList = Object.keys(defaultVersionMap);
  const key = `${plugin.name}-${plugin.type}-${plugin.artifact.name}`;
  const isDefaultVersionExists = defaultVersionsList.indexOf(key) !== -1;

  const isArtifactExistsInBackend = (plugin.allArtifacts || []).filter((plug) =>
    isEqual(plug.artifact, defaultVersionMap[key])
  );
  if (!isDefaultVersionExists || !isArtifactExistsInBackend.length) {
    const highestVersion = findHighestVersion(
      plugin.allArtifacts.map((highestVersionPlugin) => highestVersionPlugin.artifact.version),
      true
    );
    const latestPluginVersion = plugin.allArtifacts.find(
      (latestPluginVersionPlugin) => latestPluginVersionPlugin.artifact.version === highestVersion
    );
    return objectQuery(latestPluginVersion, 'artifact');
  }

  return { ...defaultVersionMap[key] };
};
/*
  This store is a collection of extensions and plugins for the side panel.
  {
    plugins: {
      'batchsource': {
        Stream:{
          type: ...,
          artifact: {...},
          allArtifacts: [ {...}, {...}],
          defaultArtifact
        }
      }
    },
    extensions: []
  }
*/

// TODO type these actions
const pluginsFetch = createAction<any>('PLUGINS_FETCH');
const fetchAllPlugins = createAction<any>('FETCH_ALL_PLUGINS');
const pluginTemplateFetch = createAction<any>('PLUGIN_TEMPLATE_FETCH');
const pluginsDefaultVersionFetch = createAction<any>('PLUGINS_DEFAULT_VERSION_FETCH');
const extensionsFetch = createAction<any>('EXTENSIONS_FETCH');
const reset = createAction<any>('LEFTPANELSTORE_RESET');
// unsure if this is used?
// const pluginsDefaultVersionUpdate = createAction<any>('PLUGINS_DEFAULT_VERSION_UPDATE');
const pluginDefaultVersionCheckAndUpdate = createAction<any>(
  'PLUGIN_DEFAULT_VERSION_CHECK_AND_UPDATE'
);

export interface IDAGPlugin {
  name?: string;
  pluginName: string;
  artifact: any;
}

const popoverTemplate =
  '/assets/features/hydrator/templates/create/popovers/leftpanel-plugin-popover.html';
const getInitialState = () => {
  return {
    plugins: {
      pluginTypes: {},
      pluginToVersionMap: {},
    },
    extensions: [],
  };
};

const getTemplatesWithAddedInfo = (templates = [], extension = '') => {
  return templates.map((template) => {
    return Object.assign({}, template, {
      nodeClass: 'plugin-templates',
      name: template.pluginTemplate,
      pluginName: template.pluginName,
      type: extension,
      icon: getIcon(template.pluginName),
      template: popoverTemplate,
      allArtifacts: [template.artifact],
    });
  });
};

const getExtraProperties = (plugin: IDAGPlugin, extension: string) => {
  return {
    type: extension,
    icon: getIcon(plugin.name || plugin.pluginName),
    label: myRemoveCamelCase(plugin.name || plugin.pluginName),
    template: popoverTemplate,
  };
};

const getPluginsWithAddedInfo = (
  plugins: IDAGPlugin[],
  pluginToArtifactArrayMap = {},
  extension = ''
) => {
  if ([plugins.length, extension.length].indexOf(0) !== -1) {
    return plugins;
  }

  const getAllArtifacts = (
    getAllArtifactspluginToArtifactArrayMap = {},
    plugin: IDAGPlugin,
    getAllArtifactsExtension = ''
  ) => {
    if (
      [
        Object.keys(getAllArtifactspluginToArtifactArrayMap).length,
        Object.keys(plugin).length,
      ].indexOf(0) !== -1
    ) {
      return [];
    }
    const pluginArtifacts =
      getAllArtifactspluginToArtifactArrayMap[plugin.name || plugin.pluginName];
    if (!Array.isArray(pluginArtifacts)) {
      return [];
    }
    return [...pluginArtifacts].map((plug) =>
      Object.assign({}, plug, getExtraProperties(plug, getAllArtifactsExtension))
    );
  };

  const getArtifact = (getArtifactpluginToArtifactArrayMap = {}, plugin: IDAGPlugin) => {
    if (!Object.keys(plugin).length) {
      return {};
    }
    return (
      objectQuery(
        getArtifactpluginToArtifactArrayMap,
        plugin.name || plugin.pluginName,
        0,
        'artifact'
      ) || plugin.artifact
    );
  };

  return Object.keys(pluginToArtifactArrayMap).map((pluginName) => {
    const plugin = pluginToArtifactArrayMap[pluginName][0];
    return Object.assign({}, plugin, getExtraProperties(plugin, extension), {
      artifact: getArtifact(pluginToArtifactArrayMap, plugin),
      allArtifacts: getAllArtifacts(pluginToArtifactArrayMap, plugin, extension),
      pluginMapKey: `${plugin.name}-${plugin.type}-${plugin.artifact.name}-${plugin.artifact.version}-${plugin.artifact.scope}`,
    });
  });
};

export const pluginReducer = createReducer(
  {
    pluginTypes: {},
    pluginToVersionMap: {},
  },
  (builder) => {
    builder
      .addCase(pluginsFetch, (state, action) => {
        const { extension, plugins } = action.payload;

        const pluginToArtifactArrayMap = getPluginToArtifactMap(plugins);
        const pluginsWithAddedInfo = getPluginsWithAddedInfo(
          plugins,
          pluginToArtifactArrayMap,
          extension
        );

        state.pluginTypes[extension] = pluginsWithAddedInfo
          .map((plugin) => {
            plugin.defaultArtifact = getDefaultVersionForPlugin(plugin, state.pluginToVersionMap);
            return plugin;
          })
          .concat(state.pluginTypes[extension] || []);

        state.pluginTypes = Object.assign({}, state.pluginTypes, state.pluginTypes);
      })
      .addCase(fetchAllPlugins, (state, action) => {
        state.pluginTypes = action.payload.pluginTypes;
      })
      .addCase(pluginTemplateFetch, (state, action) => {
        const { pipelineType, namespace, res } = action.payload;
        const templatesList = objectQuery(res, namespace, pipelineType);
        if (!templatesList) {
          return state;
        }

        templatesList.forEach((plugins, key) => {
          const templates = Object.values(plugins);
          const pluginWithoutTemplates = (state.pluginTypes[key] || []).filter(
            (plug) => !plug.pluginTemplate
          );
          state.pluginTypes[key] = getTemplatesWithAddedInfo(templates, key).concat(
            pluginWithoutTemplates
          );
        });
      })
      .addCase(pluginsDefaultVersionFetch, (state, action) => {
        const defaultPluginVersionsMap = action.payload.res || {};
        if (Object.keys(defaultPluginVersionsMap).length) {
          const pluginTypes = Object.keys(state.pluginTypes);
          // If this is fetched after the all the plugins have been fetched from the backend then we will update them.
          pluginTypes.forEach((pluginType) => {
            const plugins = state.pluginTypes[pluginType];
            state.pluginTypes[pluginType] = plugins.map((plugin) => {
              plugin.defaultArtifact = getDefaultVersionForPlugin(plugin, defaultPluginVersionsMap);
              return plugin;
            });
          });
          state.pluginToVersionMap = defaultPluginVersionsMap;
        }
      })
      .addCase(pluginDefaultVersionCheckAndUpdate, (state, action) => {
        const pluginTypes = Object.keys(state.pluginTypes);
        if (!pluginTypes.length) {
          return state;
        }
        const pluginToVersionMap = { ...state.pluginToVersionMap };
        pluginTypes.forEach((pluginType) => {
          state.pluginTypes[pluginType].forEach((plugin) => {
            if (plugin.pluginTemplate) {
              return;
            }
            const key = `${plugin.name}-${plugin.type}-${plugin.artifact.name}`;
            const isArtifactExistsInBackend = plugin.allArtifacts.filter((plug) =>
              Object.is(plug.artifact, pluginToVersionMap[key])
            );
            if (!isArtifactExistsInBackend.length) {
              delete pluginToVersionMap[key];
            }
          });
        });
        state = Object.assign({}, state, { pluginToVersionMap });
      })
      .addCase(reset, (state, action) => {
        state = getInitialState().plugins;
      });
  }
);

export const extensionsReducer = createReducer([], (builder) => {
  builder
    .addCase(extensionsFetch, (state, action) => {
      const uiSupportedExtension = (extension) => {
        const pipelineType = action.payload.pipelineType;
        const extensionMap = GLOBALS.pluginTypes[pipelineType];
        return Object.keys(extensionMap).filter((ext) => extensionMap[ext] === extension).length;
      };

      state = [...state, ...action.payload.extensions.filter(uiSupportedExtension)];
    })
    .addCase(fetchAllPlugins, (state, action) => {
      return state.concat(action.payload.extensions);
    })
    .addCase(reset, (state, action) => {
      state = getInitialState().extensions;
    });
});
