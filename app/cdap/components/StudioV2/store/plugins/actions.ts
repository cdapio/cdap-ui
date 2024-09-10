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

import { MyArtifactApi } from 'api/artifact';
import { GLOBALS } from 'services/global-constants';
import { getPluginIcon } from 'components/StudioV2/utils/pluginUtils';
import StudioV2Store from '..';
import MySettingsService from 'components/StudioV2/utils/settings';

const PREFIX = 'PLUGINS_ACTIONS';

export const PluginsActions = {
  FETCH_PLUGINS: `${PREFIX}/FETCH_PLUGINS`,
  FETCH_ALL_PLUGINS: `${PREFIX}/FETCH_ALL_PLUGINS`,
  FETCH_PLUGIN_TEMPLATE: `${PREFIX}/FETCH_PLUGIN_TEMPLATE`,
  FETCH_PLUGINS_DEFAULT_VERSIONS: `${PREFIX}/FETCH_PLUGINS_DEFAULT_VERSIONS`,
  UPDATE_PLUGINS_DEFAULT_VERSIONS: `${PREFIX}/UPDATE_PLUGINS_DEFAULT_VERSIONS`,
  CHECK_AND_UPDATE_PLUGIN_DEFAULT_VERSION: `${PREFIX}/CHECK_AND_UPDATE_PLUGIN_DEFAULT_VERSION`,
  FETCH_EXTENSIONS: `${PREFIX}/FETCH_EXTENSIONS`,
  RESET: `${PREFIX}/RESET`,
};

export const getTemplatesWithAddedInfo = (templates = [], extension = '') =>
  templates.map((template) => ({
    ...template,
    nodeClass: 'plugin-templates',
    name: template.pluginTemplate,
    pluginName: template.pluginName,
    type: extension,
    icon: getPluginIcon(template.pluginName),
    // TODO: should we need the following ?
    // template: popoverTemplate,
    allArtifacts: [template.artifact],
  }));

const keepUiSupportedExtensions = (pipelineType) => (extension) => {
  const extensionMap = GLOBALS.pluginTypes[pipelineType];
  return Object.keys(extensionMap).filter((ext) => extensionMap[ext] === extension).length;
};

export async function fetchPluginsDefaultVersions() {
  const pluginDefalutVersion = await MySettingsService.getInstance().get('plugin-default-version');
  if (!pluginDefalutVersion) return;

  StudioV2Store.dispatch({
    type: PluginsActions.FETCH_PLUGINS_DEFAULT_VERSIONS,
    payload: pluginDefalutVersion,
  });
}
