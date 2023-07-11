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
import EditIcon from '@material-ui/icons/Edit';
import AddBoxOutlinedIcon from '@material-ui/icons/AddBoxOutlined';
import IndeterminateCheckBoxOutlinedIcon from '@material-ui/icons/IndeterminateCheckBoxOutlined';
import { DiffIndicator } from './types';
import { getPluginDiffColors } from './util/helpers';
import { SvgIcon } from '@material-ui/core';

type IconProps = ComponentProps<typeof SvgIcon>;
interface IDiffIconProps extends Omit<IconProps, 'color'> {
  diffType: DiffIndicator;
}
export function DiffIcon({ diffType, style, ...props }: IDiffIconProps) {
  const color = getPluginDiffColors(diffType).primary;
  if (diffType === DiffIndicator.ADDED) {
    return <AddBoxOutlinedIcon style={{ color, ...style }} {...props} />;
  } else if (diffType === DiffIndicator.DELETED) {
    return <IndeterminateCheckBoxOutlinedIcon style={{ color, ...style }} {...props} />;
  }
  return <EditIcon style={{ color, ...style }} {...props} />;
}
