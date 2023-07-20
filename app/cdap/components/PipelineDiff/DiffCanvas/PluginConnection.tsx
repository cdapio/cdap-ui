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
import {
  EdgeProps,
  EdgeLabelRenderer,
  BaseEdge,
  getSmoothStepPath,
  useReactFlow,
  useStoreApi,
} from 'reactflow';
import styled from 'styled-components';

import { DiffIndicator } from '../types';
import { DiffIcon } from '../DiffIcon';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { actions } from '../store/diffSlice';

const DiffIconRoot = styled(DiffIcon)`
  position: absolute;
  transform: translate(-50%, -50%)
    translate(${({ labelX }) => labelX}px, ${({ labelY }) => labelY}px);
`;

export const PluginConnection = ({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  ...props
}: EdgeProps<{ diffIndicator?: DiffIndicator }>) => {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  const dispatch = useAppDispatch();
  const { fitBounds } = useReactFlow();
  const store = useStoreApi();
  const { nodeInternals } = store.getState();
  const fromNode = nodeInternals.get(source);
  const toNode = nodeInternals.get(target);

  const focusElement = useAppSelector((state) => {
    return state.pipelineDiff.focusElement;
  });

  useEffect(() => {
    if (focusElement === id) {
      const x1 = Math.min(fromNode.position.x, toNode.position.x);
      const y1 = Math.min(fromNode.position.y, toNode.position.y);

      const x2 = Math.max(fromNode.position.x + fromNode.width, toNode.position.x + toNode.width);
      const y2 = Math.max(fromNode.position.y + fromNode.height, toNode.position.y + toNode.height);
      const bounds = {
        x: x1,
        y: y1,
        width: x2 - x1,
        height: y2 - y1,
      };
      fitBounds(bounds, { duration: 1000 });
      dispatch(actions.focused());
    }
  }, [fromNode, toNode, focusElement]);

  return (
    <>
      <BaseEdge path={edgePath} {...props} />
      {data.diffIndicator && (
        <EdgeLabelRenderer>
          <DiffIconRoot diffType={data.diffIndicator} labelX={labelX} labelY={labelY} />
        </EdgeLabelRenderer>
      )}
    </>
  );
};
