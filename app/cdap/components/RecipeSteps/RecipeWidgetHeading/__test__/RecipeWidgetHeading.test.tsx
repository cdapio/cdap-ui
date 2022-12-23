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

import { render, screen } from '@testing-library/react';
import RecipeWidgetHeading from 'components/RecipeSteps/RecipeWidgetHeading/index';
import React from 'react';
import { Route, Router, Switch } from 'react-router';
import history from 'services/history';

describe('It should test DrawerWidgetHeading Component', () => {
  it('Should test whether DrawerWidgetHeading Component is rendered with correct heading', () => {
    render(
      <Router history={history}>
        <Switch>
          <Route>
            <RecipeWidgetHeading headingText={'test-heading'} />
          </Route>
        </Switch>
      </Router>
    );

    const headingLabelElement = screen.getByTestId(/drawer-widget-heading/i);
    expect(headingLabelElement).toBeInTheDocument();
    expect(headingLabelElement).toHaveTextContent('test-heading');
  });
});
