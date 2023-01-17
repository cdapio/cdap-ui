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

import { Box, Typography } from '@material-ui/core';
import { grey, lightGreen, red } from '@material-ui/core/colors';
import { IGeneralStatistics } from 'components/GridTable/types';
import { IHeaderNamesList } from 'components/WranglerGrid/SelectColumnPanel/types';
import React from 'react';
import styled from 'styled-components';
import LinearProgress from '@material-ui/core/LinearProgress';

const GREEN_COLOR = lightGreen['400'];
const RED_COLOR = red.A100;

const StyledLinearProgress = styled(LinearProgress)`
  width: 109px;
  height: 8px;
  &.MuiLinearProgress-colorPrimary {
    background-color: ${grey[300]};
  }
`;

const Wrapper = styled(Box)`
  display: flex;
  align-items: center;
`;

const GreenPercentageLabel = styled(Typography)`
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  letter-spacing: 0.1px;
  color: ${GREEN_COLOR};
  margin-left: 9px;
`;

const RedPercentageLabel = styled(GreenPercentageLabel)`
  color: ${RED_COLOR};
`;

const GreenLinearProgressBar = styled(StyledLinearProgress)`
  & .MuiLinearProgress-barColorPrimary {
    background-color: ${GREEN_COLOR};
  }
`;

const RedLinearProgressBar = styled(StyledLinearProgress)`
  & .MuiLinearProgress-barColorPrimary {
    background-color: ${RED_COLOR};
  }
`;

/**
 * @param statistics is the column data received from apis, used to calculate the data quality of the respective column
 * @param  columnList is the list of all column headers for which we calculate the data quality
 * @return the list of column's data quality calculated from statistics recieved from api
 */
export const getDataQuality = (
  statistics: Record<string, IGeneralStatistics>,
  columnList: IHeaderNamesList[]
) => {
  const dataQuality: Array<Record<string, string | number>> = [];
  columnList.forEach((columnName: IHeaderNamesList) => {
    const generalValues: Record<string, string | number> = statistics[columnName.name].general;
    if (generalValues.null) {
      const nullCount = generalValues.null || 0;
      dataQuality.push({
        label: columnName.name,
        value: nullCount,
      });
    } else {
      dataQuality.push({
        label: columnName.name,
        value: '0',
      });
    }
  });
  return dataQuality;
};

const getProgressBarWrapperComponent = (dataQualityPercentValue) => {
  return dataQualityPercentValue === 0 ? GreenLinearProgressBar : RedLinearProgressBar;
};

const getPercentageLabelComponent = (dataQualityPercentValue) => {
  return dataQualityPercentValue === 0 ? GreenPercentageLabel : RedPercentageLabel;
};

export default function DataQualityCircularProgressBar({
  dataQualityPercentValue,
}: {
  dataQualityPercentValue: number;
}) {
  const LinearProgressBar = getProgressBarWrapperComponent(dataQualityPercentValue);
  const PercentageLabel = getPercentageLabelComponent(dataQualityPercentValue);

  return (
    <Wrapper>
      <LinearProgressBar
        variant="determinate"
        data-testid="linear-progress-bar-wrapper"
        value={Math.floor(dataQualityPercentValue)}
      />
      <PercentageLabel>{dataQualityPercentValue}%</PercentageLabel>
    </Wrapper>
  );
}
