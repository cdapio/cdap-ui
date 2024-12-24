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

const PREFIX = 'PREVIEW_ACTIONS';

export const PreviewActions = {
  TOGGLE_PREVIEW_MODE: `${PREFIX}/TOGGLE_PREVIEW_MODE`,
  SET_PREVIEW_START_TIME: `${PREFIX}/SET_PREVIEW_START_TIME`,
  SET_PREVIEW_STATUS: `${PREFIX}/SET_PREVIEW_STATUS`,
  SET_PREVIEW_ID: `${PREFIX}/SET_PREVIEW_ID`,
  PREVIEW_RESET: `${PREFIX}/PREVIEW_RESET`,
  SET_MACROS: `${PREFIX}/SET_MACROS`,
  SET_USER_RUNTIME_ARGUMENTS: `${PREFIX}/SET_USER_RUNTIME_ARGUMENTS`,
  SET_RUNTIME_ARGS_FOR_DISPLAY: `${PREFIX}/SET_RUNTIME_ARGS_FOR_DISPLAY`,
  SET_TIMEOUT_IN_MINUTES: `${PREFIX}/SET_TIMEOUT_IN_MINUTES`,
  SET_PREVIEW_DATA: `${PREFIX}/SET_PREVIEW_DATA`,
  RESET_PREVIEW_DATA: `${PREFIX}/RESET_PREVIEW_DATA`,
};
