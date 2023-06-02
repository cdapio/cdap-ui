/*
 * Copyright © 2015-2017 Cask Data, Inc.
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

class HydratorPlusPlusCreateCanvasCtrl {
  constructor(DAGPlusPlusNodesStore, HydratorPlusPlusConfigStore, HydratorPlusPlusHydratorService, $uibModal, GLOBALS, DAGPlusPlusNodesActionsFactory, HydratorPlusPlusPreviewStore, $scope) {
    this.DAGPlusPlusNodesStore = DAGPlusPlusNodesStore;
    this.HydratorPlusPlusConfigStore = HydratorPlusPlusConfigStore;
    this.HydratorPlusPlusHydratorService = HydratorPlusPlusHydratorService;
    this.DAGPlusPlusNodesActionsFactory = DAGPlusPlusNodesActionsFactory;
    this.GLOBALS = GLOBALS;
    this.previewStore = HydratorPlusPlusPreviewStore;
    this.$uibModal = $uibModal;

    this.nodes = [];
    this.connections = [];
    this.previewMode = false;
    this.nodeConfigModalOpen = false;
    this.updateNodesStoreNodes = this.updateNodesStoreNodes.bind(this);
    this.updateNodesStoreConnections = this.updateNodesStoreConnections.bind(this);
    this.openPluginProperties = this.openPluginProperties.bind(this);
    this.getConnections = this.getConnections.bind(this);
    this.getNodes = this.getNodes.bind(this);

    DAGPlusPlusNodesStore.registerOnChangeListener(() => {
      this.setActiveNode();
      this.setStateAndUpdateConfigStore();
    });

    let unsub = this.previewStore.subscribe(() => {
      let state = this.previewStore.getState().preview;
      this.previewMode = state.isPreviewModeEnabled;
    });

    $scope.$on('$destroy', () => {
      unsub();
    });
  }

  setStateAndUpdateConfigStore() {
    this.nodes = this.DAGPlusPlusNodesStore.getNodes();
    this.connections = this.DAGPlusPlusNodesStore.getConnections();
    this.HydratorPlusPlusConfigStore.setNodes(this.nodes);
    this.HydratorPlusPlusConfigStore.setConnections(this.connections);
  }

  getConnections() {
    return this.HydratorPlusPlusConfigStore.getConnections();
  }

  getNodes() {
    return this.HydratorPlusPlusConfigStore.getNodes();
  }

  updateNodesStoreNodes(nodes) {
    this.nodes = nodes;
    this.DAGPlusPlusNodesStore.setNodes(nodes);
    this.HydratorPlusPlusConfigStore.setNodes(this.nodes);
  }

  updateNodesStoreConnections(connections) {
    this.connections = connections;
    this.DAGPlusPlusNodesStore.setConnections(connections);
    this.HydratorPlusPlusConfigStore.setConnections(this.connections);
  }

  openPluginProperties(node) {
    window.CaskCommon.PipelineMetricsActionCreator.setMetricsTabActive(false);
    window.CaskCommon.PipelineMetricsActionCreator.setSelectedPlugin(node.type, node.plugin.name);
    this.DAGPlusPlusNodesActionsFactory.selectNode(node.name);
  }

  setActiveNode() {
    var nodeId = this.DAGPlusPlusNodesStore.getActiveNodeId();
    if (!nodeId || this.nodeConfigModalOpen) {
      return;
    }
    var pluginNode;
    var nodeFromNodesStore;
    var nodeFromConfigStore = this.HydratorPlusPlusConfigStore.getNodes().filter( node => node.name === nodeId );
    if (nodeFromConfigStore.length) {
      pluginNode = nodeFromConfigStore[0];
    } else {
      nodeFromNodesStore = this.DAGPlusPlusNodesStore.getNodes().filter(node => node.name === nodeId);
      pluginNode = nodeFromNodesStore[0];
    }

    this.$uibModal
        .open({
          windowTemplateUrl: '/assets/features/hydrator/templates/partial/node-config-modal/popover-template.html',
          templateUrl: '/assets/features/hydrator/templates/partial/node-config-modal/popover.html',
          size: 'lg',
          windowClass: 'node-config-modal hydrator-modal',
          controller: 'HydratorPlusPlusNodeConfigCtrl',
          bindToController: true,
          controllerAs: 'HydratorPlusPlusNodeConfigCtrl',
          animation: false,
          backdrop: 'static',
          resolve: {
            rIsStudioMode: function () {
              return true;
            },
            rNodeMetricsContext: function () {
              return false;
            },
            rDisabled: function() {
              return false;
            },
            rPlugin: ['HydratorPlusPlusConfigStore', function(HydratorPlusPlusConfigStore) {
              let pluginId = pluginNode.name;
              let appType = HydratorPlusPlusConfigStore.getAppType();
              let sourceConnections = HydratorPlusPlusConfigStore.getSourceConnections(pluginId);
              let sourceNodes = HydratorPlusPlusConfigStore.getSourceNodes(pluginId);
              let artifactVersion = HydratorPlusPlusConfigStore.getArtifact().version;
              return {
                pluginNode,
                appType,
                sourceConnections,
                sourceNodes,
                artifactVersion,
              };
            }]
          }
        })
        .result
        .then(this.modalCallback.bind(this), this.modalCallback.bind(this)); // Both close and ESC events in the modal are considered as SUCCESS and ERROR in promise callback. Hence the same callback for both success & failure.

    this.nodeConfigModalOpen = true;
  }

  modalCallback() {
    this.deleteNode();
    this.nodeConfigModalOpen = false;
  }

  deleteNode() {
    this.DAGPlusPlusNodesActionsFactory.resetSelectedNode();
    this.setStateAndUpdateConfigStore();
  }
}
HydratorPlusPlusCreateCanvasCtrl.$inject = ['DAGPlusPlusNodesStore', 'HydratorPlusPlusConfigStore', 'HydratorPlusPlusHydratorService', '$uibModal', 'GLOBALS', 'DAGPlusPlusNodesActionsFactory', 'HydratorPlusPlusPreviewStore', '$scope'];

angular.module(PKG.name + '.feature.hydrator')
  .controller('HydratorPlusPlusCreateCanvasCtrl', HydratorPlusPlusCreateCanvasCtrl);
