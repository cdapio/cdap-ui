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

import { render, screen } from "@testing-library/react";
import React from "react";
import { Route, Router, Switch } from "react-router";
import WrangleCard from "components/WrangleHome/Components/WrangleCard/index";
import { updatedCardsMockResponse } from "components/WrangleHome/Components/WrangleCard/mock/wrangleCardMockData";
import history from "services/history";
import * as getUpdatedHelper from "components/WrangleHome/services/getUpdatedConnectorCards";

describe("Testing the Wrangle Card Component", () => {
  test("It renders Wrangler-Card with getUpdatedConnectorCards mock", async () => {

    jest
      .spyOn(getUpdatedHelper, "getUpdatedConnectorCards")
      .mockReturnValue(Promise.resolve(updatedCardsMockResponse as any));

    render(
      <Router history={history}>
        <Switch>
          <Route>
            <WrangleCard toggleViewAllLink={jest.fn()} />
          </Route>
        </Switch>
      </Router>
    );
    expect(getUpdatedHelper.getUpdatedConnectorCards).toBeCalledTimes(1)
    const ele = screen.getByTestId(/wrangle-card-parent/i);
    expect(ele).toBeInTheDocument();
  });
});
