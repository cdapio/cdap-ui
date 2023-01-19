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
import DataTable from 'components/WranglerGrid/SelectColumnPanel/DataTable';
import T from 'i18n-react';
import React from 'react';

const mockColumnList = [
  { name: 'body_1', type: ['all'], label: 'body_1' },
  { name: 'body_2', type: ['all'], label: 'body_2' },
  { name: 'body_3', type: ['all'], label: 'body_3' },
  { name: 'body_4', type: ['string'], label: 'body_4' },
  { name: 'body_5', type: ['int'], label: 'body_5' },
];

describe('It should test DataTable Component', () => {
  const mockSetSelected = jest.fn();

  it('Should render the DataTable Component checking its table head named Columns', () => {
    render(
      <DataTable
        columns={mockColumnList}
        transformationDataType={['all']}
        handleSingleSelection={() => jest.fn()}
        selectedColumns={[]}
        dataQualityValue={[]}
        isSingleSelection={false}
        isCheckboxDisabled={() => false}
        handleMultipleSelection={() => jest.fn()}
        totalColumnCount={5}
        setSelectedColumns={mockSetSelected}
        transformationName={'swap-columns'}
      />
    );
    const checkBoxElement = screen.getByTestId(/column-table-check-box/i);
    fireEvent.change(checkBoxElement, { target: { checked: true } });
    expect(checkBoxElement).toHaveProperty('checked', true);
    expect(screen.getAllByTestId(/panel-columns/i)[0]).toHaveTextContent(
      `${T.translate('features.WranglerNewUI.GridPage.selectColumnListPanel.columns')}`
    );
  });

  it('Should render the DataTable Component checking its table head named Null Values', () => {
    render(
      <DataTable
        columns={mockColumnList}
        transformationDataType={['all']}
        handleSingleSelection={() => jest.fn()}
        selectedColumns={[]}
        dataQualityValue={[]}
        isSingleSelection={false}
        isCheckboxDisabled={() => false}
        handleMultipleSelection={() => jest.fn()}
        totalColumnCount={0}
        setSelectedColumns={mockSetSelected}
        transformationName={'swap-columns'}
      />
    );
    const checkBoxElement = screen.getByTestId(/column-table-check-box/i);
    fireEvent.change(checkBoxElement, { target: { checked: true } });
    expect(checkBoxElement).toHaveProperty('checked', true);
    expect(screen.getByTestId(/panel-values/i)).toHaveTextContent(
      `${T.translate('features.WranglerNewUI.GridPage.selectColumnListPanel.nullValues')}`
    );
  });

  it('Should trigger the checkboxs handleChange when colums length is greater than 2', () => {
    const selectedColumns = [
      { name: 'body_1', type: ['all'], label: 'body_1' },
      { name: 'body_2', type: ['all'], label: 'body_2' },
    ];
    render(
      <DataTable
        columns={mockColumnList}
        transformationDataType={['all']}
        handleSingleSelection={() => jest.fn()}
        selectedColumns={selectedColumns}
        dataQualityValue={[]}
        isSingleSelection={false}
        isCheckboxDisabled={() => false}
        handleMultipleSelection={() => jest.fn()}
        totalColumnCount={0}
        setSelectedColumns={mockSetSelected}
        transformationName={'swap-columns'}
      />
    );
    const checkBoxElement = screen.getByTestId(/column-table-check-box/i);
    fireEvent.change(checkBoxElement, { target: { checked: true } });
    expect(checkBoxElement).toHaveProperty('checked', true);
    fireEvent.change(checkBoxElement, { target: { checked: false } });
    expect(checkBoxElement).toHaveProperty('checked', false);
  });
});
