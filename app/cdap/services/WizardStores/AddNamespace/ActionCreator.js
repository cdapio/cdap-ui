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
import AddNamespaceStore from 'services/WizardStores/AddNamespace/AddNamespaceStore';
import { MyNamespaceApi } from 'api/namespace';

const K8S_NS_MEMORY_LIMIT_UNIT = 'Gi';

const createNamespace = () => {
  return createOrEditNamespace(MyNamespaceApi.create);
};

const editNamespaceProperties = () => {
  return createOrEditNamespace(MyNamespaceApi.editProperties);
};

const createOrEditNamespace = (api) => {
  let state = AddNamespaceStore.getState();
  let urlParams = {
    namespace: state.general.name,
  };

  let putParams = {
    config: {},
  };

  if (state.general.description) {
    putParams['description'] = state.general.description;
  }

  if (state.hadoopMapping.hbaseNamespace) {
    putParams['config']['hbase.namespace'] = state.hadoopMapping.hbaseNamespace;
  }

  if (state.hadoopMapping.hiveDatabaseName) {
    putParams['config']['hive.database'] = state.hadoopMapping.hiveDatabaseName;
  }

  if (state.hadoopMapping.hdfsDirectory) {
    putParams['config']['root.directory'] = state.hadoopMapping.hdfsDirectory;
  }

  if (state.hadoopMapping.schedulerQueueName) {
    putParams['config']['scheduler.queue.name'] = state.hadoopMapping.schedulerQueueName;
  }

  if (state.security.keyTab) {
    putParams['config']['keytabURI'] = state.security.keyTab;
  }

  if (state.security.principal) {
    putParams['config']['principal'] = state.security.principal;
  }

  if (state.resources.k8sNamespace) {
    putParams['config']['k8s.namespace'] = state.resources.k8sNamespace;
  }

  if (state.resources.k8sNamespaceCpuLimit) {
    putParams['config']['k8s.namespace.cpu.limits'] = state.resources.k8sNamespaceCpuLimit;
  }

  if (state.resources.k8sNamespaceMemoryLimit) {
    putParams['config']['k8s.namespace.memory.limits'] = `${state.resources.k8sNamespaceMemoryLimit}${K8S_NS_MEMORY_LIMIT_UNIT}`;
  }

  if (state.resources.serviceAccountEmail) {
    putParams['config']['workload.identity.gcp.service.account.email'] = state.resources.serviceAccountEmail;
  }

  return api(urlParams, putParams);
};

const setNamespacePreferences = () => {
  let state = AddNamespaceStore.getState();
  let urlParams = {
    namespace: state.general.name,
  };
  let preferences = {};

  if (state.preferences.preferences && state.preferences.preferences.pairs.length > 0) {
    state.preferences.preferences.pairs.forEach((pair) => {
      if (pair.key.length && pair.value.length) {
        preferences[pair.key] = pair.value;
      }
    });

    return MyNamespaceApi.setPreferences(urlParams, preferences);
  }
};

export { createNamespace, editNamespaceProperties, setNamespacePreferences };
