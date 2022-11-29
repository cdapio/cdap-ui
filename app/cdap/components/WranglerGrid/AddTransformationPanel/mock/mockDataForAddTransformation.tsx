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

import { IGeneral } from 'components/GridTable/types';
export const mockDirectiveFunctionSupportedDataType = ['string'];
export const mockFunctionName = 'uppercase';
export const mockColumnData = [
  {
    name: 'body_0',
    label: 'body_0',
    type: ['String'],
  },
  {
    name: 'body_1',
    label: 'body_1',
    type: ['String'],
  },
  {
    name: 'body_2',
    label: 'body_2',
    type: ['String'],
  },
];

export const mockMissingDataList = {
  body_0: {
    general: {
      'non-null': '100',
    },
    types: {
      Integer: ' 99.9',
      'US Postal Codes': '0.1',
      'US State': ' 0.1',
      Text: '0.1',
    },
  },
};

export const mockSelectedColumns = [
  {
    label: 'body_0',
    name: 'body_0',
    type: ['String'],
  },
];

export const mockDataQualityValue = [
  {
    label: 'body_0',
    value: '0',
  },
];

export const mockStatistics: IGeneral = {
  general: {
    'non-null': 100,
  },
  types: {
    Integer: 99.9,
    'US Postal Codes': 0.1,
    'US State': 0.1,
    Text: 0.1,
  },
};

export const mockColumnList = [
  {
    name: 'body_0',
    label: 'body_0',
    type: ['String'],
  },
];
export const mockColumnDataForColumnList = [
  {
    name: 'body_0',
    label: 'body_0',
    type: ['String'],
  },
  {
    name: 'body_1',
    label: 'body_1',
    type: ['String'],
  },
];

export const mockDataQualityValueForTableRow = [
  {
    label: 'body_0',
    value: '0',
  },
  {
    label: 'body_1',
    value: '0',
  },
  {
    label: 'body_2',
    value: '0',
  },
];

export const mockUtilsForNullValues = {
  body_0: {
    general: {
      'non-null': 100,
      null: 10,
    },
    types: {
      Integer: 99.9,
      'US Postal Codes': 0.1,
      'US State': 0.1,
      Text: 0.1,
    },
  },
};

export const mockColumnListForNullValues = [
  {
    name: 'body_0',
    label: 'body_0',
    type: ['String'],
  },
];
