/*
 * Copyright © 2022 Cask Data, Inc.
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
import uniqBy from 'lodash/uniqBy';
import dagre from 'dagre';
import { MySearchApi } from 'api/search';
import { getMetadataPageUrl } from 'components/Metadata/urlHelper';

const iconMap = new Map([
  ['Flow', 'icon-tigon'],
  ['Mapreduce', 'icon-mapreduce'],
  ['Spark', 'icon-spark'],
  ['Worker', 'icon-worker'],
  ['Workflow', 'icon-workflow'],
  ['Service', 'icon-service'],
]);

interface IRelations {
  program: string;
  data: string;
  accesses: string[];
  runs: string[];
}

interface IEntityId {
  program?: string;
  application?: string;
  type?: string;
  dataset?: string;
  entity: string;
  version?: string;
  namespace: string;
}

export interface ILineageResponse {
  programs: { [key: string]: { entityId: IEntityId } };
  data: { [key: string]: { entityId: IEntityId } };
  relations: IRelations[];
}

interface INodeBase {
  label: string;
  displayType: string;
  nodeType: string;
  icon: string;
  entityType: string;
  entityId: string;
  applicationId?: string;
  runs: string[];
  oldDisplayType: string;
}

interface INode {
  dataId: string;
  uniqueNodeId: string;
  isLeftEdge?: boolean;
  isRightEdge?: boolean;
  uiLocation?: { [key: string]: string };
}

export interface INodeDisplay extends INodeBase, INode {
  link: string;
}

interface IUniqueNode extends INodeBase {
  label: string;
  id: string;
}

interface IUniqueNodes {
  [key: string]: IUniqueNode;
}

interface IConnection {
  source: string;
  target: string;
  type: string;
}

export interface IParsedLineageResponse {
  connections: IConnection[];
  nodes: INodeDisplay[];
  graph: dagre.graphlib.Graph;
}

/**
 * Method to parse lineage API response to get list of nodes, connections & associated graph layout.
 *
 * @param response - Raw lineage API response
 * @param query - Search query.
 * @param params - Search params used.
 * @returns List of nodes, connections & associated graph layout.
 */
export async function secondLineageParser(
  response: ILineageResponse,
  query: string,
  params
): Promise<IParsedLineageResponse> {
  const currentActiveNode = ['dataset', params.namespace, params.entityId].join('.');

  const connections = [];
  const uniqueNodes = {};
  let nodes = [];

  /* SETTING NODES */
  for (const [key, value] of Object.entries(response.programs)) {
    const entityId = value.entityId.program;
    const nodeObj = {
      label: entityId,
      id: key,
      nodeType: 'program',
      applicationId: value.entityId.application,
      entityId,
      entityType: parseProgramType(value.entityId.type),
      displayType: value.entityId.type,
      icon: iconMap.get(value.entityId.type),
      runs: [],
    };
    uniqueNodes[key] = nodeObj;
  }

  for (const [key, value] of Object.entries(response.data)) {
    const data = parseDataInfo(value.entityId);
    const nodeObj = {
      label: data.name,
      id: key,
      nodeType: 'data',
      entityId: data.name,
      entityType: data.type,
      displayType: data.displayType,
      icon: data.icon,
    };
    uniqueNodes[key] = nodeObj;
    if (data.type === 'datasets') {
      const queryParams = {
        namespace: params.namespace,
        entityType: data.type,
        entityId: data.name,
      };
      const propertiesReponse = await MySearchApi.getDatasetProperties(queryParams).toPromise();
      const typeProperty = propertiesReponse.properties.find(
        (property) => property.scope === 'SYSTEM' && property.name === 'type'
      );
      if (typeProperty) {
        const parsedType = typeProperty.value.split('.');
        nodeObj.displayType = parsedType[parsedType.length - 1];
      }
    }
  }

  /* SETTING CONNECTIONS */
  response.relations.forEach((rel) => {
    uniqueNodes[rel.program].runs = uniqueNodes[rel.program].runs.concat(rel.runs);
    uniqueNodes[rel.program].runs = uniqBy(uniqueNodes[rel.program].runs);
    const isUnknownOrBoth = rel.accesses.length > 1;
    if (!isUnknownOrBoth && rel.accesses[0] === 'read') {
      const dataId = rel.data;
      const programId = rel.program;
      connections.push({
        source: dataId,
        target: programId,
        type: 'read',
      });

      nodes.push(
        getNodeProperties(uniqueNodes, query, {
          dataId,
          uniqueNodeId: rel.data,
          isLeftEdge: rel.data !== currentActiveNode,
        })
      );
      nodes.push(
        getNodeProperties(uniqueNodes, query, {
          dataId: programId,
          uniqueNodeId: rel.program,
        })
      );
    }
    if (rel.accesses[0] !== 'read' || isUnknownOrBoth) {
      const dataId = rel.data;
      const programId = rel.program;
      connections.push({
        source: programId,
        target: dataId,
        type: 'write',
      });

      nodes.push(
        getNodeProperties(uniqueNodes, query, {
          dataId,
          uniqueNodeId: rel.data,
          isRightEdge: rel.data !== currentActiveNode,
        })
      );
      nodes.push(
        getNodeProperties(uniqueNodes, query, {
          dataId: programId,
          uniqueNodeId: rel.program,
        })
      );
    }
  });

  nodes = uniqBy(nodes, (node: INode) => node.dataId);
  const graph = getGraphLayout(nodes, connections);
  mapNodesLocation(nodes, graph);

  return {
    connections,
    nodes,
    graph,
  };
}

function getNodeProperties(uniqueNodes: IUniqueNodes, query: string, node: INode): INodeDisplay {
  const nodeInfo = uniqueNodes[node.uniqueNodeId];
  let label = null;
  let displayType = null;
  let link = null;
  let applicationId = null;
  let runs = [];
  let oldDisplayType = null;
  if (nodeInfo.nodeType === 'data') {
    label = nodeInfo.label;
    displayType = nodeInfo.displayType;
    link = getMetadataPageUrl('summary', {
      entityType: nodeInfo.entityType,
      entityId: nodeInfo.entityId,
      query,
    });
  } else if (nodeInfo.nodeType === 'program') {
    displayType = nodeInfo.label;
    oldDisplayType = nodeInfo.displayType;
    applicationId = nodeInfo.applicationId;
    label = applicationId;
    runs = nodeInfo.runs;
  }
  return {
    ...node,
    label,
    displayType,
    oldDisplayType,
    nodeType: nodeInfo.nodeType,
    icon: nodeInfo.icon,
    entityType: nodeInfo.entityType,
    entityId: nodeInfo.entityId,
    link,
    applicationId,
    runs,
  };
}

function parseProgramType(programType: string) {
  switch (programType.toLowerCase()) {
    case 'flow':
    case 'flows':
      return 'flows';
    case 'mapreduce':
      return 'mapreduce';
    case 'spark':
      return 'spark';
    case 'worker':
    case 'workers':
      return 'workers';
    case 'workflow':
    case 'workflows':
      return 'workflows';
    case 'service':
    case 'services':
      return 'services';
  }
}

function parseDataInfo(entityId: IEntityId) {
  if (entityId.entity === 'DATASET') {
    return {
      name: entityId.dataset,
      type: 'datasets',
      icon: 'icon-datasets',
      displayType: 'Dataset',
    };
  }
}

function mapNodesLocation(nodes: INode[], graph: dagre.graphlib.Graph) {
  nodes.forEach((node) => {
    node.uiLocation = {
      top: graph._nodes[node.dataId].y - 20 + 'px', // 20 = half of node height
      left: graph._nodes[node.dataId].x - 90 + 'px', // 90 = half of node width
    };
  });
}

function getGraphLayout(nodes: INode[], connections: IConnection[]) {
  const graph = new dagre.graphlib.Graph();
  graph.setGraph({
    nodesep: 50,
    ranksep: 90,
    rankdir: 'LR',
    marginx: 100,
    marginy: 50,
  });
  graph.setDefaultEdgeLabel(() => ({}));
  nodes.forEach((node) => graph.setNode(node.dataId, { width: 180, height: 60 }));
  connections.forEach((connection) => graph.setEdge(connection.source, connection.target));
  dagre.layout(graph);
  return graph;
}

/**
 * Method to compute graph layout information.
 *
 * @param graph - DAGRE graph instance.
 * @returns Graph's layout information such top, left & transform scale.
 */
export function getScale(graph: dagre.graphlib.Graph) {
  const parentContainerWidth = document.documentElement.clientWidth || 2000;
  if (parentContainerWidth > graph.width) {
    return {
      scale: 1,
      padX: `${(parentContainerWidth - graph.width) / 2}px`,
      padY: 0,
    };
  } else {
    const scale = parentContainerWidth / graph.width;
    return {
      scale,
      padX: `${(graph.width * scale - graph.width) / 2}px`,
      padY: `${(graph.height * scale - graph.height) / 2}px`,
    };
  }
}
