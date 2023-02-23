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

import React from 'react';

import { IconButton } from '@material-ui/core';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import T from 'i18n-react';
import { useSelector } from 'react-redux';

import CustomTooltip from 'components/ConnectionList/Components/CustomTooltip';
import {
  ColumnViewBox,
  ContainedLabel,
  DirectivesBox,
  Label,
  LargeBox,
  ReciepeStepsButton,
  TabsWrapper,
  TransformatedIconButton,
  ZoomBox,
} from 'components/FooterPanel/styles';

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
  gridMetaInfo: IGridMetaInfo;
  onRecipeStepsButtonClick: () => void;
}

export interface ITableMetaInfoTabProps {
  rowCount: number;
  columnCount: number;
}

export interface IRecipeStepsTabProps {
  recipeStepsCount: number;
}

export default function FooterPanel({ gridMetaInfo, onRecipeStepsButtonClick }: IFooterPanelProps) {
  const { rowCount, columnCount } = gridMetaInfo;

  const directives = useSelector((state) => state.dataprep.directives);

  return (
    <TabsWrapper data-testid="footer-panel-wrapper">
      <CustomTooltip title={`${T.translate(`${PREFIX}.columnViewPanel`)}`}>
        <ColumnViewBox data-testid="footer-panel-column-view-panel-tab">{ColumnIcon}</ColumnViewBox>
      </CustomTooltip>
      <LargeBox data-testid="footer-panel-meta-info-tab">
        <Label data-testid="footerpanel-simple-label">
          {T.translate(`${PREFIX}.message`, { rowCount, columnCount })}
        </Label>
      </LargeBox>
      <ZoomBox data-testid="footer-panel-zoom-tab">
        <IconButton aria-label="zoom">
          <ZoomInIcon />
        </IconButton>
        <Label data-testid="footerpanel-simple-label">
          <>{`${T.translate(`${PREFIX}.zoomPercent100`)}`}</>
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
      <ReciepeStepsButton
        data-testid="footer-panel-recipe-steps-tab-button"
        onClick={onRecipeStepsButtonClick}
        disableRipple
      >
        <Label data-testid="footerpanel-simple-label">
          {`${T.translate(`${PREFIX}.recipeSteps`)}`}
        </Label>
        <ContainedLabel data-testid="footerpanel-outlined-label">
          {directives.length}
        </ContainedLabel>
      </ReciepeStepsButton>
    </TabsWrapper>
  );
}
