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
import GridTable from '..';
import { fireEvent, render, screen } from '@testing-library/react';
import { Route, Router, Switch } from 'react-router';
import { createBrowserHistory as createHistory } from 'history';
import MyDataPrepApi from 'api/dataprep';
import rxjs from 'rxjs/operators';
import { mockForFlatMap, mockForGetWorkspace } from '../mock/mockDataForGrid';

const history = createHistory({
  basename: '/',
});

describe('Testing Grid Table Component', () => {
  jest.spyOn(rxjs, 'flatMap' as any).mockImplementation((callback: any) => {
    callback(mockForFlatMap);
  });
  it('Should check if the component is rendered', () => {
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
    expect(render).toBeDefined();
    const gridTable = container.getByTestId('grid-table');
    expect(container.getByTestId('grid-table')).toBeInTheDocument();
  });

  it('Should check if the component is rendered', () => {
    jest.spyOn(MyDataPrepApi, 'getWorkspace').mockImplementation(() => {
      return {
        pipe: () => {
          return {
            subscribe: (callback) => {
              callback([]);
            },
          };
        },
      };
    });
    const realUseState = React.useState
    React.useState = jest.fn().mockReturnValue([realUseState, {}])
    const container = render(
      <Router history={history}>
        <Switch>
          <Route>
            <GridTable />
          </Route>
        </Switch>
      </Router>
    );
    const gridTable = container.getByTestId('grid-table');
    expect(container.getByTestId('grid-table')).toBeInTheDocument();
    const ele = screen.getByTestId(/footer-panel-box-click/i);
    fireEvent.click(ele);
    const ele2 = screen.getByTestId(/menu-item-component-8/i);
    fireEvent.click(ele2);
    expect(container).toBeDefined();
   
  });
});


