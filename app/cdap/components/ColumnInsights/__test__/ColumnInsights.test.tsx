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
import {
  mockColumnData,
  mockColumnDataWithEmptyDataTypeString,
} from 'components/ColumnInsights/mock/mockDataForColumnInsights';
import React from 'react';
import { Route, Router, Switch } from 'react-router';
import history from 'services/history';
import ColumnInsights from 'components/ColumnInsights';

describe('It Should test Column Insights Component', () => {
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

  it("Should test to close the Column Insights Panel by clicking on Close Icon and triggering the closeClickHandler() . After closing the panel, the Panel won't be in the DOM.", () => {
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
    expect(columnInsightsPanel).not.toBeInTheDocument();
  });
});
