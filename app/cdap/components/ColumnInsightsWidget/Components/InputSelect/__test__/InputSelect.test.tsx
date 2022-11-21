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

import { fireEvent, render, screen, within } from '@testing-library/react';
import InputSelect from 'components/ColumnInsights/Components/InputSelect';
import { mockOptions } from 'components/ColumnInsights/mock/mockDataForColumnInsights';
import React from 'react';

describe('It Should test InputSelect Component', () => {
  it('should test whether InputSelect Component is rendered.', () => {
    render(
      <InputSelect
        options={mockOptions}
        value={'boolean'}
        onChange={jest.fn()}
        fullWidth={false}
        defaultValue={'string'}
        type={'column-insights'}
      />
    );
    const inputElement = screen.getByTestId(/input-select/i);
    expect(inputElement).toBeInTheDocument();
  });
  it('should test whether MenuItem has the expected label which is selected', () => {
    const { getByRole } = render(
      <InputSelect
        options={mockOptions}
        value={'boolean'}
        onChange={jest.fn()}
        fullWidth={false}
        defaultValue={'string'}
        type={'column-insights'}
      />
    );
    fireEvent.mouseDown(getByRole('button'));
    const listbox = within(getByRole('listbox'));
    const longText = listbox.getByText(/Long/i);
    fireEvent.click(longText);
    const selectOption = screen.getByTestId(/select-option-Long/i);
    expect(selectOption).toHaveTextContent('Long');
  });
});
