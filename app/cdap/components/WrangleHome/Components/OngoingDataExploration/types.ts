/*
 *  Copyright © 2022 Cask Data, Inc.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"); you may not
 *  use this file except in compliance with the License. You may obtain a copy of
 *  the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 *  WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 *  License for the specific language governing permissions and limitations under
 *  the License.
 */

import { IArtifact } from 'components/WidgetSVG/types';
export interface IResponseData {
  count: number;
  message: string;
  values: IValues[];
}

export interface IValues {
  createdTimeMillis: number;
  directives: [];
  insights: IInsights;
  sampleSpec: ISampleSpec;
  updatedTimeMillis: number;
  workspaceId: string;
  workspaceName: string;
}

export interface IInsights {
  name: string;
  path: string;
  visualization: {};
  workspaceName: string;
}
export interface ISampleSpec {
  connectionName: string;
  path: string;
  relatedPlugins: IPlugin;
}

export interface IPlugin {
  plugin: IPluginObject;
  schema: ISchema;
}

export interface IPluginObject {
  name: string;
  type: string;
  properties: Record<string, unknown>;
  artifact: IArtifact;
}

export interface ISchema {
  type: string;
  name: string;
  fields: IFields[];
}

export interface IFields {
  name: string;
  type: string;
}

export interface IMassagedObject {
  icon: JSX.Element;
  label: string | number;
  type: string;
  percentageSymbol: string;
  subText: string;
  workspaceId: string;
}

export interface IOngoingExplorationCard {
  connectionName: string;
  count: number;
  dataQuality: string;
  recipeSteps: number;
  workspaceId: string;
  workspaceName: string;
}
