/*
 * Copyright © 2025 Cask Data, Inc.
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
import { consoleReducer, consoleInitialState } from './console/reducer';
import { plugins, pluginsInitialState } from './plugins/reducer';

const defaultInitialState = {
  common: commonDefaultInitialState,
  console: consoleInitialState,
  plugins: pluginsInitialState,
};

const StudioV2Store = createStore(
  combineReducers({
    common,
    console: consoleReducer,
    plugins,
  }),
  defaultInitialState,
  (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__()
);

export default StudioV2Store;
