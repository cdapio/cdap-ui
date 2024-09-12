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

import _get from 'lodash/get';
import _cloneDeep from 'lodash/cloneDeep';
import _isEqual from 'lodash/isEqual';
import _assign from 'lodash/assign';
import { IConfigState } from './reducer';
import { IArtifactSummary } from 'components/StudioV2/types';
import { GLOBALS, HYDRATOR_DEFAULT_VALUES } from 'services/global-constants';
import { DEPRECATED_SPARK_MASTER, ENGINE_OPTIONS, SPARK_BACKPRESSURE_ENABLED, SPARK_EXECUTOR_INSTANCES } from 'components/PipelineConfigurations/PipelineConfigConstants';
import { getAppType, getEngine } from './queries';
import { generateNodeConfig } from 'services/HydratorPluginConfigFactory';
import { formatSchemaToAvro } from 'components/StudioV2/utils/schemaUtils';
import { fetchBackendProperties } from 'components/StudioV2/utils/nodeUtils';

export function setComments_mutating(state: IConfigState, comments) {
  state.config.comments = comments;
}

export function setArtifact_mutating(state: IConfigState, artifact: IArtifactSummary) {
  state.artifact.name = artifact.name;
  state.artifact.version = artifact.version;
  state.artifact.scope = artifact.scope;

  if (GLOBALS.etlBatchPipelines.includes(artifact.name) || artifact.name === GLOBALS.eltSqlPipeline) {
    state.config.schedule = state.config.schedule || HYDRATOR_DEFAULT_VALUES.schedule;
  } else if (artifact.name === GLOBALS.etlRealtime) {
    state.config.instances = state.config.instances || HYDRATOR_DEFAULT_VALUES.instance;
  }
}

export function setProperties_mutating(state: IConfigState, properties?: any) {
  const numExecutorKey = SPARK_EXECUTOR_INSTANCES;
  const numExecutorOldKey = DEPRECATED_SPARK_MASTER;
  const backPressureKey = SPARK_BACKPRESSURE_ENABLED;

  if (typeof properties !== 'undefined' && Object.keys(properties).length > 0) {
      state.config.properties = properties;
  } else {
      state.config.properties = {};
  }

  if (state.artifact.name === GLOBALS.etlDataStreams) {
    if (typeof state.config.properties[backPressureKey] === 'undefined') {
      state.config.properties[backPressureKey] = true;
    }
  }
    
  if (getEngine(state) === ENGINE_OPTIONS.SPARK 
    ||state.artifact.name === GLOBALS.etlDataStreams
  ) {
    if (state.config.properties.hasOwnProperty(numExecutorOldKey)) {
      // format on standalone is 'local[{number}] === local[2]'
      // So the magic number 6 here is for skipping 'local[' and get the number
      let numOfExecutors = state.config.properties[numExecutorOldKey];
      numOfExecutors = typeof numOfExecutors === 'string' ? 
        numOfExecutors.substring(6, numOfExecutors.length - 1) 
        : numOfExecutors.toString();
      state.config.properties[numExecutorKey] = numOfExecutors;
      delete this.state.config.properties[numExecutorOldKey];
    }
  }
    
  state.config.properties = Object.keys(state.config.properties).reduce((obj, key) => 
    (obj[key] = state.config.properties[key].toString(), obj),
    {}
  );
}

export function setDriverResources_mutating(state: IConfigState, driverResources) {
  state.config.driverResources = driverResources || _cloneDeep(HYDRATOR_DEFAULT_VALUES.resources);
}

export function setResources_mutating(state: IConfigState, resources) {
  state.config.resources = resources || _cloneDeep(HYDRATOR_DEFAULT_VALUES.resources);
}

export function setInstrumentation_mutating(state: IConfigState, val: boolean = true) {
  state.config.processTimingEnabled = val;
}

export function setStageLogging_mutating(state: IConfigState, val: boolean = true) {
  state.config.stageLoggingEnabled = val;
}

export function setNodes_mutating(state: IConfigState, nodes = []) {
  state.__ui__.nodes = nodes;
  const listOfPromises = [];
  const parseNodeConfig = (node, res) => {
    let nodeConfig = generateNodeConfig(node._backendProperties, res);
    node.implicitSchema = nodeConfig.outputSchema.implicitSchema;
    node.outputSchemaProperty = nodeConfig.outputSchema.outputSchemaProperty;

    if (Array.isArray(node.outputSchemaProperty)) {
      node.outputSchemaProperty = node.outputSchemaProperty[0];
      node.watchProperty = nodeConfig.outputSchema.schemaProperties['property-watch'];
    }

    if (node.outputSchemaProperty) {
      node.outputSchema = node.plugin.properties[node.outputSchemaProperty];
    }

    if (nodeConfig.outputSchema.implicitSchema) {
      const outputSchema = formatSchemaToAvro(nodeConfig.outputSchema.implicitSchema);
      node.outputSchema = outputSchema;
    }

    if (!node.outputSchema && nodeConfig.outputSchema.schemaProperties['default-schema']) {
      node.outputSchema = JSON.stringify(nodeConfig.outputSchema.schemaProperties['default-schema']);
      node.plugin.properties[node.outputSchemaProperty] = node.outputSchema;
    }

    node.configGroups = res['configuration-groups'];
    node.outputs = res['outputs'];
    node.filters = res['filters'];
  };

  if (state.__ui__.nodes && state.__ui__.nodes.length) {
    state.__ui__.nodes.filter(n => !n._backendProperties).forEach( n => {
      listOfPromises.push(fetchBackendProperties(n, getAppType(state)));
    });
  } else {
    listOfPromises.push(Promise.resolve(true));
  }

  if (listOfPromises.length) {
    Promise.all(listOfPromises).then(() => {
      if (!validateState(state)) {
        emitChange();
      }

          // Once the backend properties are fetched for all nodes, fetch their config jsons.
          // This will be used for schema propagation where we import/use a predefined app/open a published pipeline
          // the user should directly click on the last node and see what is the incoming schema
          // without having to open the subsequent nodes.
          const reqBody = [];
          this.state.__ui__.nodes.forEach( n => {
            // This could happen when the user doesn't provide an artifact information for a plugin & deploys it
            // using CLI or REST and opens up in UI and clones it. Without this check it will throw a JS error.
            if (!n.plugin || !n.plugin.artifact) { return; }
            const pluginInfo = {
              name: n.plugin.artifact.name,
              version: n.plugin.artifact.version,
              scope: n.plugin.artifact.scope,
              properties: [
                `widgets.${n.plugin.name}-${n.type}`,
              ],
            };

            reqBody.push(pluginInfo);
          });

          this.myPipelineApi.fetchAllPluginsProperties({ namespace: this.$stateParams.namespace }, reqBody)
            .$promise
            .then((resInfo) => {
              resInfo.forEach((pluginInfo, index) => {
                const pluginProperties = Object.keys(pluginInfo.properties);
                if (pluginProperties.length === 0) { return; }

                try {
                  const config = JSON.parse(pluginInfo.properties[pluginProperties[0]]);
                  parseNodeConfig(this.state.__ui__.nodes[index], config);
                } catch (e) {
                  // no-op
                }
              });
              this.validateState();
            });
        },
        (err) => {
          console.log('ERROR fetching backend properties for nodes', err);
          this.validateState();
        }
      );
  }
}

