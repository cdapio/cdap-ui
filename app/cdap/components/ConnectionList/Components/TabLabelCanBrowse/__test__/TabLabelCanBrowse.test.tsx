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

import { render, screen } from '@testing-library/react';
import React from 'react';
import TabLabelCanBrowse from 'components/ConnectionList/Components/TabLabelCanBrowse';
import { GCSIcon } from 'components/ConnectionList/IconStore/CGSIcon';

const mockConnectorTypeData = {
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
};

describe('Test TabLabelCanBrowse Component', () => {
  it('Should render TabLabelCanBrowse Component', () => {
    render(
      <TabLabelCanBrowse
        label={mockConnectorTypeData.name}
        count={mockConnectorTypeData.count}
        icon={mockConnectorTypeData.icon}
        columnIndex={0}
        dataTestID={0}
      />
    );
    const ele = screen.getAllByTestId(/connections-tab-can-browse-label-0/i);
    expect(ele[0]).toBeInTheDocument();
  });
  it('Should render TabLabelCanBrowse Component with ref true', () => {
    const ref: any = {
      current: {
        scrollWidth: '20',
      },
    };
    jest.spyOn(React, 'useRef').mockImplementationOnce(() => ref);
    render(
      <TabLabelCanBrowse
        label={mockConnectorTypeData.name}
        count={mockConnectorTypeData.count}
        icon={mockConnectorTypeData.icon}
        columnIndex={0}
        dataTestID={0}
      />
    );
  });
});
