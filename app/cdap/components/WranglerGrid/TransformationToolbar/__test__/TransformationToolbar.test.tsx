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
import TransformationToolbar from 'components/WranglerGrid/TransformationToolbar/index';

describe('Testing render TransformationToolbar component', () => {
  beforeEach(() => {
    render(
      <TransformationToolbar
        columnType={''}
        submitMenuOption={() => {
          jest.fn();
        }}
        setShowBreadCrumb={() => {
          jest.fn();
        }}
        showBreadCrumb={false}
        disableToolbarIcon={false}
      />
    );
  });
  it('Should render component and check if child is rendered as expected', () => {
    const transformToolbarParent = screen.getByTestId('transformations-toolbar-container');
    expect(transformToolbarParent).toBeInTheDocument();

    const nestedMenuContainer = screen.getByTestId(/nested-menu-container/i);
    expect(transformToolbarParent).toContainElement(nestedMenuContainer);
  });

  it('should check if component exists and trigger the event', () => {
    const iconButtonElement = screen.getAllByTestId(/toolbar-icon-button/i);
    fireEvent.click(iconButtonElement[0]);
    expect(iconButtonElement[0]).toBeInTheDocument();
  });

  it('Should check if headerToggler component exists and triggers the click event', () => {
    const headerToggler = screen.getByTestId(/toolbar-header-toggler/i);
    fireEvent.click(headerToggler);
    expect(headerToggler).toBeInTheDocument();
  });
});
