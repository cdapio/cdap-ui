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

import { Box, IconButton } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import styled from 'styled-components';

export const CloseIconButton = styled(IconButton)`
  color: #ffffff;
`;

export const DirectivesContainer = styled(Box)`
  background-color: #ffffff;
  position: fixed;
  bottom: 93px;
  width: 100%;
`;

export const DirectiveUsageWrapper = styled(Box)`
  background: ${grey[700]};
`;

export const InputParentWrapper = styled(Box)`
  display: block;
  box-shadow: -3px -4px 15px rgba(68, 132, 245, 0.25);
`;

export const InputWrapper = styled(Box)`
  width: 100%;
  display: flex;
  align-items: center;
`;

export const SearchBarWrapper = styled(Box)`
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const StyledInput = styled.input`
  width: 95%;
  margin-left: 5px;
  outline: 0;
  border: 0;
  background: transparent;
  color: #ffffff;
`;

export const StyledLabel = styled.label`
  color: #94ec98;
  font-size: 14px;
  margin-bottom: 0;
`;
