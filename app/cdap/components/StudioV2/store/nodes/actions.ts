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

const PREFIX = 'NODES_ACTIONS';
export const NodesActions = {
  RESET: `${PREFIX}/RESET`,
  SET_STATE: `${PREFIX}/SET_STATE`,
  UNDO_ACTIONS: `${PREFIX}/UNDO_ACTIONS`,
  RESET_ACTIVE_NODE: `${PREFIX}/RESET_ACTIVE_NODE`,
  ADD_NODE: `${PREFIX}/ADD_NODE`,
  UPDATE_NODE: `${PREFIX}/UPDATE_NODE`,
  ADD_CONNECTION: `${PREFIX}/ADD_CONNECTION`,
  SET_ACTIVE_NODE: `${PREFIX}/SET_ACTIVE_NODE`,
  REMOVE_PREVIOUS_STATE: `${PREFIX}/REMOVE_PREVIOUS_STATE`,
  RESET_FUTURE_STATES: `${PREFIX}/RESET_FUTURE_STATES`,
};