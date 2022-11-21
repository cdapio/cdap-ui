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

import { fireEvent, render } from '@testing-library/react';
import DrawerWidget from 'components/common/DrawerWidget';
import React from 'react';
import { Route, Router, Switch } from 'react-router';
import history from 'services/history';

describe('Test DrawerWidget Component', () => {

  it('Should render the DrawerWidget Component', () => {

    const container = render(
      <Router history={history}>
        <Switch>
          <Route>
            <DrawerWidget
              open dataTestId={'test-drawer-widget'}            />
          </Route>
        </Switch>
      </Router>
    );

    expect(container).toBeDefined();

    const drawerWidgetElement = container.getByTestId("test-drawer-widget");
    expect(drawerWidgetElement).toBeInTheDocument();

  });

  it('Should render the DrawerWidget Component with Back Icon and Divider', () => {

    const closeClickHandler = jest.fn();

    const container = render(
      <Router history={history}>
        <Switch>
          <Route>
            <DrawerWidget
              anchor='bottom'
              closeClickHandler={closeClickHandler}
              headingText="Drawer Header"
              showBackIcon
              showDivider
              open={true} dataTestId={'test-drawer-widget'}            />
          </Route>
        </Switch>
      </Router>
    );

    expect(container).toBeDefined();

    const drawerWidget = container.getByTestId("test-drawer-widget");
    expect(drawerWidget).toBeInTheDocument();

    const backIcon = container.getByTestId("back-icon");
    expect(backIcon).toBeInTheDocument();

    const divider = container.getByTestId("divider");
    expect(divider).toBeInTheDocument();

    const closeIcon = container.getByTestId("close-icon");
    expect(closeIcon).toBeInTheDocument();

    fireEvent.click(closeIcon);
    expect(closeClickHandler).toBeCalled();

    const underlineIcon = container.getByTestId("underline-icon");
    expect(underlineIcon).toBeInTheDocument();

  });

});
