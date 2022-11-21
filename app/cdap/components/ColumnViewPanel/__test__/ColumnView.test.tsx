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
import ColumnView from 'components/ColumnViewPanel/index';
import React from 'react';

export const mockColumnData = [
  {
    name: 'body_0',
    label: 'body_0',
    type: ['Int'],
  },
  {
    name: 'body_1',
    label: 'body_1',
    type: ['String'],
  },
  {
    name: 'body_2',
    label: 'body_2',
    type: ['String'],
  },
  {
    name: 'body_3',
    label: 'body_3',
    type: ['String'],
  },
];

export const mockDataQuality = {
  body_0: {
    general: {
      'non-null': 100,
    },
  },
  body_1: {
    general: {
      'non-null': 66.66667,
      null: 33.333336,
    },
  },
  body_2: {
    general: {
      'non-null': 83.33333,
      null: 16.666668,
    },
    types: {
      Integer: 33.333336,
      Text: 33.333336,
    },
  },
  body_3: {
    general: {
      'non-null': 50,
      null: 50,
    },
    types: {
      Text: 16.666668,
    },
  },
};

export const mockResult = [
  { label: 'body_0', value: 0 },
  { label: 'body_1', value: 33.333336 },
  { label: 'body_2', value: 16.666668 },
  { label: 'body_3', value: 50 },
];

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
    fireEvent.change(searchInput);
    expect(searchInput).toBeInTheDocument();
  });
});
