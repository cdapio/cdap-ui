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

import { render, screen } from '@testing-library/react';
import React from 'react';
import { Route, Router, Switch } from 'react-router';
import RecipeStepsEmptyScreen from 'components/RecipeSteps/RecipeStepsEmptyScreen/index';
import history from 'services/history';
import T from 'i18n-react';

describe('It should test the RecipeStepsEmptyScreen Component', () => {
  it('renders RecipeStepsEmptyScreen Component and check if the labels are rendered as expected', () => {
    render(
      <Router history={history}>
        <Switch>
          <Route>
            <RecipeStepsEmptyScreen />
          </Route>
        </Switch>
      </Router>
    );
    const recipeStepsEmptyScreenElement = screen.getByTestId(/recipe-steps-empty-screen-parent/i);
    expect(recipeStepsEmptyScreenElement).toBeDefined();

    const headingElement = screen.getByTestId(/start-wrangle-title/i);
    expect(headingElement).toHaveTextContent(
      `${T.translate('features.WranglerNewUI.WranglerNewRecipeSteps.startWrangleTitle')}`
    );

    const subHeadingElement = screen.getByTestId(/start-wrangle-sub-title/i);
    expect(subHeadingElement).toHaveTextContent(
      `${T.translate('features.WranglerNewUI.WranglerNewRecipeSteps.startWrangleSubTitle')}`
    );
  });
});

