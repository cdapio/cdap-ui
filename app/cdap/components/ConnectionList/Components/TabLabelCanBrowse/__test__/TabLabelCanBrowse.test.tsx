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
import TabLabelCanBrowse from '../index';
import { mockConnectorTypeData } from '../mock/mockConnectorTypeData';

describe('Test TabLabelCanBrowse Component', () => {
  it('Should render TabLabelCanBrowse Component', () => {
    render(
      <TabLabelCanBrowse
        label={mockConnectorTypeData.name}
        count={mockConnectorTypeData.count}
        icon={mockConnectorTypeData.icon}
        index={0}
      />
    );
    const ele = screen.getByTestId(/connections-tab-label-browse/i);
    expect(ele).toBeInTheDocument();
  });
});
