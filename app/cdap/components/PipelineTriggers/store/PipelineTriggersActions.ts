/*
 * Copyright © 2022 Cask Data, Inc.
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

const PipelineTriggersActions = {
  setTriggersGroup: 'TRIGGERS_ADD_TRIGGERS_GROUP',
  resetTriggersGroup: 'TRIGGERS_RESET_TRIGGERS_GROUP',
  setTriggersGroupRunArgsMapping: 'TRIGGERS_ADD_TRIGGERS_GROUP_RUN_ARGS',
  changeNamespace: 'TRIGGERS_CHANGE_NAMESPACE',
  setPipeline: 'TRIGGERS_SET_PIPELINE',
  setExpandedPipeline: 'TRIGGERS_SET_EXPANDED_PIPELINE',
  setExpandedSchedule: 'TRIGGERS_SET_EXPANDED_SCHEDULE',
  setExpandedInlineTrigger: 'TRIGGERS_SET_EXPANDED_INLINE_TRIGGER',
  resetTriggers: 'TRIGGERS_RESET_TRIGGERS',
  setPaginatedPipelineList: 'TRIGGERS_SET_PAGINATED_PIPELINE_LIST',
  setEnabledTriggerPipelineInfo: 'TRIGGERS_SET_PIPELINE_INFO',
  setEnabledTriggerInlinePipelineInfo: 'TRIGGERS_SET_INLINE_PIPELINE_INFO',
  setConfigureTriggerError: 'TRIGGERS_SET_CONFIGURE_ERROR',
  setDisableTriggerError: 'TRIGGERS_SET_DISABLE_ERROR',
  setPayloadModalState: 'TRIGGERS_SET_PAYLOAD_MODAL_STATE',
  setTriggerType: 'TRIGGERS_SET_TYPE',
  reset: 'TRIGGERS_RESET',
  setMaxConcurrentRuns: 'TRIGGERS_SET_MAX_CONCURRENT_RUNS',
  setPageSize: 'TRIGGERS_SET_PAGE_SIZE',
  setCurrentPage: 'TRIGGERS_SET_CURRENT_PAGE',
  setPageToken: 'TRIGGERS_SET_PAGE_TOKEN',
  markStale: 'TRIGGERS_MARK_STATE',
  setLastRefreshTime: 'TRIGGERS_SET_LAST_REFRESH_TIME',
  setNameFilter: 'TRIGGERS_SET_NAME_FILTER',
  applySearch: 'TRIGGERS_APPLY_SERACH',
  markReady: 'TRIGGERS_MARK_READY',
};

export default PipelineTriggersActions;
