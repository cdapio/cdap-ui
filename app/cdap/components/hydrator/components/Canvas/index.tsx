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

import React, { useCallback, useEffect, useState, useLayoutEffect, useMemo } from 'react';
import ReactFlow, {
  Controls,
  ControlButton,
  Background,
  useEdgesState,
  addEdge,
  useNodesState,
  applyNodeChanges,
  applyEdgeChanges,
  useReactFlow,
  ReactFlowProvider,
  MiniMap,
  useKeyPress,
  MarkerType,
  ConnectionLineType,
  Node,
} from 'reactflow';
import 'reactflow/dist/style.css';
import uuidV4 from 'uuid/v4';
import cloneDeep from 'lodash/cloneDeep';
import { PluginNode, PluginNodeWithAlertAndError } from './PluginNode';
import UndoIcon from '@material-ui/icons/Undo';
import RedoIcon from '@material-ui/icons/Redo';
import PipelineContextMenu from 'components/PipelineContextMenu';
import {
  checkIfNodeMoved,
  connectionIsValid,
  findNodeWithNodeId,
  getCopiedElementsFromClipBoard,
  getPluginColor,
} from './helper';
import { PLUGIN_TYPES } from './constants';
import { EdgeStyle, ConnectionLineStyle } from './styles';
import { santizeStringForHTMLID } from 'services/helpers';
import PipelineCommentsActionBtn from 'components/PipelineCanvasActions/PipelineCommentsActionBtn';
import styled from 'styled-components';
import { IComment } from 'components/AbstractWidget/Comment/CommentConstants';
// import { IPipelineComment } from 'components/PipelineCanvasActions/PipelineCommentsConstants';
import IconSVG from 'components/shared/IconSVG';
import { copyToClipBoard } from 'services/Clipboard';
import { INodePosition, ISelectedElements } from './types';
import { useDispatch, useSelector } from 'react-redux';

interface ICanvasProps {
  angularNodes: any;
  angularConnections: any;
  isDisabled: boolean;
  previewMode: boolean;
  updateNodes: (nodes: any[]) => void;
  updateConnections: (connections: any[], addStateToHistory?: boolean) => void;
  onPropertiesClick: (node: any) => void;
  onMetricsClick: (event: any, node: any, portName?: any) => void;
  getAngularConnections: () => any;
  getAngularNodes: () => any;
  setSelectedNodes: (nodes: any[]) => void;
  setSelectedConnections: (connections: any[]) => void;
  onKeyboardCopy: () => void;
  setPluginActiveForComment: (nodeId: string) => void;
  getActivePluginForComment: () => string;
  setPluginComments: (nodeId: string, comments: any) => void;
  getPluginConfiguration: () => any;
  getCustomIconSrc: (node: any) => string;
  shouldShowAlertsPort: (node: any) => boolean;
  shouldShowErrorsPort: (node: any) => boolean;
  undoActions: () => void;
  redoActions: () => void;
  pipelineComments: IComment[];
  setPipelineComments: (val: any) => void;
  onPreviewData: (event: any, node: any) => void;
  cleanUpGraph: () => void;
  pipelineArtifactType: 'cdap-data-pipeline' | 'cdap-data-streams';
  metricsData: any;
  metricsDisabled: boolean;
  redoStates: any[];
  undoStates: any[];
  updateNodePositions: (nodePosition: INodePosition) => void;
}

const nodeTypes = { plugin: PluginNode, pluginWithAlertAndError: PluginNodeWithAlertAndError };

// This is to overwrite the styles of pipeline comments button
const StyledControlButton = styled(ControlButton)`
  button {
    padding: 0;
    border: none;
    width: 25px;
    height: 25px;
  }
`;

const getConnectionsForDisplay = (connections, nodes) => {
  return connections.map((conn) => {
    const reactFlowConn: any = {
      id: 'reactflow__edge-' + conn.from + '-' + conn.to,
      source: conn.from,
      target: conn.to,
      ...EdgeStyle,
    };
    const toNode = nodes.find((node) => node.name === conn.to);
    if (toNode.type === PLUGIN_TYPES.ERROR_TRANSFORM) {
      reactFlowConn.sourceHandle = 'source_error';
    } else if (toNode.type === PLUGIN_TYPES.ALERT_PUBLISHER) {
      reactFlowConn.sourceHandle = 'source_alert';
    }
    return reactFlowConn;
  });
};

const Canvas = ({
  angularNodes,
  angularConnections,
  isDisabled,
  previewMode,
  updateNodes,
  updateConnections,
  onPropertiesClick,
  onMetricsClick,
  getAngularConnections,
  getAngularNodes,
  setSelectedNodes,
  setSelectedConnections,
  onKeyboardCopy,
  setPluginActiveForComment,
  getActivePluginForComment,
  setPluginComments,
  getPluginConfiguration,
  getCustomIconSrc,
  shouldShowAlertsPort,
  shouldShowErrorsPort,
  undoActions,
  redoActions,
  pipelineComments,
  setPipelineComments,
  onPreviewData,
  cleanUpGraph,
  pipelineArtifactType,
  metricsData,
  metricsDisabled,
  redoStates,
  undoStates,
  updateNodePositions,
}: ICanvasProps) => {
  const reactFlowInstance = useReactFlow();
  const deletePressed = useKeyPress(['Backspace', 'Delete']);
  const copyPressed = useKeyPress(['Meta+c', 'Ctrl+c']);
  const pastePressed = useKeyPress(['Meta+v', 'Ctrl+v']);
  const [selectedElements, setSelectedElements] = useState<ISelectedElements>({
    nodes: [],
    edges: [],
  });

  const convertAngularNodeToReactNode = (node: any) => {
    const data = {
      node,
      onPropertiesClick,
      onMetricsClick,
      setPluginActiveForComment,
      getActivePluginForComment,
      setPluginComments,
      getSelectedConnections,
      getSelectedNodes,
      getPluginConfiguration,
      getCustomIconSrc,
      shouldShowAlertsPort,
      shouldShowErrorsPort,
      previewMode,
      onPreviewData,
      copySelectedNodeId,
      deleteSelectedNodeId,
      isDisabled,
      metricsData,
      metricsDisabled,
    };
    const reactflowNode = {
      id: node.name,
      data,
      type: 'plugin',
      position: {
        x: parseInt(node._uiPosition?.left, 10) || 150,
        y: parseInt(node._uiPosition?.top, 10) || 150,
      },
      selected: false,
    };
    if (shouldShowAlertsPort(node) && shouldShowErrorsPort(node)) {
      reactflowNode.type = 'pluginWithAlertAndError';
    }
    return reactflowNode;
  };

  const getNodesForDisplay = (angularNodes, reactNodes, isCleanUp = false) => {
    let existingIds = [];
    if (!isCleanUp) {
      existingIds = reactNodes.map((node) => node.id);
    }
    return angularNodes.map((node, idx) => {
      const reactflowNode: any = convertAngularNodeToReactNode(node);
      if (existingIds.includes(node.name)) {
        // reactflowNode.position = reactNodes.find((nd) => nd.id === node.name).position;
        reactflowNode.selected = reactNodes.find((nd) => nd.id === node.name).selected;
      }
      reactflowNode.position = {
        x: parseInt(node._uiPosition?.left, 10) || 150,
        y: parseInt(node._uiPosition?.top, 10) || 150,
      };
      reactflowNode.data.idx = idx;
      return reactflowNode;
    });
  };
  const {angularNodes2} = useSelector((state) => ({
    angularNodes2: state.nodesStore.nodes
  }))
  const dispatch = useDispatch();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // draw connections
  const onConnect = useCallback(
    (params) => {
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges]
  );

  const onSelectionChange = useCallback((elements) => {
    setSelectedElements(elements);
  }, []);

  const getSelectedNodesAndConnections = () => {
    const selectedNodes = selectedElements.nodes;
    const selectedEdges = selectedElements.edges;
    const selectedNodesId = selectedNodes.map((node) => node.id);
    const selectedEdgesId = selectedEdges.map((edge) => edge.id);
    return { selectedNodesId, selectedEdgesId };
  };

  const copySelectedElements = () => {
    copyToClipBoard(JSON.stringify(selectedElements));
  };

  const copySelectedNodeId = (nodeId: string) => {
    const node = findNodeWithNodeId(nodes, nodeId);
    copyToClipBoard(JSON.stringify({ nodes: [node], edges: [] }));
  };

  const deleteSelectedElements = () => {
    const { selectedNodesId, selectedEdgesId } = getSelectedNodesAndConnections();
    setNodes((nds) => nds.filter((node) => !selectedNodesId.includes(node.id)));
    setEdges((eds) => eds.filter((edge) => !selectedEdgesId.includes(edge.id)));
    const newNodes = getAngularNodes().filter((node) => !selectedNodesId.includes(node.name));
    updateNodes(newNodes);
    const newConnections = getAngularConnections().filter(
      (conn) =>
        !selectedNodesId.includes(conn.from) &&
        !selectedNodesId.includes(conn.to) &&
        !selectedEdgesId.find((edge) => edge.includes(conn.from) && edge.includes(conn.to))
    );
    updateConnections(newConnections, false);
    setSelectedElements({
      nodes: [],
      edges: [],
    });
  };

  const deleteSelectedNodeId = (nodeId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    const newNodes = getAngularNodes().filter((node) => node.name !== nodeId);
    updateNodes(newNodes);
    const newConnections = getAngularConnections().filter(
      (conn) => nodeId !== conn.from && nodeId !== conn.to
    );
    updateConnections(newConnections, false);
  };

  const pasteCopiedElements = () => {
    getCopiedElementsFromClipBoard().then((res: ISelectedElements) => {
      let pastedNodes = [...res.nodes];
      let pastedEdges = [...res.edges];
      const oldNameToNewNameMap = {};
      // add copied nodes
      pastedNodes = pastedNodes.map((node) => {
        const newNode = cloneDeep(node);
        const newName = `${santizeStringForHTMLID(node.data.node.plugin.label)}-${uuidV4()}`;
        oldNameToNewNameMap[node.id] = newName;
        newNode.data = {
          ...newNode.data,
          onPropertiesClick,
          onMetricsClick,
          setPluginActiveForComment,
          getActivePluginForComment,
          setPluginComments,
          getSelectedConnections,
          getSelectedNodes,
          getPluginConfiguration,
          getCustomIconSrc,
          shouldShowAlertsPort,
          shouldShowErrorsPort,
          onPreviewData,
          copySelectedNodeId,
          deleteSelectedNodeId,
        };
        newNode.data.node.plugin.label += '_copy';
        newNode.id = newName;
        newNode.data.node.name = newName;
        newNode.data.node.id = newName;
        newNode.position.x += 30;
        newNode.position.y += 30;
        newNode.data.node._uiPosition = {
          top: newNode.position.y + 'px',
          left: newNode.position.x + 'px',
        };
        newNode.selected = true;
        return newNode;
      });
      setNodes((nds) => {
        nds.forEach((node) => (node.selected = false));
        const newNds = nds.concat(pastedNodes);
        updateNodes(newNds.map((node) => node.data.node));
        return newNds;
      });
      // add copied connections
      pastedEdges = pastedEdges.map((edge) => {
        const newEdge = { ...edge };
        newEdge.source = oldNameToNewNameMap[edge.source];
        newEdge.target = oldNameToNewNameMap[edge.target];
        newEdge.id = 'reactflow__edge-' + newEdge.source + '-' + newEdge.target;
        return newEdge;
      });
      setEdges((eds) => {
        eds.forEach((edge) => (edge.selected = false));
        const newEds = eds.concat(pastedEdges);
        updateConnections(
          newEds.map((edge) => {
            return {
              id: edge.id,
              from: edge.source,
              to: edge.target,
            };
          })
        );
        return newEds;
      });
    });
  };

  const onWranglerSourceAdd = (wranglerSource: any) => {
    const node = wranglerSource.nodes[0];
    node.icon = 'icon-DataPreparation';
    const randIndex = Math.floor(Math.random() * 100);
    node.plugin.label = `${node.plugin.label}${randIndex}`;
    const reactflowNode = convertAngularNodeToReactNode(node);
    setNodes((nds) => {
      const newNds = nds.concat(reactflowNode);
      updateNodes(newNds.map((node) => node.data.node));
      return newNds;
    });
  };
  const alignGraph = () => {
    cleanUpGraph();
    setNodes((nds) => {
      return [].concat(getNodesForDisplay(getAngularNodes(), nds, true));
    });
    // setting a timeout for fitview after nodes positions are updated
    // not sure if there's a better way
    setTimeout(() => {
      reactFlowInstance.fitView();
    }, 200);
  };

  const updateNodesUIPosition = (node: Node) => {
    dispatch({
      type: 'UPDATE_NODE_UI_POSITION',
      payload: {
        id: node.data.node.id,
        position: {
          _uiPosition: {
            top: node.position.y + 'px',
            left: node.position.x + 'px',
          },
        },
      }
    });
  };

  // delete selection box
  // it requires some adjustments to reuse the onKeyboardDelete function in dag-plus-ctrl
  // writing the logic here to directly delete
  useEffect(() => {
    if (isDisabled || !deletePressed) {
      return;
    }
    deleteSelectedElements();
  }, [deletePressed]);

  useEffect(() => {
    if (isDisabled || !copyPressed) {
      return;
    }
    copySelectedElements();
  }, [copyPressed]);

  useEffect(() => {
    if (isDisabled || !pastePressed) {
      return;
    }
    pasteCopiedElements();
  }, [pastePressed]);

  useEffect(() => {
    setNodes((nds) => {
      return [].concat(getNodesForDisplay(angularNodes2, nds));
    });
  }, [JSON.stringify(angularNodes2), previewMode, metricsData]);

  useEffect(() => {
    setEdges(() => {
      return [].concat(getConnectionsForDisplay(getAngularConnections(), getAngularNodes()));
    });
  }, [JSON.stringify(getAngularConnections())]);

  const getSelectedConnections = () => {
    const { edges } = selectedElements;
    const selectedEdgesId = new Set(edges.map((edge) => edge.id));
    const selectedConnections = getAngularConnections().filter((conn) => {
      return (
        selectedEdgesId.has(`${conn.from}-${conn.to}`) ||
        selectedEdgesId.has(`${conn.to}-${conn.from}`)
      );
    });
    return selectedConnections;
  };

  const getSelectedNodes = () => {
    const { nodes } = selectedElements;
    const selectedNodesId = new Set(nodes.map((node) => node.id));
    const selectedNodes = getAngularNodes().filter((node) => {
      return selectedNodesId.has(node.name);
    });
    return selectedNodes;
  };

  const addConnections = (params) => {
    const connections = getAngularConnections().concat({
      id: params.id,
      from: params.source,
      to: params.target,
    });
    updateConnections(connections);
  };

  const checkIfConnectionExistsOrValid = (params) => {
    // exisiting connections
    if (edges.find((edge) => edge.source === params.source && edge.target === params.target)) {
      return false;
    }

    // same node
    if (params.source === params.target) {
      return false;
    }

    const nodeById = nodes.reduce((acc, node) => {
      acc[node.id] = node;
      return acc;
    }, {});

    const fromNode = nodeById[params.source];
    const toNode = nodeById[params.target];
    return connectionIsValid(fromNode.data.node, toNode.data.node);
  };

  const addEdgeStyle = (params) => {
    const nodeById = nodes.reduce((acc, node) => {
      acc[node.id] = node;
      return acc;
    }, {});
    const fromNode = nodeById[params.source];
    const toNode = nodeById[params.target];

    const newParams = { ...params, ...EdgeStyle };
    if (
      toNode.data.node.type === PLUGIN_TYPES.CONDITION ||
      fromNode.data.node.type === PLUGIN_TYPES.ACTION ||
      toNode.data.node.type === PLUGIN_TYPES.ACTION ||
      fromNode.data.node.type === PLUGIN_TYPES.SPARK_PROGRAM ||
      toNode.data.node.type === PLUGIN_TYPES.SPARK_PROGRAM
    ) {
      newParams.style.strokeDasharray = '4,8';
    }
    return newParams;
  };

  return (
    <div id="diagram-container" style={{ height: '92vh', marginLeft: '80px' }}>
      <ReactFlow
        id="dag-container"
        nodes={nodes}
        edges={edges}
        minZoom={-5}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={(params) => {
          if (checkIfConnectionExistsOrValid(params)) {
            const newParams = addEdgeStyle(params);
            onConnect(newParams);
            addConnections(newParams);
          }
        }}
        nodeTypes={nodeTypes}
        deleteKeyCode={null}
        connectionLineStyle={ConnectionLineStyle}
        connectionLineType={ConnectionLineType.SmoothStep}
        nodesDraggable={!isDisabled}
        nodesConnectable={!isDisabled}
        onSelectionChange={onSelectionChange}
        onNodeDragStop={(e, node: Node, nodes: Node[]) => {
          nodes.forEach((node) => {
            if (checkIfNodeMoved(node)) {
              updateNodesUIPosition(node);
            }
          });
        }}
        onSelectionDragStop={(e, nodes) => {
          nodes.forEach((node) => {
            if (checkIfNodeMoved(node)) {
              updateNodesUIPosition(node);
            }
          });
        }}
      >
        <Background />
        {nodes.length > 5 && (
          <MiniMap
            nodeColor={(n) => {
              return getPluginColor(n.data.node.type);
            }}
            pannable
          />
        )}
        <Controls position="top-right" style={{ marginTop: '100px' }} showInteractive={!isDisabled}>
          {!isDisabled && (
            <>
              <ControlButton
                title="Align"
                onClick={alignGraph}
                data-cy="pipeline-clean-up-graph-control"
                data-testid="pipeline-clean-up-graph-control"
              >
                <IconSVG name="icon-clean" />
              </ControlButton>
              <ControlButton
                title="Undo"
                onClick={undoActions}
                data-cy="pipeline-undo-action-btn"
                data-testid="pipeline-undo-action-btn"
                disabled={undoStates.length === 0}
              >
                <UndoIcon />
              </ControlButton>
              <ControlButton
                title="Redo"
                onClick={redoActions}
                data-cy="pipeline-redo-action-btn"
                data-testid="pipeline-redo-action-btn"
                disabled={redoStates.length === 0}
              >
                <RedoIcon />
              </ControlButton>
            </>
          )}
          <StyledControlButton title="Pipeline Comments">
            <PipelineCommentsActionBtn
              tooltip=""
              comments={pipelineComments}
              onChange={setPipelineComments}
              disabled={isDisabled}
            />
          </StyledControlButton>
        </Controls>
      </ReactFlow>
      {!isDisabled && (
        <PipelineContextMenu
          onWranglerSourceAdd={onWranglerSourceAdd}
          onNodesCopy={copySelectedElements}
          onNodesPaste={pasteCopiedElements}
          onNodesDelete={deleteSelectedElements}
          pipelineArtifactType={pipelineArtifactType}
          onZoomIn={reactFlowInstance.zoomIn}
          onZoomOut={reactFlowInstance.zoomOut}
          fitToScreen={reactFlowInstance.fitView}
          prettyPrintGraph={alignGraph}
          reactFlowCopyDeleteDisabled={!selectedElements.nodes.length}
        />
      )}
    </div>
  );
};

export const WrapperCanvas = ({
  angularNodes,
  angularConnections,
  isDisabled,
  previewMode,
  updateNodes,
  updateConnections,
  onPropertiesClick,
  onMetricsClick,
  getAngularConnections,
  getAngularNodes,
  setSelectedNodes,
  setSelectedConnections,
  onKeyboardCopy,
  setPluginActiveForComment,
  getActivePluginForComment,
  setPluginComments,
  getPluginConfiguration,
  getCustomIconSrc,
  shouldShowAlertsPort,
  shouldShowErrorsPort,
  undoActions,
  redoActions,
  pipelineComments,
  setPipelineComments,
  onPreviewData,
  cleanUpGraph,
  pipelineArtifactType,
  metricsData,
  metricsDisabled,
  redoStates,
  undoStates,
  updateNodePositions,
}: ICanvasProps) => {
  return (
    <ReactFlowProvider>
      <Canvas
        angularNodes={angularNodes}
        angularConnections={angularConnections}
        isDisabled={isDisabled}
        previewMode={previewMode}
        updateNodes={updateNodes}
        updateConnections={updateConnections}
        onPropertiesClick={onPropertiesClick}
        onMetricsClick={onMetricsClick}
        getAngularConnections={getAngularConnections}
        getAngularNodes={getAngularNodes}
        setSelectedNodes={setSelectedNodes}
        setSelectedConnections={setSelectedConnections}
        onKeyboardCopy={onKeyboardCopy}
        setPluginActiveForComment={setPluginActiveForComment}
        getActivePluginForComment={getActivePluginForComment}
        setPluginComments={setPluginComments}
        getPluginConfiguration={getPluginConfiguration}
        getCustomIconSrc={getCustomIconSrc}
        shouldShowAlertsPort={shouldShowAlertsPort}
        shouldShowErrorsPort={shouldShowErrorsPort}
        undoActions={undoActions}
        redoActions={redoActions}
        pipelineComments={pipelineComments}
        setPipelineComments={setPipelineComments}
        onPreviewData={onPreviewData}
        cleanUpGraph={cleanUpGraph}
        pipelineArtifactType={pipelineArtifactType}
        metricsData={metricsData}
        metricsDisabled={metricsDisabled}
        redoStates={redoStates}
        undoStates={undoStates}
        updateNodePositions={updateNodePositions}
      />
    </ReactFlowProvider>
  );
};
