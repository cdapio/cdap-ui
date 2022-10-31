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
import OngoingDataExploration from '../index';

const testObj = {
  connectionName: 'Upload',
  workspaceName: 'Divami_Users_Emails.xlsx',
  recipeSteps: 0,
  dataQuality: 100,
};

test('renders Ongoing Data Exploration component', () => {
  jest.mock('api/dataprep', () => {
    return Promise.resolve([
      { connectionName: 'yolo', workspaceName: 'Divami_Users_Emails.xlsx', recipeSteps: 0 },
      { connectionName: 'Upload', workspaceName: 'Divami_Users_Emails.xlsx', recipeSteps: 0 },
    ]); 
    });
    render(<OngoingDataExploration />);
    const ele = screen.getByTestId(/ongoing-data-explore-parent/i);
    expect(ele).toBeInTheDocument();
  });
