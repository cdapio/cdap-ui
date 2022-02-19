/*
 * Copyright © 2020 Cask Data, Inc.
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
const simpleSchema = require('./data/simple-schema.json');
const simpleSchema2 = require('./data/simpleSchema.json');
const simpleSchema3 = require('./data/simpleSchema3.json');
const largeSchema = require('./data/large-schema.json');
const largeSchema2 = require('./data/schema-10k.json');

const schemaWithName = {
  name: 'etlSchemaBody',
  schema: {
    name: 'etlSchemaBody',
    type: 'record',
    fields: [
      {
        name: 'new_field',
        type: 'string',
      },
    ],
  },
};
const schemaWithModifiedType = {
  name: 'etlSchemaBody',
  schema: {
    name: 'etlSchemaBody',
    type: 'record',
    fields: [
      {
        name: 'new_field',
        type: 'boolean',
      },
    ],
  },
};

const schemaWithMap = {
  name: 'etlSchemaBody',
  schema: {
    name: 'etlSchemaBody',
    type: 'record',
    fields: [
      {
        name: 'new_field',
        type: {
          type: 'map',
          keys: 'string',
          values: 'string',
        },
      },
    ],
  },
};

const schemaWithNestedRecordName = {
  name: 'etlSchemaBody',
  schema: {
    name: 'etlSchemaBody',
    type: 'record',
    fields: [
      {
        name: 'Record1',
        type: {
          type: 'record',
          name: 'Record1',
          fields: [{
            name: 'Record1',
            type: {
              type: 'record',
              name: 'Record1.Record1',
              fields: [{
                name: 'stringfield',
                type: 'string'
              }]
            }
          }]
        }
      }
    ]
  }
}

export {
  schemaWithMap,
  schemaWithName,
  schemaWithModifiedType,
  simpleSchema,
  simpleSchema2,
  simpleSchema3,
  largeSchema,
  largeSchema2,
  schemaWithNestedRecordName,
};
