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

import StudioV2Store from '..';

const PREFIX = 'CONSOLE_ACTIONS';

export const ConsoleActions = {
  ADD_MESSAGE: `${PREFIX}/ADD_MESSAGE`,
  ADD_MESSAGES: `${PREFIX}/ADD_MESSAGES`,
  RESET: `${PREFIX}/RESET`,
};

export function resetConsoleMessages() {
  StudioV2Store.dispatch({
    type: ConsoleActions.RESET,
  });
}

export function addConsoleMessage(payload) {
  StudioV2Store.dispatch({
    type: ConsoleActions.ADD_MESSAGE,
    payload,
  });
}

export function addConsoleMessages(payload) {
  StudioV2Store.dispatch({
    type: ConsoleActions.ADD_MESSAGES,
    payload,
  });
}
