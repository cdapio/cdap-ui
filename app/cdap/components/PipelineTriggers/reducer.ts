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

const TRIGGER_PREFIX = 'features.PipelineTriggers.SetTriggers';
import T from 'i18n-react';
import NamespaceStore from 'services/NamespaceStore';

export function triggerConditionReducer(oldstate, action) {
  switch (action.type) {
    case 'COMPLETED':
      return { ...oldstate, completed: !oldstate.completed };
    case 'KILLED':
      return { ...oldstate, killed: !oldstate.killed };
    case 'FAILED':
      return { ...oldstate, failed: !oldstate.failed };
    case 'PIPELINE_SELECT':
      return {
        ...oldstate,
        selected: true,
      };
    case 'PIPELINE_UNSELECT':
      return {
        ...oldstate,
        selected: false,
      };
    case 'TOGGLE_PAYLOAD':
      return {
        ...oldstate,
        payloadModalOpen: !oldstate.payloadModalOpen,
        mappingError: !oldstate.payloadModalOpen ? '' : oldstate.mappingError,
      };
    case 'INVALID_MAPPING':
      return { ...oldstate, mappingError: action.error };
    default:
      return oldstate;
  }
}

export const initialInlineTriggerState = {
  completed: true,
  killed: false,
  failed: false,
  payloadModalOpen: false,
  selected: false,
  mappingError: '',
};

export function triggerNameReducer(oldstate, action) {
  switch (action.type) {
    case 'SET_NAMESPACE':
      const nsList = NamespaceStore.getState().namespaces;
      const ns = NamespaceStore.getState().selectedNamespace;
      return {
        ...oldstate,
        namespaceList: nsList,
        namespace: ns,
      };
    case 'SET_SEARCH_INPUT':
      return {
        ...oldstate,
        searchInput: action.searchInput,
      };
    case 'NO_TRIGGER_NAME_ERROR':
      return {
        ...oldstate,
        isNameInvalid: true,
        triggerNameError: T.translate(`${TRIGGER_PREFIX}.triggerNameRequired`),
        triggerName: '',
      };
    case 'TRIGGER_NAME_TOO_LONG':
      return {
        ...oldstate,
        isNameInvalid: true,
        triggerNameError: T.translate(`${TRIGGER_PREFIX}.triggerNameLengthLimit`),
        triggerName: action.triggerName,
      };
    case 'TRIGGER_NAME_EXISTS_ERROR':
      return {
        ...oldstate,
        isNameInvalid: true,
        triggerNameError: T.translate(`${TRIGGER_PREFIX}.triggerNameExists`),
        triggerName: action.triggerName,
      };
    case 'SET_VALID_TRIGGER_NAME':
      return {
        ...oldstate,
        isNameInvalid: false,
        triggerNameError: '',
        triggerName: action.triggerName,
      };
    case 'TOGGLE_PAYLOAD':
      return { ...oldstate, computeModalOpen: !oldstate.computeModalOpen };
    case 'COMPUTE_PROFILE':
      return {
        ...oldstate,
        computeProfile: { ...oldstate.computeProfile, ...action.computeProfile },
        computeModalOpen: !oldstate.computeModalOpen,
      };
    default:
      return oldstate;
  }
}

export const initialAvailablePipelineListState = {
  searchInput: '',
  namespaceList: [],
  namespace: '',
  triggerName: '',
  isNameInvalid: true,
  computeModalOpen: false,
  computeProfile: {},
  triggerNameError: T.translate(`${TRIGGER_PREFIX}.triggerNameRequired`),
};
