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
import Concatenate from 'components/WranglerGrid/TransformationComponents/Concatenate/index';
import T from 'i18n-react';

describe('It should test Concentrate coponent', () => {
  const PREFIX =
    'features.WranglerNewUI.GridPage.transformationUI.format.options.concatenate.labels';

  beforeEach(() => {
    render(
      <Concatenate
        setTransformationComponentsValue={jest.fn()}
        transformationComponentValues={undefined}
      />
    );
  });
  it('should render form label as expected', () => {
    const labelComponent = screen.getByTestId(/concentrate-form-label/i);
    expect(labelComponent).toBeInTheDocument();
    expect(labelComponent).toHaveTextContent(`${T.translate(`${PREFIX}.add`).toString()}`);
  });

  it('should trigger handleChnage of input text', () => {
    const inputElement = screen.getByTestId(/concentrate-input-text/i);
    expect(inputElement).toBeInTheDocument();
    fireEvent.change(inputElement.firstChild, { target: { value: 'Abhilash' } });
    expect(inputElement.firstChild).toHaveValue('Abhilash');
  });

  it('Should click checkbox and trigger handle change of form input field', () => {
    const checkBoxElement = screen.getAllByTestId(/copy-to-new-column-checkbox/i);
    expect(checkBoxElement[0]).toBeInTheDocument();
    fireEvent.click(checkBoxElement[0]);
    const formInputElement = screen.getByTestId(/copy-to-new-column-custom-input/i);
    expect(formInputElement).toBeInTheDocument();
    fireEvent.change(formInputElement, { target: { value: 'Abhilash' } });
    expect(formInputElement).toHaveValue('Abhilash');
  });
});
