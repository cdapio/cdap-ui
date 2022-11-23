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
import React from 'react';
import SemiCircleProgressBar from 'react-progressbar-semicircle';
import styled from 'styled-components';
import { IDataQualityRecord } from 'components/ColumnViewPanel/components/SelectColumnsList/types';

export interface IDataQualityCircularProgressBarProps {
  dataQualityPercentValue: number;
  wrapperComponentData: IDataQualityWrapperComponentData;
}

export interface IDataQualityWrapperComponentData {
  dataQualityList: IDataQualityRecord[];
  filteredColumnIndex: number;
}

const SemiCircularProgressBarWrapper = styled(Box)`
  width: 75px;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 100%;
  letter-spacing: 0.15px;
`;

const GreenSemiCircleProgressBar = styled(SemiCircularProgressBarWrapper)`
  color: #8bcc74;
`;

const RedSemiCircleProgressBar = styled(SemiCircularProgressBarWrapper)`
  color: #e97567;
`;

const getProgressBarWrapperComponent = (dataQualityList, filteredColumnIndex) => {
  return dataQualityList?.length && dataQualityList[filteredColumnIndex]?.value === 0
    ? GreenSemiCircleProgressBar
    : RedSemiCircleProgressBar;
};

export default function({
  wrapperComponentData,
  dataQualityPercentValue,
}: IDataQualityCircularProgressBarProps) {
  const { dataQualityList, filteredColumnIndex } = wrapperComponentData;
  const Wrapper = getProgressBarWrapperComponent(dataQualityList, filteredColumnIndex);

  return (
    <Wrapper data-testid="semi-circular-progress-bar-wrapper">
      <SemiCircleProgressBar
        strokeWidth="5"
        diameter="75"
        percentage={!isNaN(dataQualityPercentValue) ? Math.floor(dataQualityPercentValue) : ''}
        stroke={dataQualityPercentValue === 0 ? '#8BCC74' : '#E97567'}
        showPercentValue={true}
      />
    </Wrapper>
  );
}
