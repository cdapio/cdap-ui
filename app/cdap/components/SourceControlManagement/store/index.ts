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

import { combineReducers, createStore } from 'redux';
import { composeEnhancers } from 'services/helpers';
import { IAction } from 'services/redux-helpers';
import { ILocalPipeline } from '../types';

interface IPushViewState {
  ready: boolean;
  localPipelines: ILocalPipeline[];
  nameFilter: string;
  selectedPipelines: string[];
  commitModalOpen: boolean;
  loadingMessage: string;
  showFailedOnly: boolean;
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

const defaultPushViewState: IPushViewState = {
  ready: false,
  localPipelines: [],
  nameFilter: '',
  selectedPipelines: [],
  commitModalOpen: false,
  loadingMessage: null,
  showFailedOnly: false,
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

const SourceControlManagementSyncStore = createStore(
  combineReducers({
    push,
  }),
  {
    push: defaultPushViewState,
  },
  composeEnhancers('SourceControlManagementSyncStore')()
);

export default SourceControlManagementSyncStore;
