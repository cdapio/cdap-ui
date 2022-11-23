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
import Filter from 'components/WranglerGrid/TransformationComponents/Filter/index';
import T from 'i18n-react';

describe('Testing Filter Component', () => {
  it('Should render Filter component', () => {
    render(
      <Filter
        setTransformationComponentsValue={jest.fn()}
        transformationComponentValues={undefined}
      />
    );

    const parentElement = screen.getByTestId(/filter-parent-wrapper/i);
    expect(parentElement).toBeInTheDocument();
    const labelElement = screen.getByTestId(/subheader-select-action/i);
    expect(labelElement).toBeInTheDocument();
    expect(labelElement).toHaveTextContent(
      `${T.translate('features.WranglerNewUI.GridPage.transformationUI.filter.selectAction')}`
    );
  });
});
