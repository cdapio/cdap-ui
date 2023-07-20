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
import React, { ComponentType } from 'react';
import {
  Node,
  Background,
  Controls,
  Edge,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  NodeProps,
} from 'reactflow';
import { DefaultPluginNode, PluginNodeWithAlertError } from './PluginNode';
import { getReactflowPipelineGraph } from '../util/reactflowGraph';
import { AvailablePluginsMap, IPipelineConfig, IPipelineDiffMap, NodeType } from '../types';
import { IPipelineNodeData } from '../store/diffSlice';
import { getPluginDiffColors } from '../util/helpers';

const nodeTypes: Record<NodeType, ComponentType<NodeProps>> = {
  defaultNode: DefaultPluginNode,
  alertErrorNode: PluginNodeWithAlertError,
};

// A type helper to distribute each node type into its corresponding node
type PipelineNode<U = NodeType> = U extends NodeType ? Node<IPipelineNodeData, U> : never;

interface IDiffCanvasProps {
  nodes: PipelineNode[];
  connections: Edge[];
  backgroundId?: string;
}
const DiffCanvas = ({ nodes, connections, backgroundId }: IDiffCanvasProps) => {
  return (
    <ReactFlow
      nodes={nodes}
      edges={connections}
      nodesConnectable={false}
      nodesDraggable={false}
      minZoom={-5}
      nodeTypes={nodeTypes}
      fitView
    >
      {nodes.length > 5 && (
        <MiniMap
          pannable
          nodeColor={(node: PipelineNode) =>
            getPluginDiffColors(node.data.diffItem?.diffIndicator).primaryLightest
          }
        />
      )}
      <Controls position="top-right" showInteractive={false} />
      <Background id={backgroundId} />
    </ReactFlow>
  );
};

interface IDiffCanvasWrapperProps {
  config: IPipelineConfig;
  diffMap: IPipelineDiffMap;
  availablePluginsMap: AvailablePluginsMap;
  backgroundId?: string;
}
export const DiffCanvasWrapper = ({
  config,
  diffMap,
  availablePluginsMap,
  backgroundId,
}: IDiffCanvasWrapperProps) => {
  const { nodes, connections } = getReactflowPipelineGraph(config, availablePluginsMap, diffMap);
  return (
    <ReactFlowProvider>
      <DiffCanvas nodes={nodes} connections={connections} backgroundId={backgroundId} />
    </ReactFlowProvider>
  );
};
