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

export type TDeepPartial<T> = {
  [P in keyof T]?: TDeepPartial<T[P]>;
};
export interface IPipelineConnection {
  from: string;
  to: string;
}
interface IPipelinePlugin {
  label: string;
  name: string;
  properties: any;
  type: string;
}
export interface IPipelineStage {
  id: string;
  name: string;
  plugin: IPipelinePlugin;
}
export interface IPipeline {
  stages: IPipelineStage[];
  connections: IPipelineConnection[];
}
export interface TStageMap {
  [name: string]: IPipelineStage;
}
export interface TConnectionMap {
  [name: string]: IPipelineConnection;
}
