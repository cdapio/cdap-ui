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
import { Handle, NodeProps, Position } from 'reactflow';
import styled from 'styled-components';
import classnames from 'classnames';
import { IPipelineNodeData } from '../store/diffSlice';
import { getPluginDiffColors } from '../util/helpers';
import { DiffIcon } from '../DiffIcon';

const NodeRoot = styled.div`
  position: relative;
  height: 110px;
  width: 200px;
  border: 2px solid ${({ color }) => color};
  border-radius: 5px;
  background: white;
  display: flex;
  flex-direction: column;
`;

const HeaderRoot = styled.div`
  width: 100%;
  display: flex;
`;

const CustomIconRoot = styled.img`
  &&& {
    width: 25px;
    height: 25px;
    margin: 10px;
  }
`;

const IconRoot = styled.div`
  &&& {
    font-size: 25px;
    padding: 10px;
  }
`;

const TitleContainer = styled.div`
  flex-grow: 1;
  padding-top: 10px;
  min-width: 0;
`;

const TitleLabel = styled.label`
  display: block;
  color: ${({ color }) => color};
  font-size: 14px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

const SubtitleLabel = styled(TitleLabel)`
  font-size: 10px;
  color: ${({ color }) => color};
`;

const DiffIconRoot = styled(DiffIcon)`
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(50%, -50%);
`;

const HandleRoot = styled(Handle)`
  width: 14px;
  height: 14px;
  background-color: #4e5568;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AlertHandleRoot = styled(HandleRoot)`
  left: 30px;
`;

const ErrorHandleRoot = styled(HandleRoot)`
  left: 60px;
`;

const BottomHandleLabel = styled.span`
  font-size: 11px;
  position: absolute;
  top: -16px;
  color: ${({ color }) => color};
`;

export const DefaultPluginNode = ({
  id,
  data,
  children,
}: React.PropsWithChildren<NodeProps<IPipelineNodeData>>) => {
  const diffIndicator = data.diffItem?.diffIndicator;
  const { primary, primaryLight } = getPluginDiffColors(diffIndicator);
  return (
    <NodeRoot id={id} color={primary}>
      <HeaderRoot>
        {data.customIconSrc ? (
          <CustomIconRoot src={data.customIconSrc} />
        ) : (
          <IconRoot className={classnames('node-icon fa', data.iconName)} />
        )}
        <TitleContainer>
          <TitleLabel color={primary}>{data.plugin.label}</TitleLabel>
          <SubtitleLabel color={primaryLight}>{data.plugin.artifact.version}</SubtitleLabel>
        </TitleContainer>
      </HeaderRoot>
      {diffIndicator && <DiffIconRoot diffType={diffIndicator} fontSize="large" />}
      <HandleRoot type="target" position={Position.Left} />
      <HandleRoot type="source" id="source_right" position={Position.Right} />
      {children}
    </NodeRoot>
  );
};

export const PluginNodeWithAlertError = (props: NodeProps<IPipelineNodeData>) => {
  const { data } = props;
  const diffIndicator = data.diffItem?.diffIndicator;
  const { primaryLightest } = getPluginDiffColors(diffIndicator);

  return (
    <DefaultPluginNode {...props}>
      <AlertHandleRoot type="source" id="source_alert" position={Position.Bottom}>
        <BottomHandleLabel color={primaryLightest}>Alert</BottomHandleLabel>
      </AlertHandleRoot>
      <ErrorHandleRoot type="source" id="source_error" position={Position.Bottom}>
        <BottomHandleLabel color={primaryLightest}>Error</BottomHandleLabel>
      </ErrorHandleRoot>
    </DefaultPluginNode>
  );
};
