/*
 * Copyright © 2024 Cask Data, Inc.
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

import _cloneDeep from 'lodash/cloneDeep';
import { GLOBALS } from 'services/global-constants';

export function formatSchemaToAvro(schema) {
  const typeMap = 'map<string, string>';
  const mapObj = {
    type: 'map',
    keys: 'string',
    values: 'string'
  };
  let fields = [];
  let outputSchema;

  if (typeof schema === 'string') {
    try {
      outputSchema = JSON.parse(schema);
    } catch (e) {
      console.log('ERROR: Parsing schema JSON ', e);
      return schema;
    }
  } else if (schema === null || typeof schema === 'undefined' ) {
    return '';
  } else {
    outputSchema = _cloneDeep(schema);
  }

  if (outputSchema.name && outputSchema.type && outputSchema.fields) {
    return JSON.stringify(outputSchema);
  }

  fields = Object.keys(outputSchema).map(field => {
    if (outputSchema[field] === typeMap) {
      return {
        name: field,
        type: mapObj
      };
    }
    return {
      name: field,
      type: outputSchema[field]
    };
  });

  return JSON.stringify({
    name: outputSchema.name || GLOBALS.defaultSchemaName,
    type: outputSchema.type || 'record',
    fields: outputSchema.fields || fields
  });
}