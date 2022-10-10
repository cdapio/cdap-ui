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

import { IArtifactObj } from 'components/PipelineContextMenu/PipelineTypes';

export interface IConstraint {
  maxConcurrency: number;
  type: string;
  waitUntilMet: boolean;
}

export interface IBaseTrigger {
  type: string;
}

export interface IProgramId {
  namespace: string;
  application: string;
  version: string;
  type: string;
  entity: 'PROGRAM';
  program: string;
}

export interface IProgramStatusTrigger extends IBaseTrigger {
  programStatuses: string[];
  programId: IProgramId;
}

export interface ICompositeTrigger extends IBaseTrigger {
  triggers: IProgramStatusTrigger[];
}

export interface ISchedule {
  name: string;
  description: string;
  namespace?: string;
  application?: string;
  applicationVersion?: string;
  program: IProgram;
  properties: { [key: string]: string };
  constraints: IConstraint[];
  trigger: ICompositeTrigger | IProgramStatusTrigger;
  timeoutMillis: number;
  lastUpdateTime?: number;
  status?: string;
  isTransformed?: boolean;
}

export interface IPipelineInfo {
  appVersion: string;
  artifact: IArtifactObj;
  configuration: string;
  datasets: any[];
  description: string;
  name: string;
  plugins: IPlugin[];
  programs: IProgramInfo[];
}

interface IProgram {
  programType: string;
  programName: string;
}

interface IPlugin {
  id: string;
  name: string;
  type: string;
}

interface IProgramInfo {
  app: string;
  description: string;
  name: string;
  type: string;
}

export interface ITriggeringPipelineInfo {
  id: string;
  namespace: string;
  description: string;
  workflowName: string;
  version?: string;
}

export interface ICompositeTriggerRunArgs {
  arguments: IRuntimeArgumentMapping[];
  pluginProperties: IPluginPropertyMapping[];
}

export interface ICompositeTriggerRunArgsWithTargets extends ICompositeTriggerRunArgs {
  targets: Map<string, ITriggeringPipelineId>;
}

export interface IRuntimeArgumentMapping {
  source: string;
  target: string;
  pipelineId: ITriggeringPipelineId;
}

export interface ITriggeringPipelineId {
  namespace: string;
  pipelineName: string;
}

export interface IPluginPropertyMapping extends IRuntimeArgumentMapping {
  stageName: string;
}

export interface ITriggerPropertyMapping {
  key: string;
  value: string;
  type: string;
}
