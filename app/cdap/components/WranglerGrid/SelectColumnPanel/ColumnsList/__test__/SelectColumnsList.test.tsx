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
import SelectColumnsList from 'components/WranglerGrid/SelectColumnPanel/ColumnsList';

describe('It should test the SelectColumnsList Component', () => {
  it('should render the SelectColumnsList Component', () => {
    render(
      <Router history={history}>
        <Switch>
          <Route>
            <SelectColumnsList
              selectedColumnsCount={1}
              setSelectedColumns={() => jest.fn()}
              dataQuality={[]}
              transformationDataType={[]}
              columnsList={[]}
              transformationName={''}
              selectedColumns={[]}
            />
          </Route>
        </Switch>
      </Router>
    );
    expect(screen.getByTestId(/select-column-list-parent/i)).toBeInTheDocument();
  });
  it('should render the SelectColumnsList Component with some input value along with label and null and trigger input ', () => {
    render(
      <Router history={history}>
        <Switch>
          <Route>
            <SelectColumnsList
              columnsList={[]}
              selectedColumnsCount={0}
              setSelectedColumns={jest.fn()}
              dataQuality={[
                { label: 'hello', value: '' },
                { label: 'world', value: '' },
              ]}
              transformationDataType={['all', 'test']}
              transformationName={''}
              selectedColumns={[]}
            />
          </Route>
        </Switch>
      </Router>
    );

    const inputSearchElement = screen.getByTestId('input_id');
    fireEvent.change(inputSearchElement, { target: { value: '123' } });
    fireEvent.change(inputSearchElement, { target: { value: 'hello' } });
    fireEvent.change(inputSearchElement, { target: { value: null } });
    const searchIconElement = screen.getByTestId(/click-handle-focus/i);
    fireEvent.click(searchIconElement);
    expect(searchIconElement).toBeInTheDocument();
  });

  it('should render the SelectColumnsList Component with some input value along with label and null and trigger searchIconClick', () => {
    render(
      <Router history={history}>
        <Switch>
          <Route>
            <SelectColumnsList
              columnsList={[{ label: 'hello', type: ['test'], name: 'hello' }]}
              selectedColumnsCount={1}
              setSelectedColumns={jest.fn()}
              dataQuality={[
                { label: 'hello', value: '' },
                { label: 'world', value: '' },
              ]}
              transformationDataType={['test']}
              transformationName={'join-columns'}
              selectedColumns={[]}
            />
          </Route>
        </Switch>
      </Router>
    );

    const inputSearchElement = screen.getByTestId('input_id');
    fireEvent.change(inputSearchElement, { target: { value: '123' } });
    fireEvent.change(inputSearchElement, { target: { value: 'hello' } });
    fireEvent.change(inputSearchElement, { target: { value: null } });

    const searchIconElement = screen.getByTestId(/click-handle-focus/i);
    fireEvent.click(searchIconElement);
    expect(searchIconElement).toBeInTheDocument();
  });

  it('should render the SelectColumnsList Component while changing text input with some input value along with label and null', () => {
    const getSelectedColumns = jest.fn();
    render(
      <Router history={history}>
        <Switch>
          <Route>
            <SelectColumnsList
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
            />
          </Route>
        </Switch>
      </Router>
    );

    const inputSearchElement = screen.getByTestId('input_id');
    fireEvent.change(inputSearchElement, { target: { value: '123' } });
    expect(inputSearchElement).toHaveValue('123');
  });
  it('should render the SelectColumnsList Component with selectedColumnsCount is 0 and data quality array and trigger the single selection function and to click the radio button', () => {
    const mockSetSelected = jest.fn();
    render(
      <Router history={history}>
        <Switch>
          <Route>
            <SelectColumnsList
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
              transformationName={''}
              selectedColumns={[]}
            />
          </Route>
        </Switch>
      </Router>
    );
    const radioInputElement = screen.getAllByTestId('radio-input-0');
    fireEvent.click(radioInputElement[0], { target: { checked: true } });
    expect(radioInputElement[0]).toBeInTheDocument();
  });

  it('should render the SelectColumnsList Component with selectedColumnsCount is 0 and data quality array and trigger the multiple selection function', () => {
    const mockSetSelected = jest.fn();
    render(
      <Router history={history}>
        <Switch>
          <Route>
            <SelectColumnsList
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
              selectedColumns={[]}
            />
          </Route>
        </Switch>
      </Router>
    );
    const checkboxInputElement = screen.getAllByTestId('check-box-input-0');
    fireEvent.click(checkboxInputElement[0], { target: { checked: false } });
    fireEvent.click(checkboxInputElement[0], { target: { checked: true } });
    expect(checkboxInputElement[0]).toBeInTheDocument();
  });
});
