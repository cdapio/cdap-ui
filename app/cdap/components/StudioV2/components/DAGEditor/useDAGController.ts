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

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
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
  reconnectEdge,
} from 'reactflow';
import _noop from 'lodash/noop';
import AvailablePluginsStore from 'services/AvailablePluginsStore';

interface IDAGController {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (conn: Connection) => void;
  onReconnect: (oldEdge: Edge, newConn: Connection) => void;
  onEdgesDelete: (edges: Edge[]) => void;
  isValidConnection: (conn: Connection) => boolean;
}

function getNodesComparisonKey(nodes) {
  return JSON.stringify(
    nodes.map((node) => node.data),
    (key, value) => (key === '_uiPosition' ? undefined : value === _noop ? "_noop" : value)
  );
}

export function useDAGController(
  uiNodes,
  uiEdges,
  updateNode,
  removeNode,
  addConnection,
  moveConnection,
  removeConnection,
  prevalidateConnection,
): IDAGController {
  const [nodes, setNodes, onNodesChange] = useNodesState(uiNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(uiEdges);
  
  const pluginsMapRef = useRef(null);
  function setUpPluginsListener() {
    return AvailablePluginsStore.subscribe(() => {
      const { pluginsMap } = AvailablePluginsStore.getState().plugins;
      // trigger a re-rendering of nodes when the pluginsMap changes,
      // as the nodes views may change depending on changes in plugins
      if (pluginsMap !== pluginsMapRef.current) {
        setNodes((nodes) => [...nodes]);
        pluginsMapRef.current = pluginsMap;
      }
    });
  }
  useLayoutEffect(setUpPluginsListener, []);

  useLayoutEffect(() => {
    setNodes(uiNodes);
    setEdges(uiEdges);
  }, [getNodesComparisonKey(uiNodes), JSON.stringify(uiEdges)]);

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
          updateNode(node.data.pluginNode.id, nodeConfig);
        } else if (change.type === 'remove') {
          const node = getNodeById(change.id);
          removeNode(node.data.pluginNode);
        }
      }
    },
    [nodes]
  );

  const handleEdgesChange = useCallback((changes) => {
    // pass
  }, []);

  const populateEdge = useCallback(
    (edge) => ({
      ...edge,
      source: getNodeById(edge.source),
      target: getNodeById(edge.target),
    }),
    [nodes]
  );

  const onConnect = useCallback(
    (conn) => {
      setEdges((oldEdges) => addEdge(conn, oldEdges));
      addConnection(populateEdge(conn));
    },
    [edges, nodes]
  );

  const onReconnect = useCallback(
    (oldEdge, newConn) => {
      setEdges((els) => reconnectEdge(oldEdge, newConn, els));
      moveConnection(populateEdge(oldEdge), populateEdge(newConn));
    },
    [setEdges, getNodeById]
  );

  const onEdgesDelete = useCallback(
    (edgesToDel: Edge[]) => {
      const edgeIdsToDelSet = new Set(edgesToDel.map((x) => x.id));
      setEdges((eds) => eds.filter((e) => !edgeIdsToDelSet.has(e.id)));
      edgesToDel.map(populateEdge).forEach(removeConnection);
    },
    [edges]
  );

  const isValidConnection = useCallback(
    (conn: Connection) => prevalidateConnection(populateEdge(conn)), 
    [nodes, prevalidateConnection, populateEdge]
  );

  return {
    nodes,
    edges,
    onNodesChange: handleNodesChange,
    onEdgesChange: handleEdgesChange,
    onConnect,
    onReconnect,
    onEdgesDelete,
    isValidConnection,
  };
}
