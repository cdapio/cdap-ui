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

import { importDatasetIcon } from 'components/WrangleHome/Components/WrangleCard/iconStore/importDataset';

export const mockItems = [
  {
    icon: importDatasetIcon,
    label: 'Test_postgres_01',
    type: 'iconWithText',
  },
  {
    label: 'sql_features',
    type: 'text',
  },
  {
    label: '9 Recipe steps',
    type: 'text',
  },
  {
    label: null,
    percentageSymbol: '%',
    subText: 'Data Quality',
    type: 'percentageWithText',
  },
  {
    workspaceId: '08e5d850-357d-4982-960a-6e1d19c7e0e8',
  },
];

export const mockItemsWithPercentage = [
  {
    icon: importDatasetIcon,
    label: 'Test_postgres_01',
    type: 'iconWithText',
  },
  {
    label: 'sql_features',
    type: 'text',
  },
  {
    label: '9 Recipe steps',
    type: 'text',
  },
  {
    label: '80',
    percentageSymbol: '%',
    subText: 'Data Quality',
    type: 'percentageWithText',
  },
  {
    workspaceId: '08e5d850-357d-4982-960a-6e1d19c7e0e8',
  },
];

export const mockItemsPercentageData = [
  {
    icon: importDatasetIcon,
    label: 'Test_postgres_01',
    type: 'iconWithText',
  },
  {
    label: 'sql_features',
    type: 'text',
  },
  {
    label: '9 Recipe steps',
    type: 'text',
  },
  {
    label: '100',
    percentageSymbol: '%',
    subText: 'Data Quality',
    type: 'percentageWithText',
  },
  {
    workspaceId: '08e5d850-357d-4982-960a-6e1d19c7e0e8',
  },
];
