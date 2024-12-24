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

import React from 'react';
import {
  Connection,
  Edge,
  EdgeChange,
  MarkerType,
  Node,
  NodeChange,
  addEdge,
  useEdgesState,
  useNodesState,
} from 'reactflow';
import { useSelector, useDispatch } from 'react-redux';
import { getConnections, getNodes } from '../store/nodes/queries';
import { getNodes as getConfigNodes } from '../store/config/queries';
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { NodesActions } from '../store/nodes/reducer';
import { usePanelCollapseController } from 'components/layouts/SectionWithPanel';
import { UiActions } from '../store/uistate/actions';

interface IDAGController {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (conn: Connection) => void;
}

function getNodesComparisonKey(nodes) {
  return JSON.stringify(
    nodes.map((node) => node.data.pluginNode),
    (key, value) => (key === '_uiPosition' ? undefined : value)
  );
}

export function useDAGController(): IDAGController {
  const dispatch = useDispatch();
  const nodesState = useSelector((state) => state.nodes);
  const configState = useSelector((state) => state.config);
  const uiState = useSelector((state) => state.uiState);
  const { isCollapsed, collapse, expand } = usePanelCollapseController('properties-panel');

  const pluginNodes = getNodes(nodesState);
  const connections = getConnections(nodesState);

  const uiNodes = pluginNodes.map((node) => ({
    id: node.name,
    type: 'pipelineNode',
    position: {
      x: node._uiPosition.left,
      y: node._uiPosition.top,
    },
    data: {
      label: node.plugin.label,
      pluginNode: node,
    },
  }));

  // console.log(pluginNodes);

  const uiEdges = connections.map(({ from, to }) => ({
    id: `edge-${from}-${to}`,
    type: 'standard',
    source: from,
    target: to,
  }));

  const [nodes, setNodes, onNodesChange] = useNodesState(uiNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(uiEdges);

  useLayoutEffect(() => {
    setNodes(uiNodes);
    setEdges(uiEdges);
  }, [getNodesComparisonKey(uiNodes), JSON.stringify(uiEdges)]);

  useEffect(() => {
    setActiveNode(nodesState.activeNodeId);
  }, [nodesState.activeNodeId]);

  useEffect(() => {
    setStateAndUpdateConfigStore();
  }, [nodesState]);

  function setStateAndUpdateConfigStore() {
    // TODO: add logic here
  }

  function setActiveNode(nodeId) {
    console.log('***********************');
    console.log(uiState.rightPanelShown, nodeId);
    if (!nodeId || uiState.rightPanelShown) {
      return;
    }

    let pluginNode;
    let nodeFromNodesStore;
    const nodeFromConfigStore = getConfigNodes(configState).filter((node) => node.name === nodeId);
    if (nodeFromConfigStore.length) {
      pluginNode = nodeFromConfigStore[0];
    } else {
      nodeFromNodesStore = getNodes(nodesState).filter((node) => node.name === nodeId);
      pluginNode = nodeFromNodesStore[0];
    }

    const closePropertiesPanel = () => {
      collapse();
      dispatch({
        type: UiActions.CLOSE_PROPERTIES_PANEL,
      });
      dispatch({
        type: NodesActions.RESET_ACTIVE_NODE,
      });
    };

    dispatch({
      type: UiActions.OPEN_PROPERTIES_PANEL,
      payload: {
        props: {
          pluginNode,
        },
        onClose: closePropertiesPanel,
      },
    });
    expand();
  }

  const getNodeById = useCallback(
    (nodeid) => {
      return nodes.find((n) => n.id === nodeid) || null;
    },
    [nodes]
  );

  const handleNodesChange = useCallback(
    (changes) => {
      onNodesChange(changes);
      for (const change of changes) {
        if (change.type === 'position' && change.dragging === false) {
          const node = getNodeById(change.id);
          const { position } = node;
          const nodeConfig = {
            _uiPosition: {
              top: position.y,
              left: position.x,
            },
          };

          dispatch({
            type: NodesActions.UPDATE_NODE,
            payload: {
              nodeId: node.data.pluginNode.id,
              nodeConfig,
            },
          });
        }
      }
    },
    [getNodeById]
  );

  const handleEdgesChange = useCallback((changes) => {
    onEdgesChange(changes);
    console.log('EDGES CHANGE: ', changes);
    for (const change of changes) {
    }
  }, []);

  const onConnect = useCallback(
    (conn) => {
      setEdges((oldEdges) => addEdge(conn, oldEdges));
      const { source, target } = conn;
      dispatch({
        type: NodesActions.ADD_CONNECTION,
        payload: {
          from: source,
          to: target,
        },
      });
    },
    [setEdges, getNodeById]
  );

  return {
    nodes,
    edges,
    onNodesChange: handleNodesChange,
    onEdgesChange: handleEdgesChange,
    onConnect,
  };
}
