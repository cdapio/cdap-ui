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

export type ArtifactScope = 'USER' | 'SYSTEM';

export interface IArtifactSummary {
  name: string;
  version: string;
  scope: ArtifactScope;
}

export interface ILabeledArtifactSummary extends IArtifactSummary {
  label: string;
}

export interface IPlugin {
  name?: string;
  type?: string;
  label?: string;
  displayName?: string;
  description?: string;
  className?: string;
  pluginTemplate?: string;

  icon?: string;
  showCustomIcon?: boolean;
  customIconSrc?: string;

  artifact?: IArtifactSummary;
  defaultArtifact?: IArtifactSummary;
  allArtifacts?: Array<IPlugin>;
}

export interface IPluginTemplate {
  artifact?: IArtifactSummary;
  description?: string;
  lock?: {
    [key: string]: any;
  };
  nodeClass?: string;
  outputSchema?: string;
  pluginName?: string;
  pluginTemplate?: string;
  pluginType?: string;
  templateType?: string;
  properties?: {
    [key: string]: any;
  };
};
