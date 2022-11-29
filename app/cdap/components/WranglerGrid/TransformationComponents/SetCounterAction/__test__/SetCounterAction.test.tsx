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

import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import SetCounterAction from 'components/WranglerGrid/TransformationComponents/SetCounterAction/index';
import T from 'i18n-react';

describe('Test SetCounter Component', () => {
  const obj = {
    filterConditionValue: '',
    filterCondition: '',
    counterName: '',
    counter: 1,
  };

  const PREFIX = 'features.WranglerNewUI.GridPage.transformationUI.setCounter';

  beforeEach(() => {
    render(
      <SetCounterAction
        setTransformationComponentsValue={jest.fn()}
        transformationComponentValues={obj}
        transformationName={'Abhilash'}
      />
    );
  });
  it('Should check if the sub head text is as axpected', () => {
    const subHeadElement = screen.getAllByTestId(/set-counter-sub-head/i);
    expect(subHeadElement[0]).toBeInTheDocument();
    expect(subHeadElement[0]).toHaveTextContent(`${T.translate(`${PREFIX}.selectActionToTake`)}`);
  });

  it('Should check if the sub head two text is as axpected', () => {
    const subHeadElement = screen.getByTestId(/set-counter-sub-head-two/i);
    expect(subHeadElement).toBeInTheDocument();
    expect(subHeadElement).toHaveTextContent(`${T.translate(`${PREFIX}.incrementCountBy`)}`);
  });

  it('Should trigger handleChange function', () => {
    const inputElement = screen.getAllByTestId(/set-counter-input/i);
    fireEvent.change(inputElement[0].firstChild, {
      target: { value: 'test' },
    });
    expect(inputElement[0]).toBeInTheDocument();
  });

  it('Should trigger handleChange function in 2nd input', () => {
    const inputElement = screen.getAllByTestId(/set-counter-input-two/i);
    expect(inputElement[0]).toBeInTheDocument();
    fireEvent.change(inputElement[0].firstChild, {
      target: { value: 'abhilash' },
    });
    expect(inputElement[0].firstChild).toHaveValue('abhilash');
  });
});
