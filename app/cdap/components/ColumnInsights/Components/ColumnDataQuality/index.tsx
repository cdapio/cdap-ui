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
import grey from '@material-ui/core/colors/grey';
import red from '@material-ui/core/colors/red';
import ToggleButton from 'components/ColumnInsights/Components/ColumnToggleButton';
import RenderLabel from 'components/ColumnInsights/Components/common/RenderLabel';
import T from 'i18n-react';
import React from 'react';
import styled from 'styled-components';

export const PREFIX = 'features.NewWranglerUI.ColumnInsights';
interface IColumnDataQualityProps {
  dataQuality: {
    nullValueCount: number;
    nullValuePercentage: number;
    emptyValueCount: number;
    emptyValuePercentage: number;
  };
  columnInfo: {
    general: IGeneral;
    types: ITypes;
  };
}
interface ITypes {
  [key: string]: number | string;
}

interface IGeneral {
  'non-null': number;
  null: number;
  empty: number;
}

const ColumnDataQualityContainer = styled(Box)`
  border-bottom: 1px solid ${grey[300]};
  padding: 20px 0px;
`;

const QualityBarContainer = styled(Box)`
  display: flex;
  margin-top: 20px;
`;

const FilledBar = styled(Box)`
  background-color: ${grey[300]};
  display: inline-block;
  height: 5px
  border-radius: 10px;
`;

const EmptyBar = styled(Box)`
  background-color: ${red.A100};
  display: inline-block;
  height: 5px;
  border-radius: 10px;
`;

export default function({ dataQuality, columnInfo }: IColumnDataQualityProps) {
  const nonNull = columnInfo?.general['non-null'] || 0;
  const empty = columnInfo?.general?.empty || 0;
  const filled = (nonNull as number) - (empty as number);
  const calculatedEmptyValue = 100 - filled;

  return (
    <ColumnDataQualityContainer data-testid="column-data-quality-parent">
      <RenderLabel fontSize={16} dataTestId={'quality-text'}>
        <>{T.translate(`${PREFIX}.quality`).toString()}</>
      </RenderLabel>
      <QualityBarContainer data-testid="quality-bar">
        <FilledBar component="span" style={{ width: `${filled}%` }} data-testid="filled-bar" />
        <EmptyBar
          component="span"
          style={{
            width: `${calculatedEmptyValue}%`,
          }}
          data-testid="empty-bar"
        />
      </QualityBarContainer>
      <ToggleButton dataQuality={dataQuality} />
    </ColumnDataQualityContainer>
  );
}
