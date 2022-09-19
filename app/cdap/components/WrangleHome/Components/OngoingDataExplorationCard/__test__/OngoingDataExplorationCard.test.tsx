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
import { render, screen } from '@testing-library/react';
import OngoingDataExplorationCard from '../index';
import { mockItems, mockItemsWithPercentage, mockItemsPercentageData } from '../mock/mock';

describe('Test Ongoing Data Explrations Component', () => {
  test('renders OngoingDataExplorationCard component', () => {
    render(<OngoingDataExplorationCard item={mockItems} />);
    const ele = screen.getByTestId(/wrangler-home-ongoing-data-exploration-card/i);
    expect(ele).toBeInTheDocument();
  });

  test('renders OngoingDataExplorationCard percentage non nan code', () => {
    render(<OngoingDataExplorationCard item={mockItemsWithPercentage} />);
    const ele = screen.getByTestId(/ongoing-data-exploration-card-percentage-nan/i);
    expect(ele).toBeInTheDocument();
  });

  test('Test if percentageStyleRed is applied to ongoing-data-card-percentage when percent is < 100', () => {
    render(<OngoingDataExplorationCard item={mockItemsWithPercentage} />);
    const ele = screen.getByTestId(/ongoing-data-card-percentage/i);
    expect(ele).toHaveStyle('color: rgb(229, 57, 53)');
  });

  test('Test if percentageSymbolRed is applied to ongoing-data-percentage-symbol when percent is < 100', () => {
    render(<OngoingDataExplorationCard item={mockItemsWithPercentage} />);
    const ele = screen.getByTestId(/ongoing-data-percentage-symbol/i);
    expect(ele).toHaveStyle('color: rgb(229, 57, 53)');
  });

  test('Test if percentageStyleGreen is applied to ongoing-data-card-percentage when percent is 100', () => {
    render(<OngoingDataExplorationCard item={mockItemsPercentageData} />);
    const ele = screen.getByTestId(/ongoing-data-card-percentage/i);
    expect(ele).toHaveStyle('color: rgb(67, 160, 71)');
  });

  test('Test if percentageSymbolGreen is applied to ongoing-data-percentage-symbol when percent is 100', () => {
    render(<OngoingDataExplorationCard item={mockItemsPercentageData} />);
    const ele = screen.getByTestId(/ongoing-data-percentage-symbol/i);
    expect(ele).toHaveStyle('color: rgb(67, 160, 71)');
  });
});
