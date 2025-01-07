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

import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import _cloneDeep from 'lodash/cloneDeep';
import _isEqual from 'lodash/isEqual';
import _merge from 'lodash/merge';
import avsc from 'cdap-avsc';
import ee from 'event-emitter';
import {
  getAppType,
  getArtifact,
  getSourceConnections,
  getSourceNodes,
} from '../store/config/queries';
import PipelineMetricsStore from 'services/PipelineMetricsStore';
import { objectQuery } from 'services/helpers';
import { getNodesFromStages, getPluginInfo } from '../utils/nodeUtils';
import { GLOBALS } from 'services/global-constants';
import PipelineDetailStore from 'components/PipelineDetails/store';
import { getCurrentNamespace } from 'services/NamespaceStore';
import { getNodesMap } from 'components/hydrator/helpers/DAGhelpers';
import { PreviewActions } from '../store/preview/actions';
import { NodesActions } from '../store/nodes/reducer';
import { removePreviousState, resetFutureStates } from '../store/nodes/actions';

export default function usePropertiesPanel(pluginNode: any) {
  const tabs = [
    { label: 'Properties' },
    { label: 'Preview' },
    { label: 'Documentation' },
    { label: 'Metrics' },
  ];
  const eventEmitter = useRef(ee(ee)).current;
  const showNewSchemaEditor = window.localStorage['schema-editor'] === 'true';

  const [state, setState] = useState<any>(getDefaults({}));
  const [nodeMetrics, setNodeMetrics] = useState<any>([]);
  const [stateChangeTimeout, setStateChangeTimeout] = useState<any>(null);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [datasetAlreadyExists, setDatasetAlreadyExists] = useState<boolean>(false);
  const [datasetId, setDatasetId] = useState<any>(null);

  const previewState = useSelector((state) => state.preview);
  const uiState = useSelector((state) => state.uiState);
  const configState = useSelector((state) => state.config);
  const dispatch = useDispatch();

  const isPreviewMode = previewState.isPreviewModeEnabled;
  const isPreviewData = previewState.previewData;
  const previewId = previewState.previewId;
  const previewStatus = previewState.status;

  const rIsStudioMode = uiState.isStudioMode;
  const rDisabled = !rIsStudioMode; // TODO: revisit this

  const pluginId = pluginNode.name;
  const rPlugin: any = getResolvedPlugin();

  const rNodeMetricsContext: any = getResolvedNodeMetricsContext(); // TODO: revisit this
  const isMetricsEnabled =
    rDisabled && Array.isArray(rNodeMetricsContext.runs) && rNodeMetricsContext.runs.length;
  const portMetricsToShow = PipelineMetricsStore.getState().portsToShow;

  const labelConfig = {
    widgetProperty: {
      label: 'Label',
      'widget-type': 'textbox',
    },
    pluginProperty: {
      required: true,
    },
  };

  useEffect(() => {
    onMount();
    return onUnmount;
  }, []);

  function updateState(changes: any = {}) {
    setState((state) => _merge(_cloneDeep(state), changes));
  }

  async function onMount() {
    await fetchPluginInfo(rPlugin);
    initializeMetrics();
    await showContents();
    initializePreview();
    eventEmitter.on('dataset.selected', handleDatasetSelected);
  }

  function onUnmount() {
    updateNodeStateIfDirty();
    dispatch({
      type: PreviewActions.RESET_PREVIEW_DATA,
    });
    clearTimeout(stateChangeTimeout);
    eventEmitter.off('dataset.selected', handleDatasetSelected);
  }

  function getResolvedPlugin() {
    if (rIsStudioMode) {
      return {
        pluginNode,
        appType: getAppType(configState),
        sourceConnections: getSourceConnections(configState, pluginId),
        sourceNodes: getSourceNodes(configState, pluginId),
        artifactVersion: getArtifact(configState)?.version,
      };
    }

    const pipelineDetailStoreState = PipelineDetailStore.getState();
    const appType = pipelineDetailStoreState.artifact.name;
    const sourceConnections = pipelineDetailStoreState.config.connections.filter(
      (conn) => conn.to === pluginId
    );
    const nodes = getNodesFromStages(pipelineDetailStoreState.config.stages);
    const nodesMap = getNodesMap(nodes);
    const sourceNodes = sourceConnections.map((conn) => nodesMap[conn.from]);
    const artifactVersion = pipelineDetailStoreState.artifact.version;

    return {
      pluginNode,
      appType,
      sourceConnections,
      sourceNodes,
      artifactVersion,
    };
  }

  function getResolvedNodeMetricsContext() {
    if (rIsStudioMode) {
      return false;
    }

    const pipelineDetailStoreState = PipelineDetailStore.getState();
    const programType =
      pipelineDetailStoreState.artifact.name === GLOBALS.etlDataPipeline ? 'workflow' : 'spark';
    const programId =
      pipelineDetailStoreState.artifact.name === GLOBALS.etlDataPipeline
        ? 'DataPipelineWorkflow'
        : 'DataStreamsSparkStreaming';

    return {
      runRecord: pipelineDetailStoreState.currentRun,
      runs: pipelineDetailStoreState.runs,
      namespace: getCurrentNamespace(),
      app: pipelineDetailStoreState.name,
      programType,
      programId,
    };
  }

  async function fetchPluginInfo(rPlugin) {
    const pluginNode = rPlugin.pluginNode;
    const appType = rPlugin.appType;
    const sourceConnections = rPlugin.sourceConnections;
    const sourceNodes = rPlugin.sourceNodes;
    const artifactVersion = rPlugin.artifactVersion;

    try {
      const nodeWithInfo = await getPluginInfo(
        pluginNode,
        appType,
        sourceConnections,
        sourceNodes,
        artifactVersion
      );

      const pluginType = nodeWithInfo.type || nodeWithInfo.plugin.type;
      setState(
        getDefaults({
          node: nodeWithInfo,
          isValidPlugin: true,
          type: appType,
          isSource: GLOBALS.pluginConvert[pluginType] === 'source',
          isSink: GLOBALS.pluginConvert[pluginType] === 'sink',
          isTransform: GLOBALS.pluginConvert[pluginType] === 'transform',
          isAction: GLOBALS.pluginConvert[pluginType] === 'action',
          isCondition: GLOBALS.pluginConvert[pluginType] === 'condition',
        })
      );
    } catch (err) {
      if (err && err.statusCode === 404) {
        // This is when plugin artifact is unavailable. Show appropriate message.
        setState((state) => ({
          ...state,
          configFetched: true,
          noproperty: 0,
          isValidPlugin: false,
        }));
      }
    }
  }

  function getDefaults(config: any = {}) {
    const initialState: any = {
      configfetched: false,
      properties: [],
      noconfig: null,
      noproperty: true,
      config: {},
      groupsConfig: {},

      isValidPlugin: config.isValidPlugin || false,
      node: _cloneDeep(config.node) || {},

      isSource: config.isSource || false,
      isSink: config.isSink || false,
      isTransform: config.isTransform || false,
      isAction: config.isAction || false,
      isCondition: config.isCondition || false,

      type: config.appType || null,
      watchers: [],
      outputSchemaUpdate: 0,
      schemaAdvance: false,

      activeTab: 1,
      showPropagateConfirm: false,
    };

    initialState.activeTab = 1;
    if (isPreviewMode && isPreviewData && rPlugin.isAction) {
      initialState.activeTab = 2;
    } else if (PipelineMetricsStore.getState().metricsTabActive) {
      initialState.activeTab = 4;
    }

    initialState.defaultState = _cloneDeep(initialState);

    const propertiesSchema = objectQuery(initialState.node, 'plugin', 'properties', 'schema');
    const schemaArr = propertiesSchema || initialState.node.outputSchema;

    if (schemaArr) {
      if (Array.isArray(schemaArr)) {
        schemaArr.forEach((schemaObj) => {
          if (schemaObj.schema) {
            try {
              avsc.parse(schemaObj.schema, { wrapUnions: true });
            } catch (e) {
              // If its old schema editor by default set it to advance
              if (!showNewSchemaEditor) {
                initialState.schemaAdvance = true;
              } else {
                // else if its a new schema editor set advance only if the schema is a macro.
                if (schemaArr.indexOf('${') !== -1) {
                  initialState.schemaAdvance = true;
                }
              }
            }
          }
        });
      } else {
        try {
          avsc.parse(schemaArr, { wrapUnions: true });
        } catch (e) {
          // If its old schema editor by default set it to advance
          if (!showNewSchemaEditor) {
            initialState.schemaAdvance = true;
          } else {
            // else if its a new schema editor set advance only if the schema is a macro.
            if (schemaArr.indexOf('${') !== -1) {
              initialState.schemaAdvance = true;
            }
          }
        }
      }
    }

    initialState.showPropagateConfirm = false;
    return initialState;
  }

  function initializeMetrics() {
    let nodeMetricsArr;
    if (rNodeMetricsContext) {
      nodeMetricsArr = [
        `user.${state.node.name}.records.in`,
        `user.${state.node.name}.records.error`,
        `user.${state.node.name}.process.time.total`,
        `user.${state.node.name}.process.time.avg`,
        `user.${state.node.name}.process.time.max`,
        `user.${state.node.name}.process.time.min`,
        `user.${state.node.name}.process.time.stddev`,
      ];
      const nodeType = state.node.type || state.node.plugin.type;
      if (nodeType === 'splittertransform') {
        if (state.node.outputSchema && Array.isArray(state.node.outputSchema)) {
          state.node.outputSchema.forEach((port) => {
            nodeMetricsArr.push(`user.${state.node.name}.records.out.${port.name}`);
          });
        }
      } else {
        nodeMetricsArr.push(`user.${state.node.name}.records.out`);
      }
    } else {
      nodeMetricsArr = [];
    }

    setNodeMetrics(nodeMetricsArr);
  }

  async function showContents() {
    const changes: any = {};
    if (Array.isArray(state.watchers)) {
      state.watchers.forEach((watcher) => watcher());
      changes.watchers = [];
    }

    if (Object.keys(state.node).length) {
      changes.configfetched = false;

      clearTimeout(stateChangeTimeout);
      const tout = setTimeout(async () => {
        await loadNewPlugin();
        await validateNodeLabel();
      }, 0);
      setStateChangeTimeout(tout);
    }

    updateState(changes);
  }

  function initializePreview() {
    if (rIsStudioMode && isPreviewMode && previewId) {
      dispatch({
        type: PreviewActions.SET_PREVIEW_DATA,
        payload: null,
      });
      setSelectedNode({
        nodeType: state.node.type,
        name: state.node.plugin.label,
        plugin: state.node.plugin,
        isSource: state.isSource,
        isSink: state.isSink,
        isCondition: state.isCondition,
      });
    }
  }

  ////////////////////////////////////
  // TODO: correct from here

  async function loadNewPlugin() {
    const noJsonErrorHandler = (err) => {
      const propertiesFromBackend = Object.keys(state.node._backendProperties);
      // Didn't receive a configuration from the backend. Fallback to all textboxes.
      const changes: any = _cloneDeep(state);
      switch (err) {
        case 'NO_JSON_FOUND':
          changes.noConfigMessage = GLOBALS.en.hydrator.studio.info['NO-CONFIG'];
          break;
        case 'CONFIG_SYNTAX_JSON_ERROR':
          changes.noConfigMessage = GLOBALS.en.hydrator.studio.error['SYNTAX-CONFIG-JSON'];
          break;
        case 'CONFIG_SEMANTICS_JSON_ERROR':
          changes.noConfigMessage = GLOBALS.en.hydrator.studio.error['SEMANTIC-CONFIG-JSON'];
          break;
      }
      changes.noconfig = true;
      changes.configfetched = true;

      propertiesFromBackend.forEach((property) => {
        changes.node.plugin.properties[property] = state.node.plugin.properties[property] || '';
      });
      changes.defaultState = _cloneDeep(changes);
      changes.watchers.push(
        ////////////////////////////////////////
        this.$scope.$watch(
          'HydratorPlusPlusNodeConfigCtrl.state.node',
          () => {
            validateNodeLabel(this);
            this.HydratorPlusPlusConfigActions.editPlugin(this.state.node.name, this.state.node);
          },
          true
        )
      );
    };

    this.state.noproperty = Object.keys(this.state.node._backendProperties || {}).length;
    if (this.state.noproperty) {
      const artifactName = this.myHelpers.objectQuery(
        this.state.node,
        'plugin',
        'artifact',
        'name'
      );
      const artifactVersion = this.myHelpers.objectQuery(
        this.state.node,
        'plugin',
        'artifact',
        'version'
      );
      const artifactScope = this.myHelpers.objectQuery(
        this.state.node,
        'plugin',
        'artifact',
        'scope'
      );
      this.HydratorPlusPlusPluginConfigFactory.fetchWidgetJson(
        artifactName,
        artifactVersion,
        artifactScope,
        `widgets.${this.state.node.plugin.name}-${this.state.node.type ||
          this.state.node.plugin.type}`
      ).then((res) => {
        this.widgetJson = res;

        // Not going to eliminate the groupsConfig just yet, because there are still other things depending on it
        // such as output schema.
        try {
          this.state.groupsConfig = this.HydratorPlusPlusPluginConfigFactory.generateNodeConfig(
            this.state.node._backendProperties,
            res
          );
        } catch (e) {
          noJsonErrorHandler();
          return;
        }

        const generateJumpConfig = (jumpConfig, properties) => {
          let datasets = [];
          const jumpConfigDatasets = jumpConfig.datasets || [];
          datasets = jumpConfigDatasets.map((dataset) => {
            let datasetId = properties[dataset['ref-property-name']];
            const { metadataEndpoints } = window.CaskCommon.PipelineDetailStore.getState();
            if (!datasetId && metadataEndpoints) {
              const endpoint = metadataEndpoints.find((endpoint) => {
                return endpoint.properties.stageName === this.state.node.id;
              });
              datasetId = endpoint && endpoint.name;
            }
            return { datasetId, entityType: 'datasets' };
          });
          return { datasets };
        };
        if (res.errorDataset || this.state.node.errorDatasetName) {
          this.state.showErrorDataset = true;
          this.state.errorDatasetTooltip =
            (res.errorDataset && res.errorDataset.errorDatasetTooltip) || false;
          this.state.node.errorDatasetName = this.state.node.errorDatasetName || '';
        }

        if (
          this.$scope.isDisabled &&
          this.state.groupsConfig.jumpConfig &&
          Object.keys(this.state.groupsConfig.jumpConfig).length
        ) {
          const { datasets } = generateJumpConfig(
            this.state.groupsConfig.jumpConfig,
            this.state.node.plugin.properties
          );
          this.state.groupsConfig.jumpConfig.datasets = datasets;
        } else {
          // If we isDisabled is set to false then we are in studio mode & hence remove jump config.
          // Jumpconfig is only for published view where everything is disabled.
          delete this.state.groupsConfig.jumpConfig;
        }
        const configOutputSchema = this.state.groupsConfig.outputSchema;
        // If its an implicit schema, set the output schema to the implicit schema and inform ConfigActionFactory
        if (configOutputSchema.implicitSchema) {
          this.state.node.outputSchema = [
            this.HydratorPlusPlusNodeService.getOutputSchemaObj(
              this.HydratorPlusPlusHydratorService.formatSchemaToAvro(
                configOutputSchema.implicitSchema
              )
            ),
          ];
          this.HydratorPlusPlusConfigActions.editPlugin(this.state.node.name, this.state.node);
        } else {
          // If not an implcit schema check if a schema property exists in the node config.
          // What this means is, has the plugin developer specified a plugin property in 'outputs' array of node config.
          // If yes then set it as output schema and everytime when a user edits the output schema the value has to
          // be transitioned to the respective plugin property.
          if (configOutputSchema.isOutputSchemaExists) {
            const schemaProperty = configOutputSchema.outputSchemaProperty[0];
            const pluginProperties = this.state.node.plugin.properties;
            if (pluginProperties[schemaProperty]) {
              this.state.node.outputSchema = pluginProperties[schemaProperty];
            } else if (pluginProperties[schemaProperty] !== this.state.node.outputSchema) {
              this.state.node.plugin.properties[
                configOutputSchema.outputSchemaProperty[0]
              ] = this.state.node.outputSchema[0].schema;
            }
            this.state.watchers.push(
              this.$scope.$watch('HydratorPlusPlusNodeConfigCtrl.state.node.outputSchema', () => {
                if (this.validateSchema()) {
                  this.state.node.plugin.properties[
                    configOutputSchema.outputSchemaProperty[0]
                  ] = this.state.node.outputSchema[0].schema;
                }
              })
            );
          }
        }
        if (!this.$scope.isDisabled) {
          this.state.watchers.push(
            this.$scope.$watch(
              'HydratorPlusPlusNodeConfigCtrl.state.node',
              () => {
                this.validateNodeLabel(this);
                this.HydratorPlusPlusConfigActions.editPlugin(
                  this.state.node.name,
                  this.state.node
                );
              },
              true
            )
          );
        }
        if (!this.state.node.outputSchema || this.state.node.type === 'condition') {
          let inputSchema =
            this.myHelpers.objectQuery(this.state.node, 'inputSchema', 0, 'schema') || '';
          if (typeof inputSchema !== 'string') {
            inputSchema = JSON.stringify(inputSchema);
          }
          this.state.node.outputSchema = [
            this.HydratorPlusPlusNodeService.getOutputSchemaObj(inputSchema),
          ];
        }
        if (!this.state.node.plugin.label) {
          this.state.node.plugin.label = this.state.node.name;
        }
        // Mark the configfetched to show that configurations have been received.
        this.state.configfetched = true;
        this.state.config = res;
        this.state.noconfig = false;
        this.defaultState = angular.copy(this.state);
      }, noJsonErrorHandler);
    } else {
      this.state.configfetched = true;
    }
  }

  // async function validateNodeLabel() {

  // }

  function updateNodeStateIfDirty() {
    const isStateDirty = stateIsDirty();
    // because we are adding state to history before we open a node config, so if the config wasn't changed at all,
    // then we should remove that state from history
    if (!isStateDirty) {
      removePreviousState();
    } else {
      // if it was changed, then reset future states so user can't redo
      resetFutureStates();
    }
  }

  function stateIsDirty() {
    const defaults = state.defaultState.node;
    const nodeState = state.node;
    return !_isEqual(defaults, nodeState);
  }

  function handleDatasetSelected(schema, format, datasetExists, datasetIdParam) {
    if (datasetExists) {
      setDatasetAlreadyExists(datasetExists);
    } else {
      setDatasetAlreadyExists(false);
    }

    const changes: any = {};
    // if this plugin is having an existing dataset with a macro, then don't change anything.
    // else if the user is changing to another existing dataset, then show basic mode.
    if (
      objectQuery(this, 'defaultState', 'node', 'plugin', 'properties', 'name') &&
      state.defaultState.node.plugin.properties.name !== datasetIdParam
    ) {
      changes.schemaAdvance = false;
    }
    if (datasetIdParam) {
      setDatasetId(datasetIdParam);
    }
    updateState(changes);
  }

  return {
    state,
    nodeMetrics,
    isMetricsEnabled,
  };
}
