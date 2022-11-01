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

import {
  mockConnectorTypeData,
  mockConnectorTypeWithDuplicates,
  mockConnectorTypeWithNoCategory,
  mockConnectorTypeWithoutDuplicates,
} from 'components/WrangleHome/Components/WidgetSVG/mock/mockForWidgetData';
import { getCategoriesToConnectorsMap } from 'components/WrangleHome/Components/WidgetSVG/utils';

describe('Test Utils function', () => {
  const mockReturnedValueWithConnectorType = new Map();
  mockReturnedValueWithConnectorType.set('Database', [
    {
      artifact: {
        name: 'postgresql-plugin',
        scope: 'SYSTEM',
        version: '1.9.0-SNAPSHOT',
      },
      category: 'Database',
      className: 'io.cdap.plugin.postgres.PostgresConnector',
      description: 'Connection to access data in PostgreSQL databases using JDBC.',
      name: 'PostgreSQL',
      olderVersions: [],
      type: 'connector',
    },
  ]);
  mockReturnedValueWithConnectorType.set('File', [
    {
      artifact: {
        name: 'core-plugins',
        scope: 'SYSTEM',
        version: '2.10.0-SNAPSHOT',
      },
      category: 'File',
      className: 'io.cdap.plugin.batch.connector.FileConnector',
      description: 'Connection to browse and sample data from the local file system.',
      name: 'File',
      olderVersions: [],
      type: 'connector',
    },
  ]);

  const mockReturnedValue = new Map();
  mockReturnedValue.set('postgresql-plugin', [
    {
      artifact: {
        name: 'postgresql-plugin',
        scope: 'SYSTEM',
        version: '1.9.0-SNAPSHOT',
      },
      className: 'io.cdap.plugin.postgres.PostgresConnector',
      description: 'Connection to access data in PostgreSQL databases using JDBC.',
      name: 'PostgreSQL',
      olderVersions: [],
      type: 'connector',
    },
  ]);
  it('Should invoke the utils with ConnectorTypeData', () => {
    getCategoriesToConnectorsMap(mockConnectorTypeData);
    expect(getCategoriesToConnectorsMap(mockConnectorTypeData)).toStrictEqual(
      mockReturnedValueWithConnectorType
    );
  });

  it('Should invoke the function when there is no category', () => {
    getCategoriesToConnectorsMap(mockConnectorTypeWithNoCategory);
    expect(getCategoriesToConnectorsMap(mockConnectorTypeWithNoCategory)).toStrictEqual(
      mockReturnedValue
    );
  });
  it('Should invoke the function when there is duplicate input ', () => {
    getCategoriesToConnectorsMap(mockConnectorTypeWithDuplicates);
    expect(getCategoriesToConnectorsMap(mockConnectorTypeWithNoCategory)).toStrictEqual(
      mockReturnedValue
    );
  });

  it('Should invoke the function when there is no duplicate input ', () => {
    getCategoriesToConnectorsMap(mockConnectorTypeWithoutDuplicates);
    expect(getCategoriesToConnectorsMap(mockConnectorTypeWithNoCategory)).toStrictEqual(
      mockReturnedValue
    );
  });
});
