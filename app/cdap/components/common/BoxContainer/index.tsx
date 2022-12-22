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

import { Box } from '@material-ui/core';
import styled from 'styled-components';

export const FlexJustifyAlignCenter = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 9px;
`;

export const LastDividerBox = styled(Box)`
  margin: 0px 0px 0px 4px;
`;

export const DividerBox = styled(Box)`
  margin: 0px 4px;
`;

export const DividerBoxToggler = styled(Box)`
  margin: 0px 16px;
`;

export const FunctionBoxWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-left: ${(props) => (props.showName ? 12 : 0)}px;
  padding-right: ${(props) => (props.showName ? 12 : 0)}px;
  padding-bottom: 4px;
  width: -webkit-fill-available;
  & .MuiIconButton-root {
    padding: 5px;
    display: flex;
    margin: auto;
  }
`;

export const ExpandAndFunctionToggleContainer = styled(Box)`
  display: flex;
  justify-content: center;
`;

export const SearchBoxWrapper = styled(Box)`
  min-width: 490px;
`;
