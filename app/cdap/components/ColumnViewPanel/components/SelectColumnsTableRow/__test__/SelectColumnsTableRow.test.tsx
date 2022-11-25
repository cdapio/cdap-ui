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
import SelectColumnsTableRow from 'components/ColumnViewPanel/components/SelectColumnsTableRow/index';

describe('It Should test SelectColumnsTableRow Component', () => {
  it('Should render the SelectColumnsTableRow Component in virtula DOM and check if labels are rendered as expected', () => {
    render(
      <SelectColumnsTableRow
        eachFilteredColumn={{ name: 'string', label: 'string', type: [] }}
        filteredColumnIndex={0}
        dataQualityList={[]}
        setColumnSelected={jest.fn()}
        onColumnSelection={jest.fn()}
        selectedColumn={'Abhilash'}
        handleCoumnDeSelect={jest.fn()}
      />
    );
    const tableParentWrapper = screen.getByTestId(/table-parent-wrapper/i);
    expect(tableParentWrapper).toBeInTheDocument();

    const filteredElement = screen.getByTestId(/filtered-column-label-type/i);
    expect(filteredElement).toHaveTextContent('string');

    const columnRowElement = screen.getByTestId(/table-column-row-wrapper/i);
    fireEvent.click(columnRowElement);
    expect(columnRowElement).toBeInTheDocument();
  });

  it('Should render the SelectColumnsTableRow when eachFilteredColumn.label is lectedColumn', () => {
    render(
      <SelectColumnsTableRow
        eachFilteredColumn={{ name: 'string', label: 'Abhilash', type: [] }}
        filteredColumnIndex={0}
        dataQualityList={[]}
        setColumnSelected={jest.fn()}
        onColumnSelection={jest.fn()}
        selectedColumn={'Abhilash'}
        handleCoumnDeSelect={jest.fn()}
      />
    );

    const columnRowElement = screen.getByTestId(/table-column-row-wrapper/i);
    fireEvent.click(columnRowElement);
    expect(columnRowElement).toBeInTheDocument();
  });
});
