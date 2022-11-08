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
import ConnectionList from 'components/ConnectionList';
import {
  connectionListDummyResFile,
  connectionListDummyResPostGresSql,
  mockDataForExploreConnection,
  mockResponseForFetchConnectors,
} from 'components/ConnectionList/mock/mockDataForConnectionList';
import * as apiHelpersForExploreConnection from 'components/Connections/Browser/GenericBrowser/apiHelpers';
import * as apiHelpers from 'components/Connections/Browser/SidePanel/apiHelpers';
import * as reducer from 'components/Connections/Create/reducer';
import React from 'react';
import { Route, Router, Switch } from 'react-router';
import history from 'services/history';

describe('It Should test Connection List Component', () => {
  it('Should render Connection List Component', () => {
    const dummyRes = new Map();
    dummyRes.set('PostgreSql', connectionListDummyResPostGresSql);
    dummyRes.set('File', connectionListDummyResFile);
    jest.spyOn(apiHelpers, 'getCategorizedConnections').mockReturnValue(Promise.resolve(dummyRes));

    jest
      .spyOn(reducer, 'fetchConnectors')
      .mockReturnValue(Promise.resolve(mockResponseForFetchConnectors));

    jest.spyOn(apiHelpersForExploreConnection, 'exploreConnection').mockImplementation(() => {
      return Promise.resolve(mockDataForExploreConnection);
    });

    const container = render(
      <Router history={history}>
        <Switch>
          <Route>
            <ConnectionList />
          </Route>
        </Switch>
      </Router>
    );
    expect(container).toBeDefined();
  });

  it('Should render Connection List Component', () => {
    render(
      <Router history={history}>
        <Switch>
          <Route>
            <ConnectionList />
          </Route>
        </Switch>
      </Router>
    );

    const ele = screen.getByTestId(/data-sets-parent/i);
    expect(ele).toBeInTheDocument();
  });
});
