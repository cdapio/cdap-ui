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
import { GCSIcon } from 'components/ConnectionList/icons';
import TabLabelCanSample from '../index';

const mockConnectorTypeData = {
  name: 'File',
  type: 'connector',
  category: 'File',
  description: 'Connection to browse and sample data from the local file system.',
  className: 'io.cdap.plugin.batch.connector.FileConnector',
  // canBrowse: false,
  // canSample: true
  // count: 1,
  // icon: <GCSIcon />,
};

test('renders Tab label can browse', () => {
  render(
    <TabLabelCanSample
      label={mockConnectorTypeData.name}
      entity={mockConnectorTypeData}
      initialConnectionId={undefined}
      toggleLoader={() => null}
      setIsErrorOnNoWorkSpace={jest.fn()}
    />
  );
  const ele = screen.getByTestId(/connections-tab-label-simple/i);
  expect(ele).toBeInTheDocument();
});

test('Fire click event and trigger setIsErrorOnNoWorkSpace function ', () => {
  const setIsErrorOnNoWorkSpace = jest.fn();
  render(
    <TabLabelCanSample
      label={mockConnectorTypeData.name}
      entity={mockConnectorTypeData}
      initialConnectionId={undefined}
      toggleLoader={() => null}
      setIsErrorOnNoWorkSpace={setIsErrorOnNoWorkSpace}
    />
  );
  const ele = screen.getByTestId(/connections-tab-explore/i);
  fireEvent.click(ele);
  expect(setIsErrorOnNoWorkSpace).toHaveBeenCalled();
});

// test('Fire click event and trigger onCreateWorkspace function ', () => {
//     const setIsErrorOnNoWorkSpace = jest.fn();
//     const onCreateWorkspace = jest.fn();
//     const createWorkspaceInternal = jest.fn();
//   render(<TabLabelCanSample
//     label={mockConnectorTypeData.name}
//     entity={mockConnectorTypeData}
//     initialConnectionId={undefined}
//     toggleLoader={() => null}
//     setIsErrorOnNoWorkSpace={setIsErrorOnNoWorkSpace} />);
//   const ele = screen.getByTestId(/connections-tab-explore/i);
//   fireEvent.click(ele);
//   expect(onCreateWorkspace).toHaveBeenCalled();
// });
