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
import React, { ComponentProps } from 'react';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import { SvgIcon } from '@material-ui/core';
import { DiffIndicator } from './types';
import { getPluginDiffColors } from './util/helpers';
import styled from 'styled-components';

const DiffIconContainer = styled(SvgIcon)`
  border: 2px solid ${({ color }) => color};
  border-radius: 3px;
  background-color: white;
  line-height: 1;
`;

const ModifiedIcon = styled.circle`
  fill: ${({ color }) => color};
`;

type IconProps = ComponentProps<typeof SvgIcon>;
interface IDiffIconProps extends Omit<IconProps, 'color'> {
  diffType: DiffIndicator;
  className?: string;
}
export function DiffIcon({ diffType, className, ...props }: IDiffIconProps) {
  const color = getPluginDiffColors(diffType).primary;
  if (diffType === DiffIndicator.ADDED) {
    return (
      <DiffIconContainer color={color} className={className}>
        <AddIcon style={{ color }} {...props} />
      </DiffIconContainer>
    );
  } else if (diffType === DiffIndicator.DELETED) {
    return (
      <DiffIconContainer color={color} className={className}>
        <RemoveIcon style={{ color }} {...props} />
      </DiffIconContainer>
    );
  }
  return (
    <DiffIconContainer color={color} className={className}>
      <ModifiedIcon cx={'50%'} cy={'50%'} r={'4'} color={color} {...props} />
    </DiffIconContainer>
  );
}
