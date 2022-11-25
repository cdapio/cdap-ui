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
import ColumnDataDistribution from 'components/ColumnInsightsPanel/components/ColumnDataDistribution/index';
import history from 'services/history';
import { Route, Router, Switch } from 'react-router';

describe('It Should test Column Data Distribution Component', () => {
  const mockGraphData = [
    {
      text: 'undefined',
      value: 30,
    },
    {
      text: '"""91"""',
      value: 80,
    },
    {
      text: 'hello',
      value: 1,
    },
    {
      text: 'set',
      value: 90,
    },
    {
      text: '"""91"""',
      value: 9,
    },
    {
      text: 'test',
      value: 2,
    },
    {
      text: 'peek',
      value: 1,
    },
    {
      text: '  ',
      value: 1,
    },
    {
      text: '',
      value: 10,
    },
    {
      text: '',
      value: 1,
    },
  ];
  it('Should test whether  Column Data Distribution Component is rendered in the screen and the Graph label is as expected.', () => {
    render(
      <Router history={history}>
        <Switch>
          <Route>
            <ColumnDataDistribution graphData={mockGraphData} />
          </Route>
        </Switch>
      </Router>
    );
    const distributionText = screen.getByTestId(/distribution-text/i);
    expect(distributionText).toHaveTextContent(
      `features.WranglerNewUI.ColumnInsights.distribution`
    );
  });

  it('Should test whether View Full Chart Text is as expected.', () => {
    render(
      <Router history={history}>
        <Switch>
          <Route>
            <ColumnDataDistribution graphData={mockGraphData} />
          </Route>
        </Switch>
      </Router>
    );
    const viewFullChartText = screen.getByTestId(/view-full-chart-text/i);
    expect(viewFullChartText).toHaveTextContent(
      `features.WranglerNewUI.ColumnInsights.viewFullChart`
    );
  });

  it('Should test whether Data Distribution Graph is rendered in the Screen.', () => {
    render(
      <Router history={history}>
        <Switch>
          <Route>
            <ColumnDataDistribution graphData={mockGraphData} />
          </Route>
        </Switch>
      </Router>
    );
    const dataDistributionGraph = screen.getByTestId(/data-distribution-graph/i);
    fireEvent.click(dataDistributionGraph);
    expect(dataDistributionGraph).toBeInTheDocument();
  });
});
