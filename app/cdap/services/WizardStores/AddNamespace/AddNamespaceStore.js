/*
 * Copyright © 2016-2018 Cask Data, Inc.
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

import { combineReducers, createStore, compose } from 'redux';
import AddNamespaceActions from 'services/WizardStores/AddNamespace/AddNamespaceActions';
import { convertMapToKeyValuePairsObj } from 'components/shared/KeyValuePairs/KeyValueStoreActions';
import uuidV4 from 'uuid/v4';

// Defaults
const skippableDefaultState = {
  __complete: true,
  __skipped: true,
  __error: false,
};

const nonSkippableDefaultState = {
  __skipped: false,
  __error: false,
};

const defaultGeneralState = Object.assign(
  {
    name: '',
    description: '',
    schedulerQueue: '',
  },
  nonSkippableDefaultState
);

const defaultResourcesState = Object.assign(
  {
    k8sNamespace: '',
    k8sNamespaceCpuLimit: '',
    k8sNamespaceMemoryLimit: '',
    serviceAccountEmail: '',
  },
  skippableDefaultState
);

const defaultHadoopMappingState = Object.assign(
  {
    hdfsDirectory: '',
    hiveDatabaseName: '',
    hbaseNamespace: '',
    schedulerQueueName: '',
  },
  skippableDefaultState
);

const defaultSecurityState = Object.assign(
  {
    principal: '',
    keyTab: '',
  },
  skippableDefaultState
);

const defaultPreferencesState = Object.assign(
  {
    preferences: {
      pairs: [
        {
          key: '',
          value: '',
          uniqueId: uuidV4(),
        },
      ],
    },
  },
  skippableDefaultState
);

const defaultEditableFieldsState = Object.assign(
  {
    fields: Object.keys({
      ...defaultGeneralState,
      ...defaultResourcesState,
      ...defaultHadoopMappingState,
      ...defaultSecurityState,
      ...defaultPreferencesState,
    }),
  },
  skippableDefaultState
);

const defaultAction = {
  type: '',
  payload: {},
  uniqueId: uuidV4(),
};

const defaultInitialState = {
  general: defaultGeneralState,
  resources: defaultResourcesState,
  hadoopMapping: defaultHadoopMappingState,
  security: defaultSecurityState,
  preferences: defaultPreferencesState,
  editableFields: defaultEditableFieldsState,
};

// Utilities. FIXME: Move to a common place?
const isNil = (value) => value === null || typeof value === 'undefined' || value === '';
const isComplete = (state, requiredFields) => {
  let emptyFieldsInState = Object.keys(state).filter((fieldName) => {
    return isNil(state[fieldName]) && requiredFields.indexOf(fieldName) !== -1;
  });
  return !emptyFieldsInState.length ? true : false;
};

const generalStepRequiredFields = ['name'];
// this was a circular dependency before - leaving it to help with debugging later if needed
// import AddNamespaceWizardConfig from 'services/WizardConfigs/AddNamespaceWizardConfig';
// import head from 'lodash/head';
// head(
//   AddNamespaceWizardConfig.steps.filter((step) => step.id === 'general')
// ).requiredFields;

const onErrorHandler = (reducerId, stateCopy, action) => {
  stateCopy = Object.assign({}, stateCopy);
  if (action.payload.id === reducerId) {
    stateCopy.__error = action.payload.error;
  }
  return stateCopy;
};
const onSuccessHandler = (reducerId, stateCopy, action) => {
  stateCopy = Object.assign({}, stateCopy, action);
  if (action.payload.id === 'general') {
    stateCopy.__complete = action.payload.res;
  }
  return stateCopy;
};

const general = (state = defaultGeneralState, action = defaultAction) => {
  let stateCopy;
  switch (action.type) {
    case AddNamespaceActions.setName:
      stateCopy = Object.assign({}, state, {
        name: action.payload.name,
      });
      break;
    case AddNamespaceActions.setDescription:
      stateCopy = Object.assign({}, state, {
        description: action.payload.description,
      });
      break;
    case AddNamespaceActions.setSchedulerQueue:
      stateCopy = Object.assign({}, state, {
        schedulerQueue: action.payload.schedulerQueue,
      });
      break;
    case AddNamespaceActions.setProperties:
      stateCopy = {
        ...state,
        name: action.payload.name,
        description: action.payload.description,
      };
      break;
    case AddNamespaceActions.onError:
      return onErrorHandler('general', Object.assign({}, state), action);
    case AddNamespaceActions.onSuccess:
      return onSuccessHandler('general', Object.assign({}, state), action);
    case AddNamespaceActions.onReset:
      return defaultGeneralState;
    default:
      return state;
  }
  return Object.assign({}, stateCopy, {
    __complete: isComplete(stateCopy, generalStepRequiredFields),
    __error: action.payload.error || false,
  });
};

const resources = (state = defaultResourcesState, action = defaultAction) => {
  let stateCopy;
  switch (action.type) {
    case AddNamespaceActions.setK8sNamespace:
      stateCopy = Object.assign({}, state, {
        k8sNamespace: action.payload.k8sNamespace,
      });
      break;
    case AddNamespaceActions.setK8sNamespaceCpuLimit:
      stateCopy = Object.assign({}, state, {
        k8sNamespaceCpuLimit: action.payload.k8sNamespaceCpuLimit,
      });
      break;
    case AddNamespaceActions.setK8sNamespaceMemoryLimit:
      stateCopy = Object.assign({}, state, {
        k8sNamespaceMemoryLimit: action.payload.k8sNamespaceMemoryLimit,
      });
      break;
    case AddNamespaceActions.setServiceAccountEmail:
      stateCopy = Object.assign({}, state, {
        serviceAccountEmail: action.payload.serviceAccountEmail,
      });
      break;
    case AddNamespaceActions.setProperties:
      stateCopy = {
        ...state,
        k8sNamespace: action.payload.k8sNamespace,
        k8sNamespaceCpuLimit: action.payload.k8sNamespaceCpuLimit,
        k8sNamespaceMemoryLimit: action.payload.k8sNamespaceMemoryLimit,
        serviceAccountEmail: action.payload.serviceAccountEmail,
      };
      break;
    case AddNamespaceActions.onError:
      return onErrorHandler('resources', Object.assign({}, state), action);
    case AddNamespaceActions.onSuccess:
      return onSuccessHandler('resources', Object.assign({}, state), action);
    case AddNamespaceActions.onReset:
      return defaultResourcesState;
    default:
      return state;
  }
  return Object.assign({}, stateCopy, {
    __skipped: false,
    __error: action.payload.error || false,
  });
};

const hadoopMapping = (state = defaultHadoopMappingState, action = defaultAction) => {
  let stateCopy;
  switch (action.type) {
    case AddNamespaceActions.setHDFSDirectory:
      stateCopy = Object.assign({}, state, {
        hdfsDirectory: action.payload.hdfsDirectory,
      });
      break;
    case AddNamespaceActions.setHiveDatabaseName:
      stateCopy = Object.assign({}, state, {
        hiveDatabaseName: action.payload.hiveDatabaseName,
      });
      break;
    case AddNamespaceActions.setHBaseNamespace:
      stateCopy = Object.assign({}, state, {
        hbaseNamespace: action.payload.hbaseNamespace,
      });
      break;
    case AddNamespaceActions.setSchedulerQueueName:
      stateCopy = Object.assign({}, state, {
        schedulerQueueName: action.payload.schedulerQueueName,
      });
      break;
    case AddNamespaceActions.setProperties:
      stateCopy = {
        ...state,
        hdfsDirectory: action.payload.hdfsRootDirectory,
        hiveDatabaseName: action.payload.hiveDatabaseName,
        hbaseNamespace: action.payload.hbaseNamespaceName,
        schedulerQueueName: action.payload.schedulerQueueName,
      };
      break;
    case AddNamespaceActions.onError:
      return onErrorHandler('hadoopMapping', Object.assign({}, state), action);
    case AddNamespaceActions.onSuccess:
      return onSuccessHandler('hadoopMapping', Object.assign({}, state), action);
    case AddNamespaceActions.onReset:
      return defaultHadoopMappingState;
    default:
      return state;
  }
  return Object.assign({}, stateCopy, {
    __skipped: false,
    __error: action.payload.error || false,
  });
};

const security = (state = defaultSecurityState, action = defaultAction) => {
  let stateCopy;
  switch (action.type) {
    case AddNamespaceActions.setPrincipal:
      stateCopy = Object.assign({}, state, {
        principal: action.payload.principal,
      });
      break;
    case AddNamespaceActions.setKeytab:
      stateCopy = Object.assign({}, state, {
        keyTab: action.payload.keyTab,
      });
      break;
    case AddNamespaceActions.setProperties:
      stateCopy = {
        ...state,
        principal: action.payload.principal,
        keyTab: action.payload.keytabURI,
      };
      break;
    case AddNamespaceActions.onError:
      return onErrorHandler('security', Object.assign({}, state), action);
    case AddNamespaceActions.onSuccess:
      return onSuccessHandler('security', Object.assign({}, state), action);
    case AddNamespaceActions.onReset:
      return defaultSecurityState;
    default:
      return state;
  }
  return Object.assign({}, stateCopy, {
    __skipped: false,
    __error: action.payload.error || false,
  });
};

const preferences = (state = defaultPreferencesState, action = defaultAction) => {
  let stateCopy;
  switch (action.type) {
    case AddNamespaceActions.setPreferences:
      stateCopy = Object.assign({}, state, {
        preferences: action.payload.keyValues,
      });
      break;
    case AddNamespaceActions.setProperties:
      stateCopy = {
        ...state,
        preferences: convertMapToKeyValuePairsObj(action.payload.namespacePrefs),
      };
      break;
    case AddNamespaceActions.onReset:
      return defaultPreferencesState;
    default:
      return state;
  }
  return Object.assign({}, stateCopy, {
    __skipped: false,
    __error: action.payload.error || false,
  });
};

const editableFields = (state = defaultEditableFieldsState, action = defaultAction) => {
  switch (action.type) {
    case AddNamespaceActions.setEditableFields:
      return {
        ...state,
        fields: action.payload.editableFields,
      };
    case AddNamespaceActions.onReset:
      return defaultEditableFieldsState;
    default:
      return state;
  }
};

const composeEnhancers =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        name: 'AddNamespaceStore',
      })
    : compose;

// Store
const createAddNamespaceStore = () => {
  return createStore(
    combineReducers({
      general,
      resources,
      hadoopMapping,
      security,
      preferences,
      editableFields,
    }),
    defaultInitialState,
    composeEnhancers()
  );
};

const addNamespaceStore = createAddNamespaceStore();
export default addNamespaceStore;
export { createAddNamespaceStore };
