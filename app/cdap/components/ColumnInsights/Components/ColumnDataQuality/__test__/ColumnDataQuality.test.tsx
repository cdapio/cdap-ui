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

import { render, screen } from '@testing-library/react';
import {
  mockColumnInfoForDataQuality,
  mockDataQuality,
} from 'components/ColumnInsights/mock/mockDataForColumnInsights';
import React from 'react';
import ColumnDataQuality from 'components/ColumnInsights/Components/ColumnDataQuality';

describe('It Should test ColumnDatQuality Component.', () => {
  it('Should test whether ColumnDatQuality is rendered in the Screen and Quality Text is as expected. ', () => {
    render(
      <ColumnDataQuality dataQuality={mockDataQuality} columnInfo={mockColumnInfoForDataQuality} />
    );
    const columnDataQualityParent = screen.getByTestId(/column-data-quality-parent/i);
    expect(columnDataQualityParent).toBeInTheDocument();

    const qualityText = screen.getByTestId(/quality-text/i);
    expect(qualityText).toHaveTextContent('features.NewWranglerUI.ColumnInsights.quality');
  });

  it('Should test whether the quality Bar is in the Screen and the quality bar width based on the null values.', () => {
    render(
      <ColumnDataQuality dataQuality={mockDataQuality} columnInfo={mockColumnInfoForDataQuality} />
    );
    const qualityBar = screen.getByTestId(/quality-bar/i);
    expect(qualityBar).toBeInTheDocument();

    const filledQualityBar = screen.getByTestId(/filled-bar/i);
    expect(filledQualityBar).toHaveStyle('width:40%');

    const emptyQualityBar = screen.getByTestId(/empty-bar/i);
    expect(emptyQualityBar).toHaveStyle('width:60%');
  });

  it('Should test whether the quality Bar is in the Screen when a non-null value is not present.', () => {
    render(
      <ColumnDataQuality
        dataQuality={mockDataQuality}
        columnInfo={{
          general: {
            null: 50,
          },
          types: {
            Text: 16.666668,
          },
        }}
      />
    );
    const qualityBar = screen.getByTestId(/quality-bar/i);
    expect(qualityBar).toBeInTheDocument();

    const filledQualityBar = screen.getByTestId(/filled-bar/i);
    expect(filledQualityBar).toHaveStyle('width:0%');
  });

  it('Should test whether ToggleButton is present in the Document.', () => {
    render(
      <ColumnDataQuality
        dataQuality={mockDataQuality}
        columnInfo={{
          general: {
            null: 50,
          },
          types: {
            Text: 16.666668,
          },
        }}
      />
    );
    const toggleButton = screen.getByTestId(/data-quality-toggle-parent/i);
    expect(toggleButton).toBeInTheDocument();
  });
});
