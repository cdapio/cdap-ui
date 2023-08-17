/*
 * Copyright © 2017 Cask Data, Inc.
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

import { MyProgramApi } from 'api/program';
import PipelineSummaryStore, {
  PIPELINESSUMMARYACTIONS,
} from 'components/PipelineSummary/Store/PipelineSummaryStore';
import { MyMetricApi } from 'api/metric';
import { convertProgramToMetricParams } from 'services/program-api-converter';
import { objectQuery } from 'services/helpers';
import isNil from 'lodash/isNil';
import cloneDeep from 'lodash/cloneDeep';

function setRuns(runs) {
  PipelineSummaryStore.dispatch({
    type: PIPELINESSUMMARYACTIONS.SETRUNS,
    payload: {
      runs: runs.map((run) => ({
        runid: run.runid,
        start: run.start,
        starting: run.starting,
        end: run.end,
        // If the pipeline is starting there is either start nor end times.
        duration: isNil(run.end)
          ? Math.ceil(Date.now() / 1000) - run.starting
          : run.end - run.starting,
        status: run.status,
      })),
    },
  });
}

function fetchMetrics({ namespaceId, appId, programType, programId }, metrics) {
  const { runs } = PipelineSummaryStore.getState().pipelinerunssummary;
  const postBody = {};
  runs.forEach((run) => {
    postBody[`qid_${run.runid}`] = {
      tags: {
        namespace: namespaceId,
        app: appId,
        [convertProgramToMetricParams(programType)]: programId,
        run: run.runid,
      },
      metrics,
      timeRange: {
        aggregate: 'true',
      },
    };
  });
  return MyMetricApi.query(null, postBody);
}

function updateMetrics(metrics, mapKey = 'metrics') {
  const modMetrics = {};
  Object.keys(metrics).forEach((key) => {
    const runId = key.replace('qid_', '');
    modMetrics[runId] = { [mapKey]: {} };
    metrics[key].series.forEach((metricObj) => {
      modMetrics[runId][mapKey][metricObj.metricName] = objectQuery(
        metricObj,
        'data',
        0,
        'value'
      );
    });
  });
  let { runs } = PipelineSummaryStore.getState().pipelinerunssummary;
  runs = runs.map((run) => {
    const runid = run.runid;
    return Object.assign({}, run, modMetrics[runid]);
  });
  PipelineSummaryStore.dispatch({
    type: PIPELINESSUMMARYACTIONS.SETRUNS,
    payload: {
      runs,
    },
  });
}

function updateNodeMetrics(pipelineConfig) {
  const { runs } = PipelineSummaryStore.getState().pipelinerunssummary;
  let nodesMap = {
    recordsin: {},
    recordsout: {},
  };
  const sourcePluginTypes = [
    'batchsource',
    'realtimesource',
    'streamingsource',
  ];
  const sinkPluginTypes = ['batchsink', 'realtimesink', 'sparksink'];
  const sourcePlugins = [];
  const sinkPlugins = [];
  pipelineConfig.config.stages.forEach((stage) => {
    nodesMap.recordsin[stage.name] = [];
    nodesMap.recordsout[stage.name] = [];
    if (sourcePluginTypes.indexOf(stage.plugin.type) !== -1) {
      sourcePlugins.push(stage.name);
    }
    if (sinkPluginTypes.indexOf(stage.plugin.type) !== -1) {
      sinkPlugins.push(stage.name);
    }
  });
  /*
    Sample node metrics:
      {
        "user.TPFSAvro.records.out": 40,
        "user.TPFSAvro.records.in": 40,
        "user.File.records.in": 40,
        "user.File.records.out": 40,
      }
    Sample nodesMap:
      {
        recordsin: {
          TPFSAvro: [run records],
          File: [run records]
        },
        recordsout: {
          TPFSAvro: [run records],
          File: [run records]
        }
      }
  */
  const getNodesMetricsMapRecords = (run, nodesMap, type = '.records.in') => {
    const cleanUpRegex = /\user.|\.records\.out|\.records\.in/gi;
    const getNodeLabel = (node) => node.replace(cleanUpRegex, () => '');
    const nodesCount = Object.keys(nodesMap);
    const metricsCount = Object.keys(run.nodesMetrics);
    const defaultMetrics = {};
    Object.keys(nodesMap).map((n) => (defaultMetrics[`user.${n}${type}`] = 0));
    let nodesWithMetrics = run.nodesMetrics;
    if (!nodesCount.length || nodesCount.length !== metricsCount.length) {
      nodesWithMetrics = Object.assign({}, defaultMetrics, run.nodesMetrics);
    }
    return Object.keys(nodesWithMetrics)
      .filter(
        (node) =>
          node.indexOf(type) !== -1 && !isNil(nodesMap[getNodeLabel(node)])
      )
      .map((node) => ({
        [getNodeLabel(node)]: run.nodesMetrics[node] || 0,
      }));
  };
  const addRunRecordTo = (map, node, run) => {
    const nodeLabel = Object.keys(node).pop();
    const runRecord = Object.assign({}, run, {
      numberOfRecords: node[nodeLabel],
    });
    map[nodeLabel].push(runRecord);
  };
  runs.forEach((run) => {
    getNodesMetricsMapRecords(
      run,
      nodesMap.recordsin,
      '.records.in'
    ).forEach((nodeMetricMap) =>
      addRunRecordTo(nodesMap.recordsin, nodeMetricMap, cloneDeep(run))
    );
    getNodesMetricsMapRecords(
      run,
      nodesMap.recordsout,
      '.records.out'
    ).forEach((nodeMetricMap) =>
      addRunRecordTo(nodesMap.recordsout, nodeMetricMap, cloneDeep(run))
    );
  });
  const recordsInNonSourcePluginsMap = {};
  const recordsOutNoneSinkPluginsMap = {};
  Object.keys(nodesMap.recordsin)
    .filter((node) => sourcePlugins.indexOf(node) === -1)
    .forEach((node) => {
      recordsInNonSourcePluginsMap[node] = nodesMap.recordsin[node];
    });
  Object.keys(nodesMap.recordsout)
    .filter((node) => sinkPlugins.indexOf(node) === -1)
    .forEach((node) => {
      recordsOutNoneSinkPluginsMap[node] = nodesMap.recordsout[node];
    });
  nodesMap = {
    recordsin: recordsInNonSourcePluginsMap,
    recordsout: recordsOutNoneSinkPluginsMap,
  };

  PipelineSummaryStore.dispatch({
    type: PIPELINESSUMMARYACTIONS.SETNODESMETRICSMAP,
    payload: {
      nodesMap,
    },
  });
}

function fetchSummary({
  namespaceId,
  appId,
  programType,
  programId,
  pipelineConfig,
  limit = -1,
  start = -1,
  end = -1,
}) {
  let params = {
    namespace: namespaceId,
    appId,
    programType,
    programId,
  };
  PipelineSummaryStore.dispatch({
    type: PIPELINESSUMMARYACTIONS.SETLOADING,
    payload: {
      loading: true,
    },
  });
  const addProperty = (propertyValue, propertyName) => {
    if (propertyValue === -1) {
      return {};
    }
    return { [propertyName]: propertyValue };
  };
  params = Object.assign(
    {},
    params,
    addProperty(limit, 'limit'),
    addProperty(start, 'start'),
    addProperty(end, 'end')
  );
  MyProgramApi.runs(params).subscribe((runs) => {
    setRuns(runs);
    const logMetrics = [
      'system.app.log.error',
      'system.app.log.warn',
      'system.app.log.info',
      'system.app.log.debug',
      'system.app.log.trace',
    ];
    let nodeMetrics = [];
    pipelineConfig.config.stages.forEach((node) => {
      nodeMetrics = nodeMetrics.concat([
        `user.${node.name}.records.in`,
        `user.${node.name}.records.out`,
      ]);
    });
    PipelineSummaryStore.dispatch({
      type: PIPELINESSUMMARYACTIONS.SETNODEMETRICSLOADING,
      payload: {
        nodemetricsloading: true,
      },
    });
    fetchMetrics(params, logMetrics).subscribe((logsMetrics) =>
      updateMetrics(logsMetrics, 'logsMetrics')
    );
    fetchMetrics(params, nodeMetrics).subscribe((nodesMetrics) => {
      updateMetrics(nodesMetrics, 'nodesMetrics');
      updateNodeMetrics(pipelineConfig);
    });
  });
}

export { fetchSummary };
