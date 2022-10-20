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
import ColumnView from 'components/ColumnView';
import React from 'react';
import { mockColumnData, mockDataQuality } from 'components/ColumnView/mock/mockDataForColumnView';

describe('It Should test Column View Component', () => {
  it('Should render the Column View Component and the column view panel , select Column list component to be in the document', () => {
    render(
      <ColumnView
        columnData={mockColumnData}
        dataQuality={mockDataQuality}
        closeClickHandler={() => jest.fn()}
      />
    );
    const columnViewParent = screen.getByTestId('column-view-panel-parent');
    expect(columnViewParent).toBeInTheDocument();
  });

  it('It Should trigger searchTermHandler Function', () => {
    render(
      <ColumnView
        columnData={mockColumnData}
        dataQuality={mockDataQuality}
        closeClickHandler={() => jest.fn()}
      />
    );
    const searchIcon = screen.getByTestId('search-icon');
    fireEvent.click(searchIcon);

    const searchInput = screen.getByTestId('search-term-input');
    fireEvent.change(searchInput, { target: { value: 'body_0' } });
    expect(searchInput).toHaveValue('body_0');
  });
});
