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

import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import AddTransformation from 'components/WranglerGrid/AddTransformationPanel';
import {
  mockDirectiveFunctionSupportedDataType,
  mockFunctionName,
  mockColumnData,
  mockMissingDataList,
} from 'components/WranglerGrid/AddTransformationPanel/mock/mockDataForAddTransformation';
import * as dataQualityHelper from 'components/common/DataQualityCircularProgressBar/utils';

describe('It should test the AddTransformatio Component', () => {
  jest.spyOn(dataQualityHelper, 'getDataQuality').mockReturnValue([]);

  it('Trigger handleSelectColumn()', () => {
    render(
      <AddTransformation
        applyTransformation={jest.fn()}
        transformationDataType={mockDirectiveFunctionSupportedDataType}
        transformationName={mockFunctionName}
        columnsList={mockColumnData}
        missingItemsList={undefined}
        onCancel={jest.fn()}
      />
    );

    const selectColumnButton = screen.getAllByTestId('select-column-button');
    fireEvent.click(selectColumnButton[0]);
    expect(selectColumnButton[0]).toBeInTheDocument();
  });

  render(
    <AddTransformation
      applyTransformation={jest.fn()}
      transformationDataType={mockDirectiveFunctionSupportedDataType}
      transformationName={mockFunctionName}
      columnsList={mockColumnData}
      missingItemsList={undefined}
      onCancel={jest.fn()}
    />
  );

  const selectColumnButton = screen.getByTestId('select-column-button');
  fireEvent.click(selectColumnButton);
  expect(selectColumnButton).toBeInTheDocument();

  const backIconButton = screen.getAllByTestId('back-icon')[0];
  fireEvent.click(backIconButton);

  const drawerCloseButton = screen.getAllByTestId('add-transformation-drawer-close-icon')[0];
  fireEvent.click(drawerCloseButton);
  expect(drawerCloseButton).toBeInTheDocument();
});

it('Trigger handleApply() , closeSelectColumnsPopupWithoutColumn ', () => {
  render(
    <AddTransformation
      applyTransformation={jest.fn()}
      transformationDataType={mockDirectiveFunctionSupportedDataType}
      transformationName={mockFunctionName}
      columnsList={mockColumnData}
      missingItemsList={undefined}
      onCancel={jest.fn()}
    />
  );

  const selectColumnButton = screen.getByTestId('select-column-button');
  fireEvent.click(selectColumnButton);
  const doneBtn = screen.getByTestId('button_done');
  fireEvent.click(doneBtn);
  const applyBtn = screen.getByTestId('apply-step-button');
  fireEvent.click(applyBtn);
  expect(applyBtn).toBeInTheDocument();
});
