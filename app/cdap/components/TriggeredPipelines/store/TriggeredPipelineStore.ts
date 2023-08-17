/*
 * Copyright © 2022 Cask Data, Inc.
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

import { combineReducers, createStore, Store } from 'redux';
import TriggeredPipelineActions from 'components/TriggeredPipelines/store/TriggeredPipelineActions';
import { IPipelineInfo, ISchedule } from 'components/PipelineTriggers/store/ScheduleTypes';

interface IPayLoad {
  triggeredPipelines?: ISchedule[];
  expandedPipeline?: string;
  expandedPipelineInfo?: IPipelineInfo;
}

interface IAction {
  type: string;
  payload: IPayLoad;
}

const defaultAction: IAction = {
  type: '',
  payload: {},
};

const defaultInitialState: IPayLoad = {
  triggeredPipelines: [],
  expandedPipeline: undefined,
  expandedPipelineInfo: undefined,
};

const triggered = (state: IPayLoad = defaultInitialState, action = defaultAction): IPayLoad => {
  switch (action.type) {
    case TriggeredPipelineActions.setTriggered:
      return {
        ...state,
        triggeredPipelines: action.payload.triggeredPipelines,
      };

    case TriggeredPipelineActions.setToggle:
      return {
        ...state,
        expandedPipeline: action.payload.expandedPipeline,
        expandedPipelineInfo: undefined,
      };

    case TriggeredPipelineActions.setPipelineInfo:
      return {
        ...state,
        expandedPipelineInfo: action.payload.expandedPipelineInfo,
      };
    case TriggeredPipelineActions.reset:
      return defaultInitialState;
    default:
      return state;
  }
};

const TriggeredPipelineStore: Store<IPayLoad, IAction> = createStore(
  combineReducers({
    triggered,
  }),
  {
    triggered: defaultInitialState,
  },
  window &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION__()
);

export default TriggeredPipelineStore;
