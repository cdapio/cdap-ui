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

import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import OpenWorkspacesList from "components/OpenWorkspacesList/index";
import { Route, Router, Switch } from "react-router";
import history from "services/history";
import MyDataPrepApi from "api/dataprep";
import {mockRes} from 'components/OpenWorkspacesList/mock/mock'

describe("It should test OpenWorkspacesList Component", () => {

  beforeEach(() => {
    jest.spyOn(MyDataPrepApi, "getWorkspaceList").mockImplementation(() => {
        return {
          subscribe: (callback) => {
            callback(mockRes);
          },
        };
      });
      render(
        <Router history={history}>
          <Switch>
            <Route>
              <OpenWorkspacesList />
            </Route>
          </Switch>
        </Router>
      );
  })

  it("Should click worspaceList button and trigger expected event then trigger workspace-list-item click event", () => {

    const buttonElement = screen.getByTestId(/open-workspaces-list-label/i);
    fireEvent.click(buttonElement);
    expect(buttonElement).toBeInTheDocument();
    const listItemComponent = screen.getByTestId(/open-workspace-list-item-0/i)
    fireEvent.click(listItemComponent)
    expect(listItemComponent).toBeInTheDocument()
    expect(MyDataPrepApi.getWorkspaceList).toBeCalledTimes(1)
  });

  it("should trigger handleCloseAway function with click event", () => {
    const closeAwayElement = screen.getAllByTestId(/open-workspaces-list/i);
    fireEvent.click(closeAwayElement[0].firstChild);
    expect(closeAwayElement[0]).toBeInTheDocument()
    expect(MyDataPrepApi.getWorkspaceList).toBeCalledTimes(2)
  });

});
