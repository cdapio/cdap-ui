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

import React from 'react';
import DirectiveInput from 'components/DirectiveInput/index';
import { fireEvent, render, screen } from '@testing-library/react';

describe('Testing Directive Input Component', () => {
  beforeEach(() => {
    render(
      <DirectiveInput
        columnNamesList={[{ name: 'abhilash', label: 'Batman', type: [] }]}
        onDirectiveInputHandler={() => jest.fn()}
        onClose={() => jest.fn()}
        openDirectivePanel={true}
      />
    );
  });

  it('Should check if the component is rendered ', () => {
    const parentElement = screen.getByTestId(/directive-input-parent/i);
    expect(parentElement).toBeInTheDocument();
  });

  it('Should check if the input element is working as expected with test as input', () => {
    const inputElement = screen.getByTestId(/select-directive-input-search/i);
    expect(inputElement).toBeInTheDocument();
    fireEvent.change(inputElement, { target: { value: '' } });
    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter', charCode: 13 });
    expect(inputElement).toHaveAttribute('value', '');
  });
});
