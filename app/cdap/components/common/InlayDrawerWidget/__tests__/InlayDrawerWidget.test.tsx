/*
 * Copyright © 2018 Cask Data, Inc.
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

import { cleanup, fireEvent, render } from '@testing-library/react';
import InlayDrawerWidget from 'components/common/InlayDrawerWidget';
import { IActionsOptions } from 'components/common/InlayDrawerWidget/Menu';
import React from 'react';

const handleDrawerCloseIconClick = jest.fn();
const onSaveButtonClick = jest.fn();
const onApplyButtonClick = jest.fn();
const onDownloadClick = jest.fn();

const actionsOptions: IActionsOptions[] = [
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
    clickHandler: onDownloadClick,
  },
];

let container;

beforeEach(() => {
  container = render(
    <InlayDrawerWidget
      headingText={'Inlay Drawer'}
      onClose={handleDrawerCloseIconClick}
      showDivider={true}
      position={'left'}
      actionsOptions={actionsOptions}
    >
      <div>Child Component</div>
    </InlayDrawerWidget>
  );
});

describe('Test Inlay Drawer Component', () => {
  test('Should trigger onSaveButtonClick function', () => {
    const menuButton = container.getByRole('button', { name: /actions/i });
    fireEvent.click(menuButton);

    const saveButton = container.getByRole('menuitem', { name: /save/i });
    fireEvent.click(saveButton);

    expect(onSaveButtonClick).toHaveBeenCalled();
  });

  test('Should trigger onApplyButtonClick function', () => {
    const menuButton = container.getByRole('button', { name: /actions/i });
    fireEvent.click(menuButton);

    const applyButton = container.getByRole('menuitem', { name: /apply/i });
    fireEvent.click(applyButton);

    expect(onApplyButtonClick).toHaveBeenCalled();
  });

  test('Should trigger onDownloadClick function', () => {
    const menuButton = container.getByRole('button', { name: /actions/i });
    fireEvent.click(menuButton);

    const downloadButton = container.getByRole('menuitem', { name: /download/i });
    fireEvent.click(downloadButton);

    expect(onDownloadClick).toHaveBeenCalled();
  });
});

afterEach(() => {
  cleanup();
});
