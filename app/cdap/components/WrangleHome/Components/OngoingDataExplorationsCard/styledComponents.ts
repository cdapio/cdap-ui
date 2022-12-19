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

import { Box, Grid, Typography } from '@material-ui/core';
import { green, red } from '@material-ui/core/colors';
import styled from 'styled-components';

export const GridContainer = styled(Grid)`
  height: 77px;
  border: 1px solid #dadce0;
  border-radius: 4px;
  margin-bottom: 10px;
  cursor: pointer;
  margin: 10px auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-right: 62px;
`;

export const GridContainerAtHomePage = styled(GridContainer)`
  width: 1204px;
  margin: 10px auto;
`;

export const GridContainerAtWorkspaceListPage = styled(GridContainer)`
  width: 1306px;
`;

export const GridForConnectorIcon = styled(Grid)`
  min-width: 100px;
  padding-left: 20px;
  display: flex;
  flex-direxction: column;
  justify-content: flex-start;
  align-items: center;
`;

export const GridForExplorationCard = styled(Grid)`
  width: 301px;
  flex: 1;
  padding-top: 14px;
  padding-left: 23px;
  padding-bottom: 13px;
  padding-right: 23px;
  display: flex;
  margin: auto 0px;
  justify-content: space-between;
  align-items: center;
  & .MuiTypography-body1 {
    margin: auto 0px;
    font-size: 16px;
    line-height: 24px;
    width: 253px;
    text-overflow: ellipsis;
    font-weight: 400;
    overflow: hidden;
    white-space: nowrap;
    color: #000000;
  }
`;

export const IconWithTextTypography = styled(Typography)`
  max-width: 171px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const IconWithoutTextTypography = styled(Typography)`
  max-width: 171px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const NullValueCountContainer = styled(Box)`
  display: flex;
  min-width: 85px;
  justify-content: end;
`;

export const PercentageSymbol = styled(Typography)`
  font-size: 20px;
  line-height: 30px;
  margin: auto 0px;
  margin-right: 6px;
  letter-spacing: 0.15px;
  padding-top: 14px;
`;

export const PercentageSymbolRed = styled(PercentageSymbol)`
  color: ${red[600]};
`;

export const PercentageSymbolGreen = styled(PercentageSymbol)`
  color: ${green[600]};
`;

export const QualityTextContainer = styled(Box)`
  display: flex;
  justify-content: flex-start;
`;

export const StyledTyporgraphy = styled(Typography)`
  padding-top: 0px;
`;

export const TypographyWithoutColor = styled(Typography)`
  line-height: 30px;
  font-size: 36px;
  letter-spacing: 0.15px;
  margin: auto 0px;
`;

export const TypographyWithGreenColorText = styled(TypographyWithoutColor)`
  color: ${green[600]};
`;

export const TypographyWithRedColorText = styled(TypographyWithoutColor)`
  color: ${red[600]};
`;
