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
import DefineVariable from 'components/WranglerGrid/TransformationComponents/DefineVariable';

const mockColumnList = [
  {
    name: 'body_0',
    label: 'body_0',
    type: ['Bytes'],
  },
  {
    name: 'body_1',
    label: 'body_1',
    type: ['String'],
  },
  {
    name: 'body_2',
    label: 'body_2',
    type: ['Bytes'],
  },
];
describe('It should test DefineVariable Component', () => {
  it('should test whether Define Variable component is rendered and is in the Document.', () => {
    render(
      <DefineVariable
        setTransformationComponentsValue={jest.fn()}
        transformationComponentValues={{
          variableName: '',
          customInput: '',
          selectedColumnForDefineVariable: '',
          filterCondition: 'TEXTEXACTLY',
          selectedColumn: '',
        }}
        columnsList={mockColumnList}
      />
    );
    const defineVariableContainer = screen.getByTestId(/define-variable-container/i);
    expect(defineVariableContainer).toBeInTheDocument();
  });
  it('should test the variable , custom Input fields and summary is as expected .', () => {
    render(
      <DefineVariable
        setTransformationComponentsValue={jest.fn()}
        transformationComponentValues={{
          variableName: '',
          customInput: '',
          selectedColumnForDefineVariable: 'body_0',
          filterCondition: 'TEXTEXACTLY',
          selectedColumn: 'body_0',
        }}
        columnsList={mockColumnList}
      />
    );
    const defineVariableContainer = screen.getByTestId(/define-variable-container/i);
    expect(defineVariableContainer).toBeInTheDocument();

    const variableName = screen.getByTestId(/variable-name-input/i);
    fireEvent.change(variableName.firstChild, { target: { value: 'testingDefineVariable' } });

    const customInput = screen.getByTestId(/custom-input/i);
    fireEvent.change(customInput.firstChild, { target: { value: 'custom' } });

    const defineVariableSummary = screen.getByTestId(/define-variable-summary/i);
    expect(defineVariableSummary).toBeInTheDocument();
    expect(defineVariableSummary).toHaveTextContent(
      'Summary: you defined the variable "testingDefineVariable" for the cell in column body_0 in the row which features.WranglerNewUI.GridPage.transformationUI.defineVariable.defineVariableOptions.valueIs custom in column "body_0"'
    );
  });
});
