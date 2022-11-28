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

import { render, screen } from '@testing-library/react';
import React from 'react';
import ParseDateTimeComponent from 'components/WranglerGrid/TransformationComponents/ParseComponents/ParseDateTimeComponent/index';

describe('It should test ParseDateTimeComponent', () => {
  it('Should render ParseDateTimeComponent', () => {
    render(
      <ParseDateTimeComponent
        setTransformationComponentsValue={jest.fn()}
        transformationComponentValues={{
          radioOption: 'string',
          copyColumnName: 'string',
          customInput: 'string',
          copyToNewColumn: true,
          sheetValue: 'string',
          firstRowAsHeader: true,
          depth: 0,
          columnWidths: 'string',
          optionPaddingParam: 'string',
        }}
      />
    );

    const parentElement = screen.getByTestId(/parse-component-parent/i);
    expect(parentElement).toBeInTheDocument();
  });
});
