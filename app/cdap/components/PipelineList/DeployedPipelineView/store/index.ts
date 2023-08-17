/*
 * Copyright © 2018 Cask Data, Inc.
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
import { Reducer, Store as StoreInterface } from 'redux';
import { IAction } from 'services/redux-helpers';
import { IPipeline } from 'components/PipelineList/DeployedPipelineView/types';
import { IDraft } from 'components/PipelineList/DraftPipelineView/types';

export enum SORT_ORDER {
  asc = 'asc',
  desc = 'desc',
}

interface IState {
  deleteError?: string;
  sortColumn: string;
  sortOrder: SORT_ORDER;
  search: string;
  searchInput: string;
  previousTokens: string[];
  nextPageToken: string;
  pageToken: string;
  hasMultiple: boolean;
  pageLimit: number;
  pipelines: IPipeline[];
  ready: boolean;
  drafts: IDraft[];
  pullLoading: boolean;
  pullStatus: {
    alertType: string;
    message: string;
  };
}

export interface IDeployedPipelineStore {
  deployed: IState;
}

export const Actions = {
  setSearchInput: 'DEPLOYED_SET_SEARCH',
  applySearch: 'DEPLOYED_APPLY_SEARCH',
  setDeleteError: 'DEPLOYED_PIPELINE_SET_DELETE_ERROR',
  clearDeleteError: 'DEPLOYED_PIPELINE_CLEAR_DELETE_ERROR',
  setSort: 'DEPLOYED_PIPELINE_SET_SORT',
  prevPage: 'DEPLOYED_PIPELINE_PREV_PAGE',
  nextPage: 'DEPLOYED_PIPELINE_NEXT_PAGE',
  reset: 'DEPLOYED_PIPELINE_RESET',
  setPipelines: 'DEPLOYED_PIPELINE_SET_PIPELINES',
  updatePipelines: 'DEPLOYED_PIPELINE_UPDATE_PIPELINES',
  setDrafts: 'DEPLOYED_PIPELINE_SET_DRAFTS',
  // Source Control Management
  setPullLoading: 'DEPLOYED_PIPELINE_SET_PULL_LOADING',
  setPullStatus: 'DEPLOYED_PIPELINE_SET_PULL_STATUS',
};

const defaultInitialState: IState = {
  deleteError: null,
  sortColumn: 'name',
  sortOrder: SORT_ORDER.asc,
  search: '',
  searchInput: '',
  nextPageToken: null,
  previousTokens: [],
  pageToken: null,
  pageLimit: 25,
  pipelines: null,
  hasMultiple: false,
  ready: false,
  drafts: [],
  pullLoading: false,
  pullStatus: null,
};

const deployed: Reducer<IState> = (state: IState = defaultInitialState, action: IAction) => {
  switch (action.type) {
    case Actions.setDeleteError:
      return {
        ...state,
        deleteError: action.payload.deleteError,
      };
    case Actions.clearDeleteError:
      return {
        ...state,
        deleteError: null,
      };
    case Actions.setSearchInput:
      return {
        ...state,
        searchInput: action.payload.search,
      };
    case Actions.applySearch:
      return {
        ...state,
        search: state.searchInput,
        pageToken: null,
        previousTokens: [],
        nextPageToken: null,
        hasMultiple: false,
        ready: false,
      };
    case Actions.setSort:
      return {
        ...state,
        sortColumn: action.payload.sortColumn,
        sortOrder: action.payload.sortOrder,
        pageToken: null,
        previousTokens: [],
        nextPageToken: null,
        hasMultiple: false,
        ready: false,
      };
    case Actions.prevPage:
      const lastTokenIdx = state.previousTokens.length - 1;
      const lastToken = state.previousTokens[lastTokenIdx];
      return {
        ...state,
        previousTokens: state.previousTokens.slice(0, lastTokenIdx),
        nextPageToken: state.pageToken,
        pageToken: lastToken,
        hasMultiple: true,
        ready: false,
      };
    case Actions.nextPage:
      return {
        ...state,
        previousTokens: [...state.previousTokens, state.pageToken],
        nextPageToken: null,
        pageToken: state.nextPageToken,
        hasMultiple: true,
        ready: false,
      };
    case Actions.setPipelines:
      return {
        ...state,
        pipelines: action.payload.pipelines,
        nextPageToken: action.payload.nextPageToken,
        hasMultiple: !!action.payload.nextPageToken || !!state.previousTokens.length,
        ready: true,
      };
    case Actions.updatePipelines:
      return {
        ...state,
        pipelines: action.payload.pipelines,
      };
    case Actions.setDrafts:
      return {
        ...state,
        drafts: action.payload.drafts,
      };
    case Actions.setPullLoading:
      return {
        ...state,
        pullLoading: action.payload.pullLoading,
      };
    case Actions.setPullStatus:
      return {
        ...state,
        pullStatus: action.payload.pullStatus,
      };
    case Actions.reset:
      return defaultInitialState;
    default:
      return state;
  }
};

const Store: StoreInterface<IDeployedPipelineStore, IAction> = createStore(
  combineReducers({
    deployed,
  }),
  {
    deployed: defaultInitialState,
  },
  composeEnhancers('DeployedPipelineStore')()
);

export default Store;
