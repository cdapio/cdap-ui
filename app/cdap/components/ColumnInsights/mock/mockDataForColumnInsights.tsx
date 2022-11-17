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

export const mockColumnData = {
  open: true,
  columnName: 'body_2',
  distinctValues: 3,
  characterCount: {
    min: 0,
    max: 8,
  },
  dataQuality: {
    nullValueCount: 3,
    nullValuePercentage: 50,
    emptyValueCount: 0,
    emptyValuePercentage: 0,
  },
  dataQualityBar: {
    general: {
      'non-null': 50,
      null: 50,
    },
    types: {
      Text: 16.666668,
    },
  },
  dataTypeString: 'Contains letters and numbers',
  dataDistributionGraphData: [
    {
      text: 'undefined',
      value: 3,
    },
    {
      text: '"""91"""',
      value: 1,
    },
    {
      text: '11swd',
      value: 1,
    },
    {
      text: 'sxe',
      value: 1,
    },
  ],
  columnNamesList: ['body_0,body_1,body_2,body_3,body_4'],
};

export const mockColumnDataWithEmptyDataTypeString = {
  open: true,
  columnName: 'body_2',
  distinctValues: 3,
  characterCount: {
    min: 0,
    max: 8,
  },
  dataQuality: {
    nullValueCount: 3,
    nullValuePercentage: 50,
    emptyValueCount: 0,
    emptyValuePercentage: 0,
  },
  dataQualityBar: {
    general: {
      'non-null': 50,
      null: 50,
    },
    types: {
      Text: 16.666668,
    },
  },
  dataTypeString: '',
  dataDistributionGraphData: [
    {
      text: 'undefined',
      value: 3,
    },
    {
      text: '"""91"""',
      value: 1,
    },
    {
      text: '11swd',
      value: 1,
    },
    {
      text: 'sxe',
      value: 1,
    },
  ],
  columnNamesList: ['body_0,body_1,body_2,body_3,body_4'],
};

export const mockGraphData = [
  {
    text: 'undefined',
    value: 30,
  },
  {
    text: '"""91"""',
    value: 80,
  },
  {
    text: 'hello',
    value: 1,
  },
  {
    text: 'set',
    value: 90,
  },
  {
    text: '"""91"""',
    value: 9,
  },
  {
    text: 'test',
    value: 2,
  },
  {
    text: 'peek',
    value: 1,
  },
  {
    text: '  ',
    value: 1,
  },
  {
    text: '',
    value: 10,
  },
  {
    text: '',
    value: 1,
  },
];

export const mockDataQuality = {
  nullValueCount: 3,
  nullValuePercentage: 50,
  emptyValueCount: 0,
  emptyValuePercentage: 0,
};

export const mockColumnInfoForDataQuality = {
  general: {
    'non-null': 40,
    null: 50,
  },
  types: {
    Text: 16.666668,
  },
};

export const mockOptions = [
  {
    value: 'string',
    label: 'String',
  },
  {
    value: 'boolean',
    label: 'Boolean',
  },
  {
    value: 'int',
    label: 'Integer',
  },
  {
    value: 'long',
    label: 'Long',
  },
  {
    value: 'short',
    label: 'Short',
  },
  {
    value: 'float',
    label: 'Float',
  },
  {
    value: 'double',
    label: 'Double',
  },
  {
    value: 'decimal',
    label: 'Decimal',
  },
  {
    value: 'bytes',
    label: 'Bytes',
  },
];
