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
import { getNodesFromStages } from 'services/helpers';

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

export function computePipelineDiff(pipeline1, pipeline2) {
  return [];
}
