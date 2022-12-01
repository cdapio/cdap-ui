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

import { Box, IconButton, Typography } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import CustomTooltip from 'components/ConnectionList/Components/CustomTooltip';
import { ColumnIcon } from 'components/FooterPanel/IconStore/ColumnIcon';
import T from 'i18n-react';
import React from 'react';
import styled from 'styled-components';

export const PREFIX = 'features.WranglerNewUI.FooterPanel.labels';

interface IGridMetaInfo {
  rowCount: number;
  columnCount: number;
}

interface IFooterPanelProps {
  recipeStepsCount: number;
  gridMetaInfo: IGridMetaInfo;
  handleShowRecipePanelHandler: () => void;
  setDirectivePanelIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ColumnViewBox = styled(Box)`
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

const DirectivesBox = styled(Box)`
  text-align: center;
  gap: 8px;
  width: 9.5%;
  height: 40px;
  background: linear-gradient(180deg, #4681f400 0.85%, #4681f433 118.78%);
  border-left: 1px solid rgba(57, 148, 255, 0.4);
  cursor: pointer;
`;

const Label = styled(Typography)`
  line-height: 40px;
`;

const ReciepeStepsBox = styled(Box)`
  text-align: center;
  padding: 9.5px 12px;
  gap: 8px;
  width: 13.5%;
  height: 40px;
  background: linear-gradient(180deg, #4681f400 0.85%, #4681f433 118.78%);
  border-left: 1px solid rgba(57, 148, 255, 0.4);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TabsWrapper = styled(Box)`
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

const TransformatedIconButton = styled(IconButton)`
  transform: rotate(90deg);
`;

const OutlinedLabel = styled(Label)`
  background-color: ${grey[600]};
  line-height: 21px;
  width: 20px;
  color: #ffffff;
  border-radius: 4px;
`;

const ZoomBox = styled(Box)`
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

const LargeBox = styled(Box)`
  width: 65%;
  padding: 0px 32px;
`;

export interface IRecipeStepsTabProps {
  recipeStepsCount: number;
}

export default function({
  recipeStepsCount,
  gridMetaInfo,
  handleShowRecipePanelHandler,
  setDirectivePanelIsOpen,
}: IFooterPanelProps) {
  const { rowCount, columnCount } = gridMetaInfo;

  return (
    <TabsWrapper data-testid="footer-panel-wrapper">
      <CustomTooltip title={`${T.translate(`${PREFIX}.columnViewPanel`)}`}>
        <ColumnViewBox data-testid="footer-panel-column-view-panel-tab">{ColumnIcon}</ColumnViewBox>
      </CustomTooltip>
      <LargeBox data-testid="footer-panel-meta-info-tab">
        <Label data-testid="footerpanel-simple-message">
          {T.translate(`${PREFIX}.message`, { rowCount, columnCount })}
        </Label>
      </LargeBox>
      <ZoomBox data-testid="footer-panel-zoom-tab">
        <IconButton aria-label="zoom">
          <ZoomInIcon />
        </IconButton>
        <Label data-testid="footerpanel-simple-zoom-label">
          <>{`${T.translate(`${PREFIX}.zoomPercent100`)}`}</>
        </Label>
        <TransformatedIconButton aria-label="arrow">
          <ArrowRightIcon />
        </TransformatedIconButton>
      </ZoomBox>
      <DirectivesBox
        data-testid="footer-panel-directives-tab"
        onClick={() => setDirectivePanelIsOpen(true)}
      >
        <Label data-testid="footerpanel-simple-directives-label">
          <>{`${T.translate(`${PREFIX}.directives`)}`}</>
        </Label>
      </DirectivesBox>
      <ReciepeStepsBox
        data-testid="footer-panel-recipe-steps-tab"
        onClick={handleShowRecipePanelHandler}
      >
        <Label data-testid="footerpanel-recipe-steps-label">
          <>{`${T.translate(`${PREFIX}.recipeSteps`)}`}</>
        </Label>
        <OutlinedLabel data-testid="footerpanel-outlined-label">
          <>{recipeStepsCount}</>
        </OutlinedLabel>
      </ReciepeStepsBox>
    </TabsWrapper>
  );
}
