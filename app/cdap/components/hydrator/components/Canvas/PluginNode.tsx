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

import { Button } from '@material-ui/core';
import React, { useEffect, useRef, useState } from 'react';
import { Handle, Position, useStore } from 'reactflow';
import classnames from 'classnames';
import styled from 'styled-components';
import MenuIcon from '@material-ui/icons/Menu';
import ThemeWrappedComment from 'components/AbstractWidget/Comment';
import PluginContextMenu from 'components/PluginContextMenu';
import { getPluginColor } from './helper';
import PrimaryOutlinedButton from 'components/shared/Buttons/PrimaryOutlinedButton';
import { NodeMetrics } from 'components/NodeMetrics';

const CommentsWrapper = styled.div`
  position: absolute;
  top: -30px;
  right: 0;
  color: #1a73e8;
  z-index: 2;
`;

const StyledDiv = styled.div`
  height: 100px;
  width: 200px;
  border: 2px solid ${(props) => props.color};
  border-radius: 5px;
  background: ${(props) => (props.selectable ? props.color : 'white')};
  z-index: 2;

  &:hover {
    border-width: 4px;
    margin: -2px;
    width: 204px;
    height: 104px;
  }

  label {
    display: block;
    color: ${(props) => (props.selectable ? 'white' : props.color)};
    font-size: 14px;
    text-overflow: ellipsis;
    overflow: hidden;
    width: 120px;
  }

  button {
    color: ${(props) => (props.selectable ? 'white' : props.color)};
    border-color: ${(props) => (props.selectable ? 'white' : props.color)};
  }

  > div {
    box-shadow: ${(props) =>
      props.previewMode ? '0 0 0 2px #f7dc6f' : '0 10px 18px -9px rgba(0, 0, 0, 0.5)'};
    position: relative;
    padding: 5px;
    height: 100%;
    z-index: 1;
  }
`;
// 0 0 0 2px #f7dc6f
const FlexDiv = styled.div`
  display: flex;
`;

const PreviewDataDiv = styled.div`
  position: absolute;
  bottom: 20px;
  left: 13px;
  a {
    font-size: 10px;
    color: ${(props) => (props.selected || props.dragging) && 'white'};
  }
`;

const NodeMetricsDiv = styled.div`
  position: absolute;
  bottom: 24px;

  width: ~'-moz-calc(100% - 24px)';
  width: ~'-webkit-calc(100% - 24px)';
  width: ~'calc(100% - 24px)';
`;

const StyledImg = styled.img`
  width: 25px;
  height: 25px;
  margin: 5px;
`;

const IconDiv = styled.div`
  margin: 5px;
  font-size: 25px !important;
`;

const ErrorDiv = styled.div`
  margin-left: auto;
  border-radius: 5px;
  background: #ffcc00;
  color: white;
  width: 20px;
  height: 20px;
  text-align: center;
  line-height: 1;
  button {
    padding: 0;
    min-width: 20px;
    color: white;
  }
`;

const CaretHandle = styled(Handle)`
  width: 14px;
  height: 14px;
  background-color: #4e5568;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  div {
    width: 0;
    height: 0;
    pointer-events: none;
    ${(props) =>
      props.position === Position.Bottom &&
      !props.isDisabled &&
      `
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-top: 7px solid #bac0d6;
        transform: translateY(1px);
      `}
    ${(props) =>
      props.position === Position.Right &&
      !props.isDisabled &&
      `
        border-top: 4px solid transparent;
        border-bottom: 4px solid transparent;
        border-left: 7px solid #bac0d6;
        transform: translateX(1px)
      `}
  }
  &:hover {
    background-color: #58b7f6;
  }
  &:hover > div {
    width: 0;
    height: 0;
    pointer-events: none;
    ${(props) =>
      props.position === Position.Bottom &&
      !props.isDisabled &&
      `
        border-left: 7px solid transparent;
        border-right: 7px solid transparent;
        border-top: 7px solid #58b7f6;
        transform: translateY(15px);
      `}
    ${(props) =>
      props.position === Position.Right &&
      !props.isDisabled &&
      `
        border-top: 7px solid transparent;
        border-bottom: 7px solid transparent;
        border-left: 7px solid #58b7f6;
        transform: translateX(15px);
      `}
  }
  span {
    font-size: 11px;
    position: absolute;
    top: -16px;
    color: #b9c0d8;
  }
  ${(props) => props.id === 'source_error' && `transform: translate(-40px, 0)`}
  ${(props) => props.id === 'source_alert' && `transform: translate(-70px, 0)`}
`;

const NodeMenu = styled.div`
  display: flex;
  position: absolute;
  bottom: 0;
  right: 0;
  align-items: center;
  button {
    min-width: 20px;
  }
`;

/**
 * This is to achieve the effect of dropping connection line onto anywhere inside
 * a plugin will establish a connection.
 * Reactflow's connection depends on the Handle component, we need to make the handle the
 * same width and height as the plugin node. But one caveat is that this will prevent
 * dragging the node on the canvas. One solution is to check the state of whether the user
 * is currently drawing a connection line by checking the reactflowStore. If not drawing,
 * pointer-events will be disabled on the TargetHandle so that the user will be able to drag
 * the node. Otherwise, pointer-events will be allowed so that the user can attach the connection
 * to the node.
 */
const TargetHandle = styled(Handle)`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 0;
  transform: none;
  border: none;
  opacity: 0;
  ${(props) => !props.isDrawing && `pointer-events: none !important;`}
`;

const isDrawingConnection = (state) => {
  return state.connectionHandleId !== null;
};

interface IPluginNodeProps {
  data: any;
  selected: boolean;
  dragging: boolean;
  showAlertsPort?: boolean;
  showErrorsPort?: boolean;
}

export const PluginNode = ({
  data,
  selected,
  dragging,
  showAlertsPort,
  showErrorsPort,
}: IPluginNodeProps) => {
  const {
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
    idx,
  } = data;

  const [isEntered, setIsEntered] = useState(false);
  const [isCommentBoxOpen, setIsCommentBoxOpen] = useState(false);

  const isDrawing = useStore(isDrawingConnection);

  const imgUrl = getCustomIconSrc(node);

  const handleMouseEnter = () => {
    setIsEntered(true);
  };

  const handleMouseLeave = () => {
    setIsEntered(false);
  };

  // open contextmenu on button click
  const buttonRef = useRef(null);
  const handleButtonClick = (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    // Create a new contextmenu event
    const contextMenuEvent = new MouseEvent('contextmenu', {
      bubbles: true,
      cancelable: true,
      view: window,
      clientX: mouseX,
      clientY: mouseY,
    });
    // Dispatch the contextmenu event on the button element
    buttonRef.current.dispatchEvent(contextMenuEvent);
  };

  return (
    <>
      {(node?.information?.comments?.list || isCommentBoxOpen) && (
        <CommentsWrapper>
          <ThemeWrappedComment
            comments={node?.information?.comments?.list}
            commentsId={node.id}
            isOpen={isCommentBoxOpen}
            placement="bottom-start"
            onChange={setPluginComments}
            onOpen={() => {
              setPluginActiveForComment(node.id);
              setIsCommentBoxOpen(true);
            }}
            onClose={() => {
              setPluginActiveForComment(null);
              setIsCommentBoxOpen(false);
            }}
          />
        </CommentsWrapper>
      )}

      <StyledDiv
        id={node.id}
        color={getPluginColor(node.type)}
        selectable={(selected || dragging) && !isDisabled}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        isEntered={isEntered}
        previewMode={previewMode}
        data-cy={`plugin-node-${node.plugin.name}-${node.type}-${idx}`}
        data-testid={`plugin-node-${node.plugin.name}-${node.type}-${idx}`}
      >
        <div>
          <FlexDiv>
            {imgUrl ? (
              <div>
                <StyledImg src={imgUrl} />
              </div>
            ) : (
              <IconDiv className={classnames('node-icon fa', node.icon)}></IconDiv>
            )}
            <div>
              <div
                className="node-name"
                title={node.plugin.label}
                data-testid={`plugin-node-name-${node.plugin.name}-${node.type}-${idx}`}
              >
                <label htmlFor="text" style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  {node.plugin.label}
                </label>
              </div>
              {isEntered ? (
                <PrimaryOutlinedButton
                  onClick={() => {
                    onPropertiesClick(node);
                  }}
                  size="small"
                  data-cy="node-properties-btn"
                  data-testid="node-properties-btn"
                >
                  Properties
                </PrimaryOutlinedButton>
              ) : (
                <label style={{ fontSize: '10px' }}>{node.plugin.artifact.version}</label>
              )}
            </div>
            {node.errorCount > 0 && (
              <ErrorDiv>
                <Button
                  onClick={() => {
                    onPropertiesClick(node);
                  }}
                >
                  {node.errorCount}
                </Button>
              </ErrorDiv>
            )}
          </FlexDiv>
          {previewMode && (
            <PreviewDataDiv selected={selected} dragging={dragging}>
              <a
                onClick={(event) => {
                  onPreviewData(event, node);
                }}
              >
                Preview Data
              </a>
            </PreviewDataDiv>
          )}
          {isDisabled && (
            <NodeMetricsDiv>
              <NodeMetrics
                node={node}
                onClick={onMetricsClick}
                metricsData={metricsData}
                disabled={metricsDisabled}
              />
            </NodeMetricsDiv>
          )}
          <NodeMenu>
            <Button ref={buttonRef} onClick={handleButtonClick} disabled={isDisabled}>
              <MenuIcon />
            </Button>
          </NodeMenu>
          <TargetHandle type="target" position={Position.Left} isDrawing={isDrawing} />
          <CaretHandle
            id="source_right"
            type="source"
            position={Position.Right}
            isDisabled={isDisabled}
            data-cy={`plugin-endpoint-${node.plugin.name}-${node.type}-right`}
            data-testid={`plugin-endpoint-${node.plugin.name}-${node.type}-right`}
            className={`plugin-endpoint_${node.id}-right`}
          >
            <div></div>
          </CaretHandle>
          {showAlertsPort && (
            <CaretHandle
              id="source_error"
              type="source"
              position={Position.Bottom}
              isDisabled={isDisabled}
            >
              <span>Error</span>
              <div></div>
            </CaretHandle>
          )}
          {showErrorsPort && (
            <CaretHandle
              id="source_alert"
              type="source"
              position={Position.Bottom}
              isDisabled={isDisabled}
            >
              <span>Alert</span>
              <div></div>
            </CaretHandle>
          )}
        </div>
      </StyledDiv>
      {!isDisabled && (
        <PluginContextMenu
          nodeId={node.id}
          nodeName={node.name}
          getPluginConfiguration={getPluginConfiguration}
          getSelectedConnections={getSelectedConnections}
          getSelectedNodes={getSelectedNodes}
          copySelectedNodeId={copySelectedNodeId}
          deleteSelectedNodeId={deleteSelectedNodeId}
          onAddComment={() => {
            setPluginActiveForComment(node.id);
            setIsCommentBoxOpen(true);
          }}
        />
      )}
    </>
  );
};

/**
 *
 * I need this because the connection port is not really working well
 * with live rendering. It will encounter issue when importing a pipeline
 * because connections were drawn before the plugin rendered. Plugins with
 * static ports will resolve this issue
 */
export const PluginNodeWithAlertAndError = ({ data, selected, dragging }: IPluginNodeProps) => {
  return (
    <PluginNode
      data={data}
      selected={selected}
      dragging={dragging}
      showAlertsPort={true}
      showErrorsPort={true}
    />
  );
};
