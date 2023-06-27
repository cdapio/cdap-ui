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

import { diff } from 'json-diff';
import { getGraphLayout } from 'components/hydrator/helpers/DAGhelpers';
import { getNodesFromStages } from 'services/helpers';
import { TDeepPartial } from '../types';
import {
  IPipeline,
  TStageMap,
  TConnectionMap,
  IPipelineStage,
  IPipelineConnection,
} from '../types';

// TODO: add config type
export function getReactflowPipelineGraph(config) {
  let nodes = getNodesFromStages(config.stages);
  const connections = config.connections;
  const graph = getGraphLayout(nodes, connections, 200);
  nodes = nodes.map((node) => {
    return {
      ...node,
      _uiPosition: {
        top: graph._nodes[node.name].y + 'px',
        left: graph._nodes[node.name].x + 'px',
      },
    };
  });
  return { nodes, connections };
}

function preprocessPipeline(pipeline: IPipeline) {
  const stageMap: TStageMap = {};
  const connectionMap: TConnectionMap = {};
  const stageNameToPluginName = {};

  for (const stage of pipeline.stages) {
    const stageMapKey = `${stage.plugin.name}__${stage.name}`;
    stageMap[stageMapKey] = stage;
    stageNameToPluginName[stage.name] = stage.plugin.name;
  }

  for (const connection of pipeline.connections) {
    const fromName = `${stageNameToPluginName[connection.from]}__${connection.from}`;
    const toName = `${stageNameToPluginName[connection.to]}__${connection.to}`;
    // TODO: I am not sure if the users are allowed to use % in their names, other character
    // that is guarenteed to be not used is preferred
    const connectionMapKey = `${fromName}%${toName}`;
    connectionMap[connectionMapKey] = connection;
  }
  return { stageMap, connectionMap };
}

/**
 * Given two pipelines, return the difference between them
 * @param pipeline1 first pipeline
 * @param pipeline2 second pipeline
 * @returns edit actions applied to pipeline1 to get pipeline2
 */
export function computePipelineDiff(pipeline1: IPipeline, pipeline2: IPipeline) {
  const { stageMap: stageMap1, connectionMap: connectionMap1 } = preprocessPipeline(pipeline1);
  const { stageMap: stageMap2, connectionMap: connectionMap2 } = preprocessPipeline(pipeline2);

  const stagesDiffMap: {
    [name: string]: TDeepPartial<IPipelineStage>;
  } = diff(stageMap1, stageMap2);

  const connectionsDiffMap: {
    [name: string]: TDeepPartial<IPipelineConnection>;
  } = diff(connectionMap1, connectionMap2);

  const stagesDiffList: Array<['+' | '-' | '~', string, TDeepPartial<IPipelineStage>]> = [];
  for (const stage in stagesDiffMap) {
    if (stage.match(/__added$/)) {
      stagesDiffList.push(['+', stage.replace(/__added$/, ''), stagesDiffMap[stage]]);
    } else if (stage.match(/__deleted$/)) {
      stagesDiffList.push(['-', stage.replace(/__deleted$/, ''), stagesDiffMap[stage]]);
    } else {
      stagesDiffList.push(['~', stage, stagesDiffMap[stage]]);
    }
  }
  const connectionsDiffList: Array<[
    '+' | '-' | '~',
    string,
    TDeepPartial<IPipelineConnection>
  ]> = [];
  for (const connection in connectionsDiffMap) {
    if (connection.match(/__added$/)) {
      connectionsDiffList.push([
        '+',
        connection.replace(/__added$/, ''),
        connectionsDiffMap[connection],
      ]);
    } else if (connection.match(/__deleted$/)) {
      connectionsDiffList.push([
        '-',
        connection.replace(/__deleted$/, ''),
        connectionsDiffMap[connection],
      ]);
    } else {
      connectionsDiffList.push(['~', connection, connectionsDiffMap[connection]]);
    }
  }
  // TODO: return stagesDiffList AND connectionsDiffList
  return { stagesDiffList, connectionsDiffList };
}
