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
import DrawerWidget from 'components/DrawerWidget';
import { createBrowserHistory as createHistory } from 'history';
import React from 'react';
import { Route, Router, Switch } from 'react-router';
import RecipeStepsTableComponent from '..';
import { mockRecipe } from '../mock/mock';

const history = createHistory({
  basename: '/',
});

describe('It should test the Recipe Component', () => {
  it('renders Recipe Component and triggers button and following functionality', () => {
   const container = render(
      <Router history={history}>
        <Switch>
          <Route>
            <RecipeStepsTableComponent recipeSteps={mockRecipe} />
          </Route>
        </Switch>
      </Router>
    );
    expect(container).toBeDefined;
    const ele = screen.getByTestId(/recipe-steps-table-component-image-click0/i);
    fireEvent.click(ele);
    const ele2 = screen.getByTestId(/recipe-steps-span0/i);
    expect(ele2).toContainHTML('a-column');
    
  });
});
