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

import { ConsoleActions } from './actions';

interface IConsoleState {
  messages: any[];
}

export const consoleInitialState: IConsoleState = {
  messages: [],
};

export const consoleReducer = (
  state: IConsoleState = consoleInitialState,
  action?
): IConsoleState => {
  switch (action.type) {
    case ConsoleActions.ADD_MESSAGE:
      return { ...state, messages: [...state.messages, action.payload] };

    case ConsoleActions.ADD_MESSAGES:
      return { ...state, messages: action.payload };

    case ConsoleActions.RESET:
      return { ...consoleInitialState };

    default:
      return state;
  }
};
