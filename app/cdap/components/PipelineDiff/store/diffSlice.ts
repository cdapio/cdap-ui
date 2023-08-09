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
import { AvailablePluginsMap, IPipelineConfig, IPipelineDiffMap } from '../types';

interface FocusElement {
  type: 'node' | 'edge';
  name: string;
}
interface IDiffState {
  isLoading: boolean;
  error: any; // TODO: type
  topPipelineConfig: IPipelineConfig | null;
  bottomPipelineConfig: IPipelineConfig | null;
  diffMap: IPipelineDiffMap;
  openDiffItem: string | null;
  focusElement: FocusElement | null;
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
  openDiffItem: null,
  focusElement: null,
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
      // @ts-ignore TODO: fix type issue
      state.diffMap = action.payload.diffMap;
      state.availablePluginsMap = action.payload.availablePluginsMap;
      state.isLoading = false;
      state.error = '';
    },
    fetchPipelinesRejected(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    showDiffDetails(state, action: PayloadAction<string | null>) {
      state.openDiffItem = action.payload;
    },
    modalClosed(state) {
      state.openDiffItem = null;
      state.focusElement = null;
    },
    startNavigateTo(state, action: PayloadAction<FocusElement>) {
      state.focusElement = action.payload;
    },
    endNavigate(state) {
      state.focusElement = null;
    },
  },
});

export const { actions, reducer } = diffSlice;
