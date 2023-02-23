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

import { Box, Button, IconButton, Typography } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import styled, { css } from 'styled-components';

const footerLabelStyles = css`
  font-size: 14px;
  font-weight: 400;
`;

export const ColumnViewBox = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 8px 32px;
  gap: 8px;
  width: 88px;
  height: 40px;
  border-left: 1px solid #3994ff66;
  flex: none;
  order: 0;
  flex-grow: 0;
  background: linear-gradient(180deg, #4681f400 0.85%, #4681f433 118.78%);
  border-right: 1px solid #3994ff66;
  cursor: pointer;
`;

export const DirectivesBox = styled(Box)`
  text-align: center;
  gap: 8px;
  width: 9.5%;
  height: 40px;
  background: linear-gradient(180deg, #4681f400 0.85%, #4681f433 118.78%);
  border-left: 1px solid rgba(57, 148, 255, 0.4);
  cursor: pointer;
`;

export const Label = styled(Typography)`
  ${footerLabelStyles}
  line-height: 40px;
`;

export const ReciepeStepsButton = styled(Button)`
  text-align: center;
  padding: 9.5px 12px;
  width: 13.5%;
  height: 40px;
  background: linear-gradient(180deg, #4681f400 0.85%, #4681f433 118.78%);
  border-left: 1px solid rgba(57, 148, 255, 0.4);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: none;
  border-radius: 0;
`;

export const TabsWrapper = styled(Box)`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: space-between;
  background-color: #f3f6f9;
  height: 40px;
  box-shadow: 0px -2px 2px #0000001a;
  width: 100%;
  position: absolute;
  bottom: 54px;
`;

export const TransformatedIconButton = styled(IconButton)`
  transform: rotate(90deg);
`;

export const ContainedLabel = styled(Label)`
  ${footerLabelStyles}
  background-color: ${grey[600]};
  line-height: 21px;
  width: 20px;
  color: #ffffff;
  border-radius: 4px;
  margin-left: 8px;
`;

export const ZoomBox = styled(Box)`
  display: flex;
  justify-content: center;
  text-align: center;
  align-items: center;
  width: 10.5%;
  height: 40px;
  background: linear-gradient(180deg, #4681f400 0.85%, #4681f433 118.78%);
  border-left: 1px solid rgba(57, 148, 255, 0.4);
  cursor: pointer;
`;

export const LargeBox = styled(Box)`
  width: 65%;
  padding: 0px 32px;
`;
