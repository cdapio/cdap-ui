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

import React from 'react';
import { render, screen } from '@testing-library/react';
import WrangleCard from 'components/WrangleHome/Components/WrangleCard/index';
import { Route, Router, Switch } from 'react-router';
import history from 'services/history';

test('It renders Wrangler-Card ', async () => {
  describe('It should test WrangleCard Component', () => {
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
