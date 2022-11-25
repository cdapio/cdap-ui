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
import NestedMenu from 'components/WranglerGrid/NestedMenu/index';

const dummyData1 = [
  {
    label: 'test',
    supportedDataType: ['test'],
    value: 'test',
    options: [
      {
        label: 'test',
        supportedDataType: ['test'],
        value: 'test',
        options: [],
      },
    ],
  },
];

const dummyData2 = [
  {
    label: 'test',
    supportedDataType: ['test'],
    value: 'test',
  },
];

describe('Testing nested menu component', () => {
  it('should test default render of nested menu', () => {
    render(
      <NestedMenu
        submitMenuOption={() => {
          jest.fn();
        }}
        columnType={'test'}
        menuOptions={dummyData1}
        title={'hello'}
        anchorElement={[]}
        setAnchorElement={() => jest.fn()}
        open={true}
        menuToggleHandler={() => jest.fn()}
      />
    );

    const parentElement = screen.getByTestId(/toolbar-icon-label-test/i);
    fireEvent.click(parentElement);
    fireEvent.click(screen.getByTestId(/nested-menu-parent-root/i));
    expect(screen.getByTestId(/nested-menu-parent-root/i)).toBeInTheDocument();
    expect(parentElement).toBeInTheDocument();
    expect(parentElement).toHaveClass('MuiTypography-root');
  });

  it('should test default render of nested menu with options as empty', () => {
    render(
      <NestedMenu
        submitMenuOption={() => {
          jest.fn();
        }}
        columnType={'test'}
        menuOptions={dummyData2}
        title={'hello'}
        anchorElement={[]}
        setAnchorElement={() => jest.fn()}
        open={false}
        menuToggleHandler={() => jest.fn()}
      />
    );

    const parentElement = screen.getByTestId(/toolbar-icon-label-test/i);
    fireEvent.click(parentElement);
    expect(parentElement).toBeInTheDocument();
  });
});
