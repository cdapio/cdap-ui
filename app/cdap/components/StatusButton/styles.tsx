/*
 * Copyright © 2021 Cask Data, Inc.
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

import CloseIcon from '@material-ui/icons/Close';
import styled from 'styled-components';
import { Box, Button, IconButton, Popper } from '@material-ui/core';

export const StyledPopper = styled(Popper)`
  z-index: 5;
  overflow-x: unset;
  overflow-y: unset;
  &::before {
    content: '';
    position: absolute;
    margin-right: -0.71em;
    top: 12px;
    left: 4.7px;
    width: 15px;
    height: 15px;
    background-color: ${(props) => props.theme.palette.white[50]};
    box-shadow: -2px -2px 4px -1px rgb(0 0 0 / 31%);
    transform: rotate(225deg);
    clip-path: polygon(-5px -5px, calc(100% + 5px) -5px, calc(100% + 5px) calc(100% + 5px));
  }
`;

// https://styled-components.com/docs/faqs#how-can-i-override-styles-with-higher-specificity
export const StyledButton = styled(Button)`
  &&& {
    font-size: 18px;
    padding: 2px;
    min-width: 15px;
    &:focus {
      background-color: rgba(0, 0, 0, 0.04);
    }
  }
`;

export const StyledP = styled.p`
  margin-bottom: 0;
`;

export const BoldP = styled.p`
  font-weight: 800;
  margin-bottom: 0;
`;

export const PositionedIconButton = styled(IconButton)`
  &&& {
    right: 3px;
    top: 3px;
    height: 4px;
    width: 4px;
    position: absolute;
  }
`;

export const CloseIconScaled = styled(CloseIcon)`
  transform: scale(0.8);
`;

export const StyledBox = styled(Box)`
  border: 0;
  min-width: 240px;
  max-width: 290px;
  border-radius: 4px;
  margin-left: 12px;
  padding: 16px;
  background-color: ${(props) => props.theme.palette.white[50]};
  box-shadow: -2px 2px 4px -1px rgba(0, 0, 0, 0.31);
`;
