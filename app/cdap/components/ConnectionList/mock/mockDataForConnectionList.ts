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

export const connectionListDummyResPostGresSql = [
  {
    name: 'TESTING',
    connectionId: 'TESTING',
    connectionType: 'PostgreSQL',
    description: '',
    preConfigured: false,
    isDefault: false,
    createdTimeMillis: 1663766799085,
    updatedTimeMillis: 1663766799085,
    plugin: {
      category: 'Database',
      name: 'PostgreSQL',
      type: 'connector',
      properties: {
        host: 'jenkins.divami.com',
        port: '5432',
        jdbcPluginName: 'postgresql',
        database: 'exlaibias',
        user: 'postgres',
        password: 'divami',
        connectionArguments: '1=1',
      },
      artifact: {
        scope: 'SYSTEM',
        name: 'postgresql-plugin',
        version: '1.9.0-SNAPSHOT',
      },
    },
  },
];

export const connectionListDummyResFile = [
  {
    name: 'fjhgkhjl',
    connectionId: 'fjhgkhjl',
    connectionType: 'File',
    description: '',
    preConfigured: false,
    isDefault: false,
    createdTimeMillis: 1663766703232,
    updatedTimeMillis: 1663766703232,
    plugin: {
      category: 'File',
      name: 'File',
      type: 'connector',
      properties: {},
      artifact: {
        scope: 'SYSTEM',
        name: 'core-plugins',
        version: '2.10.0-SNAPSHOT',
      },
    },
  },
];

export const mockResponseForFetchConnectors = [
  {
    name: 'S3',
    type: 'connector',
    category: 'Amazon Web Services',
    description: 'Connection to access data in Amazon S3.',
    className: 'io.cdap.plugin.aws.s3.connector.S3Connector',
    artifact: {
      name: 'amazon-s3-plugins',
      version: '1.18.0-SNAPSHOT',
      scope: 'SYSTEM',
    },
  },
];
