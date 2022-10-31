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
import OngoingDataExploration from 'components/WrangleHome/Components/OngoingDataExploration/index';
import MyDataPrepApi from 'api/dataprep';
import operators from 'rxjs/operators';
import { Route, Router, Switch } from 'react-router';
import history from 'services/history';
import {
  getWorkspaceListSubscribeMock,
  switchMapCallbackMock,
} from 'components/WrangleHome/Components/OngoingDataExploration/mock/mockoldData';

describe('It should test OngoingDataExploration Component', () => {
  test('renders Ongoing Data Exploration component', async () => {
    jest.spyOn(operators as any, 'switchMap').mockImplementation((callback: Function) => {
      callback(switchMapCallbackMock);
    });
    jest.spyOn(MyDataPrepApi, 'getWorkspaceList').mockImplementation(() => {
      return {
        pipe: () => {
          return {
            subscribe: (callback) => {
              callback(getWorkspaceListSubscribeMock);
            },
          };
        },
      };
    });
    render(
      <Router history={history}>
        <Switch>
          <Route>
            <OngoingDataExploration />
          </Route>
        </Switch>
      </Router>
    );
    const ele = screen.getByTestId(/ongoing-data-explore-parent/i);
    expect(ele).toBeInTheDocument();
  });
});
