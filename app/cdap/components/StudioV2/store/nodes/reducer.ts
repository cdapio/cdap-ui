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

import _get from 'lodash/get';
import _cloneDeep from 'lodash/cloneDeep';
import _isEqual from 'lodash/isEqual';
import _assign from 'lodash/assign';

import {
  addConnection_mutating,
  addNode_mutating,
  resetActiveNodeId_mutating,
  setActiveNodeId_mutating,
  undoActions_mutating,
  updateNode_mutating,
} from './mutations';
import { cloneAndApply } from 'components/StudioV2/utils/objectUtils';

const PREFIX = 'NODES_ACTIONS';
export const NodesActions = {
  RESET: `${PREFIX}/RESET`,
  SET_STATE: `${PREFIX}/SET_STATE`,
  UNDO_ACTIONS: `${PREFIX}/UNDO_ACTIONS`,
  RESET_ACTIVE_NODE: `${PREFIX}/RESET_ACTIVE_NODE`,
  ADD_NODE: `${PREFIX}/ADD_NODE`,
  UPDATE_NODE: `${PREFIX}/UPDATE_NODE`,
  ADD_CONNECTION: `${PREFIX}/ADD_CONNECTION`,
  SET_ACTIVE_NODE: `${PREFIX}/SET_ACTIVE_NODE`,
};

export interface INodesState {
  nodes: any[];
  connections: any[];
  activeNodeId?: string | null;
  currentSourceCount: number;
  currentTransformCount: number;
  currentSinkCount: number;
  canvasPanning: {
    top: number;
    left: number;
  };
  stateHistory?: {
    past: INodesState[];
    future: INodesState[];
  };
  adjacencyMap: any;
}

export const nodesInitialState: INodesState = {
  nodes: [],
  connections: [],
  activeNodeId: null,
  currentSourceCount: 0,
  currentTransformCount: 0,
  currentSinkCount: 0,
  canvasPanning: {
    top: 0,
    left: 0,
  },
  stateHistory: {
    past: [],
    future: [],
  },
  adjacencyMap: {},
};

export const nodes = (state: INodesState = nodesInitialState, action?): INodesState => {
  switch (action.type) {
    case NodesActions.RESET:
      return _cloneDeep(nodesInitialState);

    case NodesActions.SET_STATE: {
      const patchCurrent = action?.meta?.patchCurrent;
      if (!patchCurrent) {
        return _cloneDeep(action.payload);
      }

      return _assign(_cloneDeep(state), action.payload);
    }

    case NodesActions.UNDO_ACTIONS:
      return cloneAndApply(state, undoActions_mutating);

    case NodesActions.RESET_ACTIVE_NODE:
      return cloneAndApply(state, resetActiveNodeId_mutating);

    case NodesActions.SET_ACTIVE_NODE:
      return cloneAndApply(state, (draft) => setActiveNodeId_mutating(draft, action.payload));

    case NodesActions.ADD_NODE:
      return cloneAndApply(state, (draft) => addNode_mutating(draft, action.payload));

    case NodesActions.UPDATE_NODE:
      return cloneAndApply(state, (draft) =>
        updateNode_mutating(draft, action.payload.nodeId, action.payload.nodeConfig)
      );

    case NodesActions.ADD_CONNECTION:
      return cloneAndApply(state, (draft) => addConnection_mutating(state, action.payload));

    default:
      return state;
  }
};
