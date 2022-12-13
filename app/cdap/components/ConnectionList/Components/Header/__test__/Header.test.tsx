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
import T from 'i18n-react';
import React from 'react';
import { Route, Router, Switch } from 'react-router';
import history from 'services/history';
import Header from 'components/ConnectionList/Components/Header';
import { mockData, mockEachData } from 'components/ConnectionList/Components/Header/mock/mock';

describe('test Header Component', () => {
  const mockSearchHandleFunction = jest.fn();
  const mockHandleClearSearch = jest.fn();

  beforeEach(() => {
    render(
      <Router history={history}>
        <Switch>
          <Route>
            <Header
              levelIndex={1}
              tabsData={[]}
              searchHandler={mockSearchHandleFunction}
              makeCursorFocused={jest.fn()}
              handleSearch={jest.fn()}
              refs={{ current: [] }}
              handleClearSearch={mockHandleClearSearch}
              headersRefs={{ current: [] }}
              columnIndex={1}
              filteredData={mockData}
              eachFilteredData={mockEachData}
            />
          </Route>
        </Switch>
      </Router>
    );
  });
  test('should trigger search function upon clicking search icon button', () => {
    const searchIconButton = screen.getAllByTestId(/search-icon-1/i);
    fireEvent.click(searchIconButton[0]);
    expect(mockSearchHandleFunction).toBeCalled();
  });

  test('should trigger clear search function upon clicking clear search icon button', () => {
    const searchIconButton = screen.getAllByTestId(/clear-search-icon-1/i);
    fireEvent.click(searchIconButton[0]);
    expect(mockHandleClearSearch).toBeCalled();
  });

  test('should trigger onChange event when typed in it as expected', () => {
    const inputElement = screen.getAllByTestId(/search-field-1/i);
    fireEvent.change(inputElement[0], { target: { value: 'test' } });
    expect(inputElement[0]).toHaveValue('test');
  });
});
