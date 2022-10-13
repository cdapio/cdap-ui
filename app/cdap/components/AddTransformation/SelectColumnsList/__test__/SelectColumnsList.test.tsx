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

import { render } from "@testing-library/react";
import { createBrowserHistory as createHistory } from "history";
import React from "react";
import { Route, Router, Switch } from "react-router";
import SelectColumnsList from "..";

const history = createHistory({
  basename: "/",
});

describe("It should test the SelectColumnsList Component", () => {
  it("should render the SelectColumnsList Component with selectedColumnsCount<10", () => {
    const container = render(
      <Router history={history}>
        <Switch>
          <Route>
            <SelectColumnsList selectedColumnsCount={20} />
          </Route>
        </Switch>
      </Router>
    );
    expect(container).toBeDefined;
  });
  it("should render the SelectColumnsList Component with selectedColumnsCount<10", () => {
    const container = render(
      <Router history={history}>
        <Switch>
          <Route>
            <SelectColumnsList selectedColumnsCount={2} />
          </Route>
        </Switch>
      </Router>
    );
    expect(container).toBeDefined;
  });
  it("should render the SelectColumnsList Component with selectedColumnsCount is 0", () => {
    const container = render(
      <Router history={history}>
        <Switch>
          <Route>
            <SelectColumnsList selectedColumnsCount={0} />
          </Route>
        </Switch>
      </Router>
    );
    expect(container).toBeDefined;
  });

  it("should render the SelectColumnsList Component with selectedColumnsCount is 0 and trigger onChnage Event", () => {
    render(
      <Router history={history}>
        <Switch>
          <Route>
            <SelectColumnsList selectedColumnsCount={10} />
          </Route>
        </Switch>
      </Router>
    );

    const element: HTMLInputElement = document.getElementById(
      "transformation-checkbox-select-all-columns"
    ) as HTMLInputElement;
    expect(element.checked).toBeFalsy();

    element.click();
    expect(element.checked).toBeTruthy();

    document
      .getElementById("transformation-checkbox-select-all-columns")
      .click();

    expect(element.checked).toBeFalsy();
  });
});
