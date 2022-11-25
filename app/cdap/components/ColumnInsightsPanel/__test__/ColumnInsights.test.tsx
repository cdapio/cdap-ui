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
import { Route, Router, Switch } from 'react-router';
import history from 'services/history';
import ColumnInsights from 'components/ColumnInsightsPanel/index';

describe('It Should test Column Insights Component', () => {
  const mockColumnData = {
    open: true,
    columnName: 'body_2',
    distinctValues: 3,
    characterCount: {
      min: 0,
      max: 8,
    },
    dataQuality: {
      nullValueCount: 3,
      nullValuePercentage: 50,
      emptyValueCount: 0,
      emptyValuePercentage: 0,
    },
    dataQualityBar: {
      general: {
        'non-null': 50,
        null: 50,
      },
      types: {
        Text: 16.666668,
      },
    },
    dataTypeString: 'Contains letters and numbers',
    dataDistributionGraphData: [
      {
        text: 'undefined',
        value: 3,
      },
      {
        text: '"""91"""',
        value: 1,
      },
      {
        text: '11swd',
        value: 1,
      },
      {
        text: 'sxe',
        value: 1,
      },
    ],
    columnNamesList: ['body_0,body_1,body_2,body_3,body_4'],
  };

  const mockColumnDataWithEmptyDataTypeString = {
    open: true,
    columnName: 'body_2',
    distinctValues: 3,
    characterCount: {
      min: 0,
      max: 8,
    },
    dataQuality: {
      nullValueCount: 3,
      nullValuePercentage: 50,
      emptyValueCount: 0,
      emptyValuePercentage: 0,
    },
    dataQualityBar: {
      general: {
        'non-null': 50,
        null: 50,
      },
      types: {
        Text: 16.666668,
      },
    },
    dataTypeString: '',
    dataDistributionGraphData: [
      {
        text: 'undefined',
        value: 3,
      },
      {
        text: '"""91"""',
        value: 1,
      },
      {
        text: '11swd',
        value: 1,
      },
      {
        text: 'sxe',
        value: 1,
      },
    ],
    columnNamesList: ['body_0,body_1,body_2,body_3,body_4'],
  };
  it('Should test whether the Column Insights Panel is rendered on the screen.', () => {
    render(
      <Router history={history}>
        <Switch>
          <Route>
            <ColumnInsights
              columnData={mockColumnData}
              renameColumnNameHandler={jest.fn()}
              dataTypeHandler={jest.fn()}
              columnType={'String'}
              onClose={jest.fn()}
            />
          </Route>
        </Switch>
      </Router>
    );
    const columnInsightsPanel = screen.getByTestId(/column-insights-panel/i);
    expect(columnInsightsPanel).toBeInTheDocument();
  });

  it('Should test to close the Column Insights Panel by clicking on Close Icon and triggering the closeClickHandler()', () => {
    render(
      <Router history={history}>
        <Switch>
          <Route>
            <ColumnInsights
              columnData={mockColumnDataWithEmptyDataTypeString}
              renameColumnNameHandler={jest.fn()}
              dataTypeHandler={jest.fn()}
              columnType={'String'}
              onClose={jest.fn()}
            />
          </Route>
        </Switch>
      </Router>
    );
    const columnInsightsPanel = screen.getByTestId(/column-insights-panel/i);
    const closeIcon = screen.getByTestId(/close-icon/i);
    fireEvent.click(closeIcon);
    expect(columnInsightsPanel).toBeInTheDocument();
  });
});
