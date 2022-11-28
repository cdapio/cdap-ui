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
import React, { ChangeEvent } from 'react';
import RadioInput from 'components/WranglerGrid/SelectColumnPanel/DataTable/RadioInput';

describe('It should render ', () => {
  it('Should render RadioInput component and trigger the on click event', () => {
    const MockOnChange = jest.fn();
    render(
      <RadioInput
        selectedColumns={[{ label: 'test', name: 'test', type: ['test'] }]}
        onSingleSelection={MockOnChange}
        columnDetail={{ label: 'test', name: 'test', type: ['test'] }}
        columnIndex={0}
      />
    );

    const radioInputElement = screen.getByTestId(/radio-input-0/i);
    fireEvent.click(radioInputElement, { target: { checked: true } });
    expect(MockOnChange).toHaveBeenCalled();
  });
});
