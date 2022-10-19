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
import ConnectionsTabs from 'components/ConnectionList/Components/ConnectionTabs/index';
import { tabsTestData } from 'components/ConnectionList/Components/ConnectionTabs/mock/tabTestData';

test('renders Connections Tab Component', () => {
  render(
    <ConnectionsTabs
      tabsData={tabsTestData}
      handleChange={() => null}
      value="apple"
      index={0}
      connectionId={undefined}
      setToaster={jest.fn}
      toggleLoader={jest.fn}
    />
  );
  const ele = screen.getByTestId(/connections-tabs-parent/i);
  expect(ele).toBeInTheDocument();
});
