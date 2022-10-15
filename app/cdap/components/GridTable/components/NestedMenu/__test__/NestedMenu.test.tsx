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
import React from 'react';
import NestedMenu from '..';
import { StructureIcon } from '../../AaToolbar/images';

describe('It should test NestedMenu Component', () => {
  it('should render the component', () => {
    const container = render(<NestedMenu icon={StructureIcon} submitMenuOption={jest.fn()} />);
    expect(container).toBeDefined();
    const IconButton = document.getElementById('nested-menu-icon-button');
    fireEvent.click(IconButton);
  });
  it('It Should trigger handleMenuClick Function', () => {
    const container = render(<NestedMenu icon={StructureIcon} submitMenuOption={jest.fn()} />);
    const menuItemComponentElement = container.getByTestId('menu-item-component-3');
    fireEvent.click(menuItemComponentElement);
  });
  it('It Should trigger onClick Function', () => {
    const container = render(<NestedMenu icon={StructureIcon} submitMenuOption={jest.fn()} />);
    const menuItemComponentElement = container.getByTestId('menu-item-component-3');
    const menuElement = document.getElementById('parent-menu');
    fireEvent.click(menuElement);
    fireEvent.click(menuItemComponentElement);
  });
});
