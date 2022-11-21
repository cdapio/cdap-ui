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
import RenderLabel from 'components/ColumnInsights/Components/common/RenderLabel/';
import T from 'i18n-react';
import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from '@material-ui/core';
import { blue } from '@material-ui/core/colors';

const PREFIX = 'features.NewWranglerUI.ColumnInsights';
interface IDataQualityProps {
  dataQuality: IDataQuality;
}

interface IDataQuality {
  nullValueCount: number;
  nullValuePercentage: number;
  emptyValueCount: number;
  emptyValuePercentage: number;
}

const StyledDataQualityBox = styled(Box)`
  width: 100%;
  display: flex;
  align-items: center;
  background-color: rgb(255, 255, 255);
  justify-content: center;
  filter: drop-shadow(0px 2px 4px rgba(68, 132, 245, 0.25));
  border-radius: 4px;
  margin-top: 20px;
`;

const StyledToggleButton = styled(Button)`
  border: 1px solid #dadce0;
  width: 50%;
  text-align: center;
  padding: 10px;
  cursor: pointer;
  text-transform: none;
`;

const StyledToggleLeftButton = styled(StyledToggleButton)`
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-right: 1px solid #dadce0;
`;

const SelectedToogleLeftButton = styled(StyledToggleLeftButton)`
  background: #f3f6f9;
  border: 1px solid ${blue[500]} !important;
  box-shadow: inset 2px 2px 2px rgba(68, 132, 245, 0.4);
`;

const StyledToggleRightButton = styled(StyledToggleButton)`
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
  border-left: 0px;
  text-transform: none;
`;

const SelectedToogleRightButton = styled(StyledToggleRightButton)`
  background: #f3f6f9;
  border: 1px solid ${blue[500]} !important;
  box-shadow: inset 2px 2px 2px rgba(68, 132, 245, 0.4);
`;

const getWrapperComponent = (isSelected, position) => {
  if (position === 'left') {
    return isSelected === 1 ? SelectedToogleLeftButton : StyledToggleLeftButton;
  } else {
    return isSelected === 2 ? SelectedToogleRightButton : StyledToggleRightButton;
  }
};

export default function({ dataQuality }: IDataQualityProps) {
  const [isSelected, setIsSelected] = useState(1);
  const LeftWrapperComponent = getWrapperComponent(isSelected, 'left');
  const RightWrapperComponent = getWrapperComponent(isSelected, 'right');

  return (
    <StyledDataQualityBox data-testid={'data-quality-toggle-parent'}>
      <LeftWrapperComponent
        setIsSelected={setIsSelected}
        onClick={() => setIsSelected(1)}
        data-testid={`toggle-button-left`}
      >
        <RenderLabel fontSize={14} dataTestId="toggle-button-left-label">
          <>
            {T.translate(`${PREFIX}.empty`).toString()}
            {` ${dataQuality.emptyValueCount} (${dataQuality.emptyValuePercentage}%)`}
          </>
        </RenderLabel>
      </LeftWrapperComponent>
      <RightWrapperComponent
        setIsSelected={setIsSelected}
        onClick={() => setIsSelected(2)}
        data-testid={`toggle-button-right`}
      >
        <RenderLabel fontSize={14} dataTestId="toggle-button-right-label">
          <>
            {T.translate(`${PREFIX}.null`)}
            {` ${dataQuality?.nullValueCount} (${dataQuality?.nullValuePercentage}%)`}
          </>
        </RenderLabel>
      </RightWrapperComponent>
    </StyledDataQualityBox>
  );
}
