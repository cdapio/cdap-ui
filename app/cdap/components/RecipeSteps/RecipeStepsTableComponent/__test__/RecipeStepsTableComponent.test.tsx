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
import { Route, Router, Switch } from 'react-router';
import RecipeStepsTableComponent from 'components/RecipeSteps/RecipeStepsTableComponent/index';
import { mockRecipe } from 'components/RecipeSteps/RecipeStepsTableComponent/mock/mock';
import history from 'services/history';

describe('It should test the Recipe Component', () => {
  it('renders Recipe Component and triggers button and following functionality', () => {
    render(
      <Router history={history}>
        <Switch>
          <Route>
            <RecipeStepsTableComponent recipeSteps={mockRecipe} onDeleteRecipeSteps={undefined} />
          </Route>
        </Switch>
      </Router>
    );
    const recipeStepsSpan = screen.getByTestId(/recipe-steps-span0/i);
    expect(recipeStepsSpan).toContainHTML('a-column');
  });

  it('renders Recipe Component and triggers button and following functionality', () => {
    render(
      <Router history={history}>
        <Switch>
          <Route>
            <RecipeStepsTableComponent recipeSteps={mockRecipe} onDeleteRecipeSteps={jest.fn()} />
          </Route>
        </Switch>
      </Router>
    );
    const deleteElement = screen.getAllByTestId(/recipe-step-0-delete/i);
    fireEvent.click(deleteElement[0]);
    expect(deleteElement[0]).toBeInTheDocument();
    const recipeStepsSpan = screen.getByTestId(/recipe-steps-span0/i);
    expect(recipeStepsSpan).toContainHTML('a-column');
  });
});

