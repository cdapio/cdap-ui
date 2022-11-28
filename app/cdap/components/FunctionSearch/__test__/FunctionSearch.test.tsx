/*
 *  Copyright © 2022 Cask Data, Inc.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"); you may not
 *  use this file except in compliance with the License. You may obtain a copy of
 *  the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 *  WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 *  License for the specific language governing permissions and limitations under
 *  the License.
 */

import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import FunctionSearch from 'components/FunctionSearch';
import MyDataPrepApi from 'api/dataprep';
import { mockData } from 'components/FunctionSearch/mock/mockData';

describe('It Should test FunctionSeach Component.', () => {
  beforeEach(() => {
    jest.spyOn(MyDataPrepApi, 'getUsage').mockImplementation(() => {
      return {
        subscribe: (callback) => {
          callback(mockData);
        },
      };
    });
  });

  it('Should test whether FunctionSearch Component is rendered .', () => {
    render(<FunctionSearch transformationPanel={jest.fn()} />);
    const searchBox = screen.getByTestId(/search-box/i);
    expect(searchBox).toBeInTheDocument();
  });

  it('Should trigger input field onchange when we search in the Search Box ', () => {
    const { container } = render(<FunctionSearch transformationPanel={jest.fn()} />);
    const searchInputField = container.querySelector('input');
    expect(searchInputField).toBeInTheDocument();

    fireEvent.change(searchInputField, { target: { value: 'uppercase' } });
    expect(searchInputField).toHaveValue('uppercase');

    fireEvent.change(searchInputField, { target: { value: '' } });
    expect(searchInputField).toHaveValue('');
  });

  it('Should clear the input field search.', () => {
    const { container } = render(<FunctionSearch transformationPanel={jest.fn()} />);
    const searchInputField = container.querySelector('input');

    fireEvent.change(searchInputField, { target: { value: 'uppercase' } });
    expect(searchInputField).toHaveValue('uppercase');

    const clearIcon = screen.getByTestId(/clear-search-icon/i);
    fireEvent.click(clearIcon);

    expect(searchInputField).toHaveValue('');
  });

  it('It should search and click on directive option', () => {
    const { container } = render(<FunctionSearch transformationPanel={jest.fn()} />);
    const searchInputField = container.querySelector('input');

    fireEvent.change(searchInputField, { target: { value: 'uppercase' } });
    expect(searchInputField).toHaveValue('uppercase');

    const uppercaseOption = screen.getByTestId(/search-result-uppercase/i);
    fireEvent.click(uppercaseOption);
  });
});
