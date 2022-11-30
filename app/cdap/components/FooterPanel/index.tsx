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
import T from 'i18n-react';
import React, { useState } from 'react';
import styled from 'styled-components';
import ZoomList from 'components/FooterPanel/ZoomList';

export const PREFIX = 'features.WranglerNewUI.FooterPanel.labels';

const ColumnIcon = (
  <svg
    width="20"
    height="18"
    viewBox="0 0 20 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    data-testid="column-icon"
  >
    <path
      d="M1 6.65385L1 3.3718C1 2.93657 1.21071 2.51917 1.58579 2.21142C1.96086 1.90366 2.46957 1.73077 3 1.73077L17 1.73077C17.5304 1.73077 18.0391 1.90366 18.4142 2.21142C18.7893 2.51917 19 2.93657 19 3.3718V6.65385M1 6.65385L1 14.859C1 15.2942 1.21071 15.7116 1.58579 16.0194C1.96086 16.3271 2.46957 16.5 3 16.5H17C17.5304 16.5 18.0391 16.3271 18.4142 16.0194C18.7893 15.7116 19 15.2942 19 14.859V6.65385M1 6.65385L19 6.65385M1 11.5769H19"
      stroke="#757575"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

interface IGridMetaInfo {
  rowCount: number;
  columnCount: number;
}

interface IFooterPanelProps {
  recipeStepsCount: number;
  gridMetaInfo: IGridMetaInfo;
  setZoomPercent: React.Dispatch<React.SetStateAction<number>>;
  zoomPercent: number;
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
  height: 40px;
  background: linear-gradient(180deg, #4681f400 0.85%, #4681f433 118.78%);
  border-left: 1px solid rgba(57, 148, 255, 0.4);
  cursor: pointer;
`;

const Label = styled(Typography)`
  line-height: 40px;
`;

const OutlinedLabel = styled(Label)`
  background-color: ${grey[600]};
  line-height: 21px;
  width: 20px;
  color: #ffffff;
  border-radius: 4px;
`;

const ReciepeStepsBox = styled(Box)`
  text-align: center;
  padding: 9.5px 12px;
  gap: 8px;
  height: 40px;
  background: linear-gradient(180deg, #4681f400 0.85%, #4681f433 118.78%);
  border-left: 1px solid rgba(57, 148, 255, 0.4);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TabsWrapper = styled(Box)`
  justify-content: flex-start;
  align-items: space-between;
  background-color: #f3f6f9;
  height: 40px;
  box-shadow: 0px -2px 2px #0000001a;
  width: 100%;
  position: absolute;
  bottom: 54px;
  display: grid;
  grid-template-columns: 7% 58% 10% 10% 15%;
`;

const TransformatedIconButton = styled(IconButton)`
  transform: rotate(90deg);
`;

const ZoomBox = styled(Box)`
  display: flex;
  justify-content: center;
  text-align: center;
  align-items: center;
  height: 40px;
  background: linear-gradient(180deg, #4681f400 0.85%, #4681f433 118.78%);
  border-left: 1px solid rgba(57, 148, 255, 0.4);
  cursor: pointer;
`;

const LargeBox = styled(Box)`
  width: 55%;
  padding: 0px 32px;
`;
export interface ITableMetaInfoTabProps {
  rowCount: number;
  columnCount: number;
}

export interface IRecipeStepsTabProps {
  recipeStepsCount: number;
}

export default function({
  recipeStepsCount,
  gridMetaInfo,
  setZoomPercent,
  zoomPercent,
}: IFooterPanelProps) {
  const { rowCount, columnCount } = gridMetaInfo;
  const [openZoomOption, setOpenZoomOption] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  return (
    <TabsWrapper data-testid="footer-panel-wrapper">
      <CustomTooltip title={`${T.translate(`${PREFIX}.columnViewPanel`)}`}>
        <ColumnViewBox data-testid="footer-panel-column-view-panel-tab">{ColumnIcon}</ColumnViewBox>
      </CustomTooltip>
      <LargeBox data-testid="footer-panel-meta-info-tab">
        <Label data-testid="footerpanel-simple-label">
          <>
            {`${T.translate(`${PREFIX}.currentData`)} 
          - ${rowCount} ${T.translate(`${PREFIX}.rows`)} ${T.translate(
              `features.WranglerNewUI.common.and`
            )} ${columnCount} ${T.translate(`${PREFIX}.columns`)}`}
          </>
        </Label>
      </LargeBox>
      <ZoomBox
        data-testid="footer-panel-zoom-tab"
        onClick={(event) => {
          setOpenZoomOption(!openZoomOption);
          setAnchorEl(event.currentTarget);
        }}
      >
        <IconButton aria-label="zoom">
          <ZoomInIcon />
        </IconButton>
        {openZoomOption && (
          <ZoomList open={openZoomOption} setZoomPercent={setZoomPercent} anchorEl={anchorEl} />
        )}
        <Label data-testid="footerpanel-simple-label">
          <>{`${zoomPercent}%`}</>
        </Label>
        <TransformatedIconButton aria-label="arrow">
          <ArrowRightIcon />
        </TransformatedIconButton>
      </ZoomBox>
      <DirectivesBox data-testid="footer-panel-directives-tab">
        <Label data-testid="footerpanel-simple-label">
          <>{`${T.translate(`${PREFIX}.directives`)}`}</>
        </Label>
      </DirectivesBox>
      <ReciepeStepsBox data-testid="footer-panel-recipe-steps-tab">
        <Label data-testid="footerpanel-simple-label">
          <>{`${T.translate(`${PREFIX}.recipeSteps`)}`}</>
        </Label>
        <OutlinedLabel data-testid="footerpanel-outlined-label">
          <>{recipeStepsCount}</>
        </OutlinedLabel>
      </ReciepeStepsBox>
    </TabsWrapper>
  );
}
