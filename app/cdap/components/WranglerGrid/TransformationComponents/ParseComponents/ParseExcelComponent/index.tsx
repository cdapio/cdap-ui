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

import { FormGroup } from '@material-ui/core';
import FormInputFieldComponent from 'components/common/TransformationInputComponents/FormInputFieldComponent';
import { PARSE_EXCEL_OPTIONS } from 'components/WranglerGrid/TransformationComponents/ParseComponents/options';
import ParseComponent from 'components/WranglerGrid/TransformationComponents/ParseComponents';
import { ISetTransformationValues } from 'components/WranglerGrid/TransformationComponents/ParseComponents/types';
import {
  CHOOSE_SHEET_IN_EXCEL,
  SET_FIRST_ROW_AS_HEADER,
  SHEET_NAME_PLACEHOLDER,
  SHEET_NUMBER_PLACEHOLDER,
} from 'components/WranglerGrid/TransformationComponents/ParseComponents/constants';
import InputCheckbox from 'components/common/TransformationInputComponents/InputCheckbox';
import React, { useEffect, useState } from 'react';
import InputRadioWithCustomInputComponent from 'components/common/TransformationInputComponents/InputRadioWithCustomInputComponent';

export default function({
  setTransformationComponentsValue,
  transformationComponentValues,
}: ISetTransformationValues) {
  const [sheetRadioType, setSheetRadioType] = useState<string>('sheetNumber');
  const [sheetValue, setSheetValue] = useState<string>('');
  const [firstRowAsHeader, setFirstRowAsHeader] = useState<boolean>(false);
  const [customInput, setCustomInput] = useState<string>('');

  useEffect(() => {
    setTransformationComponentsValue({
      ...transformationComponentValues,
      radioOption: sheetRadioType,
    });
  }, [sheetRadioType]);

  useEffect(() => {
    setTransformationComponentsValue({ ...transformationComponentValues, sheetValue });
  }, [sheetValue]);

  useEffect(() => {
    setTransformationComponentsValue({ ...transformationComponentValues, firstRowAsHeader });
  }, [firstRowAsHeader]);

  return (
    <ParseComponent sectionHeading={CHOOSE_SHEET_IN_EXCEL}>
      <FormGroup>
        <InputRadioWithCustomInputComponent
          options={PARSE_EXCEL_OPTIONS}
          radioValue={sheetRadioType}
          setRadioValue={setSheetRadioType}
          customInputType=""
          customInput={customInput}
          setCustomInput={setCustomInput}
        />
        <FormInputFieldComponent
          formInputValue={sheetValue}
          inputProps={{
            type: sheetRadioType === 'sheetNumber' ? 'number' : 'text',
            value: sheetValue,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setSheetValue(e.target.value),
            color: 'primary',
            placeholder:
              sheetRadioType === 'sheetNumber' ? SHEET_NUMBER_PLACEHOLDER : SHEET_NAME_PLACEHOLDER,
          }}
        />
        <InputCheckbox
          label={SET_FIRST_ROW_AS_HEADER}
          value={firstRowAsHeader}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFirstRowAsHeader(e.target.checked)
          }
          inputProps={{
            'data-testid': 'parse-input-checkbox',
          }}
        />
      </FormGroup>
    </ParseComponent>
  );
}
