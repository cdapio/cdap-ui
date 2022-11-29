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

import { FormControl, FormGroup, MenuItem } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { USING_PATTERN_OPTIONS } from 'components/WranglerGrid/TransformationComponents/PatternExtract/options';
import FormInputFieldComponent from 'components/common/TransformationInputComponents/FormInputFieldComponent';
import SelectInputComponent from 'components/common/TransformationInputComponents/SelectInputComponent';
import LabelComponent from 'components/common/TransformationInputComponents/LabelInputComponent';
import StartEndComponent from 'components/WranglerGrid/TransformationComponents/PatternExtract/StartEndPattern';
import CustomComponent from 'components/WranglerGrid/TransformationComponents/PatternExtract/CustomPattern';
import T from 'i18n-react';
import styled from 'styled-components';

const FormGroupWrapper = styled(FormGroup)`
  margin-top: 20px;
`;

export default function({ setTransformationComponentsValue, transformationComponentValues }) {
  const [patternName, setPatternName] = useState('');
  const [startValue, setStartValue] = useState('');
  const [endValue, setEndValue] = useState('');
  const [nDigit, setNDigit] = useState('');
  const [customInput, setCustomInput] = useState('');
  const [checkboxValue, setCheckboxValue] = useState<boolean>(false);

  useEffect(() => {
    setTransformationComponentsValue({
      ...transformationComponentValues,
      extractOptionSelected: patternName,
    });
  }, [patternName]);

  useEffect(() => {
    setTransformationComponentsValue({ ...transformationComponentValues, startValue });
  }, [startValue]);

  useEffect(() => {
    setTransformationComponentsValue({ ...transformationComponentValues, endValue });
  }, [endValue]);

  useEffect(() => {
    setTransformationComponentsValue({ ...transformationComponentValues, nDigit });
  }, [nDigit]);

  useEffect(() => {
    setTransformationComponentsValue({ ...transformationComponentValues, customInput });
  }, [customInput]);

  return (
    <>
      <FormGroupWrapper data-testid="pattern-extract-wrapper">
        <LabelComponent
          labelText={`${T.translate(
            'features.WranglerNewUI.GridPage.transformationUI.extract.selectPattern'
          )}`}
        />
        <SelectInputComponent
          optionSelected={patternName}
          setOptionSelected={setPatternName}
          options={USING_PATTERN_OPTIONS}
          customInput={customInput}
          setCustomInput={setCustomInput}
          customInputPlaceHolder={''}
          checkboxValue={checkboxValue}
          setCheckboxValue={setCheckboxValue}
          checkboxLabel={``}
        />
      </FormGroupWrapper>
      {patternName === 'ndigitnumber' && (
        <FormGroupWrapper>
          <LabelComponent
            labelText={`${T.translate(
              'features.WranglerNewUI.GridPage.transformationUI.extract.extractNumber'
            )}`}
          />
          <FormInputFieldComponent
            formInputValue={nDigit}
            inputProps={{
              type: 'number',
              value: nDigit,
              onChange: (e) => setNDigit(e.target.value),
              color: 'primary',
              placeholder: `${T.translate(
                'features.WranglerNewUI.GridPage.transformationUI.extract.examplePatternPlaceholder'
              )}`,
              inputProps: {
                'data-testid': 'custom-pattern-regex',
              },
            }}
            label={`${T.translate(
              'features.WranglerNewUI.GridPage.transformationUI.extract.digits'
            )}`}
          />
        </FormGroupWrapper>
      )}
      {patternName === 'startend' && (
        <StartEndComponent
          setStartValue={setStartValue}
          startValue={startValue}
          endValue={endValue}
          setEndValue={setEndValue}
        />
      )}
      {patternName === 'custom' && (
        <CustomComponent setCustomInput={setCustomInput} customInput={customInput} />
      )}
    </>
  );
}
