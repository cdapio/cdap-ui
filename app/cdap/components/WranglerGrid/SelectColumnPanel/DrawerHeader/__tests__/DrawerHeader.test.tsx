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

import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import T from 'i18n-react';
import DrawerHeader from 'components/WranglerGrid/SelectColumnPanel/DrawerHeader';

describe('It should test DrawerHeader Component', () => {
  it('Should test single selection column heading component', () => {
    render(<DrawerHeader closeClickHandler={jest.fn()} isSingleSelection={true} />);
    const headingElement = screen.getByTestId(/drawer-heading/i);
    expect(headingElement).toHaveTextContent(
      `${T.translate('features.WranglerNewUI.GridPage.addTransformationPanel.selectColumnHeading')}`
    );
  });

  it('Should test multiple selection column heading component', () => {
    render(<DrawerHeader closeClickHandler={jest.fn()} isSingleSelection={false} />);
    const headingElement = screen.getByTestId(/drawer-heading/i);
    expect(headingElement).toHaveTextContent(
      `${T.translate(
        'features.WranglerNewUI.GridPage.addTransformationPanel.selectMultiColumnsHeading'
      )}`
    );
  });

  it('Should trigger close button of panel', () => {
    render(<DrawerHeader closeClickHandler={jest.fn()} isSingleSelection={false} />);
    const closeButton = screen.getByTestId(/select-column-drawer-close-icon-button/i);
    fireEvent.click(closeButton);
    expect(closeButton).toBeInTheDocument();
  });

  it('Should trigger back button of panel', () => {
    render(<DrawerHeader closeClickHandler={jest.fn()} isSingleSelection={false} />);
    const backButton = screen.getByTestId(/back-icon-button/i);
    fireEvent.click(backButton);
    expect(backButton).toBeInTheDocument();
  });
});
