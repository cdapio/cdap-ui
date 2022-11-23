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
import CustomTransform from 'components/WranglerGrid/TransformationComponents/index';
import { fireEvent, render, screen } from '@testing-library/react';
import { TRANSFORMATION_COMPONENTS } from 'components/WranglerGrid/TransformationComponents/constants';

describe('Test CustomTransform component', () => {
  it('Should render CustomTransform', () => {
    render(
      <CustomTransform
        setTransformationComponentsValue={jest.fn()}
        transformationComponent={TRANSFORMATION_COMPONENTS}
        transformationComponentValues={{ customInput: 'abc' }}
        transformationName={'customTransform'}
        transformationDataType={[]}
        columnsList={[]}
        missingItemsList={{}}
        onCancel={function(): void {
          throw new Error('Function not implemented.');
        }}
        applyTransformation={function(directive: string): void {
          throw new Error('Function not implemented.');
        }}
      />
    );

    const parentElement = screen.getByTestId(/form-group-parent/i);
    expect(parentElement).toBeInTheDocument();

    const inputTextElement = screen.getByTestId(/custom-input-value/i);
    fireEvent.change(inputTextElement, { target: { value: 'Test' } });
    expect(inputTextElement).toBeInTheDocument();
  });
});
