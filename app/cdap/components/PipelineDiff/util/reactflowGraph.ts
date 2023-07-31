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
import { Node } from 'reactflow';
import {
  IPipelineConfig,
  IPipelineDiffMap,
  IPipelineStage,
  PipelineEdge,
  PipelineNode,
} from '../types';
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

  const nodes: PipelineNode[] = config.stages.map((stage) => {
    stageNameToStage[stage.name] = stage;
    const pluginMapKey = getAvailabePluginsMapKeyFromPlugin(stage.plugin);

    const stageDiffKey = getStageDiffKey(stage);
    const type = pluginReactflowNodeType(availablePluginsMap, pluginMapKey);
    const diffItem = diffMap.stages[stageDiffKey];

    return {
      id: stageDiffKey,
      data: {
        ...stage,
        customIconSrc: getCustomIconSrc(availablePluginsMap, pluginMapKey),
        iconName: getPluginIcon(stage.plugin.name),
        diffItem,
        diffKey: stageDiffKey,
      },
      type,
      position: {
        x: graph._nodes[stage.name].x,
        y: graph._nodes[stage.name].y,
      },
    };
  });

  const connections: PipelineEdge[] = config.connections.map((connection) => {
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
      data: {
        diffIndicator,
      },
      source: getStageDiffKeyFromPluginName(connection.from),
      target: getStageDiffKeyFromPluginName(connection.to),
      sourceHandle,
      type: diffIndicator ? 'diffEdge' : 'smoothstep',
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

/**
 * Returns a bound that a canvas can fit where node is centered and
 * has space around it.
 * @param node the reference node
 * @returns the bounds to fit in the canvas
 */
export function getPluginBounds(node: Node) {
  const cx = node.position.x + node.width / 2;
  const cy = node.position.y + node.height / 2;
  return {
    x: cx - node.width,
    y: cy - node.height,
    width: node.width * 2,
    height: node.height * 2,
  };
}

/**
 * @param fromNode source node
 * @param toNode target node
 * @returns a bound that fits both source and target nodes
 */
export function getEdgeBounds(fromNode: Node, toNode: Node) {
  const x1 = Math.min(fromNode.position.x, toNode.position.x);
  const y1 = Math.min(fromNode.position.y, toNode.position.y);

  const x2 = Math.max(fromNode.position.x + fromNode.width, toNode.position.x + toNode.width);
  const y2 = Math.max(fromNode.position.y + fromNode.height, toNode.position.y + toNode.height);
  return {
    x: x1,
    y: y1,
    width: x2 - x1,
    height: y2 - y1,
  };
}
