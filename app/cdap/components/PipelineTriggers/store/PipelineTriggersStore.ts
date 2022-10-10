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

import { combineReducers, createStore } from 'redux';
import PipelineTriggersActions from 'components/PipelineTriggers/store/PipelineTriggersActions';
import {
  IPipelineInfo,
  IProgramStatusTrigger,
  ISchedule,
  ICompositeTriggerRunArgsWithTargets,
  ITriggeringPipelineId,
} from 'components/PipelineTriggers/store/ScheduleTypes';
import PipelineTriggersTypes from 'components/PipelineTriggers/store/PipelineTriggersTypes';

interface IPayLoad {
  pipelineName?: string;
  workflowName?: string;
  pipelineCompositeTriggersEnabled?: boolean;
  pipelineList?: IPipelineInfo[];
  selectedNamespace?: string;
  selectedTriggersType?: string;
  triggersGroupToAdd?: IProgramStatusTrigger[];
  triggersGroupRunArgsToAdd?: ICompositeTriggerRunArgsWithTargets;
  enabledTriggers?: ISchedule[];
  expandedPipeline?: string;
  error?: any;
  isOpen?: boolean;
  expandedSchedule?: string;
  pipelineInfo?: IPipelineInfo;
}

interface IAction {
  type: string;
  payload: IPayLoad;
}

const defaultAction: IAction = {
  type: '',
  payload: {},
};

const defaultInitialState = {
  pipelineList: [],
  triggersGroupToAdd: [],
  selectedNamespace: '',
  selectedTriggersType: PipelineTriggersTypes.orType,
  triggersGroupRunArgsToAdd: {
    arguments: [],
    pluginProperties: [],
    targets: new Map<string, ITriggeringPipelineId>(),
  },
  enabledTriggers: [],
  pipelineName: '',
  pipelineType: '',
  expandedPipeline: null,
  expandedSchedule: null,
  configureError: null,
  pipelineCompositeTriggersEnabled: false,
};

const defaultInitialEnabledTriggersState = {
  loading: false,
  pipelineInfo: null,
  disableError: null,
};

const triggers = (state = defaultInitialState, action = defaultAction) => {
  let stateCopy;

  switch (action.type) {
    case PipelineTriggersActions.setPipeline:
      stateCopy = {
        ...state,
        pipelineName: action.payload.pipelineName,
        workflowName: action.payload.workflowName,
        pipelineCompositeTriggersEnabled: action.payload.pipelineCompositeTriggersEnabled,
      };
      break;
    case PipelineTriggersActions.changeNamespace:
      stateCopy = {
        ...state,
        pipelineList: action.payload.pipelineList,
        selectedNamespace: action.payload.selectedNamespace,
        expandedPipeline: null,
        configureError: null,
      };
      break;
    case PipelineTriggersActions.setTriggerType:
      stateCopy = {
        ...state,
        selectedTriggersType: action.payload.selectedTriggersType,
        configureError: null,
      };
      break;
    case PipelineTriggersActions.setTriggersGroup:
      stateCopy = {
        ...state,
        triggersGroupToAdd: action.payload.triggersGroupToAdd,
        triggersGroupRunArgsToAdd: action.payload.triggersGroupRunArgsToAdd,
        configureError: null,
      };
      break;
    case PipelineTriggersActions.resetTriggersGroup:
      stateCopy = {
        ...state,
        triggersGroupToAdd: [],
        triggersGroupRunArgsToAdd: {
          arguments: [],
          pluginProperties: [],
          targets: new Map<string, ITriggeringPipelineId>(),
        },
        expandedPipeline: null,
        configureError: null,
      };
      break;
    case PipelineTriggersActions.setTriggersAndPipelineList:
      stateCopy = {
        ...state,
        pipelineList: action.payload.pipelineList,
        enabledTriggers: action.payload.enabledTriggers,
        selectedNamespace: action.payload.selectedNamespace,
        expandedPipeline: null,
        configureError: null,
      };
      break;
    case PipelineTriggersActions.setExpandedPipeline:
      stateCopy = {
        ...state,
        expandedPipeline: action.payload.expandedPipeline,
        configureError: null,
      };
      break;
    case PipelineTriggersActions.setExpandedSchedule:
      stateCopy = {
        ...state,
        expandedSchedule: action.payload.expandedSchedule,
        configureError: null,
      };
      break;
    case PipelineTriggersActions.setConfigureTriggerError:
      stateCopy = {
        ...state,
        configureError: action.payload.error,
      };
      break;
    case PipelineTriggersActions.reset:
      return defaultInitialState;
    default:
      return state;
  }

  return Object.assign({}, state, stateCopy);
};

const enabledTriggers = (state = defaultInitialEnabledTriggersState, action = defaultAction) => {
  let stateCopy;

  switch (action.type) {
    case PipelineTriggersActions.setExpandedSchedule:
      stateCopy = {
        ...state,
        loading: true,
        disableError: null,
      };
      break;
    case PipelineTriggersActions.setTriggersAndPipelineList:
      stateCopy = {
        ...state,
        disableError: null,
      };
      break;
    case PipelineTriggersActions.setEnabledTriggerPipelineInfo:
      stateCopy = {
        ...state,
        pipelineInfo: action.payload.pipelineInfo,
        loading: false,
        disableError: null,
      };
      break;
    case PipelineTriggersActions.setDisableTriggerError:
      stateCopy = {
        ...state,
        disableError: action.payload.error,
      };
      break;
    case PipelineTriggersActions.reset:
      return defaultInitialState;
    default:
      return state;
  }

  return Object.assign({}, state, stateCopy);
};

const PipelineTriggersStore = createStore(
  combineReducers({
    triggers,
    enabledTriggers,
  }),
  {
    triggers: defaultInitialState,
    enabledTriggers: defaultInitialEnabledTriggersState,
  },
  window &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION__()
);

export default PipelineTriggersStore;
