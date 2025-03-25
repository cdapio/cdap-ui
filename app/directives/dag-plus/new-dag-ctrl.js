/*
 * Copyright © 2025 Cask Data, Inc.
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

angular.module(PKG.name + '.commons')
  .controller('DAGPlusPlusCtrlV2', function MyDAGController(jsPlumb, $scope, $timeout, DAGPlusPlusFactory, GLOBALS, DAGPlusPlusNodesActionsFactory, $window, DAGPlusPlusNodesStore, $rootScope, $modifiedPopover, uuid, DAGPlusPlusNodesDispatcher, NonStorePipelineErrorFactory, AvailablePluginsStore, myHelpers, HydratorPlusPlusCanvasFactory, HydratorPlusPlusConfigStore, HydratorPlusPlusPreviewActions, HydratorPlusPlusPreviewStore) {

    var vm = this;
    vm.newDagEditor = () => true;

    vm.updateNode = function (nodeid, config) {
      DAGPlusPlusNodesActionsFactory.updateNode(nodeid, config);
    }

    var dispatcher = DAGPlusPlusNodesDispatcher.getDispatcher();
    var undoListenerId = dispatcher.register('onUndoActions', resetEndpointsAndConnections);
    var redoListenerId = dispatcher.register('onRedoActions', resetEndpointsAndConnections);

    const SHOW_METRICS_THRESHOLD = 0.8;
    const separation = $scope.separation || 200; // node separation length

    vm.isDisabled = $scope.isDisabled;
    vm.disableNodeClick = $scope.disableNodeClick;

    var metricsPopovers = {};
    var selectedConnections = [];
    let conditionNodes = [];
    let normalNodes = [];
    let splitterNodesPorts = {};

    vm.pluginsMap = AvailablePluginsStore.getState().plugins.pluginsMap;
    vm.adjacencyMap = DAGPlusPlusNodesStore.getAdjacencyMap();

    vm.scale = 1.0;
    vm.panning = {
      style: {
        'top': 0,
        'left': 0
      },
      top: 0,
      left: 0
    };

    vm.setCanvasPanning = (top, left) => {
      vm.panning.top = top;
      vm.panning.left = left;

      vm.panning.style = {
        'top': vm.panning.top + 'px',
        'left': vm.panning.left + 'px'
      };
    };

    vm.onViewportChange = function (viewport) {
      vm.scale = viewport.zoom || 1;
      vm.setCanvasPanning(viewport.y, viewport.x);
    }

    vm.nodeMenuOpen = null;
    vm.selectedNode = [];
    vm.activePluginToComment = null;
    vm.doesStagesHaveComments = false;

    var nodesTimeout,
        fitToScreenTimeout,
        initTimeout,
        metricsPopoverTimeout,
        resetTimeout,
        highlightSelectedNodeConnectionsTimeout;

    var Mousetrap = window.CaskCommon.Mousetrap;

    vm.checkIfAnyStageHasComment = () => {
      const existingStages = DAGPlusPlusNodesStore.getNodes();
      return !_.isEmpty(
        existingStages.find(
          (node) =>
            Array.isArray(myHelpers.objectQuery(node, 'information', 'comments', 'list')) && node.information.comments.list.length > 0
        )
      );
    };

    vm.clearSelectedNodes = () => {
      vm.selectedNode = [];
    };

    vm.selectNode = (event, node) => {
      if (vm.isDisabled) { return; }
      const isMultipleNodesDragged = document.querySelectorAll('.jsplumb-drag-selected');
      const isNodeAlreadyInSelection = vm.selectedNode.find(selectedNode => selectedNode.id === node.id);
      event.stopPropagation();

      /**
       * When users selects a bunch of nodes jsplumb adds jsplumb-drag-selected class to the nodes.
       *
       * After selecting the nodes, the user will click on one of the nodes and drag the selection around the canvas.
       * The click on the node shouldn't be considered as node selection. Hence we check if multiple nodes are being
       * dragged and if so just repaint instead of clearing out all selection and selecting that particular node.
       */
      if (isMultipleNodesDragged && isMultipleNodesDragged.length && isNodeAlreadyInSelection) {
        return;
      }

      // If user clicks on a node with command/ctrl key pressed, keep adding the nodes the selection.
      if (vm.selectionBox.isMultiSelectEnabled) {
        vm.selectedNode.push(node);
        vm.highlightSelectedNodeConnections();
      } else {
        vm.selectedNode = [node];
        clearConnectionsSelection();
      }
    };

    vm.getSelectedNodes = () => vm.selectedNode;

    vm.getSelectedConnections = () => {
      const connectionsMap = {};
      $scope.connections.forEach(conn => {
        connectionsMap[`${conn.from}###${conn.to}`] = conn;
      });
      return selectedConnections
        .map(({source, target}) => {
          return {
            from: source.getAttribute('data-nodeid'),
            to: target.getAttribute('data-nodeid'),
          };
        }).map(({from, to}) => {
          const originalConnection = connectionsMap[`${from}###${to}`];
          if (originalConnection) {
            return originalConnection;
          }
          return {from, to};
        });
    };
    vm.deleteSelectedNodes = () => vm.onKeyboardDelete();
    vm.onPluginContextMenuOpen = (nodeId) => {
      const isNodeAlreadySelected = vm.selectedNode.find(n => n.id === nodeId);
      if (isNodeAlreadySelected) {
        return;
      }
      const node = DAGPlusPlusNodesStore.getNodes().find(n => n.id === nodeId);
      if (!node) {
        return;
      }
      vm.selectedNode = [node];
      clearConnectionsSelection();
    };
    vm.isNodeSelected = (nodeName) => {
      if (!vm.selectedNode.length) {
        return false;
      }
      return vm.selectedNode.filter(node => node.id === nodeName).length > 0;
    };

    /**
     * Selection is for multi-select nodes/connections in the pipeline.
     *
     * toggle -
     *   This flag flips the mode between selection mode and move mode. We basically disable
     * dragging for the diagram-container and allow the <selection-box> to take
     * over the user selection
     *
     * isMultiSelectEnabled -
     *   This flag is used when user clicks on command/ctrl and manually selects
     * individual nodes. This is a separate flag as when user selects a node we should
     * be able to differentiate between the normal selection (just clicking on a node)
     * vs command+click in which case the nodes selection behavior is slightly different.
     * The difference should be evident in the vm.selectNodes function
     *
     * isSelectionInProgress -
     *   This flag is used to track if the user is currently selecting a bunch of nodes.
     * We need this flag to be able to easily go between selecting nodes and then clicking
     * on canvas to reset all the selection. This should be more evident in vm.handleCanvasClick
     * function.
     */
    vm.selectionBox = {
      boundaries: ['#diagram-container'],
      selectables: ['.box'],
      /**
       * It makes sense to have the events start -> move -> end to happen
       * in linear order. However under rare circumstances (cypress) this can
       * be out of order, meaning move gets fired before start event callback
       * is fired. The `isSelectionInProgress` is a catch all to make sure no
       * matter what the sequence of callback happens it is right.
       */
      isSelectionInProgress: false,
      toggle: vm.isDisabled ? false : true,
      isMultiSelectEnabled: false,
      start: () => {
        if (!vm.selectionBox.isSelectionInProgress) {
          vm.clearSelectedNodes();
          clearConnectionsSelection();
          vm.selectionBox.isSelectionInProgress = true;
        }
      },
      move: ({selected}) => {
        if (!vm.selectionBox.isSelectionInProgress) {
          vm.selectionBox.isSelectionInProgress = true;
        }
        const selectedNodes = $scope.nodes.filter(node => {
          if (selected.indexOf(node.id) !== -1) {
            return true;
          }
          return false;
        });

        /**
         * This has to be efficient for us to be able to handle large pipelines.
         *
         * Current implementation:
         *
         * I/P : nodes selected
         * 1. Get selected nodes from selection box.
         * 2. Get the adjacency map for the current graph
         * 3. Then iterate through selected nodes and for each node get all nodes connected to it from the adjacency map
         * 4. In the iteration if both the current selected node and the nodes connected to it are
         *    in the list of selected nodes then select the connection. This is where we use the
         *    selectedNodesMap to make a lookup.
         *
         */
        vm.selectedNode = selectedNodes;
        vm.highlightSelectedNodeConnections();
      },
      toggleSelectionMode: () => {
        if (!vm.selectionBox.toggle) {
          vm.selectionBox.toggle = true;
        } else {
          vm.selectionBox.toggle = false;
        }
      }
    };

    const repaintTimeoutsMap = {};

    vm.pipelineArtifactType = HydratorPlusPlusConfigStore.getAppType();

    vm.highlightSelectedNodeConnections = () => {
      const selectedNodesMap = {};
      vm.selectedNode.forEach(node => selectedNodesMap[node.id] = true);
      const adjacencyMap = DAGPlusPlusNodesStore.getAdjacencyMap();
      clearConnectionsSelection();
      vm.selectedNode.forEach(({id, name}) => {
        const connectedNodes = adjacencyMap[id];
        if (!Array.isArray(connectedNodes)) {
          return;
        }
        const connectionsFromSource = $scope.connections;
        connectedNodes.forEach(nodeId => {
          if (!selectedNodesMap[nodeId]) {
            return;
          }
          const connObj = connectionsFromSource.filter(conn => conn.source.getAttribute('data-nodeid') === name && conn.targetId === nodeId);
          if (connObj.length) {
            connObj.forEach(toggleConnection);
          }
        });
      });
    };

    vm.onPipelineContextMenuPaste = ({nodes, connections}) => {
      if (!Array.isArray(nodes) || !Array.isArray(connections)) {
        return;
      }
      vm.clearSelectedNodes();
      clearConnectionsSelection();
      let {nodes: newNodes, connections: newConnections} = sanitizeNodesAndConnectionsBeforePaste({nodes, connections});
      vm.selectedNode = newNodes;
      newNodes = [...$scope.nodes, ...newNodes];
      newConnections  = [...$scope.connections, ...newConnections];
      DAGPlusPlusNodesActionsFactory.createGraphFromConfigOnPaste(newNodes, newConnections);
      init();
      $timeout.cancel(highlightSelectedNodeConnectionsTimeout);
      highlightSelectedNodeConnectionsTimeout = $timeout(() => vm.highlightSelectedNodeConnections());
      try {
        $scope.$digest();
      } catch(e) {
        return;
      }
    };

    vm.getPluginConfiguration = () => {
      if (!vm.selectedNode.length) {
        return;
      }
      return {
        stages: this.selectedNode.map((node) => {
          return {
            id: node.id,
            name: node.name,
            icon: node.icon,
            type: node.type,
            outputSchema: node.outputSchema,
            plugin: {
              name: node.plugin.name,
              artifact: node.plugin.artifact,
              properties: angular.copy(node.plugin.properties),
              label: node.plugin.label,
            },
            comments: node.comments,
          };
        })
      };
    };

    function init() {
      $scope.nodes = DAGPlusPlusNodesStore.getNodes();
      $scope.connections = DAGPlusPlusNodesStore.getConnections();
      vm.undoStates = DAGPlusPlusNodesStore.getUndoStates();
      vm.redoStates = DAGPlusPlusNodesStore.getRedoStates();

      if (initTimeout) {
        $timeout.cancel(initTimeout);
      }
      initTimeout = $timeout(function () {
        initNodes();
        bindKeyboardEvents();

        // Process metrics data
        if ($scope.showMetrics) {

          angular.forEach($scope.nodes, function (node) {
            var elem = angular.element(document.getElementById(node.id || node.name)).children();

            var scope = $rootScope.$new();
            scope.data = {
              node: node
            };
            scope.version = node.plugin.artifact.version;

            metricsPopovers[node.name] = {
              scope: scope,
              element: elem,
              popover: null,
              isShowing: false
            };

            $scope.$on('$destroy', function () {
              elem.remove();
              elem = null;
              scope.$destroy();
            });

          });

          $scope.$watch('metricsData', function () {
            if (Object.keys($scope.metricsData).length === 0) {
              angular.forEach(metricsPopovers, function (value) {
                value.scope.data.metrics = 0;
              });
            }

            angular.forEach($scope.metricsData, function (pluginMetrics, pluginName) {
              let metricsToDisplay = {};
              let pluginMetricsKeys = Object.keys(pluginMetrics);
              for (let i = 0; i < pluginMetricsKeys.length; i++) {
                let pluginMetric = pluginMetricsKeys[i];
                if (typeof pluginMetrics[pluginMetric] === 'object') {
                  metricsToDisplay[pluginMetric] = _.sum(Object.keys(pluginMetrics[pluginMetric]).map(key => pluginMetrics[pluginMetric][key]));
                } else {
                  metricsToDisplay[pluginMetric] = pluginMetrics[pluginMetric];
                }
              }

              metricsPopovers[pluginName].scope.data.metrics = metricsToDisplay;
            });
          }, true);
        }
        vm.doesStagesHaveComments = vm.checkIfAnyStageHasComment();
      });

      // This is here because the left panel is initially in the minimized mode and expands
      // based on user setting on local storage. This is taking more than a single angular digest cycle
      // Hence the timeout to 1sec to render it in subsequent digest cycles.
      // FIXME: This directive should not be dependent on specific external component to render itself.
      // The left panel should default to expanded view and cleaning up the graph and fit to screen should happen in parallel.
      fitToScreenTimeout = $timeout(() => {
        vm.cleanUpGraph();
      }, 500);
    }

    vm.onNodeDelete = function (event, nodes = vm.selectedNode) {
      if (event) {
        event.stopPropagation();
      }

      const newNodes = angular.copy(nodes);
      newNodes.forEach(node => {
        DAGPlusPlusNodesActionsFactory.removeNode(node.id);

        if (Object.keys(splitterNodesPorts).indexOf(node.name) !== -1) {
          delete splitterNodesPorts[node.name];
        }
        let nodeType = node.plugin.type || node.type;
        if (nodeType  === 'condition') {
          conditionNodes = conditionNodes.filter(conditionNode => conditionNode !== node.name);
        } else if (nodeType === 'splittertransform' && node.outputSchema && Array.isArray(node.outputSchema)) {
          // pass
        } else {
          normalNodes = normalNodes.filter(normalNode => normalNode !== node.name);
        }

        selectedConnections = selectedConnections.filter(function(selectedConnObj) {
          return (
            selectedConnObj.source &&
            selectedConnObj.target &&
            selectedConnObj.source.id !== node.id &&
            selectedConnObj.target.id !== node.id
          );
        });
        $scope.connections = $scope.connections
          .filter(connection => connection.from !== node.id && connection.to !== node.id);
      });
      vm.clearSelectedNodes();
    };

    vm.onKeyboardDelete = function onKeyboardDelete() {
      if (vm.selectedNode.length) {
        vm.onNodeDelete(null, vm.selectedNode);
      } else {
        vm.removeSelectedConnections();
      }
    };

    function bindKeyboardEvents() {
      Mousetrap.bind(['command+z', 'ctrl+z'], vm.undoActions);
      Mousetrap.bind(['command+shift+z', 'ctrl+shift+z'], vm.redoActions);
      Mousetrap.bind(['del', 'backspace'], vm.onKeyboardDelete);
      Mousetrap.bind(['command+c', 'ctrl+c'], vm.onKeyboardCopy);

      if (vm.isDisabled) {
        return;
      }
      // Toggle between move mode. With spacebar users can move the entire canvas
      Mousetrap.bind('space', () => {
        $scope.$apply(function() {
          vm.selectionBox.toggle = true;
        });
      }, 'keyup');
      Mousetrap.bind('space', () => {
        $scope.$apply(function() {
          vm.selectionBox.toggle = false;
        });
      }, 'keydown');

      // Select all the nodes in the canvas.
      Mousetrap.bind('command+a', () => {
        const nodes = $scope.nodes;
        vm.selectedNode = nodes;
        vm.highlightSelectedNodeConnections();
        return false;
      });

      // Select multiple nodes by manually selecting nodes.
      Mousetrap.bind('shift', () => {
        vm.selectionBox.isMultiSelectEnabled = true;
      }, 'keydown');
      Mousetrap.bind('shift', () => {
        vm.selectionBox.isMultiSelectEnabled = false;
      }, 'keyup');
    }

    function unbindKeyboardEvents() {
      Mousetrap.unbind(['command+z', 'ctrl+z']);
      Mousetrap.unbind(['command+shift+z', 'ctrl+shift+z']);
      Mousetrap.unbind(['command+c', 'ctrl+c']);
      Mousetrap.unbind(['del', 'backspace']);
      Mousetrap.unbind('shift');
      Mousetrap.unbind('space');
      Mousetrap.unbind('command+a');
    }

    function closeMetricsPopover(node) {
      var nodeInfo = metricsPopovers[node.name];
      if (metricsPopoverTimeout) {
        $timeout.cancel(metricsPopoverTimeout);
      }
      if (nodeInfo && nodeInfo.popover) {
        nodeInfo.popover.hide();
        nodeInfo.popover.destroy();
        nodeInfo.popover = null;
      }
    }

    vm.nodeMouseEnter = function (node) {
      if (!$scope.showMetrics || vm.scale >= SHOW_METRICS_THRESHOLD) { return; }

      var nodeInfo = metricsPopovers[node.name];

      if (metricsPopoverTimeout) {
        $timeout.cancel(metricsPopoverTimeout);
      }

      if (nodeInfo.element && nodeInfo.scope) {
        nodeInfo.popover = $modifiedPopover(nodeInfo.element, {
          trigger: 'manual',
          placement: 'auto right',
          target: angular.element(nodeInfo.element[0]),
          templateUrl: $scope.metricsPopoverTemplate,
          container: 'main',
          scope: nodeInfo.scope
        });
        nodeInfo.popover.$promise
          .then(function () {

            // Needs a timeout here to avoid showing popups instantly when just moving
            // cursor across a node
            metricsPopoverTimeout = $timeout(function () {
              if (nodeInfo.popover && typeof nodeInfo.popover.show === 'function') {
                nodeInfo.popover.show();
              }
            }, 500);
          });
      }
    };

    vm.nodeMouseLeave = function (node) {
      if (!$scope.showMetrics || vm.scale >= SHOW_METRICS_THRESHOLD) { return; }

      closeMetricsPopover(node);
    };

    vm.zoomIn = function () {
      vm.scale += 0.1;
    };

    vm.zoomOut = function () {
      if (vm.scale <= 0.2) { return; }
      vm.scale -= 0.1;
    };


    function initNodes() {
      angular.forEach($scope.nodes, function (node) {
        const key = generatePluginMapKey(node);
        const ispluginsMapAvailable = Object.keys(vm.pluginsMap).length;
        // If pluginsMap is not available yet, consider the plugin to be valid until we know otherwise
        node.isPluginAvailable = ispluginsMapAvailable ?
            Boolean(myHelpers.objectQuery(vm.pluginsMap, key, 'pluginInfo')) : true;
        if (node.type === 'condition') {
          initConditionNode(node.id);
        } else if (node.type === 'splittertransform') {
          initSplitterNode(node);
        } else {
          initNormalNode(node);
        }
      });
    }

    function initNormalNode(node) {
      if (normalNodes.indexOf(node.name) !== -1) {
        return;
      }
      normalNodes.push(node.name);
    }

    function initConditionNode(nodeName) {
      if (conditionNodes.indexOf(nodeName) !== -1) {
        return;
      }
      conditionNodes.push(nodeName);
    }

    function initSplitterNode(node) {
      if (!node.outputSchema || !Array.isArray(node.outputSchema) || (Array.isArray(node.outputSchema) && node.outputSchema[0].name === GLOBALS.defaultSchemaName)) {
        let splitterPorts = splitterNodesPorts[node.name];
        if (!_.isEmpty(splitterPorts)) {
          DAGPlusPlusNodesActionsFactory.setConnections($scope.connections);
          delete splitterNodesPorts[node.name];
        }
        return;
      }

      let newPorts = node.outputSchema
        .map(schema => schema.name);

      let splitterPorts = splitterNodesPorts[node.name];
      let portsChanged = !_.isEqual(splitterPorts, newPorts);

      if (!portsChanged) {
        return;
      }

      DAGPlusPlusNodesActionsFactory.setConnections($scope.connections);
      splitterNodesPorts[node.name] = newPorts;
    }

    vm.handleCanvasClick = (e) => {
      if(vm.selectionBox.isSelectionInProgress) {
        vm.selectionBox.isSelectionInProgress = false;
        return;
      }
      if (e) {
        const target = e.target;
        const isTargetDAGContainer = target.getAttribute('id') === 'dag-container';
        if (!isTargetDAGContainer) {
          return;
        }
      }
      if (vm.activePluginToComment) {
        vm.activePluginToComment = null;
      }
      vm.toggleNodeMenu();
      clearConnectionsSelection();
      vm.clearSelectedNodes();
    };

    vm.addConnection = function(newConn) {
      const { source, sourceHandle, target, targetHandle } = newConn;
      const connection = {
        from: source.id,
        to: target.id,
      };

      const sourceType = source.data.pluginNode.type;
      /**
       * If the connection is from a condition or a splitter transform
       * we need information on the source of this connection. For condition
       * it could yes/no ports or for the splitter transform it needs to be
       * the port name (null/non-null or custom ports)
       */
      if (sourceType === 'splitter') {
        connection.port = sourceHandle;
      } else if (sourceType === 'condition') {
        connection.condition = sourceHandle === 'handle-true' ? 'true' : 'false';
      }
      $scope.connections.push(connection);
      DAGPlusPlusNodesActionsFactory.setConnections($scope.connections);
    }

    vm.removeConnection = function (edge, updateStore = true) {
      const { source, target } = edge;
      if (!source || typeof source !== 'object') {
        return;
      }
      const connectionIndex = _.findIndex($scope.connections, function (conn) {
        return conn.from === source.id && conn.to === target.id;
      });
      if (connectionIndex !== -1) {
        $scope.connections.splice(connectionIndex, 1);
      }
      if (updateStore !== false) {
        DAGPlusPlusNodesActionsFactory.setConnections($scope.connections);
      }
      $timeout(() => $scope.$apply());
    }

    vm.moveConnection = function(oldEdge, newConn) {
      vm.removeConnection(oldEdge);
      vm.addConnection(newConn);
    }

    vm.removeSelectedConnections = function() {
      if (selectedConnections.length === 0 || vm.isDisabled) { return; }

      angular.forEach(selectedConnections, function (selectedConnectionObj) {
        removeConnection(selectedConnectionObj, false);
      });
      selectedConnections = [];
      DAGPlusPlusNodesActionsFactory.setConnections($scope.connections);
    };

    function toggleConnection(connObj) {
      if (!connObj) {
        return;
      }

      if (selectedConnections.indexOf(connObj) === -1) {
        selectedConnections.push(connObj);
      } else {
        selectedConnections.splice(selectedConnections.indexOf(connObj), 1);
      }
    }

    function clearConnectionsSelection() {
      selectedConnections.forEach((conn) => {
        const existingTypes = conn.getType();
        if (Array.isArray(existingTypes) && existingTypes.indexOf('selected') !== -1) {
          conn.toggleType('selected');
          conn.removeClass('selected-connector');
        }
      });

      selectedConnections = [];
    }

    vm.prevalidateConnection = function (connObj) {
      // return false if connection already exists, which will prevent the connecton from being formed
      const { source, sourceHandle, target, targetHandle } = connObj;
      const sourceNode = source.data.pluginNode;
      const targetNode = target.data.pluginNode;

      const exists = _.find($scope.connections, function (conn) {
        return conn.from === sourceNode.id && conn.to === targetNode.id;
      });

      const sameNode = sourceNode.id === targetNode.id;

      if (exists || sameNode) {
        return false;
      }

      let valid = true;
      NonStorePipelineErrorFactory.connectionIsValid(sourceNode, targetNode, function(invalidConnection) {
        if (invalidConnection) { valid = false; }
      });

      return valid;
    }

    function resetEndpointsAndConnections() {
      if (resetTimeout) {
        $timeout.cancel(resetTimeout);
      }

      resetTimeout = $timeout(function () {
        normalNodes = [];
        conditionNodes = [];
        splitterNodesPorts = {};

        $scope.nodes = DAGPlusPlusNodesStore.getNodes();
        $scope.connections = DAGPlusPlusNodesStore.getConnections();
        vm.undoStates = DAGPlusPlusNodesStore.getUndoStates();
        vm.redoStates = DAGPlusPlusNodesStore.getRedoStates();
        initNodes();
        selectedConnections = [];
      });
    }

    vm.onPreviewData = function(event, node) {
      event.stopPropagation();
      HydratorPlusPlusPreviewStore.dispatch(HydratorPlusPlusPreviewActions.setPreviewData());
      DAGPlusPlusNodesActionsFactory.selectNode(node.name);
    };

    vm.onNodeClick = function(node) {
      vm.resetActivePluginForComment();
      closeMetricsPopover(node);

      window.CaskCommon.PipelineMetricsActionCreator.setMetricsTabActive(false);
      window.CaskCommon.PipelineMetricsActionCreator.setSelectedPlugin(node.type, node.plugin.name);
      DAGPlusPlusNodesActionsFactory.selectNode(node.name);
    };

    vm.onMetricsClick = function(event, node, portName) {
      event.stopPropagation();
      if ($scope.disableMetricsClick) {
        return;
      }
      closeMetricsPopover(node);
      window.CaskCommon.PipelineMetricsActionCreator.setMetricsTabActive(true, portName);
      DAGPlusPlusNodesActionsFactory.selectNode(node.name);
    };

    vm.removeNode = function (node) {
      DAGPlusPlusNodesActionsFactory.removeNode(node.id);
      if (Object.keys(splitterNodesPorts).indexOf(node.name) !== -1) {
        delete splitterNodesPorts[node.name];
      }
      let nodeType = node.plugin.type || node.type;
      if (nodeType  === 'condition') {
        conditionNodes = conditionNodes.filter(conditionNode => conditionNode !== node.name);
      } else if (nodeType === 'splittertransform' && node.outputSchema && Array.isArray(node.outputSchema)) {
        // pass
      } else {
        normalNodes = normalNodes.filter(normalNode => normalNode !== node.name);
      }
      $scope.connections = $scope.connections
        .filter(connection => connection.from !== node.id && connection.to !== node.id);
    }

    vm.cleanUpGraph = function () {
      if ($scope.nodes.length === 0) { return; }

      let newConnections = HydratorPlusPlusCanvasFactory.orderConnections($scope.connections, HydratorPlusPlusConfigStore.getAppType() || window.CaskCommon.PipelineDetailStore.getState().artifact.name, $scope.nodes);
      let connectionsSwapped = false;
      for (let i = 0; i < newConnections.length; i++) {
        if (newConnections[i].from !== $scope.connections[i].from || newConnections[i].to !== $scope.connections[i].to) {
          connectionsSwapped = true;
          break;
        }
      }

      if (connectionsSwapped) {
        $scope.connections = newConnections;
        DAGPlusPlusNodesActionsFactory.setConnections($scope.connections);
      }

      let graphNodesNetworkSimplex = DAGPlusPlusFactory.getGraphLayout($scope.nodes, $scope.connections, separation)._nodes;
      let graphNodesLongestPath = DAGPlusPlusFactory.getGraphLayout($scope.nodes, $scope.connections, separation, 'longest-path')._nodes;

      vm.uiAutoLayout = Date.now();
      angular.forEach($scope.nodes, function (node) {
        let locationX = graphNodesNetworkSimplex[node.name].x;
        let locationY = graphNodesLongestPath[node.name].y;
        node._uiPosition = {
          left: locationX - 50 + 'px',
          top: locationY + 'px',
        };
        node._uiLayoutKey = vm.uiAutoLayout;
      });

      vm.panning.top = 0;
      vm.panning.left = 0;

      DAGPlusPlusNodesActionsFactory.resetPluginCount();
      DAGPlusPlusNodesActionsFactory.setCanvasPanning(vm.panning);
    };

    vm.toggleNodeMenu = function (node, event) {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }

      if (!node || vm.nodeMenuOpen === node.name) {
        vm.nodeMenuOpen = null;
      } else {
        vm.nodeMenuOpen = node.name;
        vm.selectedNode = [node];
      }
    };

    vm.undoActions = function () {
      if (!vm.isDisabled && vm.undoStates.length > 0) {
        DAGPlusPlusNodesActionsFactory.undoActions();
      }
    };

    vm.redoActions = function () {
      if (!vm.isDisabled && vm.redoStates.length > 0) {
        DAGPlusPlusNodesActionsFactory.redoActions();
      }
    };

    vm.shouldShowAlertsPort = (node) => {
      let key = generatePluginMapKey(node);
      vm.pluginsMap = AvailablePluginsStore.getState().plugins.pluginsMap;
      return myHelpers.objectQuery(vm.pluginsMap, key, 'widgets', 'emit-alerts');
    };

    vm.shouldShowErrorsPort = (node) => {
      let key = generatePluginMapKey(node);
      vm.pluginsMap = AvailablePluginsStore.getState().plugins.pluginsMap;
      return myHelpers.objectQuery(vm.pluginsMap, key, 'widgets', 'emit-errors');
    };

    vm.onKeyboardCopy = function onKeyboardCopy() {
      if (vm.activePluginToComment) {
        return;
      }
      const pluginConfig = vm.getPluginConfiguration();
      if (!pluginConfig) {
        return;
      }
      const stages = pluginConfig.stages;
      const connections =  vm.getSelectedConnections();
      vm.nodeMenuOpen = null;
      window.CaskCommon.Clipboard.copyToClipBoard(JSON.stringify({
        stages,
        connections
      }));
    };

    // handling node paste
    document.body.onpaste = (e) => {
      const activeNode = DAGPlusPlusNodesStore.getActiveNodeId();
      const target = myHelpers.objectQuery(e, 'target', 'tagName');
      const INVALID_TAG_NAME = ['INPUT', 'TEXTAREA'];

      if (activeNode || INVALID_TAG_NAME.indexOf(target) !== -1) {
        return;
      }

      let config;
      if (window.clipboardData && window.clipboardData.getData) {
        // for IE......
        config = window.clipboardData.getData('Text');
      } else {
        config = e.clipboardData.getData('text/plain');
      }
      try {
        config = JSON.parse(config);
      } catch(err) {
        console.error('Unable to paste to canvas: '+ err);
      }
      config.nodes = config.stages;
      config.connections = config.connections || [];
      delete config.stages;
      vm.onPipelineContextMenuPaste(config);
    };

    function sanitizeNodesAndConnectionsBeforePaste(text) {
      const sanitize =  window.CaskCommon.CDAPHelpers.santizeStringForHTMLID;
      try {
        let config = {};
        if (typeof text === 'string') {
          config = JSON.parse(text);
        } else {
          config = text;
        }
        let nodes = myHelpers.objectQuery(config, 'nodes');
        let connections = myHelpers.objectQuery(config, 'connections');
        const oldNameToNewNameMap = {};
        if (!nodes || !Array.isArray(nodes)) {
          return;
        }

        nodes = nodes.map(node => {
          if (!node) { return; }

          // change name
          let newName = `${sanitize(node.plugin.label)}`;
          const randIndex = Math.floor(Math.random() * 100);
          newName = `${newName}${randIndex}`;
          let iconConfiguration = {};
          if (!node.icon) {
            iconConfiguration = Object.assign({}, {
              icon: DAGPlusPlusFactory.getIcon(node.plugin.name)
            });
          }

          oldNameToNewNameMap[node.name] = newName;
          node.plugin.label = `${node.plugin.label}${randIndex}`;
          return Object.assign({}, node, {
            name: oldNameToNewNameMap[node.name],
            id: oldNameToNewNameMap[node.name]
          }, iconConfiguration);
        });
        connections = connections.map((connection) => {
          const from = connection.from;
          const to = connection.to;
          return Object.assign({}, connection, {
            from: oldNameToNewNameMap[from] || from,
            to: oldNameToNewNameMap[to] || to,
          });
        });
        /**
         * Commenting this out as this introduces a lot of changes behind
         * the scenes without the user knowing about it.
         * https://issues.cask.co/browse/CDAP-17252 - Will revamp this as part of this change.
         */
        /* const newNodes = window.CaskCommon.CDAPHelpers.sanitizeNodeNamesInPluginProperties(
          nodes,
          AvailablePluginsStore.getState(),
          oldNameToNewNameMap
        );
        */
        return {nodes , connections};
      } catch (e) {
        console.log('error parsing node config', e);
      }
    }

    // CUSTOM ICONS CONTROL
    function generatePluginMapKey(node) {
      let plugin = node.plugin;
      let type = node.type || plugin.type;

      return `${plugin.name}-${type}-${plugin.artifact.name}-${plugin.artifact.version}-${plugin.artifact.scope}`;
    }

    vm.shouldShowCustomIcon = (node) => {
      let key = generatePluginMapKey(node);

      let iconSourceType = myHelpers.objectQuery(vm.pluginsMap, key, 'widgets', 'icon', 'type');
      return ['inline', 'link'].indexOf(iconSourceType) !== -1;
    };

    vm.getCustomIconSrc = (node) => {
      let key = generatePluginMapKey(node);
      let iconSourceType = myHelpers.objectQuery(vm.pluginsMap, key, 'widgets', 'icon', 'type');

      if (iconSourceType === 'inline') {
        return myHelpers.objectQuery(vm.pluginsMap, key, 'widgets', 'icon', 'arguments', 'data');
      }

      return myHelpers.objectQuery(vm.pluginsMap, key, 'widgets', 'icon', 'arguments', 'url');
    };


    function initPluginsMap() {
      vm.pluginsMap = AvailablePluginsStore.getState().plugins.pluginsMap;
      $scope.nodes.forEach(node => {
        let key = generatePluginMapKey(node);
        // This is to check if the plugin version is a range. If so, mark the plugin
        // as available and UI will decide on the specific version while opening the plugin.
        if (
            myHelpers.objectQuery(node, 'plugin', 'artifact', 'version') &&
            node.plugin.artifact.version.indexOf('[') === 0
          ) {
          node.isPluginAvailable = true;
        } else {
          node.isPluginAvailable = Boolean(myHelpers.objectQuery(vm.pluginsMap, key, 'pluginInfo')) ;
        }
      });
    }
    let subAvailablePlugins = AvailablePluginsStore.subscribe(initPluginsMap);

    function cleanupOnDestroy() {
      DAGPlusPlusNodesActionsFactory.resetNodesAndConnections();
      DAGPlusPlusNodesStore.reset();

      if (subAvailablePlugins) {
        subAvailablePlugins();
      }

      // Cancelling all timeouts, key bindings and event listeners
      Object.keys(repaintTimeoutsMap).forEach((id) => {
        $timeout.cancel(repaintTimeoutsMap[id]);
      });

      $timeout.cancel(nodesTimeout);
      $timeout.cancel(fitToScreenTimeout);
      $timeout.cancel(initTimeout);
      $timeout.cancel(metricsPopoverTimeout);
      $timeout.cancel(highlightSelectedNodeConnectionsTimeout);
      Mousetrap.reset();
      dispatcher.unregister('onUndoActions', undoListenerId);
      dispatcher.unregister('onRedoActions', redoListenerId);

      document.body.onpaste = null;
    }

    vm.setComments = (nodeId, comments) => {
      const existingStages = DAGPlusPlusNodesStore.getNodes();
      DAGPlusPlusNodesStore.setNodes(existingStages.map((stage) => {
        if (stage.id === nodeId){
          let updatedInfo = stage.information || {};
          updatedInfo = Object.assign({}, updatedInfo, {
            comments: {
              list: comments
            }
          });
          stage = Object.assign({}, stage, { information: updatedInfo });
        }
        return stage;
      }));
      vm.doesStagesHaveComments = vm.checkIfAnyStageHasComment();
    };

    vm.setPluginActiveForComment = (nodeId) => {
      vm.resetActivePluginForComment(nodeId);
      if (!nodeId) {
        vm.handleCanvasClick();
      } else {
        vm.onPluginContextMenuOpen(nodeId);
      }
      vm.nodeMenuOpen = null;
    };

    vm.resetActivePluginForComment = (nodeId = null) => {
      vm.activePluginToComment = nodeId;
    };

    vm.initPipelineComments = () => {
      let comments;
      if (vm.isDisabled) {
        comments = window.CaskCommon.PipelineDetailStore.getState().config.comments;
      } else {
        comments = HydratorPlusPlusConfigStore.getComments();
      }
      vm.pipelineComments = comments;
    };

    vm.setPipelineComments = (comments) => {
      if (vm.isDisabled) {
        return;
      }
      HydratorPlusPlusConfigStore.setComments(comments);
      vm.pipelineComments = comments;
    };

    $scope.$on('$destroy', cleanupOnDestroy);
    vm.initPipelineComments();

    $scope.$watch('runId', function() {
      // Watch for runId change to update pipeline graph with
      // corresponding version
      if ($scope.runId) {
        // prevent duplicated rendering on first time page landing
        normalNodes = [];
        conditionNodes = [];
        splitterNodesPorts = {};
        init();
        vm.initPipelineComments();
      }
    }, true);

    init();
    $scope.$watch('nodes', function() {
      if (!vm.isDisabled) {
        if (nodesTimeout) {
          $timeout.cancel(nodesTimeout);
        }
        nodesTimeout = $timeout(function () {
          initNodes();
        });
      }
    }, true);

    DAGPlusPlusNodesStore.registerOnChangeListener(function () {
      vm.activeNodeId = DAGPlusPlusNodesStore.getActiveNodeId();
      $scope.nodes = DAGPlusPlusNodesStore.getNodes();
      $scope.connections = DAGPlusPlusNodesStore.getConnections();
      //$timeout(() => $scope.$apply());

      // can do keybindings only if no node is selected
      if (!vm.activeNodeId) {
        bindKeyboardEvents();
      } else {
        unbindKeyboardEvents();
      }
    });
  });
