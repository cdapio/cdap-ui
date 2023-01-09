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
import history from 'services/history';
import React from 'react';
import { Route, Router, Switch } from 'react-router';
import ColumnsList from 'components/WranglerGrid/SelectColumnPanel/ColumnsList';

describe('It should test the SelectColumnsList Component', () => {
  it('should render the SelectColumnsList Component', () => {
    render(
      <ColumnsList
        selectedColumnsCount={1}
        setSelectedColumns={() => jest.fn()}
        dataQuality={[]}
        transformationDataType={[]}
        columnsList={[]}
        transformationName={''}
        selectedColumns={[]}
        filteredColumnsOnTransformationType={[
          { label: 'hello', type: ['test'], name: 'hello' },
          { label: 'hello', type: ['test'], name: 'hello' },
        ]}
        isSingleSelection={false}
      />
    );
    expect(screen.getByTestId(/select-column-list-parent/i)).toBeInTheDocument();
  });
  it('should trigger foucus function and focus the input element as expected ', () => {
    const mockSetSelected = jest.fn();
    render(
      <ColumnsList
        columnsList={[]}
        selectedColumnsCount={0}
        setSelectedColumns={mockSetSelected}
        dataQuality={[
          { label: 'hello', value: '' },
          { label: 'world', value: '' },
        ]}
        transformationDataType={['all', 'test']}
        transformationName={''}
        selectedColumns={[]}
        filteredColumnsOnTransformationType={[
          { label: 'hello', type: ['test'], name: 'hello' },
          { label: 'hello', type: ['test'], name: 'hello' },
        ]}
        isSingleSelection={false}
      />
    );

    const searchIconElement = screen.getByTestId(/click-handle-focus/i);
    const inputElement = screen.getByTestId(/input-search-id/i);
    expect(inputElement).not.toHaveFocus();
    fireEvent.click(searchIconElement);
    expect(inputElement).toHaveFocus();
  });

  it('should render the SelectColumnsList Component while changing text input with some input value ', () => {
    const getSelectedColumns = jest.fn();
    render(
      <ColumnsList
        columnsList={[]}
        selectedColumnsCount={0}
        setSelectedColumns={getSelectedColumns}
        dataQuality={[
          { label: 'hello', value: '' },
          { label: 'world', value: '' },
        ]}
        transformationDataType={['all', 'test']}
        transformationName={''}
        selectedColumns={[]}
        filteredColumnsOnTransformationType={[
          { label: 'hello', type: ['test'], name: 'hello' },
          { label: 'hello', type: ['test'], name: 'hello' },
        ]}
        isSingleSelection={false}
      />
    );

    const inputSearchElement = screen.getByTestId('input-search-id');
    fireEvent.change(inputSearchElement, { target: { value: '123' } });
    expect(inputSearchElement).toHaveValue('123');
    fireEvent.change(inputSearchElement, { target: { value: '' } });
    expect(inputSearchElement).toHaveTextContent('');
  });

  it('should render the SelectColumnsList Component with selectedColumnsCount is 0 and data quality array and trigger the multiple selection function', () => {
    const mockSetSelected = jest.fn();
    render(
      <ColumnsList
        selectedColumnsCount={0}
        columnsList={[
          { label: 'hello', type: ['a', 'b'], name: 'test' },
          { label: 'hello', type: ['a', 'b'], name: 'test' },
        ]}
        setSelectedColumns={mockSetSelected}
        dataQuality={[
          { label: 'hello', value: '' },
          { label: 'world', value: '' },
        ]}
        transformationDataType={['TEST', 'all']}
        transformationName={'join-columns'}
        selectedColumns={[
          { label: 'hello', type: ['test'], name: 'hello' },
          { label: 'hello', type: ['test'], name: 'hello' },
        ]}
        filteredColumnsOnTransformationType={[
          { label: 'hello', type: ['test'], name: 'hello' },
          { label: 'hello', type: ['test'], name: 'hello' },
        ]}
        isSingleSelection={false}
      />
    );
    const checkboxInputElement = screen.getAllByTestId('check-box-input-0');
    fireEvent.change(checkboxInputElement[0], { target: { checked: true } });
    expect(checkboxInputElement[0]).toHaveProperty('checked', true);
  });
});
