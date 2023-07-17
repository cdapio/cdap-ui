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
import { SvgIcon } from '@material-ui/core';
import { DiffIndicator } from './types';
import { getPluginDiffColors } from './util/helpers';

type IconProps = ComponentProps<typeof SvgIcon>;
interface IIconProps extends IconProps {
  fill?: string;
}
const AddIcon = ({ fill, ...props }: IIconProps) => {
  return (
    <SvgIcon {...props}>
      <path
        fill={fill ?? 'white'}
        d="M 19 3 H 5 c -1.11 0 -2 0.9 -2 2 v 14 c 0 1.1 0.89 2 2 2 h 14 c 1.1 0 2 -0.9 2 -2 V 5 c 0 -1.1 -0.9 -2 -2 -2 Z"
      />
      <path d="M 19 3 H 5 c -1.11 0 -2 0.9 -2 2 v 14 c 0 1.1 0.89 2 2 2 h 14 c 1.1 0 2 -0.9 2 -2 V 5 c 0 -1.1 -0.9 -2 -2 -2 Z m 0 16 H 5 V 5 h 14 v 14 Z m -8 -2 h 2 v -4 h 4 v -2 h -4 V 7 h -2 v 4 H 7 v 2 h 4 Z" />
    </SvgIcon>
  );
};

const DeletedIcon = ({ fill, ...props }: IIconProps) => {
  return (
    <SvgIcon {...props}>
      <path
        fill={fill ?? 'white'}
        d="M 19 3 H 5 c -1.11 0 -2 0.9 -2 2 v 14 c 0 1.1 0.89 2 2 2 h 14 c 1.1 0 2 -0.9 2 -2 V 5 c 0 -1.1 -0.9 -2 -2 -2 Z"
      />
      <path d="M 19 3 H 5 c -1.1 0 -2 0.9 -2 2 v 14 c 0 1.1 0.9 2 2 2 h 14 c 1.1 0 2 -0.9 2 -2 V 5 c 0 -1.1 -0.9 -2 -2 -2 Z m 0 16 H 5 V 5 h 14 v 14 Z M 7 11 h 10 v 2 H 7 Z" />
    </SvgIcon>
  );
};
const ModifiedIcon = ({ fill, ...props }: IIconProps) => {
  return (
    <SvgIcon {...props}>
      <path
        fill={fill ?? 'white'}
        d="M 19 3 H 5 c -1.11 0 -2 0.9 -2 2 v 14 c 0 1.1 0.89 2 2 2 h 14 c 1.1 0 2 -0.9 2 -2 V 5 c 0 -1.1 -0.9 -2 -2 -2 Z"
      />
      <path d="M 19 3 H 5 c -1.11 0 -2 0.9 -2 2 v 14 c 0 1.1 0.89 2 2 2 h 14 c 1.1 0 2 -0.9 2 -2 V 5 c 0 -1.1 -0.9 -2 -2 -2 Z m 0 16 H 5 V 5 h 14 v 14 Z M 15 12 c 0 1.66 -1.34 3 -3 3 s -3 -1.34 -3 -3 s 1.34 -3 3 -3 s 3 1.34 3 3 Z" />
    </SvgIcon>
  );
};
interface IDiffIconProps extends Omit<IconProps, 'color'> {
  diffType: DiffIndicator;
}

export function DiffIcon({ diffType, ...props }: IDiffIconProps) {
  const color = getPluginDiffColors(diffType).primary;
  if (diffType === DiffIndicator.ADDED) {
    return <AddIcon style={{ color }} {...props} />;
  } else if (diffType === DiffIndicator.DELETED) {
    return <DeletedIcon style={{ color }} {...props} />;
  }
  return <ModifiedIcon style={{ color }} {...props} />;
}
