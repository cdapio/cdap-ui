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
import React from 'react';
import FindAndReplace from 'components/WranglerGrid/TransformationComponents/FindAndReplace';

describe('It should test Find And Replace Component', () => {
  const mockTransformationComponentValues = {
    exactMatch: false,
    findPreviousValue: '',
    findReplaceValue: ' ',
    ignoreCase: false,
  };
  it('It should test whether Find and Replace Component got rendered in the screen.', () => {
    render(
      <FindAndReplace
        setTransformationComponentsValue={jest.fn()}
        transformationComponentValues={mockTransformationComponentValues}
      />
    );
  });

  it('should test the form field for Old Values Input', () => {
    render(
      <FindAndReplace
        setTransformationComponentsValue={jest.fn()}
        transformationComponentValues={mockTransformationComponentValues}
      />
    );
    const oldValueInputForm = screen.getByTestId(/old-value-input-form/i);
    fireEvent.change(oldValueInputForm.firstChild, {
      target: { value: 'embedded' },
    });
    expect(oldValueInputForm.firstChild).toHaveValue('embedded');
  });

  it('should test the form field for New Values Input', () => {
    render(
      <FindAndReplace
        setTransformationComponentsValue={jest.fn()}
        transformationComponentValues={mockTransformationComponentValues}
      />
    );
    const newValueInputForm = screen.getByTestId(/new-value-input-form/i);
    fireEvent.change(newValueInputForm.firstChild, {
      target: { value: 'embedded' },
    });
    expect(newValueInputForm.firstChild).toHaveValue('embedded');
  });

  it('should test Ignore Case Checkbox', () => {
    render(
      <FindAndReplace
        setTransformationComponentsValue={jest.fn()}
        transformationComponentValues={mockTransformationComponentValues}
      />
    );
    const ignoreCaseCheckbox = screen.getAllByTestId(/ignore-case-input-checkbox/i);
    fireEvent.click(ignoreCaseCheckbox[0]);
  });

  it('should test Ignore Case Checkbox', () => {
    render(
      <FindAndReplace
        setTransformationComponentsValue={jest.fn()}
        transformationComponentValues={mockTransformationComponentValues}
      />
    );
    const exactMatchInputCheckbox = screen.getAllByTestId(/exact-match-input-checkbox/i);
    fireEvent.click(exactMatchInputCheckbox[0]);
  });
});
