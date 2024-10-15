/*
 * Copyright © 2024 Cask Data, Inc.
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

import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { Handle, NodeProps, Position } from 'reactflow';
import CommentIcon from '@material-ui/icons/Comment';
import {
  getCustomIconSrc,
  shouldShowCustomIcon,
} from 'components/hydrator/components/SidePanel/helpers';
import { Button, IconButton } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

const targetHandleStyle = {};
const sourceHandleStyle = {
  width: '12px',
  height: '12px',
  borderRadius: '6px',
  right: '-5px',
  background: '#b1b1b7',
};

const NODE_HIGHLIGHT_COLORS = {
  batchsource: '#48c038',
  transform: '#4586f3',
  batchsink: '#8367df',
  action: '#988470',
  condition: '#4e5568',
  alertpublisher: '#ffba01',
  errortransform: '#d40001',
};

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

export function PipelineComments({ comments }) {
  if (comments.length < 1) {
    return null;
  }

  return (
    <CommentsIconContainer>
      <CommentIcon color="primary" fontSize="large" />
    </CommentsIconContainer>
  );
}

export function PipelineNode({ id, data, selected }: NodeProps) {
  const pluginsMap = useSelector((state) => state.availablePlugins.pluginsMap);
  const node = data.pluginNode;
  const hasCustomIcon = shouldShowCustomIcon(node.plugin, pluginsMap);

  console.log(data, hasCustomIcon, pluginsMap);

  return (
    <>
      <Handle type="target" position={Position.Left} id="in-handle" style={targetHandleStyle} />
      <NodeContainer
        data-cy={'TODO: add testid'}
        data-testid={'TODO: add testid'}
        selected={selected}
        nodeType={node.type}
      >
        <PipelineComments comments={node?.information?.comments?.list || [1]} />
        {node.errorCount && (
          <NodeErrorsAndWarningsCount isWarning={!node.error}>
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
          <NodeButtonsContainer>
            <Button variant="text" color="primary" size="medium">
              PROPERTIES
            </Button>
            <IconButton size="small">
              <MenuIcon />
            </IconButton>
          </NodeButtonsContainer>
        </NodeInnerLayout>
      </NodeContainer>
      <Handle type="source" position={Position.Right} id="out-handle" style={sourceHandleStyle} />
    </>
  );
}

export const NODE_TYPES = {
  default: PipelineNode,
  pipelineNode: PipelineNode,
};
