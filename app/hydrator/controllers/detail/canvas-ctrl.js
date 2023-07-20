/*
 * Copyright © 2016-2018 Cask Data, Inc.
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
import { rPipelineDetails } from 'components/hydrator/helpers/rPipeline';

angular.module(PKG.name + '.feature.hydrator')
  .controller('HydratorPlusPlusDetailCanvasCtrl', PipeCanvasCtrl);
  
  
export const PipeCanvasCtrl = function(
  // rPipelineDetail,
  $rootScope, myAlertOnValium,
  DAGPlusPlusNodesActionsFactory, HydratorPlusPlusHydratorService, DAGPlusPlusNodesStore, $uibModal, MyPipelineStatusMapper, moment, $interval, myHelpers
) {
  this.$uibModal = $uibModal;
  var $scope = $rootScope.$new(true, undefined);

  this.DAGPlusPlusNodesStore = DAGPlusPlusNodesStore;
  this.PipelineDetailStore = window.CaskCommon.PipelineDetailStore;
  this.HydratorPlusPlusHydratorService = HydratorPlusPlusHydratorService;
  this.PipelineMetricsStore = window.CaskCommon.PipelineMetricsStore;
  this.DAGPlusPlusNodesActionsFactory = DAGPlusPlusNodesActionsFactory;
  this.MyPipelineStatusMapper = MyPipelineStatusMapper;
  this.$interval = $interval;
  this.moment = moment;
  this.currentRunTimeCounter = null;
  this.metrics = {};
  this.logsMetrics = {};
  this.runId = '';
  // try {
  //   rPipelineDetail.config = JSON.parse(rPipelineDetail.configuration);
  // } catch (e) {
  //   console.log('ERROR in configuration from backend: ', e);
  //   return;
  // }

  const { globalEvents } = window.CaskCommon;
  this.eventEmitter = window.CaskCommon.ee(window.CaskCommon.ee);
  this.pageLevelError = null;

  this.eventEmitter.on(globalEvents.PAGE_LEVEL_ERROR, (error) => {
    if (error.reset === true) {
      this.pageLevelError = null;
    }
    else {
      this.pageLevelError = myHelpers.handlePageLevelError(error);
    }
  });

  rPipelineDetails($rootScope.$stateParams.namespace, myAlertOnValium).then((rPipelineDetail) => {
    try {
      rPipelineDetail.config = JSON.parse(rPipelineDetail.configuration);
    } catch (e) {
      console.log('ERROR in configuration from backend: ', e);
      return;
    }
    let pipelineConfig = rPipelineDetail.config;
    let nodes = this.HydratorPlusPlusHydratorService.getNodesFromStages(pipelineConfig.stages);

    this.DAGPlusPlusNodesActionsFactory.createGraphFromConfig(nodes, pipelineConfig.connections, pipelineConfig.comments);

    this.updateNodesAndConnections = function () {
      var activeNode = this.DAGPlusPlusNodesStore.getActiveNodeId();
      if (!activeNode) {
        this.deleteNode();
      } else {
        this.setActiveNode();
      }
    };

    this.setActiveNode = function() {
      // need to use new config and nodes
      pipelineConfig = this.PipelineDetailStore.getState().config;
      nodes = this.HydratorPlusPlusHydratorService.getNodesFromStages(pipelineConfig.stages);
      var nodeId = this.DAGPlusPlusNodesStore.getActiveNodeId();
      if (!nodeId) {
        return;
      }
      let pluginNode = nodes.find(node => node.name === nodeId);
      this.$uibModal.open({
        windowTemplateUrl: '/assets/features/hydrator/templates/partial/node-config-modal/popover-template.html',
        templateUrl: '/assets/features/hydrator/templates/partial/node-config-modal/popover.html',
        size: 'lg',
        backdrop: 'static',
        windowTopClass: 'node-config-modal hydrator-modal',
        controller: 'HydratorPlusPlusNodeConfigCtrl',
        controllerAs: 'HydratorPlusPlusNodeConfigCtrl',
        resolve: {
          rIsStudioMode: function () {
            return false;
          },
          rDisabled: function() {
            return true;
          },
          rNodeMetricsContext: function($stateParams, GLOBALS) {
            'ngInject';
            let pipelineDetailStoreState = window.CaskCommon.PipelineDetailStore.getState();
            let programType = pipelineDetailStoreState.artifact.name === GLOBALS.etlDataPipeline ? 'workflow' : 'spark';
            let programId = pipelineDetailStoreState.artifact.name === GLOBALS.etlDataPipeline ? 'DataPipelineWorkflow' : 'DataStreamsSparkStreaming';

            return {
              runRecord: pipelineDetailStoreState.currentRun,
              runs: pipelineDetailStoreState.runs,
              namespace: $stateParams.namespace,
              app: pipelineDetailStoreState.name,
              programType,
              programId
            };
          },
          rPlugin: function(HydratorPlusPlusHydratorService) {
            'ngInject';
            let pluginId = pluginNode.name;
            let pipelineDetailStoreState = window.CaskCommon.PipelineDetailStore.getState();
            let appType = pipelineDetailStoreState.artifact.name;
            let sourceConnections = pipelineDetailStoreState.config.connections.filter(conn => conn.to === pluginId);
            let nodes = HydratorPlusPlusHydratorService.getNodesFromStages(pipelineDetailStoreState.config.stages);
            let nodesMap = HydratorPlusPlusHydratorService.getNodesMap(nodes);
            let sourceNodes = sourceConnections.map(conn => nodesMap[conn.from]);
            let artifactVersion = pipelineDetailStoreState.artifact.version;
            return {
              pluginNode,
              appType,
              sourceConnections,
              sourceNodes,
              artifactVersion,
            };
          }
        }
      })
      .result
      .then(this.deleteNode.bind(this), this.deleteNode.bind(this)); // Both close and ESC events in the modal are considered as SUCCESS and ERROR in promise callback. Hence the same callback for both success & failure.
    };

    this.deleteNode = () => {
      this.DAGPlusPlusNodesActionsFactory.resetSelectedNode();
    };

    function convertMetricsArrayIntoObject(arr) {
      var obj = {};

      angular.forEach(arr, function (item) {
        obj[item.nodeName] = {
          recordsOut: item.recordsOut,
          recordsIn: item.recordsIn,
          recordsError: item.recordsError
        };
      });

      return obj;
    }

    this.pipelineMetricsStoreSubscription = this.PipelineMetricsStore.subscribe(() => {
      this.metrics = convertMetricsArrayIntoObject(this.PipelineMetricsStore.getState().metrics);
      this.logsMetrics = this.PipelineMetricsStore.getState().logsMetrics;

      // Not sure why sometimes digest cycles are not kicked off, even though the above values have changed
      // Use $evalAsync here to make sure a digest cycle is kicked off.
      // 'Safe' way to $apply, similar to $timeout
      // https://www.panda-os.com/blog/2015/01/angularjs-apply-digest-and-evalasync/
      $scope.$evalAsync();
    });

    this.pipelineDetailStoreSubscription = this.PipelineDetailStore.subscribe(() => {
      let pipelineDetailStoreState = this.PipelineDetailStore.getState();
      let runs = pipelineDetailStoreState.runs;
      if (runs.length) {
        this.currentRun = pipelineDetailStoreState.currentRun;
        if (_.isEmpty(this.currentRun)) {
          this.currentRun = runs[0];
        }
        let status = this.MyPipelineStatusMapper.lookupDisplayStatus(this.currentRun.status);
        this.$interval.cancel(this.currentRunTimeCounter);
        if (status === 'Running') {
          this.currentRunTimeCounter = this.$interval(() => {
            let duration = window.CaskCommon.CDAPHelpers.humanReadableDuration(Math.floor(Date.now() / 1000) - this.currentRun.starting);
            this.currentRun = Object.assign({}, this.currentRun, {
              duration
            });
          }, 1000);
        }
        let timeDifference = this.currentRun.end ? this.currentRun.end - this.currentRun.starting : Math.floor(Date.now() / 1000) - this.currentRun.starting;
        this.currentRun = Object.assign({}, this.currentRun, {
          duration: window.CaskCommon.CDAPHelpers.humanReadableDuration(timeDifference),
          startTime: this.currentRun.start ? this.moment(this.currentRun.start * 1000).format('hh:mm:ss a') : null,
          starting: !this.currentRun.starting ? this.moment(this.currentRun.starting * 1000).format('hh:mm:ss a') : null,
          statusCssClass: this.MyPipelineStatusMapper.getStatusIndicatorClass(status),
          status
        });
        let reversedRuns = window.CaskCommon.CDAPHelpers.reverseArrayWithoutMutating(runs);
        let runNumber = _.findIndex(reversedRuns, {runid: this.currentRun.runid});
        this.runId = this.currentRun.runid;
        this.currentRunIndex = runNumber + 1;
        this.totalRuns = runs.length;
      }
    });

    DAGPlusPlusNodesStore.registerOnChangeListener(this.setActiveNode.bind(this));

    $scope.$on('$destroy', () => {
      this.pipelineMetricsStoreSubscription();
      this.pipelineDetailStoreSubscription();
    });
  });
};

