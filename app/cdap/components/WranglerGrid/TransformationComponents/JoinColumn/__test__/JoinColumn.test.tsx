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
import T from 'i18n-react';
import JoinColumn from 'components/WranglerGrid/TransformationComponents/JoinColumn/index';

describe('Testing render JoinColumn component', () => {
  const obj = {
    customInput: '',
    radioOption: '',
    columnNames: ['abhilash', 'test'],
    firstColumn: 'body_0',
    secondColumn: '',
    copyColumnName: 'test',
  };
  const PREFIX = 'features.WranglerNewUI.GridPage.transformationUI.joinColumn';

  beforeEach(() => {
    render(
      <JoinColumn
        setTransformationComponentsValue={jest.fn()}
        transformationComponentValues={obj}
      />
    );
  });

  it('Should render JoinColumn with head font text as expected', () => {
    const headFontElement = screen.getByTestId(/join-column-head-font/i);
    expect(headFontElement).toBeInTheDocument();
    expect(headFontElement).toHaveTextContent(`${T.translate(`${PREFIX}.setOrder`)}`);
  });

  it('Should render JoinColumn with sub head text as expected', () => {
    const subHeadElement = screen.getByTestId(/join-column-sub-head/i);
    expect(subHeadElement).toBeInTheDocument();
    expect(subHeadElement).toHaveTextContent(`${T.translate(`${PREFIX}.chooseDelimiter`)}`);
  });

  it('Should trigger handleChange Function', () => {
    const swapIconElement = screen.getByTestId(/join-column-swap-icon-wrapper/i);
    fireEvent.click(swapIconElement);
    expect(swapIconElement).toBeInTheDocument();
  });

  it('Should trigger handleChange function of input', () => {
    const inputElement = screen.getByTestId(/new-column-name-input/i);
    expect(inputElement).toBeInTheDocument();
    fireEvent.change(inputElement, { target: { value: 'abhilash' } });
    expect(inputElement).toHaveValue('abhilash');
  });
});
