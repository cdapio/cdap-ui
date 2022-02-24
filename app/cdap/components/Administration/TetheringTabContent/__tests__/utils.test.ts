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

import T from 'i18n-react';
import { areInputsValid } from 'components/Administration/TetheringTabContent/utils';
import {
  getTransformedTableData,
  getTotalTableRows,
} from 'components/Administration/TetheringTabContent/TetheringTable/utils';

const I18NPREFIX = 'features.Administration.Tethering.CreateRequest';

describe('Unit Tests for Utils', () => {
  describe('Tests for "AreInputsValid"', () => {
    const selectedNamespaces = ['ns1', 'ns2'];
    const inputFields = {
      projectName: 'TestProj',
      region: 'TestRegion',
      instanceName: 'TestInstance',
      instanceUrl: 'TestUrl',
    };

    it('Should return true with an error object with empty keys when given valid inputs', () => {
      const { errors, allValid } = areInputsValid({
        selectedNamespaces,
        inputFields,
      });
      expect(errors.namespaces).toStrictEqual({});
      expect(errors.projectName).toStrictEqual({});
      expect(errors.region).toStrictEqual({});
      expect(errors.instanceName).toStrictEqual({});
      expect(errors.instanceUrl).toStrictEqual({});
      expect(allValid).toBe(true);
    });

    it('Should return false with an error object containig missing namespace error message', () => {
      const { errors, allValid } = areInputsValid({ selectedNamespaces: [], inputFields });
      expect(errors.namespaces).toMatchObject({
        msg: T.translate(`${I18NPREFIX}.nsValidationError`),
      });
      expect(allValid).toBe(false);
    });

    it('Should return false with an error object containig missing region error message', () => {
      const { errors, allValid } = areInputsValid({
        selectedNamespaces,
        inputFields: { ...inputFields, region: '' },
      });
      expect(errors.region).toMatchObject({
        msg: T.translate(`${I18NPREFIX}.inputValidationError`, { fieldName: 'region' }),
      });
      expect(allValid).toBe(false);
    });
  });

  describe('Tests for "getTransformedTableData" and "getTotalTableRows"', () => {
    it('Should return a proper transformed table data array', () => {
      const tableData = [
        {
          connectionStatus: 'INACTIVE',
          endpoint: 'TestEndPoint1',
          name: 'Test1',
          requestTime: 1644641074338,
          tetheringStatus: 'ACCEPTED',
          metadata: {
            description: 'test1',
            metadata: {
              location: 'loc1',
              project: 'proj1',
            },
            namespaceAllocations: [{ namespace: 'kubens1', cpuLimit: '4', memoryLimit: '32' }],
          },
        },
        {
          connectionStatus: 'INACTIVE',
          endpoint: 'TestEndPoint2',
          name: 'Test2',
          requestTime: 1644641074338,
          tetheringStatus: 'ACCEPTED',
          metadata: {
            description: 'test2',
            metadata: {
              location: null,
              project: null,
            },
            namespaceAllocations: [
              { namespace: 'kubens2', cpuLimit: '8', memoryLimit: '16' },
              { namespace: 'kubens3', cpuLimit: '16', memoryLimit: '32' },
            ],
          },
        },
      ];
      const transformedTableData = getTransformedTableData(tableData);
      expect(transformedTableData.length).toBe(2);
      expect(transformedTableData[1]).toHaveProperty('region');
      expect(transformedTableData[1]).toHaveProperty('gcloudProject');
      expect(transformedTableData[1]).toHaveProperty('highlighted');
      expect(transformedTableData[1].allocationData.length).toBe(2);
      expect(getTotalTableRows(tableData)).toBe(3);
    });
  });
});
