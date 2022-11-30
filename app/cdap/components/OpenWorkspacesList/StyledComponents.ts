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

import { Box, MenuItem, MenuList, Paper, Typography } from '@material-ui/core';
import styled from 'styled-components';

const CustomizedTypography = styled(Typography)`
  font-style: normal;

  font-size: 14px;
  line-height: 21px;
  letter-spacing: 0.15px;
`;

export const ViewAllTypography = styled(CustomizedTypography)`
  color: #2196f3;
  font-weight: 400;
`;

export const WorkspaceListTypography = styled(CustomizedTypography)`
  color: #616161;
  font-weight: 400;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 201px;
`;

export const WorkspaceOpenTypography = styled(CustomizedTypography)`
  font-weight: 500;
  color: #2196f3;
  cursor: pointer;
`;

export const OpenWorkspaceContainer = styled(Box)`
  display: flex;
  margin: auto 0px;
`;

export const StyledMenuItem = styled(MenuItem)`
  margin-top: 8px;
  margin-bottom: 8px;
  padding-left: 20px;
  padding-right: 20px;
`;

export const StyledMenuList = styled(MenuList)`
  padding: 0px;
  font-weight: 400;
  padding-top: 6px;
  padding-bottom: 6px;
  color: #5f6368;
`;

export const DividerContainer = styled(Box)`
  margin-right: 20px;
`;

export const StyledPaper = styled(Paper)`
  box-shadow: none;
  border: 1px solid #dadce0;
  border-radius: 0px;
  left: -66px;
  width: 246px;
  top: 4px;
  position: absolute;
`;
