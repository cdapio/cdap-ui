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

import { FormControl, FormGroup, Radio, RadioGroup } from '@material-ui/core';
import FormInputFieldComponent from 'components/common/TransformationInputComponents/FormInputFieldComponent';
import InputCheckbox from 'components/common/TransformationInputComponents/InputCheckbox';
import {
  ADD,
  COPY_TO_NEW_COLUMN,
  DESTINATION_COLUMN,
  ENTER_STRING,
} from 'components/GridTable/constants';
import { CONCATENATE_OPTIONS } from 'components/WranglerGrid/TransformationComponents/ParseComponents/options';
import {
  ISetTransformationValues,
  ISubMenuOption,
} from 'components/WranglerGrid/TransformationComponents/ParseComponents/types';
import React, { useEffect, useState } from 'react';
import {
  CustomizedFormControlRadio,
  CustomizedFormLabel,
} from 'components/WranglerGrid/TransformationComponents/Concatenate/styles';

export default function({
  setTransformationComponentsValue,
  transformationComponentValues,
}: ISetTransformationValues) {
  const [placement, setPlacement] = useState<string>('');
  const [stringValue, setStringValue] = useState<string>('');
  const [copy, setCopy] = useState<boolean>(false);
  const [columnName, setColumnName] = useState<string>('');
  useEffect(() => {
    setTransformationComponentsValue({
      ...transformationComponentValues,
      radioOption: placement,
    });
  }, [placement]);

  useEffect(() => {
    setTransformationComponentsValue({
      ...transformationComponentValues,
      customInput: stringValue,
    });
  }, [stringValue]);

  useEffect(() => {
    setTransformationComponentsValue({
      ...transformationComponentValues,
      copyToNewColumn: copy,
    });
  }, [copy]);

  useEffect(() => {
    setTransformationComponentsValue({
      ...transformationComponentValues,
      copyColumnName: columnName,
    });
  }, [columnName]);

  return (
    <>
      <FormGroup>
        <CustomizedFormLabel data-testid='concentrate-form-label'>{ADD}</CustomizedFormLabel>
        <FormControl>
          <FormInputFieldComponent
            formInputValue={stringValue}
            inputProps={{
              type: 'text',
              value: stringValue,
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => setStringValue(e.target.value),
              color: 'primary',
              placeholder: ENTER_STRING,
              'data-testid':'concentrate-input-text'
            }}
          />
          <RadioGroup
            name="actions"
            value={placement}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPlacement(e.target.value)}
            data-testid="concentrate-radio-group"
          >
            {CONCATENATE_OPTIONS.map((eachRadio: ISubMenuOption) => (
              <CustomizedFormControlRadio
                value={eachRadio.value}
                control={<Radio color="primary" />}
                label={eachRadio.label}
              />
            ))}
          </RadioGroup>
        </FormControl>
        <InputCheckbox
          label={COPY_TO_NEW_COLUMN}
          value={copy}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCopy(e.target.checked)}
          inputProps={{
            'data-testid': 'copy-to-new-column-checkbox',
          }}
        />
      </FormGroup>
      {copy && (
        <FormGroup>
          <FormInputFieldComponent
            formInputValue={columnName}
            inputProps={{
              type: 'text',
              value: columnName,
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => setColumnName(e.target.value),
              color: 'primary',
              placeholder: DESTINATION_COLUMN,
              inputProps: {
                'data-testid': 'copy-to-new-column-custom-input',
              },
            }}
          />
        </FormGroup>
      )}
    </>
  );
}
