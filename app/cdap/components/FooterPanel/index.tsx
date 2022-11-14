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
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import CustomTooltip from 'components/ConnectionList/Components/CustomTooltip';
import OutlinedLabel from 'components/common/RenderLabel/OutlinedLabel';
import SimpleLabel from 'components/common/RenderLabel/SimpleLabel';
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
  padding: 9.5px 12px;
  gap: 8px;
  width: 9.5%;
  height: 40px;
  background: linear-gradient(180deg, #4681f400 0.85%, #4681f433 118.78%);
  border-left: 1px solid rgba(57, 148, 255, 0.4);
  cursor: pointer;
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
`;

const TabsWrapper = styled(Box)`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: space-between;
  background-color: #f3f6f9;
  height: 40;
  box-shadow: 0px -2px 2px #0000001a;
  width: 100%;
  position: absolute;
  bottom: 54px;
`;

const TransformatedIconButton = styled(IconButton)`
  transform: rotate(90deg);
`;

const ZoomBox = styled(Box)`
  text-align: center;
  gap: 8px;
  width: 10.5%;
  height: 40px;
  background: linear-gradient(180deg, #4681f400 0.85%, #4681f433 118.78%);
  border-left: 1px solid rgba(57, 148, 255, 0.4);
  cursor: pointer;
`;

export interface ITableMetaInfoTabProps {
  rowCount: number;
  columnCount: number;
}

const LargeBox = styled(Box)`
  width: 65%;
  padding: 9.5px 32px;
`;

export interface IRecipeStepsTabProps {
  recipeStepsCount: number;
}

export default function ({ recipeStepsCount, gridMetaInfo }: IFooterPanelProps) {

  const { rowCount, columnCount } = gridMetaInfo;

  return (
    <TabsWrapper data-testid="footer-panel-wrapper">
      <CustomTooltip title={`${T.translate(`${PREFIX}.columnViewPanel`)}`}>
        <ColumnViewBox data-testid="footer-panel-column-view-panel-tab">{ColumnIcon}</ColumnViewBox>
      </CustomTooltip>
      <LargeBox data-testid="footer-panel-meta-info-tab">
        <SimpleLabel>
          <>
            {`${T.translate(`${PREFIX}.currentData`)} 
          - ${rowCount} ${T.translate(`${PREFIX}.rows`)} ${T.translate(
              `features.WranglerNewUI.common.and`
            )} ${columnCount} ${T.translate(`${PREFIX}.columns`)}`}
          </>
        </SimpleLabel>
      </LargeBox>
      <ZoomBox data-testid="footer-panel-zoom-tab">
        <IconButton aria-label="zoom">
          <ZoomInIcon />
        </IconButton>
        <SimpleLabel>
          <>{`${T.translate(`${PREFIX}.zoomPercent100`)}`}</>
        </SimpleLabel>
        <TransformatedIconButton aria-label="arrow">
          <ArrowRightIcon />
        </TransformatedIconButton>
      </ZoomBox>
      <DirectivesBox data-testid="footer-panel-directives-tab">
        <SimpleLabel>
          <>{`${T.translate(`${PREFIX}.directives`)}`}</>
        </SimpleLabel>
      </DirectivesBox>
      <ReciepeStepsBox data-testid="footer-panel-recipe-steps-tab">
        <SimpleLabel>
          <>{`${T.translate(`${PREFIX}.recipeSteps`)}`}</>
        </SimpleLabel>
        <OutlinedLabel>
          <>{recipeStepsCount}</>
        </OutlinedLabel>
      </ReciepeStepsBox>
    </TabsWrapper>
  );
}
