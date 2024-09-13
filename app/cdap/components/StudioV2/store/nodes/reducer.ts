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

import { NodesActions } from './actions';

export interface INodesState {
  nodes: any[];
  connections: any[];
  activeNodeId?: any;
  currentSourceCount: number;
  currentTransformCount: number;
  currentSinkCount: number;
  canvasPanning: {
    top: number;
    left: number;
  };
  stateHistory: {
    past: any[];
    future: any[];
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
    default:
      return state;
  }
};
