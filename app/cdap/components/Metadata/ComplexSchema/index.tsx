/*
 * Copyright © 2021 Cask Data, Inc.
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

import React, { useEffect, useState } from 'react';
import T from 'i18n-react';
import styled from 'styled-components';
import { SCHEMA_TYPES, getSchemaState } from 'components/Metadata/ComplexSchema/helper';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

const I18N_PREFIX = 'features.MetadataSummary';

const SchemaTable = styled.table`
  width: 100%;
  tr > th {
    padding: 6px 0;
  }
  tr > td:first-child,
  tr > th:first-child {
    padding-left: 10px;
    padding-right: 10px;
  }
  tr > td:nth-child(2n) {
    width: 90px;
  }
  tr > td:nth-child(3n) {
    width: 50px;
  }
`;

const FieldRow = styled.tr`
  box-shadow: 2px 0 2px 0 rgb(1 0 0 / 20%);
  ${({ hasError }) => hasError && `border: solid 2px var(--danger);`}
  ${({ isNotNested }) => isNotNested && `box-shadow: none; border-top: solid 1px var(--grey06);`}
`;

const FieldInput = styled(Input)`
  width: 100%;
  color: var(--grey02) !important;
  :before {
    border: none !important;
  }
`;

const FieldSelect = styled(Select)`
  width: 100%;
  color: var(--grey02) !important;
  :before {
    border: none !important;
  }
`;

const ErrorText = styled.td`
  color: var(--danger);
`;

interface ISchema {
  type: string;
  name: string;
  fields: { [key: string]: string };
  getFields: () => {};
}

interface IInputProps {
  recordName: string;
  isRecordSchema: boolean;
  typeIndex: string;
  parentFormatOutput: () => void;
  isDisabled: boolean;
  schemaPrefix: string;
  derivedDatasetId: string;
  isInputSchema: boolean;
  isInStudio: boolean;
  errors: { [key: string]: string };
}

interface IComplexSchemaProps {
  schema: ISchema;
  inputProps: IInputProps;
}

const ComplexSchema: React.FC<IComplexSchemaProps> = ({ schema, inputProps }) => {
  const initialState = {
    parsedSchema: [],
    emptySchema: false,
    error: '',
    disabledTooltip: null,
    updateDefault: false,
    model: {},
  };
  const [schemaState, setSchemaState] = useState(initialState);

  useEffect(() => {
    const updatedState = getSchemaState(schema, inputProps);
    setSchemaState(updatedState);
    if (typeof inputProps.parentFormatOutput === 'function') {
      setTimeout(
        inputProps.parentFormatOutput.bind(null, { updateDefault: updatedState.updateDefault }),
        0
      );
    }
  }, [schema, inputProps]);

  return (
    <>
      {(!schemaState.emptySchema || !inputProps.isDisabled) && (
        <fieldset disabled={inputProps.isDisabled}>
          <SchemaTable className={inputProps.isDisabled ? 'disabled' : ''}>
            <tbody>
              <tr>
                <th>{T.translate(`${I18N_PREFIX}.schemaName`)}</th>
                <th>{T.translate(`${I18N_PREFIX}.schemaType`)}</th>
                <th>{T.translate(`${I18N_PREFIX}.schemaNull`)}</th>
              </tr>
              {inputProps.isInStudio &&
                inputProps.isDisabled &&
                schemaState.disabledTooltip.trim() !== '' && (
                  <tr>
                    <td colSpan={3}>{schemaState.disabledTooltip}</td>
                  </tr>
                )}
              {schemaState.error.trim() !== '' && (
                <tr>
                  <ErrorText colSpan={3}>{schemaState.error}</ErrorText>
                </tr>
              )}
              {schemaState.parsedSchema.map((field, index) => (
                <React.Fragment key={field.id}>
                  <FieldRow hasError={inputProps.errors[field.name]} isNotNested={!field.nested}>
                    <td>
                      <FieldInput
                        id={field.id}
                        value={field.name}
                        aria-label={T.translate(`${I18N_PREFIX}.schemaName`)}
                        data-cy={`schema-row-field-name-input-${index}}`}
                        data-testid={`schema-row-field-name-input-${index}}`}
                        placeholder={T.translate(`${I18N_PREFIX}.fieldName`)}
                        disabled={inputProps.isDisabled}
                      />
                    </td>
                    <td>
                      <FieldSelect
                        data-cy="schema-row-type-select-{{$index}}"
                        data-testid="schema-row-type-select-{{$index}}"
                        value={field.displayType}
                        disabled={inputProps.isDisabled}
                      >
                        {SCHEMA_TYPES.types.map((option) => (
                          <MenuItem value={option} key={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </FieldSelect>
                    </td>
                    <td>
                      <Checkbox
                        disabled={inputProps.isDisabled}
                        inputProps={{
                          'aria-label': '' + T.translate(`${I18N_PREFIX}.fieldActions`),
                        }}
                        checked={field.nullable}
                      />
                    </td>
                  </FieldRow>
                  {inputProps.errors[field.name] && (
                    <tr>
                      <ErrorText colSpan={3}>{inputProps.errors[field.name]}</ErrorText>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </SchemaTable>
        </fieldset>
      )}
      {schemaState.emptySchema && inputProps.isDisabled && (
        <p>{T.translate(`${I18N_PREFIX}.emptySchema`)}</p>
      )}
    </>
  );
};

export default ComplexSchema;
