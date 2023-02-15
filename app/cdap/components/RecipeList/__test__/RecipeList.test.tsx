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

import React from 'react';
import { render, screen } from '@testing-library/react';
import { Route, Router, Switch } from 'react-router';
import history from 'services/history';
import ViewAllRecipies from 'components/RecipeList/ViewAllRecipes';

describe('It renders Recipes list ', () => {
  test('renders RecipeList component', () => {
    const container = render(
      <Router history={history}>
        <Switch>
          <Route>
            <ViewAllRecipies></ViewAllRecipies>
          </Route>
        </Switch>
      </Router>
    );
    const ele = screen.getByTestId(/recipe-table-container/i);
    expect(ele).toBeInTheDocument();
  });
});
