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
import DrawerWidget from 'components/DrawerWidget/index';
import history from 'services/history';

describe('It should test DrawerWidget Component', () => {
  it('Should test whether DrawerWidget Component is rendered', () => {
    const setDrawerStatus = jest.fn();
    const closeClickHandler = () => {
      setDrawerStatus(false);
    };
    const container = render(
      <Router history={history}>
        <Switch>
          <Route>
            <DrawerWidget
              openDrawer={jest.fn}
              showDivider={true}
              closeClickHandler={closeClickHandler}
            />
          </Route>
        </Switch>
      </Router>
    );
    expect(container).toBeDefined();
  });
});
