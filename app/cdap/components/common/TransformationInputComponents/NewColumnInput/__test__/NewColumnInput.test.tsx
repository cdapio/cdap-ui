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
import NewColumnInput from 'components/common/TransformationInputComponents/NewColumnInput/index';
import T from 'i18n-react';

describe('Testing NewColumnInput component', () => {
  const PREFIX = 'features.WranglerNewUI.GridPage.transformationUI.common';

  it('Should render NewColumnInput component when  isError is false ', () => {
    render(<NewColumnInput column={''} setColumnName={jest.fn()} isError={false} />);

    const parentElement = screen.getByTestId(/new-column-wrapper-parent/i);
    expect(parentElement).toBeInTheDocument();
  });

  it('Should render NewColumnInput component when  isError is false ', () => {
    render(<NewColumnInput column={''} setColumnName={jest.fn()} isError={true} />);

    const parentElement = screen.getByTestId(/new-column-wrapper-parent/i);
    expect(parentElement).toBeInTheDocument();

    const errorElement = screen.getByTestId(/error-text/i);
    expect(errorElement).toHaveTextContent(`${T.translate(`${PREFIX}.columnExist`)}`);
  });

  it('Should trigger onChange event', () => {
    render(<NewColumnInput column={''} setColumnName={jest.fn()} isError={false} />);

    const parentElement = screen.getByTestId(/new-column-wrapper-parent/i);
    expect(parentElement).toBeInTheDocument();

    const inputTextElement = screen.getByTestId(/new-column-name-input/i);
    fireEvent.change(inputTextElement, { target: { value: 'test' } });
    expect(inputTextElement).toBeInTheDocument();
  });
});
