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

import StudioV2Store from '..';
import { INodesState, NodesActions } from './reducer';

export function resetNodesState() {
  StudioV2Store.dispatch({
    type: NodesActions.RESET,
  });
}

export function setState(payload: INodesState, patchCurrent: boolean = true) {
  StudioV2Store.dispatch({
    type: NodesActions.SET_STATE,
    payload,
    meta: {
      patchCurrent,
    },
  });
}

export function undoActions() {
  StudioV2Store.dispatch({
    type: NodesActions.UNDO_ACTIONS,
  });
}

export function resetSelectedNode() {
  StudioV2Store.dispatch({
    type: NodesActions.RESET_ACTIVE_NODE,
  });
}

export function addNode(nodeConfig) {
  StudioV2Store.dispatch({
    type: NodesActions.ADD_NODE,
    payload: nodeConfig,
  });
}

export function updateNode(nodeId, nodeConfig) {
  StudioV2Store.dispatch({
    type: NodesActions.UPDATE_NODE,
    payload: {
      nodeId,
      nodeConfig,
    },
  });
}

export function setActiveNodeId(nodeId) {
  StudioV2Store.dispatch({
    type: NodesActions.SET_ACTIVE_NODE,
    payload: nodeId,
  });
}

export function updateNodePosition(nodeId, position) {
  const nodeConfig = {
    _uiPosition: position,
  };
  updateNode(nodeId, nodeConfig);
}

export function removePreviousState() {
  StudioV2Store.dispatch({
    type: NodesActions.REMOVE_PREVIOUS_STATE,
  });
}

export function resetFutureStates() {
  StudioV2Store.dispatch({
    type: NodesActions.RESET_FUTURE_STATES,
  });
}

export function logNodePos(nodeId, pos) {
  console.log(nodeId, pos);
}
