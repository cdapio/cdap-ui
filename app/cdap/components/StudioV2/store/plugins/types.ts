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

import { IArtifactSummary, IPlugin, IPluginTemplate } from "components/StudioV2/types";

export interface IPluginToVersionMap {
  [key: string]: IArtifactSummary;
};

export interface IPluginTypesMap {
  [key: string]: Array<IPlugin>;
};

export interface IPluginsState {
  pluginTypes: IPluginTypesMap;
  pluginToVersionMap: IPluginToVersionMap;
  extensions: Array<string>;
}

export interface IPluginTemplatesMap {
  [namespace: string]: {
    [pipelineType: string]: {
      [extenstionType: string]: {
        [templateName: string]: IPluginTemplate;
      };
    };
  };
};