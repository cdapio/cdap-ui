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
import { INodesState } from './types';
import { GLOBALS } from 'services/global-constants';

export function getSourceCount(state: INodesState) {
  return state.currentSourceCount;
}

export function getTransformCount(state: INodesState) {
  return state.currentTransformCount;
}

export function getSinkCount(state: INodesState) {
  return state.currentSinkCount;
}

export function getCanvasPanning(state: INodesState) {
  return state.canvasPanning;
}

export function getAdjacencyMap(state: INodesState) {
  return state.adjacencyMap;
}

export function getNodes(state: INodesState) {
  return state.nodes;
}

export function getNodesAsObjects(state: INodesState) {
  return state.nodes.reduce((acc, node) => {
    acc[node.name] = node;
    return acc;
  }, {});
}

export function getActiveNodeId(state: INodesState) {
  return state.activeNodeId;
}

export function getConnections(state: INodesState) {
  return _cloneDeep(state.connections);
}

export function getUndoStates(state: INodesState) {
  return state.stateHistory.past;
}

export function getRedoStates(state: INodesState) {
  return state.stateHistory.future;
}

export function getNodeInitialPosition(state: INodesState, nodeType: string) {
  const canvasPanning = getCanvasPanning(state);
  const sourcePosition = {
    top: 150 - canvasPanning.top,
    left: (10 / 100) * document.documentElement.clientWidth - canvasPanning.left,
  };
  const transformPosition = {
    top: 150 - canvasPanning.top,
    left: (30 / 100) * document.documentElement.clientWidth - canvasPanning.left,
  };
  const sinkPosition = {
    top: 150 - canvasPanning.top,
    left: (50 / 100) * document.documentElement.clientWidth - canvasPanning.left,
  };

  const offset = 35;

  switch (GLOBALS.pluginConvert[nodeType]) {
    case 'source':
      const sourceOffset = getSourceCount(state) * offset;
      return {
        top: sourcePosition.top + sourceOffset,
        left: sourcePosition.left + sourceOffset,
      };
    case 'sink':
      const sinkOffset = getSinkCount(state) * offset;
      return {
        top: sinkPosition.top + sinkOffset,
        left: sinkPosition.left + sinkOffset,
      };
    default:
      const transformOffset = getTransformCount(state) * offset;
      return {
        top: transformPosition.top + transformOffset,
        left: transformPosition.left + transformOffset,
      };
  }
}
