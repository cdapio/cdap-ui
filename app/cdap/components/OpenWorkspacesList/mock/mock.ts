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

export const mockRes = {
  message: 'Success',
  count: 8,
  values: [
    {
      workspaceName: 'sql_sizing_profiles',
      workspaceId: '46384b61-0ceb-45ae-b74d-bb88a0626cfd',
      directives: [],
      createdTimeMillis: 1669744449603,
      updatedTimeMillis: 1669748151617,
      sampleSpec: {
        connectionName: 'exl',
        path: '/information_schema/sql_sizing_profiles',
        relatedPlugins: [
          {
            schema: {
              type: 'record',
              name: 'outputSchema',
              fields: [
                {
                  name: 'sizing_id',
                  type: ['int', 'null'],
                },
                {
                  name: 'sizing_name',
                  type: ['string', 'null'],
                },
                {
                  name: 'profile_id',
                  type: ['string', 'null'],
                },
                {
                  name: 'required_value',
                  type: ['int', 'null'],
                },
                {
                  name: 'comments',
                  type: ['string', 'null'],
                },
              ],
            },
            plugin: {
              name: 'Postgres',
              type: 'batchsource',
              properties: {
                useConnection: 'true',
                fetchSize: '1000',
                numSplits: '1',
                importQuery: 'SELECT * FROM "information_schema"."sql_sizing_profiles"',
                connection: '${conn(exl)}',
                connectionTimeout: '100',
                referenceName: 'sql_sizing_profiles',
              },
              artifact: {
                name: 'postgresql-plugin',
                version: '1.9.0-SNAPSHOT',
                scope: 'SYSTEM',
              },
            },
          },
          {
            schema: {
              type: 'record',
              name: 'outputSchema',
              fields: [
                {
                  name: 'sizing_id',
                  type: ['int', 'null'],
                },
                {
                  name: 'sizing_name',
                  type: ['string', 'null'],
                },
                {
                  name: 'profile_id',
                  type: ['string', 'null'],
                },
                {
                  name: 'required_value',
                  type: ['int', 'null'],
                },
                {
                  name: 'comments',
                  type: ['string', 'null'],
                },
              ],
            },
            plugin: {
              name: 'Postgres',
              type: 'batchsink',
              properties: {
                useConnection: 'true',
                dbSchemaName: 'information_schema',
                connection: '${conn(exl)}',
                tableName: 'sql_sizing_profiles',
                referenceName: 'sql_sizing_profiles',
              },
              artifact: {
                name: 'postgresql-plugin',
                version: '1.9.0-SNAPSHOT',
                scope: 'SYSTEM',
              },
            },
          },
        ],
      },
      insights: {},
    },
    {
      workspaceName: 'sql_features',
      workspaceId: '7ffca9e9-786a-4297-ad00-78e2d3dc8417',
      directives: [],
      createdTimeMillis: 1669744327469,
      updatedTimeMillis: 1669748151760,
      sampleSpec: {
        connectionName: 'exl',
        path: '/information_schema/sql_features',
        relatedPlugins: [
          {
            schema: {
              type: 'record',
              name: 'outputSchema',
              fields: [
                {
                  name: 'feature_id',
                  type: ['string', 'null'],
                },
                {
                  name: 'feature_name',
                  type: ['string', 'null'],
                },
                {
                  name: 'sub_feature_id',
                  type: ['string', 'null'],
                },
                {
                  name: 'sub_feature_name',
                  type: ['string', 'null'],
                },
                {
                  name: 'is_supported',
                  type: ['string', 'null'],
                },
                {
                  name: 'is_verified_by',
                  type: ['string', 'null'],
                },
                {
                  name: 'comments',
                  type: ['string', 'null'],
                },
              ],
            },
            plugin: {
              name: 'Postgres',
              type: 'batchsource',
              properties: {
                useConnection: 'true',
                fetchSize: '1000',
                numSplits: '1',
                importQuery: 'SELECT * FROM "information_schema"."sql_features"',
                connection: '${conn(exl)}',
                connectionTimeout: '100',
                referenceName: 'sql_features',
              },
              artifact: {
                name: 'postgresql-plugin',
                version: '1.9.0-SNAPSHOT',
                scope: 'SYSTEM',
              },
            },
          },
          {
            schema: {
              type: 'record',
              name: 'outputSchema',
              fields: [
                {
                  name: 'feature_id',
                  type: ['string', 'null'],
                },
                {
                  name: 'feature_name',
                  type: ['string', 'null'],
                },
                {
                  name: 'sub_feature_id',
                  type: ['string', 'null'],
                },
                {
                  name: 'sub_feature_name',
                  type: ['string', 'null'],
                },
                {
                  name: 'is_supported',
                  type: ['string', 'null'],
                },
                {
                  name: 'is_verified_by',
                  type: ['string', 'null'],
                },
                {
                  name: 'comments',
                  type: ['string', 'null'],
                },
              ],
            },
            plugin: {
              name: 'Postgres',
              type: 'batchsink',
              properties: {
                useConnection: 'true',
                dbSchemaName: 'information_schema',
                connection: '${conn(exl)}',
                tableName: 'sql_features',
                referenceName: 'sql_features',
              },
              artifact: {
                name: 'postgresql-plugin',
                version: '1.9.0-SNAPSHOT',
                scope: 'SYSTEM',
              },
            },
          },
        ],
      },
      insights: {},
    },
  ],
};
