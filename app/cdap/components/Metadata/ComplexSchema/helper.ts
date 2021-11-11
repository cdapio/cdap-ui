import cdapavsc from 'services/cdapavscwrapper';
import uuidV4 from 'uuid/v4';
import T from 'i18n-react';
const I18N_PREFIX = 'features.MetadataSummary';

interface ISchemaState {
  parsedSchema: ISchemaType[];
  emptySchema: boolean;
  error: string;
  disabledTooltip: string;
  updateDefault: boolean;
  model: { [key: string]: any };
}

interface ISchemaTypeBase {
  displayType: string;
  type: any;
  nullable: boolean;
  nested: boolean;
}

interface ISchemaType extends ISchemaTypeBase {
  id: string;
  name: string;
  collapse: boolean;
}

interface IOutput {
  error: string;
  updateDefault: boolean;
  model: { [key: string]: any };
}

/**
 * Method to parse schema field type.
 *
 * @param type - Field type
 * @returns parsed type
 */
export function parseType(type: any): ISchemaTypeBase {
  let storedType = type;
  let nullable = false;
  if (type.getTypeName() === 'union:wrapped') {
    const typesArr = type.getTypes();
    if (typesArr[1] && typesArr[1].getTypeName() === 'null') {
      storedType = typesArr[0];
      type = typesArr[0].getTypeName();
      nullable = true;
    } else {
      type = 'union';
    }
  } else {
    type = type.getTypeName();
  }
  type = cdapavsc.getDisplayType(type);
  return {
    displayType: type,
    type: storedType,
    nullable,
    nested: checkComplexType(type),
  };
}

/**
 * Method to check if field type is of complex.
 *
 * @param displayType - Field type
 * @returns true or false
 */
export function checkComplexType(displayType: string) {
  return ['array', 'enum', 'map', 'record', 'union'].includes(displayType.toLowerCase());
}

/**
 * Method to check if the given schema is empty.
 *
 * @param schema - Field type
 * @returns true or false
 */
export function isEmptySchema(schema: any) {
  if (!schema) {
    return true;
  }
  // we need to check if schemaJson has fields or is already returned by avsc parser in which case the fields will be
  // accessed using getFields() function.
  if (
    Object.prototype.toString.call(schema) === '[object Object]' &&
    !(schema.fields || (schema.getFields && schema.getFields()) || []).length
  ) {
    return true;
  }
  return false;
}

/**
 * Method to parse given schema.
 *
 * @param schema - schema
 * @param inputProps - schema
 * @returns parsed schema
 */
export function getSchemaState(schema: any, inputProps): ISchemaState {
  let schemaState = {
    parsedSchema: [],
    emptySchema: false,
    error: '',
    disabledTooltip: null,
    model: {},
    updateDefault: false,
  };
  let recordName: string;
  const id = uuidV4();
  if (isEmptySchema(schema) && inputProps.isDisabled) {
    schemaState.emptySchema = true;
    return schemaState;
  }
  // TODO(CDAP-13010): for splitters, the backend returns port names similar to [schemaName].string or [schemaName].int.
  // However, some weird parsing code in the avsc library doesn't allow primitive type names to be after periods(.),
  // so we have to manually make this change here. Ideally the backend should provide a different syntax for port
  // names so that we don't have to do this hack in the UI.
  if (schema.name) {
    schema.name = schema.name.replace('.', '.type');
  }
  const parsed = cdapavsc.parse(schema, { wrapUnions: true });
  recordName = inputProps.recordName || parsed._name;

  const updatedSchema = parsed.getFields().map((field) => {
    const type = field.getType();
    const partialObj = parseType(type);
    return Object.assign({}, partialObj, {
      id,
      name: field.getName(),
      collapse: true,
    });
  });
  schemaState = {
    ...schemaState,
    parsedSchema: updatedSchema,
    ...formatOutput(updatedSchema, recordName, true),
  };
  if (inputProps.derivedDatasetId) {
    schemaState.disabledTooltip = T.translate(`${I18N_PREFIX}.derivedDataset`, {
      derivedDatasetId: inputProps.derivedDatasetId,
    });
  }
  if (inputProps.isInputSchema) {
    schemaState.disabledTooltip = T.translate(`${I18N_PREFIX}.inputSchema`);
  }
  return schemaState;
}

function formatOutput(schema: ISchemaType[], recordName: string, updateDefault = false): IOutput {
  let error = '';
  let modelObj = {};
  const outputFields = schema
    .filter((field) => {
      return field.name && field.type ? true : false;
    })
    .map((field) => {
      const formatType = cdapavsc.formatType(field.type);
      return {
        name: field.name,
        type: field.nullable ? [formatType, 'null'] : formatType,
      };
    });
  if (outputFields.length > 0) {
    modelObj = {
      type: 'record',
      name:
        recordName ||
        `a${uuidV4()
          .split('-')
          .join('')}`,
      fields: outputFields,
    };
    // Validate
    try {
      cdapavsc.parse(modelObj, { wrapUnions: true });
    } catch (e) {
      const errArr = e.toString().split(':');
      error = `${errArr[0]}: ${errArr[1]}`;
      return;
    }
    if (!error) {
      modelObj = modelObj;
    }
  }
  return {
    model: modelObj,
    error,
    updateDefault,
  };
}

export const SCHEMA_TYPES = {
  types: [
    'boolean',
    'bytes',
    'date',
    'double',
    'decimal',
    'float',
    'int',
    'long',
    'string',
    'time',
    'timestamp',
    'array',
    'enum',
    'map',
    'union',
    'record',
  ],
  simpleTypes: [
    'decimal',
    'boolean',
    'bytes',
    'date',
    'double',
    'float',
    'int',
    'long',
    'string',
    'time',
    'timestamp',
  ],
};
