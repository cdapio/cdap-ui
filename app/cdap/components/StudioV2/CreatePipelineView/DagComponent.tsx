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

import React, { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  addEdge,
  useReactFlow,
  ConnectionLineType,
} from 'reactflow';

import 'reactflow/dist/style.css';
import './DAGOverrides.css';
import { useDAGController } from './useDAG';
import { NODE_TYPES } from './DAGNodes';
import { EDGE_TYPES, EdgeInProgress } from './DAGEdges';

const noop = () => 1;

const proOptions = { hideAttribution: true };

export default function DagComponent() {
  const reactflow = useReactFlow();
  const { nodes, edges, onNodesChange, onConnect, onEdgesChange } = useDAGController();

  useEffect(() => {
    console.log('zoom = ', reactflow.getZoom());
    // reactflow.zoomTo(0.5);
  });

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={NODE_TYPES}
      edgeTypes={EDGE_TYPES}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      proOptions={proOptions}
      connectionRadius={55}
      connectionLineType={ConnectionLineType.SmoothStep}
      connectionLineComponent={EdgeInProgress}
    >
      <Controls position="top-right" style={{ top: 60 }} />
      <MiniMap zoomable pannable />
      <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
    </ReactFlow>
  );
}
