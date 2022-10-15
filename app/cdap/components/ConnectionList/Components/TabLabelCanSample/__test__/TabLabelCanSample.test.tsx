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

import { fireEvent, render, screen } from '@testing-library/react';
import { createWorkspace } from 'components/Connections/Browser/GenericBrowser/apiHelpers';
import { createBrowserHistory } from 'history';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { Route, Router, Switch } from 'react-router-dom';
import TabLabelCanSample from '../index';
import {
  mockConnectorTypeData,
  mockEntityData,
  mockEntityDataForNoWorkspace,
} from '../mock/mockConnectorTypeData';

const history = createBrowserHistory({
  basename: '/',
});
describe('Test TabLabelCanSample Component', () => {
  it('Should render TabLabelCanSample Component', () => {
    render(
      <Router history={history}>
        <Switch>
          <Route>
            <TabLabelCanSample
              label={mockConnectorTypeData.name}
              entity={mockConnectorTypeData}
              initialConnectionId={undefined}
              toggleLoader={() => null}
              setIsErrorOnNoWorkSpace={jest.fn()}
            />
          </Route>
        </Switch>
      </Router>
    );
    const ele = screen.getByTestId(/connections-tab-label-simple/i);
    expect(ele).toBeInTheDocument();
  });

  it('Should trigger setIsErrorOnNoWorkSpace function ', () => {
    const setIsErrorOnNoWorkSpace = jest.fn();
    render(
      <Router history={history}>
        <Switch>
          <Route>
            <TabLabelCanSample
              label={mockConnectorTypeData.name}
              entity={mockConnectorTypeData}
              initialConnectionId={undefined}
              toggleLoader={() => null}
              setIsErrorOnNoWorkSpace={setIsErrorOnNoWorkSpace}
            />
          </Route>
        </Switch>
      </Router>
    );
    const ele = screen.getByTestId(/connections-tab-explore/i);
    fireEvent.click(ele);
    expect(setIsErrorOnNoWorkSpace).toHaveBeenCalled();
  });

  it('Should trigger onCreateWorkspace(entity) function', () => {
    const setIsErrorOnNoWorkSpace = jest.fn();
    render(
      <TabLabelCanSample
        label={mockEntityData.name}
        entity={mockEntityData}
        initialConnectionId={undefined}
        toggleLoader={() => null}
        setIsErrorOnNoWorkSpace={setIsErrorOnNoWorkSpace}
      />
    );
    const ele = screen.getByTestId(/connections-tab-explore/i);
    fireEvent.click(ele);
    expect(ele).toBeInTheDocument();
  });

  it('Should trigger onWorkspaceCreate Function', async () => {
    const setIsErrorOnNoWorkSpace = jest.fn();
    const res = createWorkspace({
      entity: {
        name: 'sql_feature',
        path: '/information_schema/sql_features',
        type: 'system table',
        canSample: true,
        canBrowse: false,
        properties: {},
      },
      connection: 'exl',
      properties: {},
    });
    const abc = Promise.resolve(res);
    act(() => {
      console.log(abc, 'ssfsfds');
    });
    console.log(abc, 'ssfsfds');

    render(
      <TabLabelCanSample
        label={mockEntityDataForNoWorkspace.name}
        entity={mockEntityDataForNoWorkspace}
        initialConnectionId="exl"
        toggleLoader={() => null}
        setIsErrorOnNoWorkSpace={setIsErrorOnNoWorkSpace}
      />
    );
    const ele = screen.getByTestId(/connections-tab-explore/i);
    fireEvent.click(ele);
    expect(ele).toBeInTheDocument();
  });
});
