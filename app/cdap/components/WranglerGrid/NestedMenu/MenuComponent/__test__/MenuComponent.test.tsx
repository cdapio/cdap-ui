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
import MenuComponent from 'components/WranglerGrid/NestedMenu/MenuComponent/index';

const dummyData = [{ label: 'test', supportedDataType: ['test'], value: 'test', options: [] }];

describe('Testing render FunctionNameToggle component', () => {
  const PREFIX = 'features.WranglerNewUI.GridPage';

  it('Should render component with all the parent elements and child elements', () => {
    render(
      <MenuComponent
        anchorElement={undefined}
        menuOptions={dummyData}
        setAnchorElement={() => {
          jest.fn();
        }}
        submitOption={() => jest.fn()}
        columnType={''}
        setMenuComponentOptions={() => jest.fn()}
      />
    );

    const menuComponentParent = screen.getByTestId(/menu-component-parent/i);
    expect(menuComponentParent).toBeInTheDocument();

    const test = screen.getByTestId(/menu-item-test/i);
    fireEvent.click(test);
    expect(test).toBeInTheDocument();
  });
});
