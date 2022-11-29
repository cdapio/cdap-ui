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
import T from 'i18n-react';
import { ISelectColumnsWidgetProps } from 'components/WranglerGrid/AddTransformationPanel/SelectColumnsWidget/types';
import {
  multipleColumnSelected,
  ADD_TRANSFORMATION_PREFIX,
} from 'components/WranglerGrid/SelectColumnPanel/constants';
import { SubHeadBoldFont, NormalFont } from 'components/common/TypographyText';
import { SelectColumnButton } from 'components/common/ButtonWidget';
import styled from 'styled-components';

export const TickIcon = (
  <svg
    width="22"
    height="23"
    viewBox="0 0 22 23"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    data-testid="tick-icon"
  >
    <path
      d="M21 10.5857V11.5057C20.9988 13.6621 20.3005 15.7604 19.0093 17.4875C17.7182 19.2147 15.9033 20.4782 13.8354 21.0896C11.7674 21.701 9.55726 21.6276 7.53447 20.8803C5.51168 20.133 3.78465 18.7518 2.61096 16.9428C1.43727 15.1338 0.879791 12.9938 1.02168 10.842C1.16356 8.69029 1.99721 6.64205 3.39828 5.0028C4.79935 3.36354 6.69279 2.22111 8.79619 1.74587C10.8996 1.27063 13.1003 1.48806 15.07 2.36572"
      stroke="#8BCC74"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M21 3.50586L11 13.5159L8 10.5159"
      stroke="#8BCC74"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

const TransformationNameBox = styled.section`
  padding: 15px 0;
  border-bottom: 1px solid #dadce0;
`;

const TransformationNameHeadWrapper = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TransformationNameTextInfoWrapper = styled.section`
  display: flex;
  align-items: center;
  padding: 10px 0 0;
`;

export default function({
  selectedColumns,
  transformationName,
  handleSelectColumn,
}: ISelectColumnsWidgetProps) {
  const selectButtonText =
    multipleColumnSelected?.filter((el) => el.value === transformationName).length > 0
      ? T.translate(`${ADD_TRANSFORMATION_PREFIX}.selectMultiColumns`).toString()
      : T.translate(`${ADD_TRANSFORMATION_PREFIX}.selectColumn`).toString();

  const singleColumnSelect = (
    <>
      <TransformationNameHeadWrapper>
        <SubHeadBoldFont component="p" data-testid="select-column-title">
          {T.translate(`${ADD_TRANSFORMATION_PREFIX}.selectColumnPara`)}
        </SubHeadBoldFont>
        {selectedColumns.length > 0 && TickIcon}
      </TransformationNameHeadWrapper>
      <TransformationNameTextInfoWrapper padding="10px 0">
        <NormalFont component="p" data-testid="select-column-subtitle">
          {T.translate(`${ADD_TRANSFORMATION_PREFIX}.quickSelect`)}
        </NormalFont>
      </TransformationNameTextInfoWrapper>
      {Array.isArray(selectedColumns) && selectedColumns.length ? (
        selectedColumns.map((item, index) => (
          <TransformationNameTextInfoWrapper padding="5px 0">
            <NormalFont component="p" data-testid="selected-function-name">{`${index + 1}. ${
              item.label
            }`}</NormalFont>
          </TransformationNameTextInfoWrapper>
        ))
      ) : (
        <SelectColumnButton
          onClick={() => handleSelectColumn(false)}
          disabled={false}
          data-testid="select-column-button"
        >
          {selectButtonText}
        </SelectColumnButton>
      )}
    </>
  );

  return <TransformationNameBox>{singleColumnSelect}</TransformationNameBox>;
}
