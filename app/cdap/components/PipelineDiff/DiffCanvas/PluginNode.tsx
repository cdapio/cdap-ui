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

import React, { useEffect } from 'react';
import { Handle, NodeProps, Position, useReactFlow, useStoreApi } from 'reactflow';
import styled from 'styled-components';
import classnames from 'classnames';
import { IPipelineNodeData, actions } from '../store/diffSlice';
import { getPluginDiffColors } from '../util/helpers';
import { DiffIcon } from '../DiffIcon';
import Button from '@material-ui/core/Button';
import { getStageDiffKey } from '../util/diff';
import { useAppDispatch, useAppSelector } from '../store/hooks';

const NodeRoot = styled.div`
  background: white;
  border-radius: 5px;
  border: 2px solid ${({ color }) => color};
  display: flex;
  flex-direction: column;
  height: 110px;
  position: relative;
  width: 200px;
`;

const HeaderRoot = styled.div`
  display: flex;
  width: 100%;
`;

const CustomIconRoot = styled.img`
  &&& {
    height: 25px;
    margin: 10px;
    width: 25px;
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
  min-width: 0;
  padding-top: 10px;
`;

const TitleLabel = styled.label`
  color: ${({ color }) => color};
  display: block;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const SubtitleLabel = styled(TitleLabel)`
  color: ${({ color }) => color};
  font-size: 10px;
`;

const DiffIconRoot = styled(DiffIcon)`
  font-size: 2.3rem;
  position: absolute;
  right: 0;
  top: 0;
  transform: translate(50%, -50%);
`;

const DiffButtonContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  padding-top: 3px;
  width: 100%;
`;

const DiffButtonRoot = styled(Button)`
  color: ${({ color }) => color};
  border-color: ${({ color }) => color};
`;

const HandleRoot = styled(Handle)`
  align-items: center;
  background-color: #4e5568;
  border-radius: 100%;
  display: flex;
  height: 14px;
  justify-content: center;
  width: 14px;
`;

const AlertHandleRoot = styled(HandleRoot)`
  left: 30px;
`;

const ErrorHandleRoot = styled(HandleRoot)`
  left: 60px;
`;

const BottomHandleLabel = styled.span`
  color: ${({ color }) => color};
  font-size: 11px;
  position: absolute;
  top: -16px;
`;

export const DefaultPluginNode = ({
  id,
  data,
  children,
}: React.PropsWithChildren<NodeProps<IPipelineNodeData>>) => {
  const diffIndicator = data.diffItem?.diffIndicator;
  const { primary, primaryLight } = getPluginDiffColors(diffIndicator);
  const dispatch = useAppDispatch();

  const { fitBounds } = useReactFlow();
  const store = useStoreApi();
  const { nodeInternals } = store.getState();
  const node = nodeInternals.get(id);

  const focusElement = useAppSelector((state) => {
    return state.pipelineDiff.focusElement;
  });

  useEffect(() => {
    if (focusElement && focusElement === data.diffKey) {
      const cx = node.position.x + node.width / 2;
      const cy = node.position.y + node.height / 2;
      fitBounds(
        {
          x: cx - node.width,
          y: cy - node.height,
          width: node.width * 2,
          height: node.height * 2,
        },
        { duration: 1000 }
      );
      dispatch(actions.focused());
    }
  }, [node, focusElement]);

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

      {diffIndicator && (
        <DiffButtonContainer>
          <DiffButtonRoot
            variant="outlined"
            size="small"
            color={primary}
            onClick={() => dispatch(actions.showDiffDetails(getStageDiffKey(data)))}
          >
            Diff
          </DiffButtonRoot>
        </DiffButtonContainer>
      )}
      {diffIndicator && <DiffIconRoot diffType={diffIndicator} />}
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
