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

<<<<<<< Updated upstream
import { fireEvent, render ,screen} from "@testing-library/react";
import { createBrowserHistory as createHistory } from "history";
import React from "react";
import { Route, Router, Switch } from "react-router";
import AddTransformation from "..";
=======
import { fireEvent, render, screen } from '@testing-library/react';
import { createBrowserHistory as createHistory } from 'history';
import React from 'react';
import { Route, Router, Switch } from 'react-router';
import AddTransformation from '..';
>>>>>>> Stashed changes

const history = createHistory({
  basename: "/",
});

<<<<<<< Updated upstream
describe("It should test the SelectColumnsList Component", () => {
  it("should render the SelectColumnsList Component and triggers the button and following event", () => {
=======
describe('It should test the AddTransformation Component', () => {
  it('renders AddTransformation Component', () => {
>>>>>>> Stashed changes
    const container = render(
      <Router history={history}>
        <Switch>
          <Route>
            <AddTransformation />
          </Route>
        </Switch>
      </Router>
    );
<<<<<<< Updated upstream
    expect(container).toBeDefined;
    const ele = screen.getByTestId(/add-transformation-button/i);
=======
    
    expect(container).toBeDefined;
    const ele = container.getByTestId(/add-transformation-button/i);
>>>>>>> Stashed changes
    fireEvent.click(ele);
    const ele1 = screen.getByTestId(/select-column-widget-button/i);
    fireEvent.click(ele1);
  });

  

});
