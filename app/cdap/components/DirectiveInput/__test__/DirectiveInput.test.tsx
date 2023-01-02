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
import DirectiveInput from 'components/DirectiveInput';
import { fireEvent, render, screen } from '@testing-library/react';
import { getFormattedSyntax } from 'components/DirectiveInput/utils';

describe('Testing Directive Input Component', () => {
  const mockCloseFunction = jest.fn();

  beforeEach(() => {
    render(
      <DirectiveInput
        columnNamesList={[{ name: 'abhilash', label: 'Batman', type: [] }]}
        onDirectiveInputHandler={() => jest.fn()}
        onClose={mockCloseFunction}
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
    getFormattedSyntax('test: apple', 'test : test');
    expect(inputElement).toBeInTheDocument();
    fireEvent.change(inputElement, { target: { value: 'test' } });
    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter' });
    expect(inputElement).toHaveAttribute('value', 'test');
  });

  it('Should check cross icon is functioning as expected ', () => {
    const closeIconElement = screen.getByTestId(/close-directive-panel/i);
    fireEvent.click(closeIconElement);
    expect(mockCloseFunction).toBeCalled();
  });
});
