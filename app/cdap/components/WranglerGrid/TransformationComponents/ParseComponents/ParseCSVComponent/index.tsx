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
import { PARSE_CSV_OPTIONS } from 'components/WranglerGrid/TransformationComponents/ParseComponents/options';
import ParseComponent from 'components/WranglerGrid/TransformationComponents/ParseComponents';
import InputRadioWithCustomInputComponent from 'components/common/TransformationInputComponents/InputRadioWithCustomInputComponent';
import { ISetTransformationValues } from 'components/WranglerGrid/TransformationComponents/ParseComponents/types';
import {
  CUSTOM_DELIMITER,
  PLEASE_SELECT_THE_DELIMITER,
  SET_FIRST_ROW_AS_HEADER,
} from 'components/WranglerGrid/TransformationComponents/ParseComponents/constants';
import InputCheckbox from 'components/common/TransformationInputComponents/InputCheckbox';
import React, { useEffect, useState } from 'react';

export default function({
  setTransformationComponentsValue,
  transformationComponentValues,
}: ISetTransformationValues) {
  const [selectedParseType, setSelectedParseType] = useState<string>('');
  const [firstRowAsHeader, setFirstRowAsHeader] = useState<boolean>(false);
  const [delimiter, setDelimiter] = useState<string>('');

  useEffect(() => {
    setTransformationComponentsValue({
      ...transformationComponentValues,
      radioOption: selectedParseType,
    });
  }, [selectedParseType]);

  useEffect(() => {
    setTransformationComponentsValue({
      ...transformationComponentValues,
      customInput: delimiter,
    });
  }, [delimiter]);

  useEffect(() => {
    setTransformationComponentsValue({
      ...transformationComponentValues,
      firstRowAsHeader,
    });
  }, [firstRowAsHeader]);

  return (
    <ParseComponent sectionHeading={PLEASE_SELECT_THE_DELIMITER}>
      <>
        <InputRadioWithCustomInputComponent
          options={PARSE_CSV_OPTIONS}
          radioValue={selectedParseType}
          setRadioValue={setSelectedParseType}
          customInputType={CUSTOM_DELIMITER}
          customInput={delimiter}
          setCustomInput={setDelimiter}
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
      </>
    </ParseComponent>
  );
}
