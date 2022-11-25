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
import blue from '@material-ui/core/colors/blue';
import RenderLabel from 'components/ColumnInsightsPanel/components/common/RenderLabel';
import T from 'i18n-react';
import React from 'react';
import BarChart from 'react-bar-chart';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

export const PREFIX = 'features.WranglerNewUI.ColumnInsights';

interface IColumnDataDistributionProps {
  graphData: IGraphData[];
}
interface IGraphData {
  text: string;
  value: number;
}

const ColumnDataDistributionContainer = styled(Box)`
  padding-top: 20px;
`;

const ColumnDataDistributionLabel = styled(Box)`
  display: flex;
  justify-content: space-between;
`;

const ColumnDataQualityGraph = styled(Box)`
  & .axis {
    display: none;
  }

  & .bar {
    fill: ${blue[500]};
  }

  & .graph {
    transform: translate(0px, 20px) !important;
  }
`;

export default function({ graphData }: IColumnDataDistributionProps) {
  const barChartProps = {
    margin: { top: 20, right: 20, bottom: 70, left: 40 },
    width: 400,
    height: 200,
  };

  const spliceData = (data: IGraphData[]) => {
    if (data && data.length >= 10) {
      return data.slice(0, 9);
    }
    return data;
  };

  return (
    <ColumnDataDistributionContainer data-testid="column-data-distribution-parent">
      <ColumnDataDistributionLabel>
        <RenderLabel fontSize={16} dataTestId="distribution-text">
          <>{T.translate(`${PREFIX}.distribution`).toString()}</>
        </RenderLabel>
        <NavLink to="#" data-testid="view-full-chart-link">
          <RenderLabel fontSize={14} color={`${blue[500]}`} dataTestId="view-full-chart-text">
            <> {T.translate(`${PREFIX}.viewFullChart`).toString()}</>
          </RenderLabel>
        </NavLink>
      </ColumnDataDistributionLabel>

      <ColumnDataQualityGraph data-testid="data-distribution-graph">
        <BarChart
          ylabel={`${PREFIX}.barChartYLabel`}
          {...barChartProps}
          data={spliceData(graphData)}
        />
      </ColumnDataQualityGraph>
    </ColumnDataDistributionContainer>
  );
}
