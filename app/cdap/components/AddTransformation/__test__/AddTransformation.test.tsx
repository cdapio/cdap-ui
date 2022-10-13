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

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import DrawerWidget from 'components/DrawerWidget';
import { createBrowserHistory as createHistory } from 'history';
import React from 'react';
import { Route, Router, Switch } from 'react-router';
import AddTransformation from '..';

const history = createHistory({
  basename: '/',
});

describe('It should test the Recipe Component', () => {
  it('renders Recipe Component', () => {
    const container = render(
      <Router history={history}>
        <Switch>
          <Route>
            <AddTransformation />
          </Route>
        </Switch>
      </Router>
    );
    const defaultProps = {
      headingText: 'features.WranglerNewAddTransformation.addTransformation',
      openDrawer: true,
    };
    const drawerWidget = render(
      <DrawerWidget {...defaultProps} closeClickHandler={jest.fn()} showBackIcon={true} />
    );
    const childAbc = drawerWidget.findAllByAltText('Back icon 1');
    fireEvent.click(childAbc as any);
  });
});
