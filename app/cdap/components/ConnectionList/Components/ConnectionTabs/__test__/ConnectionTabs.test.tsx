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
import { fireEvent, render, screen } from '@testing-library/react';
import ConnectionsTabs from '../index';
import { GCSIcon } from 'components/ConnectionList/icons';

const tabsTestData = {
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
  isSearching: false,
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
  isSearching: false,
};

const mockTabsDataWithBrowseIndex = {
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
  isSearching: false,
};

test('renders Connections Tab Component', () => {
  render(
    <ConnectionsTabs
      tabsData={tabsTestData}
      handleChange={() => null}
      value="apple"
      index="0"
      connectionId={undefined}
      setIsErrorOnNoWorkSpace={jest.fn()}
    />
  );
  const ele = screen.getByTestId(/connections-tabs-parent/i);
  expect(ele).toBeInTheDocument();
});

test('renders Connections Tabs', () => {
  render(
    <ConnectionsTabs
      tabsData={tabsTestData}
      handleChange={() => null}
      value="apple"
      index="1"
      connectionId={undefined}
      setIsErrorOnNoWorkSpace={jest.fn()}
    />
  );
  const ele = screen.getByTestId(/connection-tabs/i);
  expect(ele).toBeInTheDocument();
});

test('renders TabLabelCanBrowse with count connectorType count', () => {
  render(
    <ConnectionsTabs
      tabsData={mockTabsDataWithBrowseIndex}
      handleChange={() => null}
      value="apple"
      index={0}
      connectionId={undefined}
      setIsErrorOnNoWorkSpace={jest.fn()}
    />
  );
  const ele = screen.getByTestId(/connections-tab-label-browse/i);
  expect(ele).toBeInTheDocument();
});

test('Fire tab click event and trigger handlechange function', () => {
  const handleChange = jest.fn();
  render(
    <ConnectionsTabs
      tabsData={tabsTestData}
      handleChange={handleChange}
      value="apple"
      index="1"
      connectionId={undefined}
      setIsErrorOnNoWorkSpace={jest.fn()}
    />
  );
  const ele = screen.getAllByTestId(/connections-tab-button/i);
  fireEvent.click(ele[0]);
  expect(handleChange).toHaveBeenCalled();
});

test('Fire tab click event with index 2 and handlechange should not trigger', () => {
  const handleChange = jest.fn();
  render(
    <ConnectionsTabs
      tabsData={tabsTestData}
      handleChange={handleChange}
      value="apple"
      index="2"
      connectionId={undefined}
      setIsErrorOnNoWorkSpace={jest.fn()}
    />
  );
  const ele = screen.getAllByTestId(/connections-tab-button/i);
  fireEvent.click(ele[0]);
  expect(handleChange).toHaveBeenCalledTimes(0);
});

test('Fire tab click event with index 2 and handlechange should trigger', () => {
  const handleChange = jest.fn();
  render(
    <ConnectionsTabs
      tabsData={mockTabsDataWithBrowse}
      handleChange={handleChange}
      value="apple"
      index="2"
      connectionId={undefined}
      setIsErrorOnNoWorkSpace={jest.fn()}
    />
  );
  const ele = screen.getAllByTestId(/connections-tab-button/i);
  fireEvent.click(ele[0]);
  expect(handleChange).toHaveBeenCalledTimes(1);
});
