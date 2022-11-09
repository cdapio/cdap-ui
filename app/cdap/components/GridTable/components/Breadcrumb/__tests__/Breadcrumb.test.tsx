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

import { render, screen } from '@testing-library/react';
import React from 'react';
import { Route, Router, Switch } from 'react-router';
import Breadcrumb from 'components/GridTable/components/Breadcrumb/index';
import history from 'services/history';

const location = {
  state: {
    from: 'features.WranglerNewUI.Breadcrumb.params.wrangleHome',
    path: 'wrangle-home',
  },
};

describe('Test Breadcrumb Component', () => {
  render(
    <Router history={history}>
      <Switch>
        <Route>
          <Breadcrumb breadcrumbsList={[{ label: 'display name', link: 'path to redirect' }]} />
        </Route>
      </Switch>
    </Router>
  );

  it('Should have the Home text in the Breadcrumb', () => {
    expect(screen.getByTestId('breadcrumb-home-display name')).toHaveTextContent('display name');
  });
});
