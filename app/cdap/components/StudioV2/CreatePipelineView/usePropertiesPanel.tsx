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

import React, { useState } from 'react';
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

export default function usePropertiesPanel(pluginNode: any) {
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
  const rNodeMetricsContext = false; // TODO: resolve this from relevant state store
  const rDisabled = false; // TODO: resolve this from relevant state store
  const pluginId = pluginNode.name;
  const rPlugin: any = {
    pluginNode,
    appType: getAppType(configState),
    sourceConnections: getSourceConnections(configState, pluginId),
    sourceNodes: getSourceNodes(configState, pluginId),
    artifactVersion: getArtifact(configState)?.version,
    isAction: false, // TODO: resolve with actual value
  };

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

  return {
    state,
  };
}
