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

import { render, screen } from '@testing-library/react';
import React from 'react';
import SelectColumnsList from 'components/ColumnView/SelectColumnsList';
import T from 'i18n-react';
import { mockColumnData, mockDataQuality } from 'components/ColumnView/mock/mockDataForColumnView';

describe('It should test SelectColumnList Component', () => {
  it('should render SelectColumnList Component and test column header text for null values', () => {
    render(
      <SelectColumnsList
        columnData={mockColumnData}
        dataQuality={mockDataQuality}
        searchTerm={'mockSearchItem'}
      />
    );
    const nullValueHeader = screen.getByTestId('null-values-header');
    expect(nullValueHeader).toHaveTextContent(
      T.translate(`features.WranglerNewUI.ColumnViewPanel.nullValues`).toString()
    );
  });
  it('should render SelectColumnList Component and test Column Header Name ', () => {
    render(
      <SelectColumnsList
        columnData={mockColumnData}
        dataQuality={mockDataQuality}
        searchTerm={'body_0'}
      />
    );
    const columnNameHeader = screen.getByTestId('column-name-header');
    expect(columnNameHeader).toHaveTextContent(
      T.translate(`features.WranglerNewUI.ColumnViewPanel.columns (4)`).toString()
    );
  });
  it('should render SelectColumnList Component , test Column Name and data quality percent', () => {
    render(
      <SelectColumnsList
        columnData={mockColumnData}
        dataQuality={mockDataQuality}
        searchTerm={''}
      />
    );

    const columnLabelType = screen.getByTestId('each-column-label-type-1');
    expect(columnLabelType).toHaveTextContent('body_1 String');

    const dataQualityCircularProgressBar = screen.getByTestId('data-quality-percent-1');
    expect(dataQualityCircularProgressBar).toHaveTextContent('33.3%');
  });
});
