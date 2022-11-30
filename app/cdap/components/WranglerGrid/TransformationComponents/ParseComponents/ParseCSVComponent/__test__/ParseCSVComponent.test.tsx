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
import ParseCSVComponent from 'components/WranglerGrid/TransformationComponents/ParseComponents/ParseCSVComponent/index';
import { ITransformationComponentValues } from 'components/WranglerGrid/AddTransformationPanel/types';

describe('It should test ParseCSVComponent', () => {
  it('should test `set first row as header` checkbox', () => {
    const mockSetState = jest.fn((x) => {
      x;
    });
    render(
      <ParseCSVComponent
        setTransformationComponentsValue={
          mockSetState as React.Dispatch<React.SetStateAction<ITransformationComponentValues>>
        }
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
    const setFirstRowHeaderChecbox = screen.getByRole('checkbox');
    fireEvent.click(setFirstRowHeaderChecbox);
    expect(setFirstRowHeaderChecbox).toBeInTheDocument();
  });
});
