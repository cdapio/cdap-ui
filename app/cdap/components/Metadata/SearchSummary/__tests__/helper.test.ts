/*
 * Copyright © 2021 Cask Data, Inc.
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

import { processProperties } from 'components/Metadata/SearchSummary/helper';
jest.disableAutomock();

describe('Metadata summary helper', () => {
  const apiResponse = {
    properties: [
      {
        name: 'type',
        scope: 'SYSTEM',
        value: 'externalDataset',
      },
      {
        name: 'schema',
        scope: 'SYSTEM',
        value:
          '{"type":"record","name":"etlSchemaBody","fields":[{"name":"body","type":"string"}]}',
      },
      {
        name: 'entity-name',
        scope: 'SYSTEM',
        value: 'logs_data_source',
      },
      {
        name: 'user property',
        scope: 'USER',
        value: 'value',
      },
    ],
    tags: [
      {
        name: 'Tag name1',
        scope: 'SYSTEM',
        value: 'Tag value1',
      },
      {
        name: 'Tag name2',
        scope: 'USER',
        value: 'Tag value2',
      },
    ],
  };

  describe("'processProperties' should", () => {
    it('return parsed response', () => {
      expect(processProperties(apiResponse)).toStrictEqual({
        activePropertyTab: 0,
        hasExternalDataset: true,
        properties: {
          isSystemEmpty: false,
          isUserEmpty: false,
          system: {
            'entity-name': 'logs_data_source',
            schema:
              '{"type":"record","name":"etlSchemaBody","fields":[{"name":"body","type":"string"}]}',
            type: 'externalDataset',
          },
          user: {
            'user property': 'value',
          },
        },
        systemTags: ['Tag name1'],
      });
    });
  });
});
