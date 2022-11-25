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
import CopyColumn from 'components/WranglerGrid/TransformationComponents/CopyColumn/index';

describe('Test CopyColumn Component', () => {
  it('Should render CopyColumn', () => {
    render(
      <CopyColumn
        transformationName={''}
        setTransformationComponentsValue={jest.fn()}
        transformationComponentValues={{
          copyColumnName: 'body_0',
          columnNames: ['body_0', 'body_1', 'body_2'],
        }}
      />
    );

    const parentWrapper = screen.getByTestId(/copy-column-parent-wrapper/i);
    expect(parentWrapper).toBeInTheDocument();
  });
});
