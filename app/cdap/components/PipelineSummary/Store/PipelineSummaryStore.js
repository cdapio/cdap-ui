/*
 * Copyright © 2017 Cask Data, Inc.
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

import { createStore, combineReducers } from 'redux';
import { defaultAction, composeEnhancers } from 'services/helpers';
const PIPELINESSUMMARYACTIONS = {
  SETRUNS: 'SETRUNS',
  SETMETRICS: 'SETMETRICS',
  SETLOADING: 'SETLOADING',
  SETNODEMETRICSLOADING: 'SETNODEMETRICSLOADING',
  SETNODESMETRICSMAP: 'SETNODESMETRICSMAP',
};
const defaultRunsSummary = {
  runs: [],
  nodesMap: {},
  loading: false,
  nodeMetricsLoading: false,
};

const pipelinerunssummary = (
  state = defaultRunsSummary,
  action = defaultAction
) => {
  switch (action.type) {
    case PIPELINESSUMMARYACTIONS.SETRUNS:
      return Object.assign({}, state, {
        runs: action.payload.runs || [],
        loading: false,
      });
    case PIPELINESSUMMARYACTIONS.SETNODESMETRICSMAP:
      return Object.assign({}, state, {
        nodesMap: action.payload.nodesMap,
        nodeMetricsLoading: false,
      });
    case PIPELINESSUMMARYACTIONS.SETNODEMETRICSLOADING:
      return Object.assign({}, state, {
        nodeMetricsLoading: action.payload.nodemetricsloading,
      });
    case PIPELINESSUMMARYACTIONS.SETLOADING:
      return Object.assign({}, state, {
        loading: action.payload.loading,
        runs: [],
        nodesMap: {},
      });
    default:
      return state;
  }
};

const PipelineSummaryStore = createStore(
  combineReducers({
    pipelinerunssummary,
  }),
  {
    pipelinerunssummary: defaultRunsSummary,
  },
  composeEnhancers('PipelineSummaryStore')()
);

export { PIPELINESSUMMARYACTIONS };
export default PipelineSummaryStore;
