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
import InputWidgets from 'components/WranglerGrid/SelectColumnPanel/DataTable/InputWidgets';
import React from 'react';

describe('It should render ', () => {
  it('Should render Checkbox Component when "isSingleSelection" is false', () => {
    render(
      <InputWidgets
        isSingleSelection={false}
        selectedColumns={[
          { name: 'body_2', type: ['all'], label: 'body_2' },
          { name: 'body_1', type: ['all'], label: 'body_1' },
        ]}
        handleSingleSelection={() => jest.fn()}
        columnDetail={{ name: 'body_2', type: ['all'], label: 'body_2' }}
        isCheckboxDisabled={() => false}
        handleMultipleSelection={() => jest.fn()}
        columnIndex={0}
        isCheckboxDisabled={() => false}
      />
    );
    const checkBoxElement = screen.getByTestId(/check-box-input-0/i);
    expect(screen.getByTestId(/check-box-input-0/i)).toBeInTheDocument();
    fireEvent.change(checkBoxElement, { target: { checked: true } });
    expect((checkBoxElement as HTMLInputElement).checked).toEqual(true);
  });

  it('Should render Radio Componene when "isSingleSelection" is true', () => {
    render(
      <InputWidgets
        isSingleSelection={true}
        selectedColumns={[{ name: 'body_2', type: ['all'], label: 'body_2' }]}
        handleSingleSelection={() => jest.fn()}
        columnDetail={{ name: 'body_2', type: ['all'], label: 'body_2' }}
        isCheckboxDisabled={() => false}
        handleMultipleSelection={() => jest.fn()}
        columnIndex={0}
        isCheckboxDisabled={() => false}
      />
    );
    const radioInputElement = screen.getByTestId(/radio-input-0/i);
    expect(screen.getByTestId(/radio-input-0/i)).toBeInTheDocument();
    fireEvent.change(radioInputElement, { target: { checked: true } });
    expect((radioInputElement as HTMLInputElement).checked).toEqual(true);
  });
});
