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
import ParseLogComponent from 'components/WranglerGrid/TransformationComponents/ParseComponents/ParseLogComponent/index';

describe('It should test ParseLogComponent', () => {
  it('Should render ParseLogComponent', () => {
    render(
      <ParseLogComponent
        setTransformationComponentsValue={jest.fn()}
        transformationComponentValues={undefined}
      />
    );
    const parentElement = screen.getByTestId(/parse-component-parent/i);
    expect(parentElement).toBeInTheDocument();
  });
});
