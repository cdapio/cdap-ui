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
import rxjs from 'rxjs/operators';
import { Route, Router, Switch } from 'react-router';
import { createBrowserHistory as createHistory } from 'history';

const history = createHistory({
  basename: '/',
});

describe('Testing Ongoing Data Exploration Component', () => {
  jest.spyOn(rxjs, 'switchMap' as any).mockImplementation((callback: any) => {
    callback({
      message: 'Success',
      count: 31,
      values: [
        {
          workspaceName: 'sql_implementation_info',
          workspaceId: '0cbc0f7b-c554-4bbb-ad3a-74fe147dfe3b',
          directives: [],
          createdTimeMillis: 1663072234554,
          updatedTimeMillis: 1663681848374,
          sampleSpec: {
            connectionName: 'postgres1',
            path: '/information_schema/sql_implementation_info',
            relatedPlugins: [
              {
                schema: {
                  type: 'record',
                  name: 'outputSchema',
                  fields: [
                    {
                      name: 'implementation_info_id',
                      type: ['string', 'null'],
                    },
                    {
                      name: 'implementation_info_name',
                      type: ['string', 'null'],
                    },
                    {
                      name: 'integer_value',
                      type: ['int', 'null'],
                    },
                    {
                      name: 'character_value',
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
                    connection: '${conn(postgres1)}',
                    tableName: 'sql_implementation_info',
                    referenceName: 'sql_implementation_info',
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
                      name: 'implementation_info_id',
                      type: ['string', 'null'],
                    },
                    {
                      name: 'implementation_info_name',
                      type: ['string', 'null'],
                    },
                    {
                      name: 'integer_value',
                      type: ['int', 'null'],
                    },
                    {
                      name: 'character_value',
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
                    importQuery: 'SELECT * FROM "information_schema"."sql_implementation_info"',
                    connection: '${conn(postgres1)}',
                    connectionTimeout: '100',
                    referenceName: 'sql_implementation_info',
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

  it('Should check if the component is rendered', () => {
    jest.spyOn(MyDataPrepApi, 'getWorkspaceList').mockImplementation(() => {
      return {
        pipe: () => {
          return {
            subscribe: (callback) => {
              callback([
                {
                  headers: [
                    'implementation_info_id',
                    'implementation_info_name',
                    'integer_value',
                    'character_value',
                    'comments',
                  ],
                  types: {
                    character_value: 'String',
                    comments: 'String',
                    implementation_info_name: 'String',
                    implementation_info_id: 'String',
                    integer_value: 'Int',
                  },
                  summary: {
                    statistics: {
                      character_value: {
                        general: {
                          'non-null': 50,
                          null: 50,
                          empty: 25,
                        },
                        types: {
                          Text: 16.666668,
                        },
                      },
                      comments: {
                        general: {
                          'non-null': 50,
                          null: 50,
                        },
                        types: {
                          Text: 16.666668,
                        },
                      },
                      implementation_info_name: {
                        general: {
                          'non-null': 100,
                        },
                        types: {
                          Text: 100,
                        },
                      },
                      implementation_info_id: {
                        general: {
                          'non-null': 100,
                        },
                        types: {
                          Integer: 100,
                          'Zip Code': 16.666668,
                          ZipCode: 16.666668,
                        },
                      },
                      integer_value: {
                        general: {
                          'non-null': 41.666664,
                          null: 58.333332,
                        },
                      },
                    },
                    validation: {
                      character_value: {
                        valid: false,
                      },
                      comments: {
                        valid: false,
                      },
                      implementation_info_name: {
                        valid: false,
                      },
                      implementation_info_id: {
                        valid: false,
                      },
                      integer_value: {
                        valid: false,
                      },
                    },
                  },
                  message: 'Success',
                  count: 12,
                  values: [
                    {
                      implementation_info_name: 'CATALOG NAME',
                      character_value: 'Y',
                      implementation_info_id: '10003',
                    },
                    {
                      implementation_info_name: 'COLLATING SEQUENCE',
                      implementation_info_id: '10004',
                    },
                    {
                      implementation_info_name: 'CURSOR COMMIT BEHAVIOR',
                      implementation_info_id: '23',
                      comments: 'close cursors and retain prepared statements',
                      integer_value: '1',
                    },
                    {
                      implementation_info_name: 'DATA SOURCE NAME',
                      character_value: '',
                      implementation_info_id: '2',
                    },
                    {
                      implementation_info_name: 'DBMS NAME',
                      character_value: 'PostgreSQL',
                      implementation_info_id: '17',
                    },
                    {
                      implementation_info_name: 'DEFAULT TRANSACTION ISOLATION',
                      implementation_info_id: '26',
                      comments: 'READ COMMITTED; user-settable',
                      integer_value: '2',
                    },
                    {
                      implementation_info_name: 'IDENTIFIER CASE',
                      implementation_info_id: '28',
                      comments: 'stored in mixed case - case sensitive',
                      integer_value: '3',
                    },
                    {
                      implementation_info_name: 'NULL COLLATION',
                      implementation_info_id: '85',
                      comments: 'nulls higher than non-nulls',
                      integer_value: '0',
                    },
                    {
                      implementation_info_name: 'SERVER NAME',
                      character_value: '',
                      implementation_info_id: '13',
                    },
                    {
                      implementation_info_name: 'SPECIAL CHARACTERS',
                      character_value: '',
                      implementation_info_id: '94',
                      comments: 'all non-ASCII characters allowed',
                    },
                    {
                      implementation_info_name: 'TRANSACTION CAPABLE',
                      implementation_info_id: '46',
                      comments: 'both DML and DDL',
                      integer_value: '2',
                    },
                    {
                      implementation_info_name: 'DBMS VERSION',
                      character_value: '12.07.0000',
                      implementation_info_id: '18',
                    },
                  ],
                },
              ]);
            },
          };
        },
      };
    });
    const container = render(
      <Router history={history}>
        <Switch>
          <Route>
            <OngoingDataExploration />
          </Route>
        </Switch>
      </Router>
    );
    expect(container).toBeDefined();
  });
});
