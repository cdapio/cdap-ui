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
import React from 'react';
import DataQualityCircularProgressBar from 'components/ColumnView/SelectColumnsList/DataQualityCircularProgressBar';

describe('It Should test DataQualityCircularProgressBar Component', () => {
  it('Should render the DataQualityCircularProgressBar Component with data Quality percent as 100', () => {
    render(<DataQualityCircularProgressBar dataQualityPercentValue={100} index={1} />);
    const dataQualityPercent = screen.getByTestId(/data-quality-percent/i);
    expect(dataQualityPercent).toHaveTextContent('100');
  });

  it('Should render the DataQualityCircularProgressBar Component with data Quality percent as 0', () => {
    render(<DataQualityCircularProgressBar dataQualityPercentValue={0} index={1} />);
    const dataQualityPercent = screen.getByTestId(/data-quality-percent/i);
    expect(dataQualityPercent).toHaveTextContent('0');
  });
});
