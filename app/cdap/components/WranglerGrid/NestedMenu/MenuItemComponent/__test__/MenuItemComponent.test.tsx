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
import MenuComponent from 'components/WranglerGrid/NestedMenu/MenuItemComponent/index';
import T from 'i18n-react';

describe('Testing Menu Item Component', () => {
  it('Should render default component', () => {
    const dummyItem = {
      label: 'test',
      supportedDataType: ['all'],
      value: 'string',
      options: [],
    };
    render(
      <MenuComponent item={dummyItem} index={0} onMenuClick={() => jest.fn()} columnType={'test'} />
    );
    const parentElement = screen.getByTestId(/toolbar-icon-button-string/i);
    fireEvent.click(parentElement);
    expect(parentElement).toBeInTheDocument();
    expect(parentElement).toHaveClass(
      'MuiButtonBase-root MuiListItem-root MuiMenuItem-root MuiMenuItem-gutters MuiListItem-gutters MuiListItem-button'
    );
  });

  it('Should render default component in columntype null case', () => {
    const dummyItem = {
      label: 'test',
      supportedDataType: [],
      value: 'string',
      options: [],
    };
    render(
      <MenuComponent item={dummyItem} index={0} onMenuClick={() => jest.fn()} columnType={''} />
    );
    const parentElement = screen.getByTestId(/toolbar-icon-button-string/i);
    fireEvent.click(parentElement);
    expect(parentElement).toBeInTheDocument();
  });
  it('Should render the item list divider element', () => {
    const dummyItem = {
      label: 'test',
      supportedDataType: ['all'],
      value: T.translate('features.WranglerNewUI.GridPage.menuItems.divider'),
      options: ['all'],
    };
    render(
      <MenuComponent
        item={dummyItem as any}
        index={0}
        onMenuClick={() => jest.fn()}
        columnType={'test'}
      />
    );
    const dividerElement = screen.getByTestId(/menu-item-divider/i);
    expect(dividerElement).toBeInTheDocument();
  });
});

it('should render the heading element', () => {
  const dummyItem = {
    label: 'test',
    supportedDataType: [],
    value: T.translate('features.WranglerNewUI.GridPage.menuItems.heading'),
    options: ['all'],
  };
  render(
    <MenuComponent
      item={dummyItem as any}
      index={0}
      onMenuClick={() => jest.fn()}
      columnType={null}
    />
  );

  const headingElement = screen.getByTestId(/menu-item-heading/i);
  expect(headingElement).toHaveTextContent('test');
});
