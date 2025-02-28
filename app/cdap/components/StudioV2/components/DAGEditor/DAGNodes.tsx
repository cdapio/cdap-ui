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

import React, { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { Handle, NodeProps, Position, useUpdateNodeInternals } from 'reactflow';
import _noop from 'lodash/noop';

import CommentIcon from '@material-ui/icons/Comment';
import {
  getCustomIconSrc,
  shouldShowCustomIcon,
} from 'components/hydrator/components/SidePanel/helpers';
import Comment from 'components/AbstractWidget/Comment';
import PluginContextMenu, { getPluginMenuOptions } from 'components/PluginContextMenu';

import { Button, IconButton, ListItemIcon, Menu, MenuItem } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import {
  setMetricsTabActive,
  setSelectedPlugin,
} from 'services/PipelineMetricsStore/ActionCreator';
import ErrorStageOutline from 'components/PipelineDetails/PipelineDetailsTopPanel/PipelineRunErrorDetails/ErrorStageOutline';
import { DAGEditorContext } from '.';
import {
  AlertHandle,
  ErrorHandle,
  FalseHandle,
  disabledSourceHandleStyle,
  sourceHandleStyle,
  targetHandleStyle,
} from './NodeHandleStyles';
import SplitterPopover, { PortContainer } from './SplitterPopover';
import NodeMetrics from './NodeMetrics';
import { isPluginSink } from 'services/helpers';

const NODE_HIGHLIGHT_COLORS = {
  batchsource: '#48c038',
  transform: '#4586f3',
  batchsink: '#8367df',
  action: '#988470',
  condition: '#4e5568',
  alertpublisher: '#ffba01',
  errortransform: '#d40001',
};

type ConditionHandle = 'CONDITION_TRUE' | 'CONDITION_FALSE';
type NodeHandle = ConditionHandle | 'GENERIC';

const conditionHandleStyles = {
  CONDITION_TRUE: sourceHandleStyle,
  CONDITION_FALSE: sourceHandleStyle,
};

function getNodeHandleStyle({
  nodeType,
  isDisabled,
  handleType = 'GENERIC',
}: {
  nodeType?: string;
  isDisabled?: boolean;
  handleType?: NodeHandle;
}) {
  if (isDisabled) {
    return disabledSourceHandleStyle;
  }

  if (nodeType === 'condition') {
    return conditionHandleStyles[handleType] || sourceHandleStyle;
  }

  return sourceHandleStyle;
}

const DEFAULT_TEXT_COLOR = '#4a4a4a';
const DEFAULT_HIGHLIGHT_COLOR = 'rgba(0, 0, 0, 0.5)';
const DEFAULT_SHADOW_COLOR = 'rgba(0, 0, 0, 0.3)';

function getNodeBorder(nodeType, selected) {
  const color = NODE_HIGHLIGHT_COLORS[nodeType] || DEFAULT_HIGHLIGHT_COLOR;
  const width = selected ? '2px' : '1px';

  return `${width} ${color} solid`;
}

function getNodeShadow(nodeType, selected) {
  const color = selected
    ? NODE_HIGHLIGHT_COLORS[nodeType] || DEFAULT_SHADOW_COLOR
    : DEFAULT_SHADOW_COLOR;
  const spread = selected ? '15px' : '10px';

  return `0 0 ${spread} ${color}`;
}

const NodeContainer = styled.div`
  position: relative;
  margin-left: 2px;
  padding: 8px 12px 4px 12px;

  background: white;
  width: 200px;
  height: 100px;
  border-radius: 8px;
  box-shadow: ${({ nodeType, selected }) => getNodeShadow(nodeType, selected)};
  border: ${({ nodeType, selected }) => getNodeBorder(nodeType, selected)};
  box-sizing: content-box;
`;

const CommentsIconContainer = styled.div`
  position: absolute;
  right: 0;
  top: -30px;
`;

const NodeErrorsAndWarningsCount = styled.div`
  position: absolute;
  top: 3px;
  right: 3px;

  display: inline-block;
  padding: 0.5em;
  font-weight: 700;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  border-radius: 0.25em;
  background: ${({ isWarning }) => (isWarning ? '#ffcc00' : 'ff6666')};
  color: white;
`;

const NodeInnerLayout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: space-between;
  height: 100%;
`;

const NodeInfoContainer = styled.div`
  display: flex;
  justify-content: flex-start;
`;

const PluginIconContainer = styled.div`
  width: 25px;
  height: 25px;
  min-width: 25px;
  min-height: 25px;

  margin-right: 10px;
  margin-top: 4px;
`;

const PluginIconImage = styled.img`
  width: 25px;
  height: 25px;
`;

const PluginIconDefault = styled.div`
  width: 25px;
  height: 25px;
  font-size: 25px;
`;

const PluginMetaContainer = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PluginName = styled.div`
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 2px;
  color: ${DEFAULT_TEXT_COLOR};
`;

const PluginVersion = styled.div`
  font-size: 11px;
  color: ${DEFAULT_TEXT_COLOR};
`;

const NodeButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SplitterHandlesContainer = styled.div`
  position: absolute;
  left: calc(100% + 8px);
  top: 0;
  width: 80px;

  transform: translateY(calc((100px - 100%) / 2));
  display: flex;
  flex-direction: column;
  align-items: stretch;
  background: white;
  border-radius: 8px;
  box-shadow: ${({ nodeType, selected }) => getNodeShadow(nodeType, selected)};
  border: ${({ nodeType, selected }) => getNodeBorder(nodeType, selected)};
`;

const BottomPortsContainer = styled.div`
  display: ${({ isVisible }) => (isVisible ? 'flex' : 'none')};
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  height: 32px;
  border-radius: 10px;
  align-items: stretch;
  background: white;
  box-shadow: ${({ nodeType, selected }) => getNodeShadow(nodeType, selected)};
  border: ${({ nodeType, selected }) => getNodeBorder(nodeType, selected)};

  & > div {
    border-right: 1px ${DEFAULT_HIGHLIGHT_COLOR} solid;

    &:last-child {
      border-right: none;
    }
  }
`;

export function PipelineComments({
  comments = [],
  node,
  setComments = _noop,
  activePluginToComment = '',
  setPluginActiveForComment = _noop,
  isDisabled,
}) {
  if (comments.length < 1 && activePluginToComment !== node.id) {
    return null;
  }

  return (
    <CommentsIconContainer>
      <Comment
        comments={comments}
        commentsId={node.id}
        onChange={setComments}
        placement="bottom-start"
        isOpen={activePluginToComment === node.id}
        onOpen={setPluginActiveForComment}
        onClose={() => setPluginActiveForComment()}
        disabled={isDisabled}
      />
    </CommentsIconContainer>
  );
}

export function PipelineNode({ id, data, selected }: NodeProps) {
  const updateNodeInternals = useUpdateNodeInternals();
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const pluginsMap = useSelector((state) => state.pluginsMap);
  const node = data.pluginNode;

  const hasCustomIcon = shouldShowCustomIcon(node.plugin, pluginsMap);
  const { isDisabled } = useContext(DAGEditorContext);
  const shouldShowAlertsPort = data.shouldShowAlertsPort(node);
  const shouldShowErrorsPort = data.shouldShowErrorsPort(node);
  const hasBottomPorts = node.type === 'condition' || shouldShowAlertsPort || shouldShowErrorsPort;

  useEffect(() => updateNodeInternals(id), [
    node?.outputSchema,
    node.type,
    shouldShowAlertsPort,
    shouldShowErrorsPort,
  ]);

  function handlePropertiesClick() {
    if (typeof data.onPropertiesClick === 'function') {
      data.onPropertiesClick(node);
    }
  }

  function handleMenuClick(event) {
    setMenuAnchorEl(event.target);
    data.toggleNodeMenu(node);
  }

  function handleMenuClose() {
    setMenuAnchorEl(null);
    data.toggleNodeMenu(node);
  }

  const pluginMenuItems = getPluginMenuOptions({
    nodeId: node.id,
    getPluginConfiguration: data.getPluginConfiguration,
    getSelectedConnections: data.getSelectedConnections,
    getSelectedNodes: data.getSelectedNodes,
    onDelete: data.onSelectedDelete,
    onAddComment: data.onPluginAddComment,
  });

  function handleMenuItemClick(onClickHandler) {
    return () => {
      handleMenuClose();
      if (typeof onClickHandler === 'function') {
        onClickHandler();
      }
    };
  }

  return (
    <>
      <Handle type="target" position={Position.Left} id="target-handle" style={targetHandleStyle} />
      <NodeContainer
        data-testid={`plugin-node-${node.plugin.name}-${node.type}-${data.index}`}
        selected={selected}
        nodeType={node.type}
        id={node.id}
      >
        {data.isErrorStage() && <ErrorStageOutline stageName={node.name}></ErrorStageOutline>}
        <PipelineComments
          comments={node?.information?.comments?.list || []}
          node={node}
          setComments={data.setNodeComments}
          setPluginActiveForComment={data.onPluginAddComment}
          activePluginToComment={data.activePluginToComment}
          isDisabled={isDisabled}
        />
        {!!node.errorCount && (
          <NodeErrorsAndWarningsCount isWarning={!node.error} onClick={handlePropertiesClick}>
            {node.errorCount}
          </NodeErrorsAndWarningsCount>
        )}
        <NodeInnerLayout>
          <NodeInfoContainer>
            <PluginIconContainer>
              {hasCustomIcon ? (
                <PluginIconImage src={getCustomIconSrc(node.plugin, pluginsMap)} alt={data.label} />
              ) : (
                <PluginIconDefault className={`node-icon fa ${node.icon}`}></PluginIconDefault>
              )}
            </PluginIconContainer>
            <PluginMetaContainer>
              <PluginName>{data.label}</PluginName>
              <PluginVersion>{node.plugin.artifact.version}</PluginVersion>
            </PluginMetaContainer>
          </NodeInfoContainer>
          {data.previewMode && !['action', 'sparkprogram', 'condition'].includes(node.type) && (
            <NodeButtonsContainer>
              <Button
                variant="text"
                color="default"
                size="small"
                data-testid={`${node.plugin.name}-preview-data-btn`}
                onClick={(event) => data.onPreviewData(event, node)}
              >
                Preview Data
              </Button>
            </NodeButtonsContainer>
          )}
          <NodeButtonsContainer>
            <Button
              variant="text"
              color="primary"
              size="small"
              onClick={handlePropertiesClick}
              disabled={!node.isPluginAvailable}
              data-testid="node-properties-btn"
            >
              PROPERTIES
            </Button>
            {isDisabled ? (
              <div />
            ) : (
              <IconButton
                size="small"
                data-testid={`hamburgermenu-${node.plugin.name}-${node.type}-${data.index}-toggle`}
                disabled={isDisabled || data.nodeMenuOpen === node.name}
                onClick={handleMenuClick}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Menu
              anchorEl={menuAnchorEl}
              keepMounted
              open={Boolean(menuAnchorEl)}
              onClose={handleMenuClose}
            >
              {pluginMenuItems.map((item) => (
                <MenuItem onClick={handleMenuItemClick(item.onClick)} key={item.name}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <span>{typeof item.label === 'function' ? item.label() : item.label}</span>
                </MenuItem>
              ))}
            </Menu>
          </NodeButtonsContainer>
          {isDisabled && !['action', 'sparkprogram', 'condition'].includes(node.type) && (
            <div className="node-metrics">
              <NodeMetrics
                onClick={data.onMetricsClick}
                node={node}
                disabled={data.disableMetricsClick}
                metricsData={data.metricsData}
              />
            </div>
          )}
        </NodeInnerLayout>
        {node.type === 'splittertransform' && (
          <SplitterHandlesContainer selected={selected} nodeType={node.type}>
            {node?.outputSchema?.length && node.outputSchema[0].name !== 'etlSchemaBody' ? (
              <SplitterPopover
                node={node}
                isDisabled={isDisabled}
                ports={node.outputSchema || []}
                onMetricsClick={data.onMetricsClick}
                disableMetricsClick={data.disableMetricsClick}
                metricsData={data.metricsData}
              />
            ) : (
              <PortContainer>0 Splits</PortContainer>
            )}
          </SplitterHandlesContainer>
        )}
        <BottomPortsContainer isVisible={hasBottomPorts} selected={selected} nodeType={node.type}>
          {node.type === 'condition' && (
            <FalseHandle>
              False
              <Handle
                type="source"
                position={Position.Bottom}
                id={`source-port-${node.id}-condition-false`}
                style={getNodeHandleStyle({
                  nodeType: node.type,
                  isDisabled,
                  handleType: 'CONDITION_FALSE',
                })}
                data-testid={`plugin-endpoint-${node.plugin.name}-${node.type}-false`}
              />
            </FalseHandle>
          )}
          {!!shouldShowAlertsPort && (
            <AlertHandle>
              Alert
              <Handle
                type="source"
                position={Position.Bottom}
                id={`source-port-${node.id}-alerts`}
                style={getNodeHandleStyle({
                  nodeType: node.type,
                  isDisabled,
                  handleType: 'GENERIC',
                })}
                data-testid={`plugin-endpoint-${node.plugin.name}-${node.type}-alerts`}
              />
            </AlertHandle>
          )}
          {!!shouldShowErrorsPort && (
            <ErrorHandle>
              Error
              <Handle
                type="source"
                position={Position.Bottom}
                id={`source-port-${node.id}-errors`}
                style={getNodeHandleStyle({
                  nodeType: node.type,
                  isDisabled,
                  handleType: 'GENERIC',
                })}
                data-testid={`plugin-endpoint-${node.plugin.name}-${node.type}-errors`}
              />
            </ErrorHandle>
          )}
        </BottomPortsContainer>
      </NodeContainer>
      {node.type !== 'splittertransform' && !isPluginSink(node.type) && (
        <Handle
          type="source"
          position={Position.Right}
          id={`source-port-${node.id}-output`}
          style={getNodeHandleStyle({
            nodeType: node.type,
            isDisabled,
            handleType: node.type === 'condition' ? 'CONDITION_TRUE' : 'GENERIC',
          })}
          data-testid={`plugin-endpoint-${node.plugin.name}-${node.type}-right`}
        />
      )}
      {!isDisabled && (
        <PluginContextMenu
          nodeId={node.id}
          getPluginConfiguration={data.getPluginConfiguration}
          getSelectedConnections={data.getSelectedConnections}
          getSelectedNodes={data.getSelectedNodes}
          onDelete={data.onSelectedDelete}
          onOpen={data.onPluginMenuOpen}
          onAddComment={data.onPluginAddComment}
        />
      )}
    </>
  );
}

export const NODE_TYPES = {
  default: PipelineNode,
  pipelineNode: PipelineNode,
};
