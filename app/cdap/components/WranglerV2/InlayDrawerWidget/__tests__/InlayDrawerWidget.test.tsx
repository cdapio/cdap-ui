/*
 * Copyright © 2023 Cask Data, Inc.
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

import React from 'react';
import { cleanup, fireEvent, render } from '@testing-library/react';
import InlayDrawerWidget, { IMenuItem } from 'components/WranglerV2/InlayDrawerWidget';

const handleDrawerCloseIconClick = jest.fn();
const onSaveButtonClick = jest.fn();
const onApplyButtonClick = jest.fn();
const onDownloadButtonClick = jest.fn();

const actionsOptions: IMenuItem[] = [
  {
    label: 'Save',
    value: 'save',
    clickHandler: onSaveButtonClick,
  },
  {
    label: 'Apply',
    value: 'apply',
    clickHandler: onApplyButtonClick,
  },
  {
    label: 'Download',
    value: 'download',
    clickHandler: onDownloadButtonClick,
  },
];

let container;

beforeEach(() => {
  container = render(
    <InlayDrawerWidget
      actionsOptions={actionsOptions}
      headingText={'Inlay Drawer'}
      onClose={handleDrawerCloseIconClick}
      position={'left'}
      showDivider={true}
    >
      <div>Child Component</div>
    </InlayDrawerWidget>
  );
});

describe('Test the Inlay Drawer Widget Component', () => {
  test('Should trigger the onSaveButtonClick function', () => {
    const menuButton = container.getByRole('button', { name: /actions/i });
    fireEvent.click(menuButton);

    const saveButton = container.getByRole('menuitem', { name: /save/i });
    fireEvent.click(saveButton);

    expect(onSaveButtonClick).toHaveBeenCalled();
  });

  test('Should trigger the onApplyButtonClick function', () => {
    const menuButton = container.getByRole('button', { name: /actions/i });
    fireEvent.click(menuButton);

    const applyButton = container.getByRole('menuitem', { name: /apply/i });
    fireEvent.click(applyButton);

    expect(onApplyButtonClick).toHaveBeenCalled();
  });

  test('Should trigger the onDownloadButtonClick function', () => {
    const menuButton = container.getByRole('button', { name: /actions/i });
    fireEvent.click(menuButton);

    const downloadButton = container.getByRole('menuitem', { name: /download/i });
    fireEvent.click(downloadButton);

    expect(onDownloadButtonClick).toHaveBeenCalled();
  });
});

afterEach(() => {
  cleanup();
});
