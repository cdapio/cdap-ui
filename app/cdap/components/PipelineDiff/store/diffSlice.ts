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

const initialState = {
  isLoading: false,

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
  diffList: [],
};

const diffSlice = createSlice({
  name: 'pipelineDiff',
  initialState,
  reducers: {
    pipelinesLoading(state) {
      state.isLoading = true;
    },
    pipelinesReceived(state, action) {
      const { topPipeline, bottomPipeline, diffList } = action.payload;
      state.topPipeline = topPipeline;
      state.bottomPipeline = bottomPipeline;
      state.diffList = diffList;
      state.isLoading = false;
    },
  },
});

const { actions, reducer } = diffSlice;
export const { pipelinesLoading, pipelinesReceived } = actions;

export default reducer;

export function fetchPipelineConfig(namespace, appId, topVersion, bottomVersion, dispatch) {
  dispatch(pipelinesLoading());
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
  ).subscribe((res: any[]) => {
    const [topRes, bottomRes] = res;
    const topPipelineConfig = JSON.parse(topRes.configuration);
    const bottomPipelineConfig = JSON.parse(bottomRes.configuration);

    const diffList = computePipelineDiff(topPipelineConfig, bottomPipelineConfig);
    setTimeout(() => {
      dispatch(
        pipelinesReceived({
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
  });
}
