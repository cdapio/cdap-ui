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

import { AvailablePluginsActions } from './actions';

interface IAvailablePluginsState {
  pluginsMap: any;
}

export const availablePluginsInitialState: IAvailablePluginsState = {
  pluginsMap: {},
};

export const availablePlugins = (
  state: IAvailablePluginsState = availablePluginsInitialState,
  action?
): IAvailablePluginsState => {
  switch (action.type) {
    case AvailablePluginsActions.SET_PLUGINS_MAP:
      return { ...state, pluginsMap: action.payload };

    case AvailablePluginsActions.RESET:
      return { ...availablePluginsInitialState };

    default:
      return state;
  }
};
