/*
 * Copyright © 2023 Cask Data, Inc.
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
import { Handle, Position } from 'reactflow';
import classnames from 'classnames';
import styled from 'styled-components';

const StyledDiv = styled.div`
  height: 100px;
  width: 200px;
  border: 2px solid black;
  border-radius: 5px;
  background: white;
  z-index: 2;

  label {
    display: block;
    color: black;
    font-size: 14px;
    text-overflow: ellipsis;
    overflow: hidden;
    width: 120px;
  }
`;
// 0 0 0 2px #f7dc6f
const FlexDiv = styled.div`
  display: flex;
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

interface IPipelineDiffNodeProp {
  data: any;
}

export const PipelineDiffNode = ({ data }: IPipelineDiffNodeProp) => {
  const { node, idx } = data;

  return (
    <>
      <StyledDiv id={node.id}>
        <div>
          <FlexDiv>
            <IconDiv className={classnames('node-icon fa', node.icon)}></IconDiv>
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

              <label style={{ fontSize: '10px' }}>{node.plugin.artifact.version}</label>
            </div>
          </FlexDiv>
          <TargetHandle type="target" position={Position.Left} />
          <CaretHandle
            id="source_right"
            type="source"
            position={Position.Right}
            data-cy={`plugin-endpoint-${node.plugin.name}-${node.type}-right`}
            data-testid={`plugin-endpoint-${node.plugin.name}-${node.type}-right`}
            className={`plugin-endpoint_${node.id}-right`}
          >
            <div></div>
          </CaretHandle>
        </div>
      </StyledDiv>
    </>
  );
};
