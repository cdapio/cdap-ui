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
import ConnectionTabs from 'components/ConnectionList/Components/ConnectionTabs';
import { GCSIcon } from 'components/ConnectionList/IconStore/CGSIcon';
import React from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import history from 'services/history';

export const mockTabsTestData = {
  data: [
    {
      name: 'File',
      type: 'connector',
      category: 'File',
      description: 'Connection to browse and sample data from the local file system.',
      className: 'io.cdap.plugin.batch.connector.FileConnector',
      artifact: {
        name: 'core-plugins',
        version: '2.10.0-SNAPSHOT',
        scope: 'SYSTEM',
      },
      count: 1,
      icon: <GCSIcon />,
    },
    {
      name: 'PostgreSQL',
      type: 'connector',
      category: 'Database',
      description: 'Connection to access data in PostgreSQL databases using JDBC.',
      className: 'io.cdap.plugin.postgres.PostgresConnector',
      artifact: {
        name: 'postgresql-plugin',
        version: '1.9.0-SNAPSHOT',
        scope: 'SYSTEM',
      },
      count: 1,
      icon: <GCSIcon />,
    },
  ],
  showTabs: true,
  selectedTab: 'S3',
  toggleSearch: false,
};

const mockTabsDataWithBrowse = {
  data: [
    {
      name: 'File',
      type: 'connector',
      category: 'File',
      description: 'Connection to browse and sample data from the local file system.',
      className: 'io.cdap.plugin.batch.connector.FileConnector',
      artifact: {
        name: 'core-plugins',
        version: '2.10.0-SNAPSHOT',
        scope: 'SYSTEM',
      },
      canBrowse: true,
      count: 1,
      icon: <GCSIcon />,
    },
    {
      name: 'PostgreSQL',
      type: 'connector',
      category: 'Database',
      description: 'Connection to access data in PostgreSQL databases using JDBC.',
      className: 'io.cdap.plugin.postgres.PostgresConnector',
      artifact: {
        name: 'postgresql-plugin',
        version: '1.9.0-SNAPSHOT',
        scope: 'SYSTEM',
      },
      count: 1,
      icon: <GCSIcon />,
    },
  ],
  showTabs: true,
  selectedTab: 'S3',
  toggleSearch: false,
};

export const mockTabsDataWithBrowseIndex = {
  data: [
    {
      name: 'File',
      type: 'connector',
      category: 'File',
      description: 'Connection to browse and sample data from the local file system.',
      className: 'io.cdap.plugin.batch.connector.FileConnector',
      artifact: {
        name: 'core-plugins',
        version: '2.10.0-SNAPSHOT',
        scope: 'SYSTEM',
      },
      canBrowse: true,
      count: 1,
      icon: <GCSIcon />,
    },
  ],
  showTabs: true,
  selectedTab: 'S3',
  toggleSearch: false,
};

const tabsTestData = [{ showTabs: true }];

describe('Test ConnectionsTabs', () => {
  window.HTMLElement.prototype.scrollIntoView = function() {};

  it('Should render Connections Tabs Parent Component', () => {
    render(
      <ConnectionTabs
        tabsData={mockTabsTestData}
        handleChange={() => null}
        value="apple"
        // index={0}
        connectionId={undefined}
        setIsErrorOnNoWorkSpace={jest.fn()}
        columnIndex={0}
        index={undefined}
      />
    );
    const ele = screen.getByTestId(/connections-tabs-parent/i);
    expect(ele).toBeInTheDocument();
  });

  it('Should render Connections Tabs Component', () => {
    render(
      <ConnectionTabs
        tabsData={mockTabsTestData}
        handleChange={() => null}
        value="apple"
        // index={1}
        connectionId={undefined}
        setIsErrorOnNoWorkSpace={jest.fn()}
        columnIndex={0}
        index={undefined}
      />
    );
    const ele = screen.getByTestId(/connection-tabs/i);
    expect(ele).toBeInTheDocument();
  });

  it('Should render TabLabelCanBrowse with connectorTypes and count', () => {
    render(
      <ConnectionTabs
        tabsData={mockTabsDataWithBrowseIndex}
        handleChange={() => null}
        value="apple"
        // index={0}
        connectionId={undefined}
        setIsErrorOnNoWorkSpace={jest.fn()}
        columnIndex={0}
        index={undefined}
      />
    );
    const ele = screen.getAllByTestId(/connections-tab-can-browse-label-0/i);
    expect(ele[0]).toBeInTheDocument();
  });
});

describe('Should test whether handleChange function is triggered or not', () => {
  window.HTMLElement.prototype.scrollIntoView = function() {};

  it('Should trigger handlechange function for the first column i.e. Connector Types', () => {
    const handleChange = jest.fn();

    render(
      <ConnectionTabs
        tabsData={mockTabsTestData}
        handleChange={handleChange}
        value="apple"
        connectionId={undefined}
        setIsErrorOnNoWorkSpace={jest.fn()}
        columnIndex={0}
        index={undefined}
      />
    );
    const ele = screen.getAllByTestId(/connections-tab-column0-item0/i);
    fireEvent.click(ele[0]);
    expect(handleChange).toHaveBeenCalled();
  });

  it('Should not trigger handlechange function when clicked on columns other than first one, and canBrowse is false', () => {
    const handleChange = jest.fn();

    render(
      <Router history={history}>
        <Switch>
          <Route>
            <ConnectionTabs
              tabsData={mockTabsTestData}
              handleChange={handleChange}
              value="apple"
              connectionId={undefined}
              setIsErrorOnNoWorkSpace={jest.fn()}
              columnIndex={0}
              index={undefined}
            />
          </Route>
        </Switch>
      </Router>
    );
    const ele = screen.getAllByTestId(/connections-tab-column0-item0/i);
    fireEvent.click(ele[0]);
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('Should not trigger handlechange function when clicked on columns other than first one, and canBrowse is true', () => {
    const handleChange = jest.fn();

    render(
      <Router history={history}>
        <Switch>
          <Route>
            <ConnectionTabs
              handleChange={handleChange}
              value="apple"
              connectionId={undefined}
              setIsErrorOnNoWorkSpace={jest.fn()}
              columnIndex={0}
              tabsData={mockTabsDataWithBrowse}
              index={undefined}
            />
          </Route>
        </Switch>
      </Router>
    );
    const ele = screen.getAllByTestId(/connections-tab-column0-item0/i);
    fireEvent.click(ele[0]);
    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});
