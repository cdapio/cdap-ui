/*
 * Copyright © 2023 Cask Data, Inc.
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

import { getGraphLayout } from 'components/hydrator/helpers/DAGhelpers';
import { getPluginIcon } from 'services/helpers';
import { IPipelineConfig, IPipelineDiffMap, IPipelineStage } from '../types';
import { MarkerType } from 'reactflow';
import { PLUGIN_TYPES } from 'components/hydrator/components/Canvas/constants';
import {
  getAvailabePluginsMapKeyFromPlugin,
  getCustomIconSrc,
  getPluginDiffColors,
  pluginReactflowNodeType,
} from './helpers';
import { getConnectionDiffKey, getStageDiffKey } from './diff';

/**
 * Given a pipeline configuration, constructs a pipeline graph that can be displayed
 * in a reacflow canvas.
 * @param config a pipeline's configuration
 * @returns nodes and connections to be displayed in a reactflow pipeline graph
 */
export function getReactflowPipelineGraph(
  config: IPipelineConfig | null,
  availablePluginsMap: any,
  diffMap: IPipelineDiffMap
) {
  if (!config) {
    return { nodes: [], connections: [] };
  }
  const graphNodes = config.stages.map((stage) => {
    return {
      name: stage.name,
      type: stage.plugin.type,
      label: stage.plugin.label,
    };
  });
  const graphConnections = config.connections;
  const graph = getGraphLayout(graphNodes, graphConnections, 200);

  const stageNameToStage: { [stageName: string]: IPipelineStage } = {};

  const nodes = config.stages.map((stage) => {
    stageNameToStage[stage.name] = stage;
    const pluginMapKey = getAvailabePluginsMapKeyFromPlugin(stage.plugin);

    const type = pluginReactflowNodeType(availablePluginsMap, pluginMapKey);
    const diffItem = diffMap.stages[getStageDiffKey(stage)];

    return {
      id: stage.name,
      data: {
        ...stage,
        customIconSrc: getCustomIconSrc(availablePluginsMap, pluginMapKey),
        iconName: getPluginIcon(stage.plugin.name),
        diffItem,
      },
      type,
      position: {
        x: graph._nodes[stage.name].x,
        y: graph._nodes[stage.name].y,
      },
    } as const;
  });

  const connections = config.connections.map((connection) => {
    const getStageDiffKeyFromPluginName = (name: string) => getStageDiffKey(stageNameToStage[name]);
    const connectionKey = getConnectionDiffKey(connection, getStageDiffKeyFromPluginName);
    const diffIndicator = diffMap.connections[connectionKey]?.diffIndicator;

    let sourceHandle = 'source_right';
    if (stageNameToStage[connection.to].plugin.type === PLUGIN_TYPES.ERROR_TRANSFORM) {
      sourceHandle = 'source_error';
    } else if (stageNameToStage[connection.to].plugin.type === PLUGIN_TYPES.ALERT_PUBLISHER) {
      sourceHandle = 'source_alert';
    }
    const { primaryLight } = getPluginDiffColors(diffIndicator);
    return {
      id: connectionKey,
      source: connection.from,
      target: connection.to,
      sourceHandle,
      type: 'smoothstep',
      isSelectable: true,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: primaryLight,
      },
      style: { strokeWidth: '2px', stroke: primaryLight },
    };
  });
  return { nodes, connections };
}
