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

import {
  IComplexTypeNames,
  ISimpleType,
  ILogicalTypeNames,
} from 'components/AbstractWidget/SchemaEditor/SchemaTypes';
import {
  logicalTypeToSimpleTypeMap,
  AvroSchemaTypesEnum,
  getDefaultEmptyAvroSchema,
} from 'components/AbstractWidget/SchemaEditor/SchemaConstants';
import cloneDeep from 'lodash/cloneDeep';
import { objectQuery } from 'services/helpers';
import { isObject } from 'vega-lite/build/src/util';

const displayTypes: (ISimpleType | IComplexTypeNames | ILogicalTypeNames)[] = [
  AvroSchemaTypesEnum.ARRAY,
  AvroSchemaTypesEnum.ENUM,
  AvroSchemaTypesEnum.MAP,
  AvroSchemaTypesEnum.RECORD,
  AvroSchemaTypesEnum.UNION,
  AvroSchemaTypesEnum.BOOLEAN,
  AvroSchemaTypesEnum.BYTES,
  AvroSchemaTypesEnum.DATE,
  AvroSchemaTypesEnum.DATETIME,
  AvroSchemaTypesEnum.DECIMAL,
  AvroSchemaTypesEnum.DOUBLE,
  AvroSchemaTypesEnum.FLOAT,
  AvroSchemaTypesEnum.INT,
  AvroSchemaTypesEnum.LONG,
  AvroSchemaTypesEnum.STRING,
  AvroSchemaTypesEnum.TIME,
  AvroSchemaTypesEnum.TIMESTAMPMICROS,
  AvroSchemaTypesEnum.DATE,
  AvroSchemaTypesEnum.TIMEMICROS,
  AvroSchemaTypesEnum.DECIMAL,
];

/**
 * Checks if the current avro type is nullable.
 * @param type any avro type (simple/complex types).
 */
const isNullable = (type) => {
  if (Array.isArray(type)) {
    return type.find((t) => t === 'null') === 'null';
  }
  return false;
};

const isUnion = (type) => {
  return Array.isArray(type) && !isNullable(type);
};
/**
 * If the type is nullable get the non-null type for further processing.
 * @param type any valid avro type
 */
const getNonNullableType = (type) => {
  if (Array.isArray(type) && !isUnion(type)) {
    const nonNullTypes = type.filter((t) => t !== 'null');
    if (nonNullTypes.length === 1 && type.length - 1 === nonNullTypes.length) {
      return nonNullTypes[0];
    }
  }
  return type;
};
/**
 * Helps in getting the simple type or underlying type in a logical type.
 * @param type valid simple/logical avro type
 */
const getSimpleType = (type) => {
  if (typeof type === AvroSchemaTypesEnum.STRING) {
    return type;
  }
  if (type && type.logicalType) {
    return logicalTypeToSimpleTypeMap[type.logicalType];
  }
  return type;
};
/**
 * Utility to check if the current type is a complex type to tranverse further
 * into the schema tree.
 * @param complexType any valid complex avro type. (map, array, record, union and enum)
 */
const isComplexType = (complexType) => {
  const nullable = isNullable(complexType);
  let type = complexType;
  if (nullable) {
    type = complexType.filter((t) => t !== 'null').pop();
  }
  if (typeof type === AvroSchemaTypesEnum.STRING) {
    return false;
  }
  switch (type.type) {
    case AvroSchemaTypesEnum.RECORD:
    case AvroSchemaTypesEnum.ENUM:
    case AvroSchemaTypesEnum.ARRAY:
    case AvroSchemaTypesEnum.MAP:
      return true;
    default:
      return isUnion(complexType) ? true : false;
  }
};

const isDisplayTypeLogical = ({ type }) => {
  switch (type) {
    case AvroSchemaTypesEnum.DECIMAL:
    case AvroSchemaTypesEnum.DATE:
    case AvroSchemaTypesEnum.DATETIME:
    case AvroSchemaTypesEnum.TIME:
    case AvroSchemaTypesEnum.TIMESTAMP:
      return true;
    default:
      return false;
  }
};

const isDisplayTypeComplex = ({ type }) => {
  switch (type) {
    case AvroSchemaTypesEnum.RECORD:
    case AvroSchemaTypesEnum.ENUM:
    case AvroSchemaTypesEnum.UNION:
    case AvroSchemaTypesEnum.MAP:
    case AvroSchemaTypesEnum.ARRAY:
      return true;
    default:
      return isDisplayTypeLogical({ type }) || false;
  }
};

/**
 * Utility function to get the complex type names.
 * @param complexType any valid complex avro type.
 */
const getComplexTypeName = (complexType): IComplexTypeNames => {
  const c = complexType;
  let type;
  if (isNullable(complexType)) {
    type = complexType.filter((t) => t !== 'null').pop();
    type = type.type;
  } else {
    type = cloneDeep(c.type);
  }
  switch (type) {
    case AvroSchemaTypesEnum.RECORD:
    case AvroSchemaTypesEnum.ENUM:
    case AvroSchemaTypesEnum.ARRAY:
    case AvroSchemaTypesEnum.MAP:
      return type;
    default:
      return isUnion(c) ? AvroSchemaTypesEnum.UNION : undefined;
  }
};

const isFlatRowTypeComplex = (typeName: AvroSchemaTypesEnum) => {
  switch (typeName) {
    case AvroSchemaTypesEnum.STRING:
    case AvroSchemaTypesEnum.BOOLEAN:
    case AvroSchemaTypesEnum.BYTES:
    case AvroSchemaTypesEnum.DOUBLE:
    case AvroSchemaTypesEnum.FLOAT:
    case AvroSchemaTypesEnum.INT:
    case AvroSchemaTypesEnum.LONG:
    case AvroSchemaTypesEnum.STRING:
      return false;
    default:
      return true;
  }
};

const isNoSchemaAvailable = (schema) => {
  let avroSchema = schema;
  if (avroSchema) {
    avroSchema = avroSchema.schema;
    if (typeof avroSchema === 'string') {
      try {
        avroSchema = JSON.parse(avroSchema);
      } catch (e) {
        return true;
      }
    }
    return !objectQuery(avroSchema, 'fields', 'length');
  }
  return true;
};

const parseImportedSchemas = (schemas) => {
  let importedSchemas = schemas;
  if (typeof schemas === 'string') {
    importedSchemas = JSON.parse(schemas);
  }

  if (!Array.isArray(importedSchemas)) {
    // This will be the case when we hit 'Apply' button from wrangler.
    // We don't maintain consistency in importing schemas from multiple
    // sources. This will take time to fix as we right now throw schemas
    // in multiple formats across all places.
    if (isObject(importedSchemas) && !importedSchemas.hasOwnProperty('schema')) {
      importedSchemas = { name: 'etlSchemaBody', schema: importedSchemas };
    }
    importedSchemas = [importedSchemas];
  }

  const newSchemas = importedSchemas.map((schema) => {
    if (typeof schema !== 'object' && schema.hasOwnProperty('schema')) {
      return { ...getDefaultEmptyAvroSchema() };
    }
    const s = { ...schema };

    if (typeof schema.schema === 'string') {
      s.schema = JSON.parse(schema.schema);
    }
    if (!s.schema || s.schema.type !== 'record' || !Array.isArray(s.schema.fields)) {
      throw new Error('Imported schema is not a valid Avro schema');
    }
    if (s.schema.name) {
      s.schema.name = s.schema.name.replace('.', '.type');
    }
    return s;
  });

  return newSchemas;
};

export {
  isNullable,
  isUnion,
  isComplexType,
  getNonNullableType,
  getComplexTypeName,
  displayTypes,
  getSimpleType,
  isFlatRowTypeComplex,
  isDisplayTypeLogical,
  isDisplayTypeComplex,
  isNoSchemaAvailable,
  parseImportedSchemas,
};
