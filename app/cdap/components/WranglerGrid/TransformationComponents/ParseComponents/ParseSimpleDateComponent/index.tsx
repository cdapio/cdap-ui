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
import { PARSE_SIMPLE_DATE_OPTIONS } from 'components/WranglerGrid/TransformationComponents/ParseComponents/options';
import ParseComponent from 'components/WranglerGrid/TransformationComponents/ParseComponents';
import InputRadioWithCustomInputComponent from 'components/common/TransformationInputComponents/InputRadioWithCustomInputComponent';
import { ISetTransformationValues } from 'components/WranglerGrid/TransformationComponents/ParseComponents/types';
import { PLEASE_SELECT_THE_DATE_FORMAT } from 'components/WranglerGrid/TransformationComponents/ParseComponents/constants';
import React, { useEffect, useState } from 'react';

export default function({
  setTransformationComponentsValue,
  transformationComponentValues,
}: ISetTransformationValues) {
  const [customFormat, setCustomFormat] = useState<string>('');
  const [selectedParseType, setSelectedParseType] = useState<string>('');

  useEffect(() => {
    setTransformationComponentsValue({
      ...transformationComponentValues,
      radioOption: selectedParseType,
    });
  }, [selectedParseType]);

  useEffect(() => {
    setTransformationComponentsValue({
      ...transformationComponentValues,
      customInput: customFormat,
    });
  }, [customFormat]);

  return (
    <ParseComponent sectionHeading={PLEASE_SELECT_THE_DATE_FORMAT}>
      <InputRadioWithCustomInputComponent
        options={PARSE_SIMPLE_DATE_OPTIONS}
        radioValue={selectedParseType}
        setRadioValue={setSelectedParseType}
        customInputType="customFormat"
        customInput={customFormat}
        setCustomInput={setCustomFormat}
      />
    </ParseComponent>
  );
}
