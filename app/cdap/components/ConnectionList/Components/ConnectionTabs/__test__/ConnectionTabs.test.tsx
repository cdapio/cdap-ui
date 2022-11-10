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
import ConnectionsTabs from '../index';
import { fireEvent, render, screen } from '@testing-library/react';
import { mockTabsDataWithBrowse } from '../mock/mockTabsDataWithBrowse';
import { mockTabsDataWithBrowseIndex } from '../mock/mockTabsDataWithBrowseIndex';
import { mockTabsTestData } from '../mock/mockTabsTestData';

const tabsTestData = [{ showTabs: true }];

describe('Test ConnectionsTabs', () => {
  it('Should render Connections Tabs Parent Component', () => {
    render(
      <ConnectionsTabs
        tabsData={mockTabsTestData}
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

  it('Should render Connections Tabs Component', () => {
    render(
      <ConnectionsTabs
        tabsData={mockTabsTestData}
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

  it('Should render TabLabelCanBrowse with connectorTypes and count', () => {
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
    const ele = screen.getAllByTestId(/connections-tab-label-browse/i);
    expect(ele[0]).toBeInTheDocument();
  });
});

describe('Should test whether handleChange function is triggered or not', () => {
  it('Should trigger handlechange function for the first column i.e. Connector Types', () => {
    const handleChange = jest.fn();
    render(
      <ConnectionsTabs
        tabsData={mockTabsTestData}
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

  it('Should not trigger handlechange function when clicked on columns other than first one, and canBrowse is false', () => {
    const handleChange = jest.fn();
    render(
      <ConnectionsTabs
        tabsData={mockTabsTestData}
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

  it('Should not trigger handlechange function when clicked on columns other than first one, and canBrowse is true', () => {
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
});
