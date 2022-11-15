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

import { fireEvent, render } from "@testing-library/react";
import * as ApiHelpers from "components/Connections/Browser/GenericBrowser/apiHelpers";
import React from "react";
import { Route, Router, Switch } from "react-router";
import ParsingDrawer from "components/ParsingDrawer/index";
import history from "services/history";

describe("It Should Test the Parsing Drawer Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("Should render the Parsing Drawer Parent Component", () => {
    jest.spyOn(ApiHelpers, "createWorkspace").mockReturnValue(
      Promise.resolve({
        entity: {
          name: "sql_feature",
          path: "/information_schema/sql_features",
          type: "system table",
          canSample: true,
          canBrowse: false,
          properties: {},
        },
        connection: "exl",
        properties: {},
      })
    );
    const container = render(
      <Router history={history}>
        <Switch>
          <Route>
            <ParsingDrawer
              setLoading={() => jest.fn()}
              updateDataTranformation={() => jest.fn()}
              closeParsingDrawer={jest.fn()}
            />
          </Route>
        </Switch>
      </Router>
    );

    expect(container).toBeDefined();
  });

  it("Should test the handleApply Button ", () => {
    const screen = render(
      <Router history={history}>
        <Switch>
          <Route>
            <ParsingDrawer
              setLoading={() => jest.fn()}
              updateDataTranformation={() => jest.fn()}
              closeParsingDrawer={jest.fn()}
            />
          </Route>
        </Switch>
      </Router>
    );
    const handleApplyBtn = screen.getByTestId("parsing-apply-button");
    fireEvent.click(handleApplyBtn);
    expect(handleApplyBtn).toBeInTheDocument();
  });
});
