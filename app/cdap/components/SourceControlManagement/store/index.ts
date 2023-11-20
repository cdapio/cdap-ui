/*
 * Copyright © 2023 Cask Data, Inc.
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

import { combineReducers, createStore, Store as StoreInterface } from 'redux';
import { composeEnhancers } from 'services/helpers';
import { IAction } from 'services/redux-helpers';
import { IOperationRun, IRepositoryPipeline } from '../types';
import { act } from 'react-dom/test-utils';

interface IPushViewState {
  ready: boolean;
  localPipelines: IRepositoryPipeline[];
  nameFilter: string;
  selectedPipelines: string[];
  commitModalOpen: boolean;
  loadingMessage: string;
  showFailedOnly: boolean;
}

interface IPullViewState {
  ready: boolean;
  remotePipelines: IRepositoryPipeline[];
  nameFilter: string;
  selectedPipelines: string[];
  loadingMessage: string;
  showFailedOnly: boolean;
  pullViewErrorMsg: string;
}

interface IOperationRunState {
  running: boolean;
  operation?: IOperationRun;
}

interface IStore {
  push: IPushViewState;
  pull: IPullViewState;
  operationRun: IOperationRunState;
}

export const PushToGitActions = {
  setLocalPipelines: 'LOCAL_PIPELINES_SET',
  reset: 'LOCAL_PIPELINES_RESET',
  setNameFilter: 'LOCAL_PIPELINES_SET_NAME_FILTER',
  applySearch: 'LOCAL_PIPELINES_APPLY_SERACH',
  setSelectedPipelines: 'LOCAL_PIPELINES_SET_SELECTED_PIPELINES',
  toggleCommitModal: 'LOCAL_PIPELINES_TOGGLE_COMMIT_MODAL',
  setLoadingMessage: 'LOCAL_PIPELINES_SET_LOADING_MESSAGE',
  toggleShowFailedOnly: 'LOCAL_PIPELINES_TOGGLE_SHOW_FAILED_ONLY',
};

export const PullFromGitActions = {
  setRemotePipelines: 'REMOTE_PIPELINES_SET',
  reset: 'REMOTE_PIPELINES_RESET',
  setNameFilter: 'REMOTE_PIPELINES_SET_NAME_FILTER',
  applySearch: 'REMOTE_PIPELINES_APPLY_SERACH',
  setSelectedPipelines: 'REMOTE_PIPELINES_SET_SELECTED_PIPELINES',
  setLoadingMessage: 'REMOTE_PIPELINES_SET_LOADING_MESSAGE',
  toggleShowFailedOnly: 'REMOTE_PIPELINES_TOGGLE_SHOW_FAILED_ONLY',
  setPullViewErrorMsg: 'REMOTE_PIPELINES_SET_ERROR_MSG',
};

export const OperationRunActions = {
  setLatestOperation: 'SET_RUNNING_OPERATION',
  unsetLatestOperation: 'UNSET_RUNNING_OPERATION',
};

const defaultPushViewState: IPushViewState = {
  ready: false,
  localPipelines: [],
  nameFilter: '',
  selectedPipelines: [],
  commitModalOpen: false,
  loadingMessage: null,
  showFailedOnly: false,
};

const defaultPullViewState: IPullViewState = {
  ready: false,
  remotePipelines: [],
  nameFilter: '',
  selectedPipelines: [],
  loadingMessage: null,
  showFailedOnly: false,
  pullViewErrorMsg: '',
};

const defaultOperationRunState: IOperationRunState = {
  running: false,
};

const push = (state = defaultPushViewState, action: IAction) => {
  switch (action.type) {
    case PushToGitActions.setLocalPipelines:
      return {
        ...state,
        localPipelines: action.payload.localPipelines,
        ready: true,
      };
    case PushToGitActions.setNameFilter:
      return {
        ...state,
        nameFilter: action.payload.nameFilter,
      };
    case PushToGitActions.applySearch:
      return {
        ...defaultPushViewState,
        nameFilter: state.nameFilter,
        selectedPipelines: state.selectedPipelines,
      };
    case PushToGitActions.setSelectedPipelines:
      return {
        ...state,
        selectedPipelines: action.payload.selectedPipelines,
      };
    case PushToGitActions.toggleCommitModal:
      return {
        ...state,
        commitModalOpen: !state.commitModalOpen,
      };
    case PushToGitActions.setLoadingMessage:
      return {
        ...state,
        loadingMessage: action.payload.loadingMessage,
      };
    case PushToGitActions.toggleShowFailedOnly:
      return {
        ...state,
        showFailedOnly: !state.showFailedOnly,
      };
    case PushToGitActions.reset:
      return defaultPushViewState;
    default:
      return state;
  }
};

const pull = (state = defaultPullViewState, action: IAction) => {
  switch (action.type) {
    case PullFromGitActions.setRemotePipelines:
      return {
        ...state,
        remotePipelines: action.payload.remotePipelines,
        ready: true,
      };
    case PullFromGitActions.setNameFilter:
      return {
        ...state,
        nameFilter: action.payload.nameFilter,
      };
    case PullFromGitActions.setPullViewErrorMsg:
      return {
        ...state,
        pullViewErrorMsg: action.payload.pullViewErrorMsg,
      };
    case PullFromGitActions.applySearch:
      return {
        ...defaultPushViewState,
        nameFilter: state.nameFilter,
        selectedPipelines: state.selectedPipelines,
      };
    case PullFromGitActions.setSelectedPipelines:
      return {
        ...state,
        selectedPipelines: action.payload.selectedPipelines,
      };
    case PullFromGitActions.setLoadingMessage:
      return {
        ...state,
        loadingMessage: action.payload.loadingMessage,
      };
    case PullFromGitActions.toggleShowFailedOnly:
      return {
        ...state,
        showFailedOnly: !state.showFailedOnly,
      };
    case PullFromGitActions.reset:
      return defaultPullViewState;
    default:
      return state;
  }
};

const operationRun = (
  state: IOperationRunState = defaultOperationRunState,
  action: IAction
): IOperationRunState => {
  switch (action.type) {
    case OperationRunActions.setLatestOperation:
      return {
        running: !action.payload?.done,
        operation: action.payload,
      };
    case OperationRunActions.unsetLatestOperation:
      return {
        running: false,
      };
    default:
      return state;
  }
};

const SourceControlManagementSyncStore: StoreInterface<IStore> = createStore(
  combineReducers({
    push,
    pull,
    operationRun,
  }),
  {
    push: defaultPushViewState,
    pull: defaultPullViewState,
    operationRun: defaultOperationRunState,
  },
  composeEnhancers('SourceControlManagementSyncStore')()
);

export default SourceControlManagementSyncStore;
