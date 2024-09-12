/*
 * Copyright © 2024 Cask Data, Inc.
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
import { common, commonDefaultInitialState } from './common/reducer';
import { availablePlugins, availablePluginsInitialState } from './availablePlugins/reducer';
import { consoleReducer, consoleInitialState } from './console/reducer';
import { plugins, pluginsInitialState } from './plugins/reducer';
import { preview, previewInitialState } from './preview/reducer';
import { uiState, uiInitialState } from './uistate/reducer';
import { config, configInitialState } from './config/reducer';

const defaultInitialState = {
  common: commonDefaultInitialState,
  availablePlugins: availablePluginsInitialState,
  console: consoleInitialState,
  plugins: pluginsInitialState,
  preview: previewInitialState,
  uiState: uiInitialState,
  config: configInitialState,
};

const StudioV2Store = createStore(
  combineReducers({
    common,
    availablePlugins,
    plugins,
    preview,
    uiState,
    config,
    console: consoleReducer,
  }),
  defaultInitialState,
  (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__()
);

export default StudioV2Store;
