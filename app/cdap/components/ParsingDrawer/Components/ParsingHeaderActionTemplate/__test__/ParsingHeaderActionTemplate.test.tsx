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

import { render } from '@testing-library/react';
import { createBrowserHistory as createHistory } from 'history';
import React from 'react';
import { Route, Router, Switch } from 'react-router';
import ParsingHeaderActionTemplate from 'components/ParsingDrawer/Components/ParsingHeaderActionTemplate';

const history = createHistory({
  basename: '/',
});

describe('It Should Test the ParsingHeaderActionTemplate Component', () => {
  it('Should test whether ParsingHeaderActionTemplate Component is rendered or not', () => {
    const container = render(
      <Router history={history}>
        <Switch>
          <Route>
            <ParsingHeaderActionTemplate />
          </Route>
        </Switch>
      </Router>
    );
    expect(container).toBeDefined();
  });
});
