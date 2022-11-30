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

import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import ColumnInsightsChart from 'components/ColumnInsightsChart';

const mockGraphData = [
  {
    text: '',
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
    text: 'test',
    value: 9,
  },
  {
    text: 'peek',
    value: 2,
  },
];
describe('It Should test ColumnInsightsChart Component', () => {
  it('should test whether ColumnInsightsChart Component is in the screen', () => {
    render(
      <ColumnInsightsChart
        open={true}
        setOpen={jest.fn()}
        graphData={mockGraphData}
        columnName={'body_2'}
        distinctValues={5}
      />
    );
    const viewFullChartModal = screen.getAllByTestId(/view-full-chart-modal/i);
    expect(viewFullChartModal[0]).toBeInTheDocument();
  });

  it('should test whether the distribution Label is as expected', () => {
    render(
      <ColumnInsightsChart
        open={true}
        setOpen={jest.fn()}
        graphData={mockGraphData}
        columnName={'body_2'}
        distinctValues={5}
      />
    );
    const distributionLabel = screen.getByTestId(/distribution/i);
    expect(distributionLabel).toHaveTextContent(
      'features.WranglerNewUI.ColumnInsightsChart.distribution'
    );
  });
  it('should test whether the column Name and distinct values are as expected', () => {
    render(
      <ColumnInsightsChart
        open={true}
        setOpen={jest.fn()}
        graphData={mockGraphData}
        columnName={'body_2'}
        distinctValues={100}
      />
    );
    const columnName = screen.getByTestId(/column-name/i);
    expect(columnName).toHaveTextContent(
      'features.WranglerNewUI.ColumnInsightsChart.columnNamebody_2'
    );
    const distinctValues = screen.getByTestId(/distinct-values/i);
    expect(distinctValues).toHaveTextContent(
      'features.WranglerNewUI.ColumnInsightsChart.distinct100'
    );
  });

  it('should test whether handleClose() is triggered when we close the modal', () => {
    render(
      <ColumnInsightsChart
        open={true}
        setOpen={jest.fn()}
        graphData={mockGraphData}
        columnName={'body_2'}
        distinctValues={5}
      />
    );
    const viewFullChartModal = screen.getAllByTestId(/view-full-chart-modal/i);
    expect(viewFullChartModal[0]).toBeInTheDocument();
    const closeIcon = screen.getByTestId(/close-icon-button/i);
    fireEvent.click(closeIcon);
    expect(closeIcon).toBeInTheDocument()
  });
});
