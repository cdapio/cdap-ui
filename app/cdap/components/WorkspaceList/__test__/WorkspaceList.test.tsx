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

import { render } from '@testing-library/react';
import { createBrowserHistory as createHistory } from 'history';
import React from 'react';
import { Route, Router, Switch } from 'react-router';
import WorkspaceList from '..';

const history = createHistory({
  basename: '/',
});

describe('Test the Workspace List Component', () => {
  it('Should render the Workspace List Component', () => {
    const screen = render(
      <Router history={history}>
        <Switch>
          <Route>
            <WorkspaceList />
          </Route>
        </Switch>
      </Router>
    );
    expect(render).toBeDefined();
    const ele = screen.getByTestId(/workspace-list-parent/i);
    expect(ele).toBeInTheDocument();
  });

  it('Should should have Workspaces Label in Breadcrumb', () => {
    const screen = render(
      <Router history={history}>
        <Switch>
          <Route>
            <WorkspaceList />
          </Route>
        </Switch>
      </Router>
    );
    expect(render).toBeDefined();
    const element = screen.getByTestId(/breadcrumb-label-workspaces/i);
    console.log(element);
    expect(element).toHaveTextContent('Workspaces');
  });
});
