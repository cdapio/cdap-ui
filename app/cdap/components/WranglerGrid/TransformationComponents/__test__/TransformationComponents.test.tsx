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
import TransformationContent from 'components/WranglerGrid/TransformationComponents';
import { render, screen } from '@testing-library/react';
import { TRANSFORMATION_COMPONENTS } from 'components/WranglerGrid/TransformationComponents/constants';

describe('Test TransformationComponents', () => {
  it('Should render TransformationComponent', () => {
    const container = render(
      <TransformationContent
        setTransformationComponentsValue={jest.fn()}
        transformationComponent={TRANSFORMATION_COMPONENTS}
        transformationComponentValues={{ customInput: 'abc' }}
        transformationName={'customTransform'}
        transformationDataType={[]}
        columnsList={[]}
        missingItemsList={{}}
        onCancel={jest.fn()}
        applyTransformation={jest.fn()}
      />
    );
  });
});
