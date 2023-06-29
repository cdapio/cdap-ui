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

import { createSlice } from '@reduxjs/toolkit';
import { MyPipelineApi } from 'api/pipeline';
import { Observable } from 'rxjs/Observable';
import { computePipelineDiff, getReactflowPipelineGraph } from './pipelineUtil';
import { IPipelineConfig, IPipelineConnection, IPipelineStage, JSONDiffList } from '../types';
import { PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from '.';

interface IPipelineState {
  config: IPipelineConfig | null;
  nodes: any[];
  connections: any[];
}
interface IDiffState {
  isLoading: boolean;
  error: any;

  topPipeline: IPipelineState;
  bottomPipeline: IPipelineState;

  diffList: {
    stagesDiffList: JSONDiffList<IPipelineStage>;
    connectionsDiffList: JSONDiffList<IPipelineConnection>;
  };
}

const initialState: IDiffState = {
  isLoading: false,
  error: null,

  topPipeline: {
    config: null,
    nodes: [],
    connections: [],
  },
  bottomPipeline: {
    config: null,
    nodes: [],
    connections: [],
  },

  diffList: {
    stagesDiffList: [],
    connectionsDiffList: [],
  },
};

// TODO: type if not inferred
const diffSlice = createSlice({
  name: 'pipelineDiff',
  initialState,
  reducers: {
    fetchPipelinesPending(state) {
      state.isLoading = true;
      state.error = '';
    },
    fetchPipelinesFulfilled(
      state,
      action: PayloadAction<Pick<IDiffState, 'topPipeline' | 'bottomPipeline' | 'diffList'>>
    ) {
      const { topPipeline, bottomPipeline, diffList } = action.payload;
      state.topPipeline = topPipeline;
      state.bottomPipeline = bottomPipeline;
      state.diffList = diffList;
      state.isLoading = false;
      state.error = '';
    },
    fetchPipelinesRejected(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

const { actions, reducer } = diffSlice;
export const { fetchPipelinesPending, fetchPipelinesFulfilled, fetchPipelinesRejected } = actions;

export default reducer;

export function fetchPipelineConfig(
  namespace: any,
  appId: any,
  topVersion: any,
  bottomVersion: any,
  dispatch: AppDispatch
) {
  dispatch(actions.fetchPipelinesPending());
  Observable.forkJoin(
    MyPipelineApi.getAppVersion({
      namespace,
      appId,
      version: topVersion,
    }),
    MyPipelineApi.getAppVersion({
      namespace,
      appId,
      version: bottomVersion,
    })
  ).subscribe(
    (res: any[]) => {
      const [topRes, bottomRes] = res;
      const topPipelineConfig: IPipelineConfig = JSON.parse(topRes.configuration);
      const bottomPipelineConfig: IPipelineConfig = JSON.parse(bottomRes.configuration);

      const diffList = computePipelineDiff(topPipelineConfig, bottomPipelineConfig);
      // TODO: currently without the timeout the graph edges renders weirdly
      // need to figure out the cause
      setTimeout(() => {
        dispatch(
          actions.fetchPipelinesFulfilled({
            topPipeline: {
              ...getReactflowPipelineGraph(topPipelineConfig),
              config: topPipelineConfig,
            },
            bottomPipeline: {
              ...getReactflowPipelineGraph(bottomPipelineConfig),
              config: bottomPipelineConfig,
            },
            diffList,
          })
        );
      }, 300);
    },
    (error) => {
      console.log('Unable to load pipeline details:', error);
      dispatch(fetchPipelinesRejected(error));
    }
  );
}
