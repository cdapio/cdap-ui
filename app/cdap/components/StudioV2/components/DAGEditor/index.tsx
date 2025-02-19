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

import React, { createContext, useEffect, useRef } from 'react';
import { Provider } from 'react-redux';
import _noop from 'lodash/noop';

import {
  ReactFlow,
  Controls,
  Background,
  BackgroundVariant,
  useReactFlow,
  ConnectionLineType,
  ReactFlowProvider,
  ControlButton,
  Viewport,
  useOnViewportChange,
  Edge,
  Connection,
} from 'reactflow';
import 'reactflow/dist/style.css';

import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import UndoIcon from '@material-ui/icons/Undo';
import RedoIcon from '@material-ui/icons/Redo';

import './DAGOverrides.css';
import { IPluginNode } from '../../types';
import { useDAGController } from './useDAGController';
import { NODE_TYPES } from './DAGNodes';
import { EDGE_TYPES, EdgeInProgress } from './DAGEdges';
import AvailablePluginsStore from 'services/AvailablePluginsStore';
import PipelineCommentsActionBtn from 'components/PipelineCanvasActions/PipelineCommentsActionBtn';
import PipelineContextMenu from 'components/PipelineContextMenu';

export interface IDAGEditorContext {
  isDisabled?: boolean;
};

const MIN_ZOOM = 0.4;
const MAX_ZOOM = 2;
const proOptions = { hideAttribution: true };
export const DAGEditorContext = createContext<IDAGEditorContext>({});

export interface IConnection {
  source?: any;
  target?: any;
  sourceId: string;
  targetId: string;
}

export interface IDAGEditorProps {
  isDisabled?: boolean;
  pipelineArtifactType?: "cdap-data-pipeline" | "cdap-data-streams";
  
  metricsData?: any;
  disableMetricsClick?: boolean;
  onMetricsClick?(node: any, portName?: string): void;

  errorStages?: string[];
  connections?: IConnection[];
  previewMode?: boolean;

  dagNodes?: IPluginNode[];
  updateNode?(nodeid: string, config: any): void;
  removeNode?(node: any): void;
  onNodeClick?(node: any): void;
  onPreviewData?(node: any): void;
  shouldShowAlertsPort?(node: any): boolean;
  shouldShowErrorsPort?(node: any): boolean;
  nodeMenuOpen?: any;
  toggleNodeMenu?(): any;
  setNodeComments?(comments: any[]): void;
  activePluginToComment?: any;

  getPluginConfiguration?(): any;
  getSelectedConnections?(): any;
  getSelectedNodes?(): any;
  onSelectedDelete?(): any;
  onPluginMenuOpen?(): any;
  onPluginAddComment?(): any;

  cleanupGraph?(): void;
  undoActions?(): void;
  undoStates?: any[];
  redoActions?(): void;
  redoStates?: any[];
  pipelineComments?: any[];
  setPipelineComments?(): void;
  onPipelineContextMenuPaste?(): void;

  onViewportChange?(vp: Viewport): void;
  addConnection?(conn: any): void;
  moveConnection?(oldConn: any, newConn: any): void;
  removeConnection?(connToDel: any): void;
  prevalidateConnection?(conn?: Connection): boolean;

  uiAutoLayout?: number;
}

function removeUnits(length?: string | number): number {
  if (typeof length === 'undefined') return 0;

  if (typeof length === 'number') {
    return length;
  }
  return Number(length.replace(/px$/, ''));
}

export function DagComponent({
  isDisabled,
  pipelineArtifactType,

  metricsData,
  disableMetricsClick,
  onMetricsClick = _noop,
  onPreviewData = _noop,

  errorStages,
  connections = [],
  previewMode,

  dagNodes = [],
  removeNode,
  updateNode,
  onNodeClick,
  shouldShowAlertsPort = _noop,
  shouldShowErrorsPort = _noop,

  getPluginConfiguration = _noop,
  getSelectedConnections = _noop,
  getSelectedNodes = _noop,
  onSelectedDelete = _noop,
  onPluginMenuOpen = _noop,
  onPluginAddComment = _noop,
  setNodeComments = _noop,
  activePluginToComment,

  cleanupGraph,
  undoActions,
  undoStates = [],
  redoActions,
  redoStates = [],
  pipelineComments,
  setPipelineComments,
  onViewportChange,
  onPipelineContextMenuPaste,

  addConnection,
  moveConnection,
  removeConnection,
  prevalidateConnection,

  uiAutoLayout,
  nodeMenuOpen = '',
  toggleNodeMenu = _noop,
}: IDAGEditorProps) {
  const reactflow = useReactFlow();
  useOnViewportChange({
    onEnd: onViewportChange,
  });

  const edgeReconnectSuccessful = useRef(true);
  const {
    nodes,
    edges,
    onNodesChange,
    onConnect,
    onEdgesChange,
    onReconnect,
    onEdgesDelete,
    isValidConnection,
  } = useDAGController(
    dagNodes.map(pluginNodeToDagNode),
    connections.map(connectionToDagEdge),
    updateNode,
    removeNode,
    addConnection,
    moveConnection,
    removeConnection,
    prevalidateConnection,
  );

  function getNodeByName (nodeName){
    return dagNodes.find((n) => n.name === nodeName) || null;
  }

  function pluginNodeToDagNode(node, index) {
    return {
      id: node.name,
      type: 'pipelineNode',
      position: {
        x: removeUnits(node?._uiPosition?.left),
        y: removeUnits(node?._uiPosition?.top),
      },
      data: {
        label: node.plugin.label,
        pluginNode: node,
        
        onPropertiesClick: onNodeClick || _noop,
        disableMetricsClick,
        onMetricsClick,
        onPreviewData,
        shouldShowAlertsPort,
        shouldShowErrorsPort,

        getPluginConfiguration,
        getSelectedConnections,
        getSelectedNodes,
        onSelectedDelete,
        onPluginMenuOpen,
        onPluginAddComment,
        nodeMenuOpen,
        toggleNodeMenu,
        setNodeComments,
        activePluginToComment,

        previewMode,
        metricsData,
        errorStages,
        isErrorStage: () => errorStages?.includes(node.name),
        index,
      },
      draggable: !isDisabled,
    };
  }

  function connectionToDagEdge(conn): Edge {
    const { from, to, condition } = conn;
    const sourceNode = getNodeByName(from);
    const targetNode = getNodeByName(to);

    let edgeType = 'standard';
    if (
      sourceNode.type === 'action' ||
      targetNode.type === 'action' ||
      sourceNode.type === 'sparkprogram' ||
      targetNode.type === 'sparkprogram'
    ) {
      edgeType = 'dashed';
    }

    const edge: Edge =  {
      id: `edge-${from}-${to}`,
      type: edgeType,
      source: from,
      target: to,
      reconnectable: 'target',
      data: {
        isSourceAtBottom: false,
      },
    };

    if (!sourceNode || !targetNode) {
      return edge;
    } 

    const isConditionEdge = condition === 'false';
    const isAlertEdge = targetNode.type === 'alertpublisher';
    const isErrorEdge = targetNode.type === 'errortransform';
    const isSplitterEdge = sourceNode.type === 'splittertransform';

    let handleType = 'default';
    let sourceHandle = `source-port-${sourceNode.id}-output`;
    if (isAlertEdge) {
      sourceHandle = `source-port-${sourceNode.id}-alerts`;
      handleType = 'alert';
    } else if (isErrorEdge) {
      sourceHandle = `source-port-${sourceNode.id}-errors`;
      handleType = 'error';
    } else if (isConditionEdge) {
      sourceHandle = `source-port-${sourceNode.id}-condition-false`;
      handleType = 'condition-false';
    } else if (isSplitterEdge) {
      sourceHandle = `source-port-${sourceNode.id}-${conn.port}`;
      handleType = 'splitter-port'
    }

    if (sourceNode.type === 'condition') {
      if (handleType === 'default') {
        edgeType = 'condition-true';
      } else if (handleType ===  'condition-false') {
        edgeType = 'condition-false';
      }
    }

    return {
      ...edge,
      type: edgeType,
      sourceHandle,
      data: {
        isSourceAtBottom: isAlertEdge || isErrorEdge || isConditionEdge,
      }
    };
  }

  function fitToScreen () {
    reactflow.fitView({
      padding: 50,
      minZoom: MIN_ZOOM,
      maxZoom: MAX_ZOOM,
    });
  }

  useEffect(() => {
    document.body.classList.add('with-new-dag-editor');
    reactflow.zoomTo(0.5);
    fitToScreen();

    return () => {
      document.body.classList.remove('with-new-dag-editor');
    };
  }, []);

  useEffect(() => {
    if (previewMode) document.body.classList.add('preview-mode');

    return () => {
      document.body.classList.remove('preview-mode');
    };
  }, [previewMode])

  useEffect(fitToScreen, [uiAutoLayout]);

  function handleReconnect(oldEdge, newConn) {
    edgeReconnectSuccessful.current = true;
    onReconnect(oldEdge, newConn);
  }

  function handleReconnectStart() {
    edgeReconnectSuccessful.current = false;
  }

  function handleReconnectEnd(_, edge) {
    if (!edgeReconnectSuccessful.current) {
      onEdgesDelete([edge]);
    }

    edgeReconnectSuccessful.current = true;
  }

  return (
    <Provider store={AvailablePluginsStore}>
      <DAGEditorContext.Provider value={{ isDisabled }}>
        <ReactFlow
          id="diagram-container"
          nodes={nodes}
          edges={edges}
          nodeTypes={NODE_TYPES}
          edgeTypes={EDGE_TYPES}
          nodesConnectable={!isDisabled}
          onNodesChange={isDisabled ? undefined : onNodesChange}
          onEdgesChange={isDisabled ? undefined : onEdgesChange}
          onConnect={isDisabled ? undefined : onConnect}
          onReconnectStart={isDisabled ? undefined : handleReconnectStart}
          onReconnect={isDisabled ? undefined : handleReconnect}
          onReconnectEnd={isDisabled ? undefined : handleReconnectEnd}
          onEdgesDelete={isDisabled ? undefined : onEdgesDelete}
          proOptions={proOptions}
          connectionRadius={55}
          connectionLineType={ConnectionLineType.SmoothStep}
          connectionLineComponent={EdgeInProgress}
          isValidConnection={isValidConnection}
          minZoom={MIN_ZOOM}
        >
          <Controls position="top-right" style={{ top: 80 }}>
            {!isDisabled && (
              <>
                <ControlButton 
                  onClick={cleanupGraph}
                  title="Align"
                  data-testid="pipeline-clean-up-graph-control"
                >
                  <DragIndicatorIcon />
                </ControlButton>
                <ControlButton
                  onClick={undoActions}
                  title="Undo (Ctrl/Cmd + Z)"
                  disabled={undoStates.length === 0}
                  data-testid="pipeline-undo-action-btn"
                >
                  <UndoIcon fontSize="small" />
                </ControlButton>
                <ControlButton
                  onClick={redoActions}
                  title="Redo (Ctrl/Cmd + Shift + Z)"
                  disabled={redoStates.length === 0}
                  data-testid="pipeline-redo-action-btn"
                >
                  <RedoIcon fontSize="small" />
                </ControlButton>
              </>
            )}

            <PipelineCommentsActionBtn
              tooltip="Show/Hide Pipeline Comments"
              comments={pipelineComments}
              onChange={setPipelineComments}
              disabled={isDisabled}
              isV2={true}
            ></PipelineCommentsActionBtn>
          </Controls>
          {/* <MiniMap zoomable pannable style={{ bottom: 80 }} /> */}
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          { !isDisabled && 
            <PipelineContextMenu
              onWranglerSourceAdd={onPipelineContextMenuPaste}
              onNodesPaste={onPipelineContextMenuPaste}
              pipelineArtifactType={pipelineArtifactType}
              onZoomIn={reactflow.zoomIn}
              onZoomOut={reactflow.zoomOut}
              fitToScreen={fitToScreen}
              prettyPrintGraph={cleanupGraph}
            />
          }
        </ReactFlow>
      </DAGEditorContext.Provider>
    </Provider>
  );
}

export default function DagEditor(props: IDAGEditorProps) {
  return (
    <ReactFlowProvider>
      <DagComponent {...props} />
    </ReactFlowProvider>
  );
}
