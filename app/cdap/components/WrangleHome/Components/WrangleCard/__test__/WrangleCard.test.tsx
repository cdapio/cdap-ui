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
import * as reducers from 'components/Connections/Create/reducer';
import { createBrowserHistory as createHistory } from 'history';
import React from 'react';
import { Route, Router, Switch } from 'react-router';
import WrangleCard from '../index';
import { wrangleCardFetchConnectors } from '../mock/wrangleCardMockData';

const history = createHistory({
  basename: '/',
});

describe('Testing the Wrangle Card Component', () => {
  test('Should check whether WrangleCard Component is rendered or not', () => {
    const container = render(
      <Router history={history}>
        <Switch>
          <Route>
            <WrangleCard />
          </Route>
        </Switch>
      </Router>
    );
    expect(container).toBeDefined();
  });

  test('It renders Wrangler-Card ', async () => {
    jest
      .spyOn(reducers, 'fetchConnectors')
      .mockReturnValue(Promise.resolve(wrangleCardFetchConnectors));

    render(
      <Router history={history}>
        <Switch>
          <Route>
            <WrangleCard />
          </Route>
        </Switch>
      </Router>
    );

    const ele = screen.getByTestId(/wrangle-card-parent/i);
    expect(ele).toBeInTheDocument();
  });
});
