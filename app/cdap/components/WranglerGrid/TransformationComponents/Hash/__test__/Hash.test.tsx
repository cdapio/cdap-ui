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
import { fireEvent, render, screen } from '@testing-library/react';
import Hash from 'components/WranglerGrid/TransformationComponents/Hash/';
describe('It Should test Hash Component', () => {
  it('should test whether Hash Component is displayed in the Screen.', () => {
    render(
      <Hash
        setTransformationComponentsValue={jest.fn()}
        functionName={'hash'}
        transformationComponentValues={{
          hashValue: '',
          ignoreCase: false,
          encode: false,
        }}
      />
    );
    const hashContainer = screen.getByTestId(/hash-container/i);
    expect(hashContainer).toBeInTheDocument();
  });
  it('Should test whether hash-encode-checkbox is checked', () => {
    render(
      <Hash
        setTransformationComponentsValue={jest.fn()}
        functionName={'hash'}
        transformationComponentValues={{
          hashValue: '',
          ignoreCase: false,
          encode: false,
        }}
      />
    );
    const hashEncodeCheckbox = screen.getByTestId(/hash-encode-checkbox/i);
    fireEvent.click(hashEncodeCheckbox);
    expect(hashEncodeCheckbox).toBeChecked();
  });
});
