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
import { render } from '@testing-library/react';
import { WrangleCard } from '..';
import { Router, Switch, Route } from 'react-router';
import { createBrowserHistory } from 'history';
import { getCategorizedConnections } from 'components/Connections/Browser/SidePanel/apiHelpers';

const history = createBrowserHistory({
  basename: '/',
});
describe('Testing the Wrangle Card Component', () => {
  test('Should check whether WrangleCard Component is rendered or not', () => {
    const screen = render(
      <Router history={history}>
        <Switch>
          <Route>
            <WrangleCard />
          </Route>
        </Switch>
      </Router>
    );
    expect(screen).toBeDefined();
  });

  it('Should', async () => {
    const categorizedConnections = await getCategorizedConnections();
    expect(categorizedConnections).toEqual([
      {
        key: 'PostgreSQL',
        value: [
          {
            name: 'exl',
            connectionId: 'exl',
            connectionType: 'PostgreSQL',
            description: '',
            preConfigured: false,
            isDefault: false,
            createdTimeMillis: 1660107919860,
            updatedTimeMillis: 1660107919860,
            plugin: {
              category: 'Database',
              name: 'PostgreSQL',
              type: 'connector',
              properties: {
                host: 'jenkins.divami.com',
                port: '5432',
                jdbcPluginName: 'postgresql',
                database: 'exlaibias',
                user: 'postgres',
                password: 'divami',
                connectionArguments: '1=1',
              },
              artifact: {
                scope: 'SYSTEM',
                name: 'postgresql-plugin',
                version: '1.9.0-SNAPSHOT',
              },
            },
          },
        ],
      },
      {
        key: 'File',
        value: [
          {
            name: 'mkm',
            connectionId: 'mkm',
            connectionType: 'File',
            description: 'mkk',
            preConfigured: false,
            isDefault: false,
            createdTimeMillis: 1660125276816,
            updatedTimeMillis: 1660125276816,
            plugin: {
              category: 'File',
              name: 'File',
              type: 'connector',
              properties: {},
              artifact: {
                scope: 'SYSTEM',
                name: 'core-plugins',
                version: '2.10.0-SNAPSHOT',
              },
            },
          },
        ],
      },
    ]);
  });
});
