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
import { EdgeProps, EdgeLabelRenderer, BaseEdge, getSmoothStepPath } from 'reactflow';
import styled from 'styled-components';

import { DiffIcon } from '../DiffIcon';
import { IPipelineEdgeData } from '../types';

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
}: EdgeProps<IPipelineEdgeData>) => {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  return (
    <>
      <BaseEdge path={edgePath} {...props} />
      {data.diffIndicator && (
        <EdgeLabelRenderer>
          <DiffIconRoot diffIndicator={data.diffIndicator} labelX={labelX} labelY={labelY} />
        </EdgeLabelRenderer>
      )}
    </>
  );
};
