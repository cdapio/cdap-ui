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
import { grey } from '@material-ui/core/colors';

export const ToolBarIconWrapper = styled(Box)`
  display: flex;
  justify-content: space-between;
  border: 1px solid ${grey[300]};
  margin-top: 0;
  padding-left: 18px;
  padding-right: 18px;
  height: ${(props) => (props.showName ? 75 : 48)}px;
`;

export const ToolBarInnerWrapper = styled(Box)`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin-left: 0;
  margin-right: 0;
  width: 80%;
  padding-bottom: 8px;
  padding-top: 8px;
`;
