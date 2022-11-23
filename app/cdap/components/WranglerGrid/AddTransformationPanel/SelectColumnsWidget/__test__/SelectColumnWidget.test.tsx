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

import { fireEvent, render } from '@testing-library/react';
import { mockSelectedColumns } from 'components/WranglerGrid/AddTransformationPanel/mock/mockDataForAddTransformation';
import React from 'react';
import SelectColumnsWidget from 'components/WranglerGrid/AddTransformationPanel/SelectColumnsWidget';

describe('It should test SelectColumnsWidget Component', () => {
  it('Should render the SelectColumnsWidget Component', () => {
    const container = render(
      <SelectColumnsWidget
        selectedColumns={mockSelectedColumns}
        transformationName={'uppercase'}
        handleSelectColumn={jest.fn()}
      />
    );
    expect(container).toBeDefined();
  });

  it('Should render the SelectColumnsWidget Component', () => {
    const container = render(
      <SelectColumnsWidget
        selectedColumns={[]}
        transformationName={'uppercase'}
        handleSelectColumn={jest.fn()}
      />
    );
    const singleColumnSelectBtn = container.getByTestId('select-column-button');
    fireEvent.click(singleColumnSelectBtn);
  });
});
