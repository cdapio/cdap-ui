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
import { PayloadAction } from '@reduxjs/toolkit';
import {
  AvailablePluginsMap,
  IPipelineConfig,
  IPipelineDiffMap,
  IPipelineStage,
  IStageDiffItem,
} from '../types';

export interface IPipelineNodeData extends IPipelineStage {
  customIconSrc?: string;
  iconName: string;
  diffItem?: IStageDiffItem;
}

interface IDiffState {
  isLoading: boolean;
  error: any; // TODO: type

  topPipelineConfig: IPipelineConfig | null;
  bottomPipelineConfig: IPipelineConfig | null;

  diffMap: IPipelineDiffMap;

  availablePluginsMap: AvailablePluginsMap;
}

const initialState: IDiffState = {
  isLoading: false,
  error: null,

  topPipelineConfig: null,
  bottomPipelineConfig: null,

  diffMap: {
    stages: {},
    connections: {},
  },
  availablePluginsMap: {},
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
      action: PayloadAction<
        Pick<
          IDiffState,
          'topPipelineConfig' | 'bottomPipelineConfig' | 'diffMap' | 'availablePluginsMap'
        >
      >
    ) {
      state.topPipelineConfig = action.payload.topPipelineConfig;
      state.bottomPipelineConfig = action.payload.bottomPipelineConfig;
      state.diffMap = action.payload.diffMap;
      state.availablePluginsMap = action.payload.availablePluginsMap;
      state.isLoading = false;
      state.error = '';
    },
    fetchPipelinesRejected(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const { actions, reducer } = diffSlice;
