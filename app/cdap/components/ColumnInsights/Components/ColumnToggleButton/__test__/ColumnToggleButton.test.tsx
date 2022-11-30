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
import ColumnToggleButton from 'components/ColumnInsights/Components/ColumnToggleButton';
import { mockDataQuality } from 'components/ColumnInsights/mock/mockDataForColumnInsights';
import React from 'react';

describe('It should test whether ColumnToggleButton Component.', () => {
  it('should test whether ColumnToggleButton Component is rendered and is in the Document', () => {
    render(<ColumnToggleButton dataQuality={mockDataQuality} />);
    const toggleButtonsParent = screen.getByTestId(/data-quality-toggle-parent/i);
    expect(toggleButtonsParent).toBeInTheDocument();
  });

  it('should test onClick functionality of toggle Buttons.', () => {
    render(<ColumnToggleButton dataQuality={mockDataQuality} />);
    const leftToggleButton = screen.getAllByTestId(/toggle-button-left/i)[0];
    expect(leftToggleButton).toBeInTheDocument();
    fireEvent.click(leftToggleButton);
    const rightToggleButton = screen.getAllByTestId(/toggle-button-right/i)[0];
    expect(rightToggleButton).toBeInTheDocument();
    fireEvent.click(rightToggleButton);
  });

  it('should test the toggle buttons labels', () => {
    render(<ColumnToggleButton dataQuality={mockDataQuality} />);
    const leftToggleButtonLabel = screen.getByTestId('toggle-button-left-label');
    const rightToggleButtonLabel = screen.getByTestId('toggle-button-right-label');

    expect(leftToggleButtonLabel).toHaveTextContent(
      'features.WranglerNewUI.ColumnInsights.empty 0 (0%)'
    );
    expect(rightToggleButtonLabel).toHaveTextContent(
      'features.WranglerNewUI.ColumnInsights.null 3 (50%)'
    );
  });
});
