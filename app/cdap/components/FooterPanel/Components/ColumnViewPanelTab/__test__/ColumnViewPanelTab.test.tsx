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
import ColumnViewPanelTab from 'components/FooterPanel/Components/ColumnViewPanelTab/index';
import React from 'react';

describe('Testing render ColumnViewPanelTab component', () => {
  it('Should render component with all the parent elements and child elements', () => {
    render(<ColumnViewPanelTab />);

    const parentComponent = screen.getByTestId(/footer-panel-column-view-panel-tab-wrapper/i);

    // Checking if the parent element exists on the screen
    expect(parentComponent).toBeInTheDocument();

    const tabWrapperElement = screen.getAllByTestId(/footer-panel-column-view-panel-tab/i);
    const iconElement = screen.getByTestId(/column-icon/i);

    // Checking if the parentComponent has tabWrapperElement as it's child
    expect(parentComponent).toContainElement(tabWrapperElement[0]);

    // Checking if the iconElement is present inside the tab wrapper element
    expect(tabWrapperElement[0]).toContainElement(iconElement);
  });
});
