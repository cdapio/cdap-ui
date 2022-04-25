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

import { removeFilteredProperties } from 'components/shared/ConfigurationGroup/utilities';

describe('Unit tests for Utilities', () => {
  describe('removeFilteredProperties should', () => {
    it('Return processed values', () => {
      const values = {
        project: 'test',
        tempTableTTLHours: '72',
        location: 'US-default',
      };
      const filteredConfigurationGroups = [
        {
          label: 'basic',
          properties: [
            {
              name: 'location',
              show: true,
            },
            {
              name: 'project',
              show: true,
            },
          ],
        },
        {
          label: 'advanced',
          properties: [
            {
              name: 'tempTableTTLHours',
              show: false,
            },
          ],
        },
      ];
      expect(removeFilteredProperties(values, filteredConfigurationGroups)).toStrictEqual({
        location: 'US-default',
        project: 'test',
      });
    });
  });
});
