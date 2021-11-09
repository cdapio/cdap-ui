/*
 * Copyright © 2015-2018 Cask Data, Inc.
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

class HydratorPlusPlusConfigStore {
  constructor(HydratorPlusPlusConfigDispatcher, HydratorPlusPlusCanvasFactory, GLOBALS, mySettings, HydratorPlusPlusConsoleActions, $stateParams, NonStorePipelineErrorFactory, HydratorPlusPlusHydratorService, $q, HydratorPlusPlusPluginConfigFactory, uuid, $state, HYDRATOR_DEFAULT_VALUES, myHelpers, MY_CONFIG, EventPipe, myPipelineApi, myAppsApi, HydratorPlusPlusNodeService) {
    'ngInject';
    this.state = {};
    this.mySettings = mySettings;
    this.myHelpers = myHelpers;
    this.HydratorPlusPlusConsoleActions = HydratorPlusPlusConsoleActions;
    this.HydratorPlusPlusCanvasFactory = HydratorPlusPlusCanvasFactory;
    this.GLOBALS = GLOBALS;
    this.$stateParams = $stateParams;
    this.NonStorePipelineErrorFactory = NonStorePipelineErrorFactory;
    this.HydratorPlusPlusHydratorService = HydratorPlusPlusHydratorService;
    this.HydratorPlusPlusNodeService = HydratorPlusPlusNodeService;
    this.$q = $q;
    this.HydratorPlusPlusPluginConfigFactory = HydratorPlusPlusPluginConfigFactory;
    this.uuid = uuid;
    this.$state = $state;
    this.HYDRATOR_DEFAULT_VALUES = HYDRATOR_DEFAULT_VALUES;
    this.EventPipe = EventPipe;
    this.myPipelineApi = myPipelineApi;
    this.myAppsApi = myAppsApi;
    this.isDistributed = MY_CONFIG.isEnterprise ? true : false;

    this.changeListeners = [];
    this.setDefaults();
    this.hydratorPlusPlusConfigDispatcher = HydratorPlusPlusConfigDispatcher.getDispatcher();
    this.hydratorPlusPlusConfigDispatcher.register('onEngineChange', this.setEngine.bind(this));
    this.hydratorPlusPlusConfigDispatcher.register('onMetadataInfoSave', this.setMetadataInformation.bind(this));
    this.hydratorPlusPlusConfigDispatcher.register('onPluginEdit', this.editNodeProperties.bind(this));
    this.hydratorPlusPlusConfigDispatcher.register('onSetSchedule', this.setSchedule.bind(this));
    this.hydratorPlusPlusConfigDispatcher.register('onSetInstance', this.setInstance.bind(this));
    this.hydratorPlusPlusConfigDispatcher.register('onSetBatchInterval', this.setBatchInterval.bind(this));
    this.hydratorPlusPlusConfigDispatcher.register('onSetVirtualCores', this.setVirtualCores.bind(this));
    this.hydratorPlusPlusConfigDispatcher.register('onSetMemoryMB', this.setMemoryMB.bind(this));
    this.hydratorPlusPlusConfigDispatcher.register('onSetDriverVirtualCores', this.setDriverVirtualCores.bind(this));
    this.hydratorPlusPlusConfigDispatcher.register('onSetDriverMemoryMB', this.setDriverMemoryMB.bind(this));
    this.hydratorPlusPlusConfigDispatcher.register('onSetClientVirtualCores', this.setClientVirtualCores.bind(this));
    this.hydratorPlusPlusConfigDispatcher.register('onSetClientMemoryMB', this.setClientMemoryMB.bind(this));
    this.hydratorPlusPlusConfigDispatcher.register('onSaveAsDraft', this.saveAsDraft.bind(this));
    this.hydratorPlusPlusConfigDispatcher.register('onInitialize', this.init.bind(this));
    this.hydratorPlusPlusConfigDispatcher.register('onSchemaPropagationDownStream', this.propagateIOSchemas.bind(this));
    this.hydratorPlusPlusConfigDispatcher.register('onAddPostAction', this.addPostAction.bind(this));
    this.hydratorPlusPlusConfigDispatcher.register('onEditPostAction', this.editPostAction.bind(this));
    this.hydratorPlusPlusConfigDispatcher.register('onDeletePostAction', this.deletePostAction.bind(this));
    this.hydratorPlusPlusConfigDispatcher.register('onSetMaxConcurrentRuns', this.setMaxConcurrentRuns.bind(this));
    this.hydratorPlusPlusConfigDispatcher.register('onPublishPipeline', this.publishPipeline.bind(this));
  }
  registerOnChangeListener(callback) {
    // index of the listener to be removed while un-subscribing
    let index = this.changeListeners.push(callback) - 1;
    // un-subscribe for listeners.
    return () => {
      this.changeListeners.splice(index, 1);
    };
  }
  emitChange() {
    this.changeListeners.forEach( callback => callback() );
  }
  setDefaults(config) {
    this.state = {
      artifact: {
        name: '',
        scope: 'SYSTEM',
        version: ''
      },
      __ui__: {
        nodes: [],
      },
      description: '',
      name: '',
    };
    Object.assign(this.state, { config: this.getDefaultConfig() });

    // This will be eventually used when we just pass on a config to the store to draw the dag.
    if (config) {
      angular.extend(this.state, config);
      this.setComments(this.state.config.comments);
      this.setArtifact(this.state.artifact);
      this.setProperties(this.state.config.properties);
      this.setDriverResources(this.state.config.driverResources);
      this.setResources(this.state.config.resources);
      this.setInstrumentation(this.state.config.processTimingEnabled);
      this.setStageLogging(this.state.config.stageLoggingEnabled);
      this.setNodes(this.state.config.stages || []);
      if (this.state.artifact.name === this.GLOBALS.etlDataStreams) {
        this.setClientResources(this.state.config.clientResources);
        this.setCheckpointing(this.state.config.disableCheckpoints);
        this.setCheckpointDir(this.state.config.checkpointDir || window.CDAP_CONFIG.hydrator.defaultCheckpointDir);
        this.setGracefulStop(this.state.config.stopGracefully);
        this.setBatchInterval(this.state.config.batchInterval);
      } else if (this.state.artifact.name === this.GLOBALS.eltSqlPipeline) {
        this.setServiceAccountPath(this.state.config.serviceAccountPath || '');
      } else {
        this.setEngine(this.state.config.engine);
        this.setNumRecordsPreview(this.state.config.numOfRecordsPreview);
        this.setMaxConcurrentRuns(this.state.config.maxConcurrentRuns);
      }
    }
    this.__defaultState = angular.copy(this.state);
  }
  getDefaults() {
    return this.__defaultState;
  }
  init(config) {
    this.setDefaults(config);
  }
  getDefaultConfig() {
    return {
      resources: angular.copy(this.HYDRATOR_DEFAULT_VALUES.resources),
      driverResources: angular.copy(this.HYDRATOR_DEFAULT_VALUES.resources),
      connections: [],
      comments: [],
      postActions: [],
      properties: {},
      processTimingEnabled: true,
      stageLoggingEnabled: this.HYDRATOR_DEFAULT_VALUES.stageLoggingEnabled,
    };
  }

  setState(state) {
    this.state = state;
  }
  getState() {
    return angular.copy(this.state);
  }
  getDraftId() {
    return this.$stateParams.draftId;
  }
  getArtifact() {
    return this.getState().artifact;
  }
  getAppType() {
    return this.getState().artifact.name;
  }
  getConnections() {
    return this.getConfig().connections;
  }
  getConfig() {
    return this.getState().config;
  }
  generateConfigFromState() {
    var config = this.getDefaultConfig();
    var nodesMap = {};
    this.state.__ui__.nodes.forEach(function(n) {
      nodesMap[n.name] = angular.copy(n);
    });
    // Strip out schema property of the plugin if format is clf or syslog
    let stripFormatSchemas = (formatProp, outputSchemaProp, properties) => {
      if (!formatProp || !outputSchemaProp) {
        return properties;
      }
      if (['clf', 'syslog'].indexOf(properties[formatProp]) !== -1) {
        delete properties[outputSchemaProp];
      }
      return properties;
    };

    let addPluginToConfig = (node, id) => {
      const sanitize =  window.CaskCommon.CDAPHelpers.santizeStringForHTMLID;
      if (node.outputSchemaProperty) {
        try {
          let outputSchema = JSON.parse(node.outputSchema);
          if (angular.isArray(outputSchema.fields)) {
            outputSchema.fields = outputSchema.fields.filter( field => !field.readonly);
          }
          node.plugin.properties[node.outputSchemaProperty] = JSON.stringify(outputSchema);
        } catch (e) {
          console.log('Failed to parse output schema of plugin: ', node.plugin);
        }
      }
      node.plugin.properties = stripFormatSchemas(node.watchProperty, node.outputSchemaProperty, angular.copy(node.plugin.properties));

      let configObj = {
        name: node.plugin.label || node.name || node.plugin.name,
        plugin: {
          // Solely adding id and _backendProperties for validation.
          // Should be removed while saving it to backend.
          name: node.plugin.name,
          type: node.type || node.plugin.type,
          label: node.plugin.label,
          artifact: node.plugin.artifact,
          properties: node.plugin.properties ,
          _backendProperties: node._backendProperties,
        },
        information: node.information,
        outputSchema: node.outputSchema,
        inputSchema: node.inputSchema
      };

      configObj.id = sanitize(configObj.name);
      if (node.errorDatasetName) {
        configObj.errorDatasetName = node.errorDatasetName;
      }

      config.stages.push(configObj);
      delete nodesMap[id];
    };

    var connections = this.HydratorPlusPlusCanvasFactory.orderConnections(
      angular.copy(this.state.config.connections),
      this.state.artifact.name,
      this.state.__ui__.nodes
    );
    config.stages = [];

    connections.forEach( connection => {
      let fromConnectionName, toConnectionName;
      let fromPluginName, toPluginName;

      if (nodesMap[connection.from]) {
        fromPluginName = nodesMap[connection.from].plugin.label || nodesMap[connection.from].name;
        fromConnectionName = fromPluginName;
        addPluginToConfig(nodesMap[connection.from], connection.from);
      } else {
        fromConnectionName = this.state.__ui__.nodes.filter( n => n.name === connection.from)[0];
        fromPluginName = fromConnectionName.plugin.label || fromConnectionName.name;
        fromConnectionName = fromPluginName;
      }
      if (nodesMap[connection.to]) {
        toConnectionName = nodesMap[connection.to].plugin.label || nodesMap[connection.to].name;
        addPluginToConfig(nodesMap[connection.to], connection.to);
      } else {
        toConnectionName = this.state.__ui__.nodes.filter( n => n.name === connection.to)[0];
        toPluginName = toConnectionName.plugin.label || toConnectionName.name;
        toConnectionName = toPluginName;
      }
      connection.from = fromConnectionName;
      connection.to = toConnectionName;
    });
    config.connections = connections;

    // Adding leftover nodes
    if (Object.keys(nodesMap).length !== 0) {
      angular.forEach(nodesMap, (node, id) => {
        addPluginToConfig(node, id);
      });
    }

    let appType = this.getAppType();
    // Resources
    config.resources = {
      memoryMB: this.getMemoryMB(),
      virtualCores: this.getVirtualCores()
    };
    config.driverResources = {
      memoryMB: this.getDriverMemoryMB(),
      virtualCores: this.getDriverVirtualCores()
    };

    if (this.GLOBALS.etlBatchPipelines.includes(appType)) {
      config.schedule = this.getSchedule();
      config.engine = this.getEngine();
      config.properties = this.getProperties();
      config.stageLoggingEnabled = this.getStageLogging();
      config.processTimingEnabled = this.getInstrumentation();
      config.numOfRecordsPreview = this.getNumRecordsPreview();
    } else if (appType === this.GLOBALS.etlRealtime) {
      config.instances = this.getInstance();
    } else if (appType === this.GLOBALS.etlDataStreams) {
      config.batchInterval = this.getBatchInterval();
      config.clientResources = {
        memoryMB: this.getClientMemoryMB(),
        virtualCores: this.getClientVirtualCores()
      };
      config.properties = this.getProperties();
      config.stageLoggingEnabled = this.getStageLogging();
      config.processTimingEnabled = this.getInstrumentation();
      config.disableCheckpoints = this.getCheckpointing();
      if (!config.disableCheckpoints) {
        config.checkpointDir = this.getCheckpointDir();
      }
      config.stopGracefully = this.getGracefulStop();
    } else if (appType === this.GLOBALS.eltSqlPipeline) {
      config.schedule = this.getSchedule();
      config.serviceAccountPath = this.getServiceAccountPath();
      config.clientResources = {
        memoryMB: this.getClientMemoryMB(),
        virtualCores: this.getClientVirtualCores()
      };
    }

    config.comments = this.getComments();

    if (this.state.description) {
      config.description = this.state.description;
    }
    // Removing UUID from postactions name
    let postActions = this.getPostActions();
    postActions = _.sortBy(postActions, (action) => {
      return action.plugin.name;
    });

    let currCount = 0;
    let currAction = '';

    angular.forEach(postActions, (action) => {
      if (action.plugin.name !== currAction) {
        currAction = action.plugin.name;
        currCount = 1;
      } else {
        currCount++;
      }
      action.name = action.plugin.name + '-' + currCount;
    });

    config.postActions = postActions;
    config.maxConcurrentRuns = this.getMaxConcurrentRuns();

    return config;
  }
  getConfigForExport(configOptions = {}) {
    var state = this.getState();
    // Stripping of uuids and generating configs is what is going on here.
    var config = angular.copy(this.generateConfigFromState());
    if (typeof configOptions.shouldPruneProperties === 'undefined') {
      configOptions.shouldPruneProperties = true;
    }
    if (configOptions.shouldPruneProperties) {
      /**
       * If the pipeline is saved as draft we don't want to prune properties
       * The empty properties are needed to understand the defaults the user wants
       * to override when publishing the pipeline.
       */
      this.HydratorPlusPlusCanvasFactory.pruneProperties(config);
    }
    state.config = angular.copy(config);

    var nodes = angular.copy(this.getNodes()).map( node => {
      node.name = node.plugin.label;
      return node;
    });
    state.__ui__.nodes = nodes;

    return angular.copy(state);
  }
  getCloneConfig() {
    return this.getConfigForExport();
  }
  getDisplayConfig() {
    let uniqueNodeNames = {};
    this.HydratorPlusPlusConsoleActions.resetMessages();
    this.NonStorePipelineErrorFactory.isUniqueNodeNames(this.getNodes(), (err, node) => {
      if (err) {
        uniqueNodeNames[node.plugin.label] = err;
      }
    });

    if (Object.keys(uniqueNodeNames).length > 0) {
      return false;
    }
    var stateCopy = this.getConfigForExport();
    angular.forEach(stateCopy.config.stages, (node) => {
      if (node.plugin) {
        delete node.outputSchema;
        delete node.inputSchema;
      }
    });
    delete stateCopy.__ui__;

    return stateCopy;
  }
  getDescription() {
    return this.getState().description;
  }
  getName() {
    return this.getState().name;
  }
  getIsStateDirty() {
    let defaults = this.getDefaults();
    let state = this.getState();
    return !angular.equals(defaults, state);
  }
  setName(name) {
    this.state.name = name;
    this.emitChange();
  }
  setDescription(description) {
    this.state.description = description;
    this.emitChange();
  }
  setMetadataInformation(name, description) {
    this.state.name = name;
    this.state.description = description;
    this.emitChange();
  }
  setConfig(config, type) {
    switch (type) {
      case 'source':
        this.state.config.source = config;
        break;
      case 'sink':
        this.state.config.sinks.push(config);
        break;
      case 'transform':
        this.state.config.transforms.push(config);
        break;
    }
    this.emitChange();
  }
  setEngine(engine) {
    this.state.config.engine = engine || this.HYDRATOR_DEFAULT_VALUES.engine;
  }
  getEngine() {
    return this.state.config.engine || this.HYDRATOR_DEFAULT_VALUES.engine;
  }
  getProperties() {
    return this.getConfig().properties;
  }
  setProperties(properties) {
    const numExecutorKey = window.CaskCommon.PipelineConfigConstants.SPARK_EXECUTOR_INSTANCES;
    const numExecutorOldKey = window.CaskCommon.PipelineConfigConstants.DEPRECATED_SPARK_MASTER;
    const backPressureKey = window.CaskCommon.PipelineConfigConstants.SPARK_BACKPRESSURE_ENABLED;
    if (typeof properties !== 'undefined' && Object.keys(properties).length > 0) {
      this.state.config.properties = properties;
    } else {
      this.state.config.properties = {};
    }
    if (this.state.artifact.name === this.GLOBALS.etlDataStreams) {
      if (typeof this.state.config.properties[backPressureKey] === 'undefined') {
        this.state.config.properties[backPressureKey] = true;
      }
    }
    if (
      this.getEngine() === window.CaskCommon.PipelineConfigConstants.ENGINE_OPTIONS.SPARK ||
      this.state.artifact.name === this.GLOBALS.etlDataStreams
    ) {
      if (this.state.config.properties.hasOwnProperty(numExecutorOldKey)) {
        // format on standalone is 'local[{number}] === local[2]'
        // So the magic number 6 here is for skipping 'local[' and get the number
        let numOfExecutors = this.state.config.properties[numExecutorOldKey];
        numOfExecutors = typeof numOfExecutors === 'string' ? numOfExecutors.substring(6, numOfExecutors.length - 1) : numOfExecutors.toString();
        this.state.config.properties[numExecutorKey] = numOfExecutors;
        delete this.state.config.properties[numExecutorOldKey];
      }
    }
    this.state.config.properties = Object.keys(this.state.config.properties)
      .reduce(
        (obj, key) => (obj[key] = this.state.config.properties[key].toString(), obj),
        {}
      );
  }
  getCustomConfig() {
    let customConfig = {};
    // We hide these two properties from showing up in key value pairs in realtime pipeline
    // In batch if the engine is spark we should not hide these properties. We should show
    // the custom properties
    let backendProperties = [window.CaskCommon.PipelineConfigConstants.SPARK_EXECUTOR_INSTANCES, window.CaskCommon.PipelineConfigConstants.SPARK_BACKPRESSURE_ENABLED];
    if (this.state.artifact.name !== this.GLOBALS.etlDataStreams) {
      backendProperties = [];
    }
    for (let key in this.state.config.properties) {
      if (this.state.config.properties.hasOwnProperty(key) && backendProperties.indexOf(key) === -1) {
        customConfig[key] = this.state.config.properties[key];
      }
    }

    return customConfig;
  }

  getCustomConfigForDisplay() {
    let currentCustomConfig = this.getCustomConfig();
    let customConfigForDisplay = {};
    for (let key in currentCustomConfig) {
      if (currentCustomConfig.hasOwnProperty(key)) {
        let newKey = key;
        if (key.startsWith('system.mapreduce.')) {
          newKey = newKey.slice(17);
        } else if (key.startsWith('system.spark.')) {
          newKey = newKey.slice(13);
        }
        customConfigForDisplay[newKey] = currentCustomConfig[key];
      }
    }
    return customConfigForDisplay;
  }

  setCustomConfig(customConfig) {
    // have to do this because oldCustomConfig is already part of this.state.config.properties
    let oldCustomConfig = this.getCustomConfig();
    for (let oldKey in oldCustomConfig) {
      if (oldCustomConfig.hasOwnProperty(oldKey) && this.state.config.properties.hasOwnProperty(oldKey)) {
          delete this.state.config.properties[oldKey];
      }
    }
    let newCustomConfig = {};
    for (let configKey in customConfig) {
      if (customConfig.hasOwnProperty(configKey)) {
        let newKey = configKey;
        if (this.GLOBALS.etlBatchPipelines.includes(this.state.artifact.name) && this.getEngine() === 'mapreduce') {
          newKey = 'system.mapreduce.' + configKey;
        } else {
          newKey = 'system.spark.' + configKey;
        }
        newCustomConfig[newKey] = customConfig[configKey];
      }
    }
    angular.extend(this.state.config.properties, newCustomConfig);
  }
  getBackpressure() {
    return this.myHelpers.objectQuery(this.state, 'config', 'properties', 'system.spark.spark.streaming.backpressure.enabled');
  }
  setBackpressure(val) {
    if (this.state.artifact.name === this.GLOBALS.etlDataStreams) {
      this.state.config.properties['system.spark.spark.streaming.backpressure.enabled'] = val;
    }
  }
  getNumExecutors() {
    if (this.myHelpers.objectQuery(this.state, 'config', 'properties', window.CaskCommon.PipelineConfigConstants.SPARK_EXECUTOR_INSTANCES)) {
      return this.state.config.properties[window.CaskCommon.PipelineConfigConstants.SPARK_EXECUTOR_INSTANCES].toString();
    }
    return '1';
  }
  setNumExecutors(num) {
    this.state.config.properties[window.CaskCommon.PipelineConfigConstants.SPARK_EXECUTOR_INSTANCES] = num;
  }
  getInstrumentation() {
    return this.getConfig().processTimingEnabled;
  }
  setInstrumentation(val=true) {
    this.state.config.processTimingEnabled = val;
  }
  getStageLogging() {
    return this.getConfig().stageLoggingEnabled;
  }
  setStageLogging(val=true) {
    this.state.config.stageLoggingEnabled = val;
  }
  getCheckpointing() {
    return this.getConfig().disableCheckpoints;
  }
  setCheckpointing(val=false) {
    this.state.config.disableCheckpoints = val;
  }
  getCheckpointDir() {
    return this.getConfig().checkpointDir;
  }
  setCheckpointDir(val) {
    if (val !== false) {
      this.state.config.checkpointDir = val;
    } else {
      this.state.config.checkpointDir = '';
    }
  }
  getGracefulStop() {
    return this.getConfig().stopGracefully;
  }
  setGracefulStop(val=true) {
    this.state.config.stopGracefully = val;
  }
  getNumRecordsPreview() {
    return this.getConfig().numOfRecordsPreview;
  }
  setNumRecordsPreview(val=100) {
    if (this.GLOBALS.etlBatchPipelines.includes(this.state.artifact.name)) {
      this.state.config.numOfRecordsPreview = val;
    }
  }
  setArtifact(artifact) {
    this.state.artifact.name = artifact.name;
    this.state.artifact.version = artifact.version;
    this.state.artifact.scope = artifact.scope;

    if (this.GLOBALS.etlBatchPipelines.includes(artifact.name)) {
      this.state.config.schedule = this.state.config.schedule || this.HYDRATOR_DEFAULT_VALUES.schedule;
    } else if (artifact.name === this.GLOBALS.etlRealtime) {
      this.state.config.instances = this.state.config.instances || this.HYDRATOR_DEFAULT_VALUES.instance;
    } else if (artifact.name === this.GLOBALS.eltSqlPipeline) {
      this.state.config.schedule = this.state.config.schedule || this.HYDRATOR_DEFAULT_VALUES.schedule;
    }

    this.emitChange();
  }

  setNodes(nodes) {
    this.state.__ui__.nodes = nodes || [];
    let listOfPromises = [];
    let parseNodeConfig = (node, res) => {
      let nodeConfig = this.HydratorPlusPlusPluginConfigFactory.generateNodeConfig(node._backendProperties, res);
      node.implicitSchema = nodeConfig.outputSchema.implicitSchema;
      node.outputSchemaProperty = nodeConfig.outputSchema.outputSchemaProperty;
      if (angular.isArray(node.outputSchemaProperty)) {
        node.outputSchemaProperty = node.outputSchemaProperty[0];
        node.watchProperty = nodeConfig.outputSchema.schemaProperties['property-watch'];
      }
      if (node.outputSchemaProperty) {
        node.outputSchema = node.plugin.properties[node.outputSchemaProperty];
      }
      if (nodeConfig.outputSchema.implicitSchema) {
        let outputSchema = this.HydratorPlusPlusHydratorService.formatSchemaToAvro(nodeConfig.outputSchema.implicitSchema);
        node.outputSchema = outputSchema;
      }
      if (!node.outputSchema && nodeConfig.outputSchema.schemaProperties['default-schema']) {
        node.outputSchema = JSON.stringify(nodeConfig.outputSchema.schemaProperties['default-schema']);
        node.plugin.properties[node.outputSchemaProperty] = node.outputSchema;
      }
    };

    if (this.state.__ui__.nodes && this.state.__ui__.nodes.length) {
      this.state.__ui__.nodes.filter(n => !n._backendProperties).forEach( n => {
        listOfPromises.push(this.HydratorPlusPlusHydratorService.fetchBackendProperties(n, this.getAppType()));
      });
    } else {
      listOfPromises.push(this.$q.when(true));
    }

    if (listOfPromises.length) {
      this.$q.all(listOfPromises)
        .then(
          () => {
            if (!this.validateState()) {
              this.emitChange();
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
              });
          },
          (err) => {
            console.log('ERROR fetching backend properties for nodes', err);
            this.validateState();
          }
        );
    }
  }
  setConnections(connections) {
    this.state.config.connections = connections;
  }
  // This is for the user to forcefully propagate the output schema of a node
  // down the stream to all its connections.
  // Its a simple BFS down the graph to propagate the schema. Right now it doesn't catch cycles.
  // The assumption there are no cycles in the dag we create.
  propagateIOSchemas(pluginId) {
    let adjacencyMap = {},
        nodesMap = {},
        outputSchema,
        schema,
        connections = this.state.config.connections;
    this.state.__ui__.nodes.forEach( node => nodesMap[node.name] = node );

    connections.forEach( conn => {
      if (Array.isArray(adjacencyMap[conn.from])) {
        adjacencyMap[conn.from].push(conn.to);
      } else {
        adjacencyMap[conn.from] = [conn.to];
      }
    });

    let traverseMap = (targetNodes, outputSchema, inputSchema) => {
      if (!targetNodes) {
        return;
      }

      targetNodes.forEach( n => {
        if (!this.HydratorPlusPlusNodeService.shouldPropagateSchemaToNode(nodesMap[n])) {
          return;
        }

        let schemaToPropagate = outputSchema;

        if (nodesMap[n].type === 'errortransform') {
          schemaToPropagate = inputSchema;
        }

        nodesMap[n].outputSchema = schemaToPropagate;
        nodesMap[n].inputSchema = schemaToPropagate;
        if (nodesMap[n].outputSchemaProperty) {
          nodesMap[n].plugin.properties[nodesMap[n].outputSchemaProperty] = schemaToPropagate;
        }
        traverseMap(adjacencyMap[n], schemaToPropagate, schemaToPropagate);
      });
    };

    outputSchema = nodesMap[pluginId].outputSchema;

    let inputSchema = nodesMap[pluginId].inputSchema && Array.isArray(nodesMap[pluginId].inputSchema) && nodesMap[pluginId].inputSchema.length ? nodesMap[pluginId].inputSchema[0].schema : nodesMap[pluginId].inputSchema;

    try {
      // We need this type check because of the way we store schemas right now.
      // After we refactor then there should be a consistent format for all the schemas.
      if (Array.isArray(outputSchema)) {
        schema = JSON.parse(outputSchema[0].schema);
      } else if (typeof outputSchema === 'string') {
        schema = JSON.parse(outputSchema);
      }

      schema.fields = schema.fields.map(field => {
        delete field.readonly;
        return field;
      });

      outputSchema = [this.HydratorPlusPlusNodeService.getOutputSchemaObj(JSON.stringify(schema))];
    } catch (e) {
      console.log('Failed to parse output schema of plugin: ', pluginId);
    }
    traverseMap(adjacencyMap[pluginId], JSON.stringify(schema), inputSchema);
  }
  getNodes() {
    return this.getState().__ui__.nodes;
  }
  getStages() {
    return this.getState().config.stages || [];
  }
  getSourceConnections(nodeId) {
    return this.state.config.connections.filter( conn => conn.to === nodeId );
  }
  getSourceNodes(nodeId) {
    let nodesMap = {};
    this.state.__ui__.nodes.forEach( node => nodesMap[node.name] = node );
    return this.getSourceConnections(nodeId)
      .map(matchedConnection => nodesMap[matchedConnection.from] );
  }
  editNodeProperties(nodeId, nodeConfig) {
    let nodes = this.state.__ui__.nodes;
    let match = nodes.filter( node => node.name === nodeId);
    if (match.length) {
      match = match[0];
      angular.forEach(nodeConfig, (pValue, pName) => match[pName] = pValue);
      if (!this.validateState()) {
        this.emitChange();
      }
    }
  }
  getSchedule() {
    return this.getState().config.schedule;
  }
  getDefaultSchedule() {
    return this.HYDRATOR_DEFAULT_VALUES.schedule;
  }
  setSchedule(schedule) {
    this.state.config.schedule = schedule;
  }

  validateState(validationConfig) {
    if (!validationConfig) {
      validationConfig = {
        showConsoleMessage: false,
        validateBeforePreview: false
      };
    }
    let isStateValid = true;
    let name = this.getName();
    let errorFactory = this.NonStorePipelineErrorFactory;
    let daglevelvalidation = [
      errorFactory.hasAtleastOneSource,
      errorFactory.hasAtLeastOneSink
    ];
    let nodes = this.state.__ui__.nodes;
    let connections = angular.copy(this.state.config.connections);
    //resetting any existing errors or warnings
    nodes.forEach(node => {
      node.errorCount = 0;
      delete node.warning;
      delete node.error;
    });
    let errors = [];
    this.HydratorPlusPlusConsoleActions.resetMessages();
    let setErrorWarningFlagOnNode = (node) => {
      if (node.error) {
        delete node.warning;
      } else {
        node.warning = true;
      }
      if (validationConfig.showConsoleMessage) {
        node.error = true;
        delete node.warning;
      }
    };

    /**
     * A pipeline consisting of only custom actions is a valid pipeline,
     * so we are skipping the at least 1 source and sink check
     **/

    let countActions = nodes.filter( (node) => {
      return this.GLOBALS.pluginConvert[node.type] === 'action';
    }).length;

    if (countActions !== nodes.length || nodes.length === 0) {
      daglevelvalidation.forEach( validationFn => {
        validationFn(nodes, (err, node) => {
          if (err) {
            isStateValid = false;
            if (node) {
              node.errorCount += 1;
              setErrorWarningFlagOnNode(node);
            }
            errors.push({
              type: err
            });
          }
        });
      });
    }

    if (!validationConfig.validateBeforePreview) {
      errorFactory.hasValidName(name, (err) => {
        if (err) {
          isStateValid = false;
          errors.push({
            type: err
          });
        }
      });
    }
    errorFactory.hasNoBackendProperties(nodes, errorNodes => {
      if (errorNodes) {
        isStateValid = false;
        errorNodes.forEach(node => {
          node.error = true;
          node.errorCount += 1;
          setErrorWarningFlagOnNode(node);
        });
        errors.push({
          type: 'NO-BACKEND-PROPS',
          payload: {
            nodes: errorNodes.map(node => node.name || node.plugin.name)
          }
        });
      }
    });
    errorFactory.isRequiredFieldsFilled(nodes, (err, node, unFilledRequiredFields) => {
      if (err) {
        isStateValid = false;
        node.warning = true;
        node.errorCount += unFilledRequiredFields;
        setErrorWarningFlagOnNode(node);
      }
    });
    errorFactory.isUniqueNodeNames(nodes, (err, node) => {
      if (err) {
        isStateValid = false;
        node.errorCount += 1;
        setErrorWarningFlagOnNode(node);
      }
    });
    let strayNodes = [];
    errorFactory.allNodesConnected(nodes, connections, (errorNode) => {
      if (errorNode) {
        isStateValid = false;
        strayNodes.push(errorNode);
      }
    });
    if (strayNodes.length) {
      errors.push({
        type: 'STRAY-NODES',
        payload: {nodes: strayNodes}
      });
    }

    let invalidConnections = [];
    errorFactory.allConnectionsValid(nodes, connections, (errorConnection) => {
      if (errorConnection) {
        isStateValid = false;
        invalidConnections.push(errorConnection);
      }
    });
    if (invalidConnections.length) {
      errors.push({
        type: 'INVALID-CONNECTIONS',
        payload: { connections: invalidConnections }
      });
    }

    errorFactory.hasValidResources(this.state.config, (err) => {
      if (err) {
        isStateValid = false;
        errors.push({
          type: 'error',
          content: this.GLOBALS.en.hydrator.studio.error[err]
        });
      }
    });
    errorFactory.hasValidDriverResources(this.state.config, (err) => {
      if (err) {
        isStateValid = false;
        errors.push({
          type: 'error',
          content: this.GLOBALS.en.hydrator.studio.error[err]
        });
      }
    });
    if (this.state.artifact.name === this.GLOBALS.etlDataStreams) {
      errorFactory.hasValidClientResources(this.state.config, (err) => {
        if (err) {
          isStateValid = false;
          errors.push({
            type: 'error',
            content: this.GLOBALS.en.hydrator.studio.error[err]
          });
        }
      });
    }

    if (errors.length && validationConfig.showConsoleMessage) {
      this.HydratorPlusPlusConsoleActions.addMessage(errors);
    }
    return isStateValid;
  }
  getBatchInterval() {
    return this.getState().config.batchInterval;
  }
  setBatchInterval(interval) {
    this.state.config.batchInterval = interval || angular.copy(this.HYDRATOR_DEFAULT_VALUES.batchInterval);
  }
  getInstance() {
    return this.getState().config.instances;
  }
  setInstance(instances) {
    this.state.config.instances = instances;
  }
  setDriverResources(driverResources) {
    this.state.config.driverResources = driverResources || angular.copy(this.HYDRATOR_DEFAULT_VALUES.resources);
  }
  setResources(resources) {
    this.state.config.resources = resources || angular.copy(this.HYDRATOR_DEFAULT_VALUES.resources);
  }
  setClientResources(clientResources) {
    this.state.config.clientResources = clientResources || angular.copy(this.HYDRATOR_DEFAULT_VALUES.resources);
  }
  setDriverVirtualCores(virtualCores) {
    this.state.config.driverResources = this.state.config.driverResources || {};
    this.state.config.driverResources.virtualCores = virtualCores;
  }
  getDriverVirtualCores() {
    return this.myHelpers.objectQuery(this.state, 'config', 'driverResources', 'virtualCores');
  }
  getDriverMemoryMB() {
    return this.myHelpers.objectQuery(this.state, 'config', 'driverResources', 'memoryMB');
  }
  setDriverMemoryMB(memoryMB) {
    this.state.config.driverResources = this.state.config.driverResources || {};
    this.state.config.driverResources.memoryMB = memoryMB;
  }
  setVirtualCores(virtualCores) {
    this.state.config.resources = this.state.config.resources || {};
    this.state.config.resources.virtualCores = virtualCores;
  }

  getVirtualCores() {
    return this.myHelpers.objectQuery(this.state, 'config', 'resources', 'virtualCores');
  }
  getMemoryMB() {
    return this.myHelpers.objectQuery(this.state, 'config', 'resources', 'memoryMB');
  }
  setMemoryMB(memoryMB) {
    this.state.config.resources = this.state.config.resources || {};
    this.state.config.resources.memoryMB = memoryMB;
  }
  setClientVirtualCores(virtualCores) {
    this.state.config.clientResources = this.state.config.clientResources || {};
    this.state.config.clientResources.virtualCores = virtualCores;
  }
  getClientVirtualCores() {
    return this.myHelpers.objectQuery(this.state, 'config', 'clientResources', 'virtualCores');
  }
  getClientMemoryMB() {
    return this.myHelpers.objectQuery(this.state, 'config', 'clientResources', 'memoryMB');
  }
  setClientMemoryMB(memoryMB) {
    this.state.config.clientResources = this.state.config.clientResources || {};
    this.state.config.clientResources.memoryMB = memoryMB;
  }

  setComments(comments) {
    this.state.config.comments = comments;
  }
  getComments() {
    return this.getState().config.comments;
  }

  addPostAction(config) {
    if (!this.state.config.postActions) {
      this.state.config.postActions = [];
    }
    this.state.config.postActions.push(config);
    this.emitChange();
  }
  editPostAction(config) {
    let index = _.findLastIndex(this.state.config.postActions, (post) => {
      return post.id === config.id;
    });

    this.state.config.postActions[index] = config;
    this.emitChange();
  }
  deletePostAction(config) {
    _.remove(this.state.config.postActions, (post) => {
      return post.id === config.id;
    });
    this.emitChange();
  }
  getPostActions() {
    return this.getState().config.postActions;
  }
  getMaxConcurrentRuns() {
    return this.getState().config.maxConcurrentRuns;
  }
  setMaxConcurrentRuns(num=1) {
    this.state.config.maxConcurrentRuns = num;
  }

  setServiceAccountPath(path) {
    this.state.config.serviceAccountPath = path;
  }
  getServiceAccountPath() {
    return this.getState().config.serviceAccountPath;
  }

  saveAsDraft() {
    this.HydratorPlusPlusConsoleActions.resetMessages();
    let name = this.getName();
    let isValidName = true;
    let errorFactory = this.NonStorePipelineErrorFactory;
    errorFactory.hasValidName(name, (err) => {
      if (err) {
        isValidName = false;
      }
    });
    if (!name.length || !isValidName) {
      this.HydratorPlusPlusConsoleActions.addMessage([{
        type: 'MISSING-NAME',
      }]);
      return;
    }

    let config = this.getConfigForExport({ shouldPruneProperties: false });
    const draftId = this.getDraftId() || this.uuid.v4();
    const params = {
      context: this.$stateParams.namespace,
      draftId,
    };
    /**
     * If the user is editing draft that is using old user store, then we
     * remove it from old user store and save it in the new drafts API.
     *
     * This is to migrate the draft to using new drafts API.
     */
    this.mySettings
      .get('hydratorDrafts', true)
      .then(
        (res) => {
          var savedDraft = this.myHelpers.objectQuery(res, this.$stateParams.namespace, draftId);
          if (savedDraft) {
            delete res[this.$stateParams.namespace][draftId];
            return this.mySettings.set('hydratorDrafts', res);
          }
        })
        .then(() => this.myPipelineApi.saveDraft(params, config).$promise)
        .then(() => {
          this.$stateParams.draftId = draftId;
          this.$state.go('hydrator.create', this.$stateParams, {notify: false});
          this.HydratorPlusPlusConsoleActions.addMessage([{
            type: 'success',
            content: `Draft ${config.name} saved successfully.`
          }]);
          this.__defaultState = angular.copy(this.state);
          this.emitChange();
        },
        err => {
          let message = err;
          if (err && (err.data || err.response)) {
            message = err.data || err.response;
          }
          if (err && (err.statusCode === 404 || err.statusCode === 503)) {
            message = 'Unable to communicate with the Pipeline Studio service. Please check the service status.';
          }
          this.HydratorPlusPlusConsoleActions.addMessage([{
            type: 'error',
            content: message
          }]);
        });
  }

  publishPipeline() {
    this.HydratorPlusPlusConsoleActions.resetMessages();
    let error = this.validateState({
      showConsoleMessage: true
    });

    if (!error) { return; }
    this.EventPipe.emit('showLoadingIcon', 'Deploying Pipeline...');

    const navigateToDetailedView = (adapterName) => {
      this.EventPipe.emit('hideLoadingIcon.immediate');
      this.setState(this.getDefaults());
      this.$state.go('hydrator.detail', { pipelineId: adapterName });
    };

    const draftDeleteErrorHandler = (err) => {
      this.HydratorPlusPlusConsoleActions.addMessage([{
        type: 'error',
        content: err
      }]);
      return this.$q.reject(false);
    };

    const removeOldDraft = (draftId, adapterName, res) => {
      if (res.statusCode !== 404) {
        return draftDeleteErrorHandler.bind(this, res.response || res.data);
      }
      this.mySettings.get('hydratorDrafts', true)
        .then(
          (res) => {
            var savedDraft = this.myHelpers.objectQuery(res, this.$stateParams.namespace, draftId);
            if (savedDraft) {
              delete res[this.$stateParams.namespace][draftId];
              return this.mySettings.set('hydratorDrafts', res);
            }
            return Promise.resolve(true);
          },
          draftDeleteErrorHandler.bind(this)
        ).then(navigateToDetailedView.bind(this, adapterName));
    };

    let removeFromUserDrafts = (adapterName) => {
      const draftId = this.getDraftId();
      if (!draftId) {
        return navigateToDetailedView.call(this, adapterName);
      }
      /**
       * Remove the draft from the new API. If it errors out check if it is
       * a 404.
       * - If it is 404 so it should be an older draft. Delete from the user store
       * - If it is non-404 not show the error message. This is less likely to happen as
       *   pipeline publish succeeds but draft delete fails (network timeout issue).
       *   TODO: We should show a navigate anyway link to discard the draft and navigate to published
       *   pipeline view.
       * - If it succeeds then proceed to pipeline detailed view.
       */
      this.myPipelineApi
        .deleteDraft({ context: this.$stateParams.namespace, draftId })
        .$promise
        .then(navigateToDetailedView.bind(this, adapterName), removeOldDraft.bind(this, draftId, adapterName));
    };

    let publish = (pipelineName) => {
      this.myPipelineApi.save(
        {
          namespace: this.$state.params.namespace,
          pipeline: pipelineName
        },
        config
      )
      .$promise
      .then(
        removeFromUserDrafts.bind(this, pipelineName),
        (err) => {
          this.EventPipe.emit('hideLoadingIcon.immediate');
          this.HydratorPlusPlusConsoleActions.addMessage([{
            type: 'error',
            content: angular.isObject(err) ? err.data : err
          }]);
        }
      );
    };

    var config = this.getConfigForExport();

    // Checking if Pipeline name already exist
    this.myAppsApi
      .list({ namespace: this.$state.params.namespace })
      .$promise
      .then( (apps) => {
        var appNames = apps.map( (app) => { return app.name; } );

        if (appNames.indexOf(config.name) !== -1) {
          this.HydratorPlusPlusConsoleActions.addMessage([{
            type: 'error',
            content: this.GLOBALS.en.hydrator.studio.error['NAME-ALREADY-EXISTS']
          }]);
          this.EventPipe.emit('hideLoadingIcon.immediate');
        } else {
          publish(config.name);
        }
      });
  }
}

angular.module(`${PKG.name}.feature.hydrator`)
  .service('HydratorPlusPlusConfigStore', HydratorPlusPlusConfigStore);
