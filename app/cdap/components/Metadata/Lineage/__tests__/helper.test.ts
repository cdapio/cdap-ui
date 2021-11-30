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

import { secondLineageParser, getScale } from 'components/Metadata/Lineage/helper';
import dagre from 'dagre';

jest.disableAutomock();
jest.mock('api/search', () => {
  return {
    MySearchApi: {
      getDatasetProperties: () => ({
        toPromise: () => ({
          properties: [{ scope: 'SYSTEM', name: 'type', value: 'foo.externalDataset' }],
        }),
      }),
    },
  };
});

describe('Lineage helper', () => {
  describe("'secondLineageParser' should", () => {
    const lineageResponse = {
      relations: [
        {
          data: 'dataset.default.logs_data_sink',
          program: 'logs_generator_1631803780361',
          accesses: ['write'],
          runs: ['601bbbd4-16fd-11ec-9c4c-0000009bcbfa'],
        },
        {
          data: 'dataset.default.logs_data_source',
          program: 'logs_generator_1631803780361',
          accesses: ['read'],
          runs: ['601bbbd4-16fd-11ec-9c4c-0000009bcbfa'],
        },
        {
          data: 'dataset.default.logs_data_sink',
          program: 'logs_generator_1633423008833',
          accesses: ['write'],
          runs: ['6e186c64-25b7-11ec-a15e-0000009ac830'],
        },
        {
          data: 'dataset.default.logs_data_sink',
          program: 'logs_generator_1631876521632',
          accesses: ['write'],
          runs: ['bb5cbdb9-17a6-11ec-8070-0000001b79bc'],
        },
        {
          data: 'dataset.default.logs_data_sink',
          program: 'logs_generator_1632120542360',
          accesses: ['write'],
          runs: ['e3656574-19de-11ec-9b5e-000000164571'],
        },
        {
          data: 'dataset.default.logs_data_source',
          program: 'logs_generator_1632120542360',
          accesses: ['read'],
          runs: ['e3656574-19de-11ec-9b5e-000000164571'],
        },
        {
          data: 'dataset.default.logs_data_source',
          program: 'logs_generator_1631876521632',
          accesses: ['read'],
          runs: ['bb5cbdb9-17a6-11ec-8070-0000001b79bc'],
        },
        {
          data: 'dataset.default.logs_data_source',
          program: 'logs_generator_1633423008833',
          accesses: ['read'],
          runs: ['6e186c64-25b7-11ec-a15e-0000009ac830'],
        },
      ],
      programs: {
        logs_generator_1631876521632: {
          entityId: {
            application: 'logs_generator_1631876521632',
            version: '-SNAPSHOT',
            type: 'Workflow',
            program: 'DataPipelineWorkflow',
            namespace: 'default',
            entity: 'PROGRAM',
          },
        },
        logs_generator_1632120542360: {
          entityId: {
            application: 'logs_generator_1632120542360',
            version: '-SNAPSHOT',
            type: 'Workflow',
            program: 'DataPipelineWorkflow',
            namespace: 'default',
            entity: 'PROGRAM',
          },
        },
        logs_generator_1633423008833: {
          entityId: {
            application: 'logs_generator_1633423008833',
            version: '-SNAPSHOT',
            type: 'Workflow',
            program: 'DataPipelineWorkflow',
            namespace: 'default',
            entity: 'PROGRAM',
          },
        },
        logs_generator_1631803780361: {
          entityId: {
            application: 'logs_generator_1631803780361',
            version: '-SNAPSHOT',
            type: 'Workflow',
            program: 'DataPipelineWorkflow',
            namespace: 'default',
            entity: 'PROGRAM',
          },
        },
      },
      data: {
        'dataset.default.logs_data_sink': {
          entityId: { dataset: 'logs_data_sink', namespace: 'default', entity: 'DATASET' },
        },
        'dataset.default.logs_data_source': {
          entityId: { dataset: 'logs_data_source', namespace: 'default', entity: 'DATASET' },
        },
      },
    };
    const searchParams = {
      end: 'now',
      entityId: 'logs_data_sink',
      entityType: 'datasets',
      levels: 1,
      namespace: 'default',
      rollup: 'workflow',
      start: 'now-365d',
    };

    it('return parsed response for given lineage response', async () => {
      const response = await secondLineageParser(lineageResponse, 'logs', searchParams);
      expect(response.connections).toStrictEqual([
        {
          source: 'logs_generator_1631803780361',
          target: 'dataset.default.logs_data_sink',
          type: 'write',
        },
        {
          source: 'dataset.default.logs_data_source',
          target: 'logs_generator_1631803780361',
          type: 'read',
        },
        {
          source: 'logs_generator_1633423008833',
          target: 'dataset.default.logs_data_sink',
          type: 'write',
        },
        {
          source: 'logs_generator_1631876521632',
          target: 'dataset.default.logs_data_sink',
          type: 'write',
        },
        {
          source: 'logs_generator_1632120542360',
          target: 'dataset.default.logs_data_sink',
          type: 'write',
        },
        {
          source: 'dataset.default.logs_data_source',
          target: 'logs_generator_1632120542360',
          type: 'read',
        },
        {
          source: 'dataset.default.logs_data_source',
          target: 'logs_generator_1631876521632',
          type: 'read',
        },
        {
          source: 'dataset.default.logs_data_source',
          target: 'logs_generator_1633423008833',
          type: 'read',
        },
      ]);
      expect(response.graph._nodeCount).toBe(6);
      expect(response.graph._edgeCount).toBe(8);
      expect(response.graph._nodes).toStrictEqual({
        ['dataset.default.logs_data_sink']: {
          height: 60,
          width: 180,
          x: 730,
          y: 245,
        },
        ['dataset.default.logs_data_source']: {
          height: 60,
          width: 180,
          x: 190,
          y: 245,
        },
        logs_generator_1631803780361: {
          height: 60,
          width: 180,
          x: 460,
          y: 80,
        },
        logs_generator_1631876521632: {
          height: 60,
          width: 180,
          x: 460,
          y: 300,
        },
        logs_generator_1632120542360: {
          height: 60,
          width: 180,
          x: 460,
          y: 410,
        },
        logs_generator_1633423008833: {
          height: 60,
          width: 180,
          x: 460,
          y: 190,
        },
      });
      expect(response.nodes).toStrictEqual([
        {
          applicationId: null,
          dataId: 'dataset.default.logs_data_sink',
          displayType: 'externalDataset',
          entityId: 'logs_data_sink',
          entityType: 'datasets',
          icon: 'icon-datasets',
          isRightEdge: false,
          label: 'logs_data_sink',
          link: '/ns//metadata/datasets/logs_data_sink/summary/search/logs',
          nodeType: 'data',
          oldDisplayType: null,
          runs: [],
          uiLocation: { left: '640px', top: '225px' },
          uniqueNodeId: 'dataset.default.logs_data_sink',
        },
        {
          applicationId: 'logs_generator_1631803780361',
          dataId: 'logs_generator_1631803780361',
          displayType: 'DataPipelineWorkflow',
          entityId: 'DataPipelineWorkflow',
          entityType: 'workflows',
          icon: 'icon-workflow',
          label: 'logs_generator_1631803780361',
          link: null,
          nodeType: 'program',
          oldDisplayType: 'Workflow',
          runs: ['601bbbd4-16fd-11ec-9c4c-0000009bcbfa'],
          uiLocation: { left: '370px', top: '60px' },
          uniqueNodeId: 'logs_generator_1631803780361',
        },
        {
          applicationId: null,
          dataId: 'dataset.default.logs_data_source',
          displayType: 'externalDataset',
          entityId: 'logs_data_source',
          entityType: 'datasets',
          icon: 'icon-datasets',
          isLeftEdge: true,
          label: 'logs_data_source',
          link: '/ns//metadata/datasets/logs_data_source/summary/search/logs',
          nodeType: 'data',
          oldDisplayType: null,
          runs: [],
          uiLocation: { left: '100px', top: '225px' },
          uniqueNodeId: 'dataset.default.logs_data_source',
        },
        {
          applicationId: 'logs_generator_1633423008833',
          dataId: 'logs_generator_1633423008833',
          displayType: 'DataPipelineWorkflow',
          entityId: 'DataPipelineWorkflow',
          entityType: 'workflows',
          icon: 'icon-workflow',
          label: 'logs_generator_1633423008833',
          link: null,
          nodeType: 'program',
          oldDisplayType: 'Workflow',
          runs: ['6e186c64-25b7-11ec-a15e-0000009ac830'],
          uiLocation: { left: '370px', top: '170px' },
          uniqueNodeId: 'logs_generator_1633423008833',
        },
        {
          applicationId: 'logs_generator_1631876521632',
          dataId: 'logs_generator_1631876521632',
          displayType: 'DataPipelineWorkflow',
          entityId: 'DataPipelineWorkflow',
          entityType: 'workflows',
          icon: 'icon-workflow',
          label: 'logs_generator_1631876521632',
          link: null,
          nodeType: 'program',
          oldDisplayType: 'Workflow',
          runs: ['bb5cbdb9-17a6-11ec-8070-0000001b79bc'],
          uiLocation: { left: '370px', top: '280px' },
          uniqueNodeId: 'logs_generator_1631876521632',
        },
        {
          applicationId: 'logs_generator_1632120542360',
          dataId: 'logs_generator_1632120542360',
          displayType: 'DataPipelineWorkflow',
          entityId: 'DataPipelineWorkflow',
          entityType: 'workflows',
          icon: 'icon-workflow',
          label: 'logs_generator_1632120542360',
          link: null,
          nodeType: 'program',
          oldDisplayType: 'Workflow',
          runs: ['e3656574-19de-11ec-9b5e-000000164571'],
          uiLocation: { left: '370px', top: '390px' },
          uniqueNodeId: 'logs_generator_1632120542360',
        },
      ]);
    });
  });

  describe("'getScale' should", () => {
    function getGraph() {
      const graph = new dagre.graphlib.Graph();
      graph.setGraph({
        nodesep: 50,
        ranksep: 90,
        rankdir: 'LR',
        marginx: 100,
        marginy: 50,
      });
      graph.setDefaultEdgeLabel(() => ({}));
      dagre.layout(graph);
      return graph;
    }
    it('return graph co-ordinates for graphs lesser than container width', () => {
      const graph = getGraph().graph();
      graph.width = 1000;
      graph.height = 500;
      expect(getScale(graph)).toStrictEqual({
        scale: 1,
        padX: '500px',
        padY: 0,
      });
    });
    it('return graph co-ordinates for graphs bigger than container width', () => {
      const graph = getGraph().graph();
      graph.width = 2000;
      graph.height = 500;
      expect(getScale(graph)).toStrictEqual({
        scale: 1,
        padX: '0px',
        padY: '0px',
      });
    });
  });
});
