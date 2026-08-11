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

import _get from 'lodash/get';
import _cloneDeep from 'lodash/cloneDeep';
import _isEqual from 'lodash/isEqual';
import _assign from 'lodash/assign';
import uuid from 'uuid';

import { INodesState } from './types';
import { santizeStringForHTMLID } from 'services/helpers';
import { GLOBALS } from 'services/global-constants';

export function addSourceCount_mutating(state: INodesState): INodesState {
  state.currentSourceCount++;
  return state;
}

export function addTrasformCount_mutating(state: INodesState): INodesState {
  state.currentTransformCount++;
  return state;
}

export function addSinkCount_mutating(state: INodesState): INodesState {
  state.currentSinkCount++;
  return state;
}

export function resetSourceCount_mutating(state: INodesState): INodesState {
  state.currentSourceCount = 0;
  return state;
}

export function resetTransformCount_mutating(state: INodesState): INodesState {
  state.currentTransformCount = 0;
  return state;
}

export function resetSinkCount_mutating(state: INodesState): INodesState {
  state.currentSinkCount = 0;
  return state;
}

export function resetPluginCount_mutating(state: INodesState): INodesState {
  state.currentSourceCount = 0;
  state.currentTransformCount = 0;
  state.currentSinkCount = 0;
  return state;
}

export function setCanvasPanning_mutating(
  state: INodesState,
  panning: {
    top: number;
    left: number;
  }
): INodesState {
  state.canvasPanning.top = panning.top;
  state.canvasPanning.left = panning.left;
  return state;
}

export function addNode_mutating(state: INodesState, nodeConfig): INodesState {
  if (!nodeConfig.name) {
    nodeConfig.name = nodeConfig.plugin.label + '_' + uuid.v4();
  }

  if (!nodeConfig.id) {
    nodeConfig.id = santizeStringForHTMLID(nodeConfig.plugin.label) + '_' + uuid.v4();
  }

  addStateToHistory_mutating(state);
  switch (GLOBALS.pluginConvert[nodeConfig.type]) {
    case 'source':
      addSourceCount_mutating(state);
      break;
    case 'sink':
      addSinkCount_mutating(state);
      break;
    default:
      addTrasformCount_mutating(state);
      break;
  }

  state.nodes.push(nodeConfig);
  if (!state.adjacencyMap[nodeConfig.id]) {
    state.adjacencyMap[nodeConfig.id] = [];
  }

  return state;
}

export function addStateToHistory_mutating(state: INodesState, resetFuture: boolean = true) {
  const currentState = _cloneDeep(state);
  delete currentState.stateHistory;

  state.stateHistory.past.push(currentState);
  if (resetFuture) {
    return resetFutureStates_mutating(state);
  }

  return state;
}

export function resetFutureStates_mutating(state: INodesState): INodesState {
  state.stateHistory.future = [];
  return state;
}

export function removePreviousState_mutating(state: INodesState): INodesState {
  state.stateHistory.past.pop();
  return state;
}

export function undoActions_mutating(state: INodesState): INodesState {
  const past = _get(state, `stateHistory.past`, []);
  if (past.length) {
    const previousState = state.stateHistory.past.pop();
    const presentState = _cloneDeep(state);
    delete presentState.stateHistory;
    state.stateHistory.future.unshift(presentState);
    previousState.stateHistory = state.stateHistory;
    return previousState;
  }

  return state;
}

export function redoActions_mutating(state: INodesState): INodesState {
  const future = _get(state, 'stateHistory.future', []);
  if (future.length) {
    const nextState = state.stateHistory.future.shift();
    const presentState = _cloneDeep(state);
    delete presentState.stateHistory;
    state.stateHistory.past.push(presentState);
    nextState.stateHistory = state.stateHistory;
    return nextState;
  }

  return state;
}

export function updateNode_mutating(state: INodesState, nodeId: string, config): INodesState {
  const matchNode = state.nodes.filter((node) => node.id === nodeId)[0];
  if (!matchNode) {
    return state;
  }

  addStateToHistory_mutating(state);
  _assign(matchNode, config);
  return state;
}

export function removeNode_mutating(state: INodesState, nodeId: string): INodesState {
  const match = state.nodes.filter((node) => node.id === nodeId)[0];
  if (!match) {
    return state;
  }

  addStateToHistory_mutating(state);
  switch (GLOBALS.pluginConvert[match.type]) {
    case 'source':
      state.currentSourceCount--;
      break;
    case 'sink':
      state.currentSinkCount--;
      break;
    default:
      state.currentTransformCount--;
      break;
  }
  state.nodes.splice(state.nodes.indexOf(match), 1);
  state.connections = state.connections.filter(
    (conn) => conn.from !== match.name && conn.to !== match.name
  );
  state.activeNodeId = null;
  delete state.adjacencyMap[nodeId];
  Object.keys(state.adjacencyMap).forEach((key) => {
    state.adjacencyMap[key] = state.adjacencyMap[key].filter((n) => n !== nodeId);
  });

  return state;
}

export function setNodes_mutating(state: INodesState, nodes): INodesState {
  state.adjacencyMap = {};
  nodes.forEach((node) => {
    if (!node.name) {
      node.name = node.label + '_' + uuid.v4();
    }
    if (!node.id) {
      node.id = santizeStringForHTMLID(node.label) + '_' + uuid.v4();
    }
    if (!node.type) {
      node.type = node.plugin.type;
    }
    if (!state.adjacencyMap[node.id]) {
      state.adjacencyMap[node.id] = [];
    }
  });
  state.nodes = _cloneDeep(nodes);

  return state;
}

export function setActiveNodeId_mutating(state: INodesState, nodeId: string): INodesState {
  addStateToHistory_mutating(state, false);
  state.activeNodeId = nodeId;
  return state;
}

export function resetActiveNodeId_mutating(state: INodesState): INodesState {
  state.activeNodeId = null;
  state.nodes.forEach((node) => {
    node.selected = false;
  });

  return state;
}

export function addConnection_mutating(state: INodesState, connection): INodesState {
  addStateToHistory_mutating(state);
  state.connections.push(_cloneDeep(connection));

  const { from, to } = connection;
  const sourceNode = state.nodes.find((node) => node.name === from);
  const targetNode = state.nodes.find((node) => node.name === to);
  const sourceNodeId = sourceNode.id || sourceNode.name;
  const targetNodeId = targetNode.id || targetNode.name;

  if (!state.adjacencyMap[sourceNodeId]) {
    state.adjacencyMap[sourceNodeId] = [targetNodeId];
  } else {
    state.adjacencyMap[sourceNodeId].push(targetNodeId);
  }

  return state;
}

export function updateConnections(state: INodesState, connections): INodesState {
  addStateToHistory_mutating(state);
  setConnections_mutating(state, connections);
  return state;
}

export function removeConnection_mutating(state: INodesState, connection): INodesState {
  addStateToHistory_mutating(state);
  const { from, to } = connection;
  const index = state.connections.findIndex((conn) => conn.from === from && conn.to === to);
  const sourceNode = state.nodes.find((node) => node.name === from);
  const targetNode = state.nodes.find((node) => node.name === to);
  const sourceNodeId = sourceNode.id || sourceNode.name;
  const targetNodeId = targetNode.id || targetNode.name;

  state.adjacencyMap[sourceNodeId] = state.adjacencyMap[sourceNodeId].filter(
    (target) => target !== targetNodeId
  );
  state.connections.splice(index, 1);

  return state;
}

export function setConnections_mutating(state: INodesState, connections): INodesState {
  Object.keys(state.adjacencyMap).forEach((key) => {
    state.adjacencyMap[key] = [];
  });
  connections.forEach(({ from, to }) => {
    const sourceNode = state.nodes.find((node) => node.name === from);
    const targetNode = state.nodes.find((node) => node.name === to);
    const sourceNodeId = sourceNode.id || sourceNode.name;
    const targetNodeId = targetNode.id || targetNode.name;

    if (!state.adjacencyMap[sourceNodeId]) {
      state.adjacencyMap[sourceNodeId] = [targetNodeId];
    } else {
      state.adjacencyMap[sourceNodeId].push(targetNodeId);
    }
  });
  state.connections = _cloneDeep(connections);

  return state;
}

export function setNodesAndConnections_mutating(
  state: INodesState,
  nodes,
  connections
): INodesState {
  setNodes_mutating(state, nodes);
  state.connections = _cloneDeep(connections);
  state.adjacencyMap = {};

  nodes.forEach((node) => {
    let nodeId = node;
    if (typeof node === 'object' && typeof node.id === 'string') {
      nodeId = node.id;
    }
    if (!nodeId) {
      return;
    }
    state.adjacencyMap[nodeId] = [];
  });

  connections.forEach(({ from, to }) => {
    const sourceNode = state.nodes.find((node) => node.name === from);
    const targetNode = state.nodes.find((node) => node.name === to);
    const sourceNodeId = sourceNode.id || sourceNode.name;
    const targetNodeId = targetNode.id || targetNode.name;
    state.adjacencyMap[sourceNodeId].push(targetNodeId);
  });

  return state;
}
