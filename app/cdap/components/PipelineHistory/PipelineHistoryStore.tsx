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

import { gql } from 'apollo-boost';
import { combineReducers, createStore } from 'redux';
import { Reducer, Store as StoreInterface } from 'redux';
import { IAction } from 'services/redux-helpers';
import { IPipelineVersion } from './types';

interface IState {
  previousTokens: string[];
  nextPageToken: string;
  pageToken: string;
  pageLimit: number;
  pipelineVersions: IPipelineVersion[];
  ready: boolean;
  pageLimitOptions: number[];
}

interface IStore {
  versions: IState;
}

export const PIPELINE_HISTORY_QUERY = gql`
  query Query(
    $namespace: String
    $pageSize: Int
    $token: String
    $nameFilter: String
    $orderBy: String
    $nameFilterType: String
    $sortCreationTime: String
  ) {
    pipelines(
      namespace: $namespace
      pageSize: $pageSize
      pageToken: $token
      nameFilter: $nameFilter
      orderBy: $orderBy
      nameFilterType: $nameFilterType
      sortCreationTime: $sortCreationTime
    ) {
      applications {
        name
        version
        artifact {
          name
        }
        runs {
          status
          starting
        }
        totalRuns
        nextRuntime {
          id
          time
        }
        change {
          description
          creationTimeMillis
        }
      }
      nextPageToken
    }
  }
`;

const Actions = {
  prevPage: 'PIPELINE_VERSIONS_PREV_PAGE',
  nextPage: 'PIPELINE_VERSIONS_NEXT_PAGE',
  reset: 'PIPELINE_VERSIONS_RESET',
  setVersions: 'PIPELINE_VERSIONS_SET_VERSIONS',
  updateVersions: 'PIPELINE_VERSIONS_UPDATE_PIPELINES',
  setPageLimit: 'PIPELINE_VERSIONS_SET_PAGE_LIMIT',
};

const defaultInitialState: IState = {
  nextPageToken: null,
  previousTokens: [],
  pageToken: null,
  pageLimit: 5,
  pipelineVersions: [],
  ready: false,
  pageLimitOptions: [4, 5, 6, 7, 8, 9],
};

const versions: Reducer<IState> = (state = defaultInitialState, action: IAction) => {
  switch (action.type) {
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
    case Actions.setVersions:
      return {
        ...state,
        pipelineVersions: action.payload.pipelineVersions,
        nextPageToken: action.payload.nextPageToken,
        ready: true,
      };
    case Actions.updateVersions:
      return {
        ...state,
        pipelineVersions: action.payload.pipelineVersions,
      };
    case Actions.reset:
      return defaultInitialState;
    case Actions.setPageLimit:
      return {
        ...defaultInitialState,
        pageLimit: action.payload.pageLimit,
      };
    default:
      return state;
  }
};

const Store: StoreInterface<IStore> = createStore(
  combineReducers({
    versions,
  }),
  {
    versions: defaultInitialState,
  }
);

export function setPageLimit(pageLimit) {
  Store.dispatch({
    type: Actions.setPageLimit,
    payload: { pageLimit: parseInt(pageLimit, 10) },
  });
}

export function reset() {
  Store.dispatch({
    type: Actions.reset,
  });
}

export function setVersions({ pipelineVersions, nextPageToken }) {
  Store.dispatch({
    type: Actions.setVersions,
    payload: {
      pipelineVersions,
      nextPageToken,
    },
  });
}

export function prevPage() {
  const { previousTokens } = Store.getState().versions;
  if (!previousTokens.length) {
    return;
  }
  Store.dispatch({
    type: Actions.prevPage,
  });
}

export function nextPage() {
  const { nextPageToken } = Store.getState().versions;
  if (!nextPageToken) {
    return;
  }
  Store.dispatch({
    type: Actions.nextPage,
  });
}

export default Store;
export { Actions, IStore };
