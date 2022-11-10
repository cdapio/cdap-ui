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

import React from 'react';
import GridTable from 'components/GridTable/index';
import { render } from '@testing-library/react';
import { Route, Router, Switch } from 'react-router';
import { createBrowserHistory as createHistory } from 'history';
import MyDataPrepApi from 'api/dataprep';
import rxjs from 'rxjs/operators';
import { mockForFlatMap, mockForGetWorkspace } from '../mock/mockDataForGrid';
import history from 'services/history';

describe('Testing Grid Table Component', () => {
  jest.spyOn(rxjs, 'flatMap' as any).mockImplementation((callback: any) => {
    callback(mockForFlatMap);
  });
  it('Should mock API', () => {
    jest.spyOn(MyDataPrepApi, 'getWorkspace').mockImplementation(() => {
      return {
        pipe: () => {
          return {
            subscribe: (callback) => {
              callback(mockForGetWorkspace);
            },
          };
        },
      };
    });

    const container = render(
      <Router history={history}>
        <Switch>
          <Route>
            <GridTable />
          </Route>
        </Switch>
      </Router>
    );
    expect(container).toBeDefined();
    expect(container.getByTestId('grid-table-container')).toBeInTheDocument();
  });
});
