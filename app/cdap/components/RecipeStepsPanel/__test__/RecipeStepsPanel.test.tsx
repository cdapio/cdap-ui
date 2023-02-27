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
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import { Route, Router } from 'react-router-dom';

import DataPrepStore from 'components/DataPrep/store';
import RecipeStepsPanel from '..';

jest.mock('js-file-download', () => jest.fn());

const onDrawerCloseIconClick = jest.fn();
const setSnackbar = jest.fn();

describe('MyComponent', () => {
  let history;

  beforeEach(() => {
    history = createMemoryHistory();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render the Routes without crashing', () => {
    render(
      <Provider store={DataPrepStore}>
        <Router history={history}>
          <Route path="/ns/default/wrangler-grid/:wid">
            <RecipeStepsPanel setSnackbar={jest.fn} onDrawerCloseIconClick={jest.fn} />
          </Route>
        </Router>
      </Provider>
    );
  });

  it('should display the correct header for the Recipe Steps Panel', () => {
    history.push('ns/default/wrangler-grid/66ce6f7d-e9be-42bd-8886-e418e188564c');
    const { getByText } = render(
      <Provider store={DataPrepStore}>
        <Router history={history}>
          <Route path="/ns/default/wrangler-grid/:wid">
            <RecipeStepsPanel
              setSnackbar={setSnackbar}
              onDrawerCloseIconClick={onDrawerCloseIconClick}
            />
          </Route>
        </Router>
      </Provider>
    );
    expect(getByText('features.WranglerNewUI.RecipeStepsPanel.drawerHeader')).toBeInTheDocument();
  });

  it('should trigger onDrawerCloseIconClick when close icon is clicked', () => {
    history.push('ns/default/wrangler-grid/66ce6f7d-e9be-42bd-8886-e418e188564c');
    const { getByTestId } = render(
      <Provider store={DataPrepStore}>
        <Router history={history}>
          <Route path="/ns/default/wrangler-grid/:wid">
            <RecipeStepsPanel
              setSnackbar={setSnackbar}
              onDrawerCloseIconClick={onDrawerCloseIconClick}
            />
          </Route>
        </Router>
      </Provider>
    );
    const closeIcon = getByTestId('inlay-drawer-widget-close-icon');
    fireEvent.click(closeIcon);
    expect(onDrawerCloseIconClick).toHaveBeenCalled();
  });

  it('should trigged setSnackbar when download action is selected', () => {
    history.push('ns/default/wrangler-grid/66ce6f7d-e9be-42bd-8886-e418e188564c');
    const { getByTestId } = render(
      <Provider store={DataPrepStore}>
        <Router history={history}>
          <Route path="/ns/default/wrangler-grid/:wid">
            <RecipeStepsPanel
              setSnackbar={setSnackbar}
              onDrawerCloseIconClick={onDrawerCloseIconClick}
            />
          </Route>
        </Router>
      </Provider>
    );
    const actionsButton = getByTestId('inlay-drawer-actions-menu');
    fireEvent.click(actionsButton);
    const menuItem = getByTestId(
      'menu-item-features.wranglernewui.recipestepspanel.downloadoption'
    );
    fireEvent.click(menuItem);
    expect(setSnackbar).toHaveBeenCalled();
  });
});
