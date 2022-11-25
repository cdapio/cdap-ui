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

import { Typography } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import React from 'react';
import styled from 'styled-components';

interface IRenderLabelProps {
  children: JSX.Element;
  fontSize?: number;
  color?: string;
  dataTestId?: string;
}

const SimpleLabel = styled(Typography)`
  &&& {
    font-size: ${(props) => props.fontSize ?? 14}px;
    line-height: 150%;
    font-weight: 400;
    color: ${(props) => props.color ?? `${grey[900]}`};
    margin: auto 0px;
  }
`;

/**
 *
 * @param children: children to be rendered inside the variants of RenderLabel
 * @param fontSize: fontSize as props
 * @param color: color
 * @returns RenderLabel with custom Color and fontSize
 */
export default function({ children, fontSize, color, dataTestId }: IRenderLabelProps) {
  return (
    <SimpleLabel component="span" fontSize={fontSize} color={color} data-testid={dataTestId}>
      {children}
    </SimpleLabel>
  );
}
