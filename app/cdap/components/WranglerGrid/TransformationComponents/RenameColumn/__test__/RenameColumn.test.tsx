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

import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import RenameColumn from 'components/WranglerGrid/TransformationComponents/RenameColumn/index';

describe('Testing render RenameColumn component', () => {
  const obj = {
    customInput: '',
    radioOption: '',
    columnNames: ['abhilash', 'test'],
    firstColumn: 'body_0',
    secondColumn: '',
    copyColumnName: 'test',
  };
  beforeEach(() => {
    render(
      <RenameColumn
        transformationComponentValues={obj}
        setTransformationComponentsValue={jest.fn()}
      />
    );
  });

  it('Should render RenameColumn', () => {
    const parentElement = screen.getByTestId(/new-column-wrapper-parent/i);
    expect(parentElement).toBeInTheDocument();
  });

  it('Should trigger handleChange function of input', () => {
    const inputElement = screen.getByTestId(/new-column-name-input/i);
    expect(inputElement).toBeInTheDocument();
    fireEvent.change(inputElement, { target: { value: 'abhilash' } });
    expect(inputElement).toHaveValue('abhilash');
  });
});
