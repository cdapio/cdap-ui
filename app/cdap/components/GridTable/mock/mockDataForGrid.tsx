/*
 *  Copyright © 2022 Cask Data, Inc.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"); you may not
 *  use this file except in compliance with the License. You may obtain a copy of
 *  the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 *  WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 *  License for the specific language governing permissions and limitations under
 *  the License.
 */

import { IExecuteAPIResponse } from 'components/GridTable/types';

export const mock: IExecuteAPIResponse = {
  headers: ['body_0', 'body_1', 'body_2', 'body_3', 'body_4', 'body_5'],
  types: {
    body_3: 'String',
    body_4: 'String',
    body_1: 'String',
    body_2: 'String',
    body_0: 'String',
    body_5: 'String',
  },
  values: [
    {
      body_3: 'email',
      body_4: 'gender',
      body_1: 'first_name',
      body_2: 'last_name',
      body_0: 'id',
      body_5: 'ip_address',
    },
    {
      body_3: 'jpedler0@newsvine.com',
      body_4: 'Bigender',
      body_1: 'Jarred',
      body_2: 'Pedler',
      body_0: '1',
      body_5: '43.239.118.97',
    },
    {
      body_3: 'vhalewood1@un.org',
      body_4: 'Male',
      body_1: 'Vittorio',
      body_2: 'Halewood',
      body_0: '2',
      body_5: '79.188.85.70',
    },
  ],
  summary: {
    statistics: {
      body_3: {
        general: {
          'non-null': 100,
        },
        types: {
          Email: 99.9,
          'US State': 1.2,
          Text: 0.1,
        },
      },
      body_4: {
        general: {
          'non-null': 100,
        },
        types: {
          Text: 98.4,
          Gender: 90.4,
        },
      },
      body_1: {
        general: {
          'non-null': 100,
        },
        types: {
          'US State': 0.3,
          Text: 99.6,
        },
      },
      body_2: {
        general: {
          'non-null': 100,
        },
        types: {
          'US Postal Codes': 0.1,
          'US State': 0.1,
          Text: 98.9,
        },
      },
      body_0: {
        general: {
          'non-null': 100,
        },
        types: {
          Integer: 99.9,
          'US Postal Codes': 0.1,
          'US State': 0.1,
          Text: 0.1,
        },
      },
      body_5: {
        general: {
          'non-null': 100,
        },
        types: {
          Currency: 12.9,
          IPV4: 99.9,
        },
      },
    },
    validations: {},
  },
};

export const mockUtilResult = { name: 'gender', count: 0 };
