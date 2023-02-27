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

import { fireEvent, render } from '@testing-library/react';
import { Provider } from 'react-redux';

import DataPrepStore from 'components/DataPrep/store';
import RecipeStepsPanel from 'components/RecipeStepsPanel';

const onDrawerCloseIconClick = jest.fn();
const setSnackbar = jest.fn();

describe('Test Recipe Steps Panel Component', () => {
  it('should test whether drawerCloseIcon is working as expected', () => {
    const { getByTestId } = render(
      <Provider store={DataPrepStore}>
        <RecipeStepsPanel
          onDrawerCloseIconClick={onDrawerCloseIconClick}
          setSnackbar={setSnackbar}
        />
      </Provider>
    );

    const drawerCloseIcon = getByTestId('inlay-drawer-widget-close-icon');

    fireEvent.click(drawerCloseIcon);
    expect(onDrawerCloseIconClick).toHaveBeenCalled();
  });
});
