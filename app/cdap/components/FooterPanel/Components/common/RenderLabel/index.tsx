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
import { IRenderLabelProps } from 'components/FooterPanel/Components/common/RenderLabel/types';
import React from 'react';
import styled from 'styled-components';

const SimpleLabel = styled(Typography)`
  &&& {
    margin-left: 2px;
    margin-right: 5px;
    margin-top: 2px;
  }
`;

const OutlinedLabel = styled(Typography)`
  &&& {
    background-color: ${grey[600]};
    height: 21px;
    width: 20px;
    color: #ffffff;
    border-radius: 4px;
    padding: 4px 5px;
  }
`;

/**
 *
 * @param children: children to be rendered inside the variants of RenderLabel
 * @param type: simple or outlined, 2 variants of Typography Label
 * @returns RenderLabel with appropriate variations according to props
 */
export default function({ children, type }: IRenderLabelProps) {
  return (
    <>
      {type === 'simple' && (
        <SimpleLabel data-testid="footerpanel-simple-label" component="span">
          {children}
        </SimpleLabel>
      )}
      {type === 'outlined' && (
        <OutlinedLabel data-testid="footerpanel-outlined-label" component="span">
          {children}
        </OutlinedLabel>
      )}
    </>
  );
}
