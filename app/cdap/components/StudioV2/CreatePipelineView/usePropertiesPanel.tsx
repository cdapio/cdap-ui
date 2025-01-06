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

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import _cloneDeep from 'lodash/cloneDeep';
import avsc from 'cdap-avsc';
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

export default function usePropertiesPanel(pluginNode: any, isDisabled: boolean = false) {
  const tabs = [
    { label: 'Properties' },
    { label: 'Preview' },
    { label: 'Documentation' },
    { label: 'Metrics' },
  ];
  const showNewSchemaEditor = window.localStorage['schema-editor'] === 'true';

  const [state, setState] = useState<any>(getDefaults({}));

  const previewState = useSelector((state) => state.preview);
  const uiState = useSelector((state) => state.uiState);
  const configState = useSelector((state) => state.config);
  const dispatch = useDispatch();

  const isPreviewMode = previewState.isPreviewModeEnabled;
  const isPreviewData = previewState.previewData;
  const rIsStudioMode = uiState.isStudioMode;
  const rDisabled = !rIsStudioMode; // TODO: revisit this

  const rNodeMetricsContext = getResolvedNodeMetricsContext(); // TODO: revisit this

  const pluginId = pluginNode.name;
  const rPlugin = getResolvedPlugin();

  useEffect(() => {
    onMount();
  }, []);

  async function onMount() {
    await fetchPluginInfo(rPlugin);

    ///////////////////////////////////////////////
    // TODO: correct from here
    await initializeMetrics();
    await showContents();
    await initializePreview();
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

  async function initializeMetrics() {
    this.isMetricsEnabled =
      this.$scope.isDisabled &&
      Array.isArray(this.metricsContext.runs) && this.metricsContext.runs.length;
    if (this.metricsContext) {
      this.nodeMetrics = [
        `user.${this.state.node.name}.records.in`,
        `user.${this.state.node.name}.records.error`,
        `user.${this.state.node.name}.process.time.total`,
        `user.${this.state.node.name}.process.time.avg`,
        `user.${this.state.node.name}.process.time.max`,
        `user.${this.state.node.name}.process.time.min`,
        `user.${this.state.node.name}.process.time.stddev`,
      ];
      const nodeType = this.state.node.type || this.state.node.plugin.type;
      if (nodeType === 'splittertransform') {
        if (this.state.node.outputSchema && Array.isArray(this.state.node.outputSchema)) {
          angular.forEach(this.state.node.outputSchema, (port) => {
            this.nodeMetrics.push(`user.${this.state.node.name}.records.out.${port.name}`);
          });
        }
      } else {
        this.nodeMetrics.push(`user.${this.state.node.name}.records.out`);
      }
    } else {
      this.nodeMetrics = [];
    }
  }

  return {
    state,
  };
}
