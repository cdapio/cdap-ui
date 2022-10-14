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

import React from 'react';
import { render } from '@testing-library/react';
import OngoingDataExploration from '../index';
import MyDataPrepApi from 'api/dataprep';
import operators from 'rxjs/operators';
import { createBrowserHistory as createHistory } from 'history';
import { Route, Router, Switch } from 'react-router';
import { screen } from '@testing-library/react';

const history = createHistory({
  basename: '/',
});

const testObj = {
  connectionName: 'Upload',
  workspaceName: 'Divami_Users_Emails.xlsx',
  recipeSteps: 0,
  dataQuality: 100,
};

test('renders Ongoing Data Exploration component', async () => {
  // jest.mock('api/dataprep', () => {
  //   return Promise.resolve([
  //     { connectionName: 'yolo', workspaceName: 'Divami_Users_Emails.xlsx', recipeSteps: 0 },
  //     { connectionName: 'Upload', workspaceName: 'Divami_Users_Emails.xlsx', recipeSteps: 0 },
  //   ]);
  // });

  jest.spyOn(operators as any, 'switchMap').mockImplementation((callback: Function) => {
    callback({
      message: 'Success',
      count: 1,
      values: [
        {
          workspaceName: 'sql_features',
          workspaceId: '0f622401-5a2f-49c9-9d9e-ae8c707d4475',
          directives: [],
          createdTimeMillis: 1663766821131,
          updatedTimeMillis: 1665582448801,
          sampleSpec: {
            connectionName: 'TESTING',
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
                    connection: '${conn(TESTING)}',
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
                    connection: '${conn(TESTING)}',
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
    });
  });
  jest.spyOn(MyDataPrepApi, 'getWorkspaceList').mockImplementation(() => {
    return {
      pipe: () => {
        return {
          subscribe: (callback) => {
            callback([
              {
                headers: [
                  'feature_id',
                  'feature_name',
                  'sub_feature_id',
                  'sub_feature_name',
                  'is_supported',
                  'is_verified_by',
                  'comments',
                ],
                types: {
                  feature_id: 'String',
                  is_supported: 'String',
                  comments: 'String',
                  feature_name: 'String',
                  sub_feature_id: 'String',
                  sub_feature_name: 'String',
                },
                summary: {
                  statistics: {
                    feature_id: {
                      general: {
                        'non-null': 100,
                      },
                    },
                    is_supported: {
                      general: {
                        'non-null': 100,
                      },
                      types: {
                        Text: 100,
                        Boolean: 100,
                      },
                    },
                    comments: {
                      general: {
                        'non-null': 100,
                        empty: 96.36871,
                      },
                      types: {
                        Text: 2.6536312,
                      },
                    },
                    feature_name: {
                      general: {
                        'non-null': 100,
                      },
                      types: {
                        Text: 71.36871,
                      },
                    },
                    sub_feature_id: {
                      general: {
                        'non-null': 100,
                        empty: 73.463684,
                      },
                      types: {
                        Integer: 26.536312,
                      },
                    },
                    is_verified_by: {
                      general: {
                        null: 100,
                      },
                    },
                    sub_feature_name: {
                      general: {
                        'non-null': 100,
                        empty: 73.463684,
                      },
                      types: {
                        Integer: 0.2793296,
                        Text: 20.111732,
                      },
                    },
                  },
                  validation: {
                    feature_id: {
                      valid: false,
                    },
                    is_supported: {
                      valid: false,
                    },
                    comments: {
                      valid: false,
                    },
                    feature_name: {
                      valid: false,
                    },
                    sub_feature_id: {
                      valid: false,
                    },
                    is_verified_by: {
                      valid: false,
                    },
                    sub_feature_name: {
                      valid: false,
                    },
                  },
                },
                message: 'Success',
                count: 716,
                values: [
                  {
                    feature_id: 'X410',
                    is_supported: 'YES',
                    comments: '',
                    feature_name: 'Alter column data type: XML type',
                    sub_feature_id: '',
                    sub_feature_name: '',
                  },
                ],
              },
            ]);
          },
        };
      },
    };
  });
  render(
    <Router history={history}>
      <Switch>
        <Route>
          <OngoingDataExploration />
        </Route>
      </Switch>
    </Router>
  );
  const ele = screen.getByTestId(/ongoing-data-explore-parent/i);
  expect(ele).toBeInTheDocument();
});
