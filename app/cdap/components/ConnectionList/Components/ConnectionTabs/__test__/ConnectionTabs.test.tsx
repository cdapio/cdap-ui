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
import React from 'react';
import ConnectionsTabs from '../index';
import { tabsDataWithBrowse } from '../mock/tabsDataWithBrowse';
import { tabsDataWithBrowseIndex } from '../mock/tabsDataWithBrowseIndex';
import { tabsTestData } from '../mock/tabsTestData';

describe('Test ConnectionsTabs', () => {
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
        tabsData={tabsDataWithBrowseIndex}
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
        tabsData={tabsDataWithBrowse}
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
});
