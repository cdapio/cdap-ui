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
import { Edge, Node } from 'reactflow';
export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};
export interface IPipelineConnection {
  from: string;
  to: string;
}
export interface IPipelineStage {
  id: string;
  name: string;
  plugin: {
    label: string;
    name: string;
    properties: any;
    type: string;
    artifact: {
      name: string;
      version: string;
      scope: string;
    };
  };
}
export interface IPipelineConfig {
  stages: IPipelineStage[];
  connections: IPipelineConnection[];
}
export interface IStageMap {
  [name: string]: IPipelineStage;
}
export interface IConnectionMap {
  [name: string]: IPipelineConnection;
}
export enum DiffIndicator {
  ADDED = '+',
  DELETED = '-',
  MODIFIED = '~',
}

export interface IStageDiffItem {
  diffIndicator: DiffIndicator;
  stage1: IPipelineStage;
  stage2: IPipelineStage;
  diff: DeepPartial<IPipelineStage>;
}
export interface IConnectionDiffItem {
  diffIndicator: DiffIndicator;
  diff: DeepPartial<IPipelineConnection>;
  from: IPipelineStage;
  to: IPipelineStage;
}

export interface IPipelineDiffMap {
  stages: { [diffKey: string]: IStageDiffItem };
  connections: { [diffKey: string]: IConnectionDiffItem };
}

export type AvailablePluginsMap = any;

export type NodeType = 'alertErrorNode' | 'defaultNode';
export interface IPipelineNodeData extends IPipelineStage {
  customIconSrc?: string;
  iconName: string;
  diffItem?: IStageDiffItem;
  diffKey: string;
}
// A type helper to distribute each node type into its corresponding node
export type PipelineNode<U = NodeType> = U extends NodeType ? Node<IPipelineNodeData, U> : never;

export type EdgeType = 'smoothstep' | 'diffEdge';
export interface IPipelineEdgeData {
  diffIndicator?: DiffIndicator;
}
export type PipelineEdge = Edge<IPipelineEdgeData>;
