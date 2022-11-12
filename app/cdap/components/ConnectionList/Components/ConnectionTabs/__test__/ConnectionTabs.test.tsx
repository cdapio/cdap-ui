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

import React from "react";
import ConnectionsTabs from "components/ConnectionList/Components/ConnectionTabs/index";
import { fireEvent, render, screen } from "@testing-library/react";
import { mockTabsDataWithBrowse } from "components/ConnectionList/Components/ConnectionTabs/mock/mockTabsDataWithBrowse";
import { mockTabsDataWithBrowseIndex } from "components/ConnectionList/Components/ConnectionTabs/mock/mockTabsDataWithBrowseIndex";
import { mockTabsTestData } from "components/ConnectionList/Components/ConnectionTabs/mock/mockTabsTestData";

const tabsTestData = [{ showTabs: true }];

describe("Test ConnectionsTabs", () => {
  it("Should render Connections Tabs Parent Component", () => {
    render(
      <ConnectionsTabs
        tabsData={mockTabsTestData}
        handleChange={() => null}
        value="apple"
        index="0"
        connectionId={undefined}
        setIsErrorOnNoWorkSpace={jest.fn()}
        columnIndex={undefined}

      />
    );
    const connectionTabParentElement = screen.getByTestId(/connections-tabs-parent/i);
    expect(connectionTabParentElement).toBeInTheDocument();
  });

  it("Should render Connections Tabs Component", () => {
    render(
      <ConnectionsTabs
        tabsData={mockTabsTestData}
        handleChange={() => null}
        value="apple"
        index="1"
        connectionId={undefined}
        setIsErrorOnNoWorkSpace={jest.fn()}
        columnIndex={undefined}

      />
    );
    const connectionTabElement = screen.getByTestId(/connection-tabs/i);
    expect(connectionTabElement).toBeInTheDocument();
  });

  it("Should render TabLabelCanBrowse with connectorTypes and count", () => {
    render(
      <ConnectionsTabs
        tabsData={mockTabsDataWithBrowseIndex}
        handleChange={() => null}
        value="apple"
        index={0}
        connectionId={undefined}
        setIsErrorOnNoWorkSpace={jest.fn()}
        columnIndex={undefined}

      />
    );
    const labelBrowseElement = screen.getByTestId(/connections-tab-label-browse/i);
    expect(labelBrowseElement).toBeInTheDocument();
  });
});

describe("Should test whether handleChange function is triggered or not", () => {
  it("Should trigger handlechange function for the first column i.e. Connector Types", () => {
    const handleChange = jest.fn();
    render(
      <ConnectionsTabs
        tabsData={mockTabsTestData}
        handleChange={handleChange}
        value="apple"
        index="1"
        connectionId={undefined}
        setIsErrorOnNoWorkSpace={jest.fn()}
        columnIndex={1}
      />
    );
    const connectionTabElement = screen.getAllByTestId(/connection-tab-10/i);
    fireEvent.click(connectionTabElement[0]);
    expect(handleChange).toHaveBeenCalled();
  });

  it("Should not trigger handlechange function when clicked on columns other than first one, and canBrowse is false", () => {
    const handleChange = jest.fn();
    render(
      <ConnectionsTabs
        tabsData={mockTabsTestData}
        handleChange={handleChange}
        value="apple"
        index="2"
        connectionId={undefined}
        setIsErrorOnNoWorkSpace={jest.fn()}
        columnIndex={1}

      />
    );
    const connectionTabElement = screen.getAllByTestId(/connection-tab-10/i);
    fireEvent.click(connectionTabElement[0]);
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("Should not trigger handlechange function when clicked on columns other than first one, and canBrowse is true", () => {
    const handleChange = jest.fn();
    render(
      <ConnectionsTabs
        tabsData={mockTabsDataWithBrowse}
        handleChange={handleChange}
        value="apple"
        index="2"
        connectionId={undefined}
        setIsErrorOnNoWorkSpace={jest.fn()}
        columnIndex={1}

      />
    );
    const connectionTabElement = screen.getAllByTestId(/connection-tab-10/i);
    fireEvent.click(connectionTabElement[0]);
    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});
