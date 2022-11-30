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
import { fireEvent, render, screen } from '@testing-library/react';
import ZoomList from 'components/FooterPanel/ZoomList/index';

describe('Testing ZoomList Component', () => {
  it('Should render ZoomList', () => {
    render(<ZoomList open={true} setZoomPercent={jest.fn()} anchorEl={null} />);

    const menuElement = screen.getByTestId(/zoom-list-menu-item-0/i);
    expect(menuElement).toBeInTheDocument();
    fireEvent.click(menuElement);
    expect(menuElement).toHaveTextContent('50%');
  });
});
