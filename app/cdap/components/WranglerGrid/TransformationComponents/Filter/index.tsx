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

import React, { useState, useEffect } from 'react';
import SelectInput from 'components/common/TransformationInputComponents/SelectInputComponent';
import InputRadioWithCustomInputComponent from 'components/common/TransformationInputComponents/InputRadioWithCustomInputComponent';
import T from 'i18n-react';
import LabelComponent from 'components/common/TransformationInputComponents/LabelInputComponent';
import { FormGroup, Box } from '@material-ui/core';
import {
  FILTER_RADIO_OPTION,
  FILTER_OPTIONS,
  FILTER_PLACEHOLDER,
} from 'components/WranglerGrid/TransformationComponents/Filter/options';
import { ITransformationComponentValues } from 'components/WranglerGrid/AddTransformationPanel/types';
import { SubHeadBoldFont } from 'components/common/TypographyText';
import styled from 'styled-components';

interface IFilterProps {
  setTransformationComponentsValue: React.Dispatch<
    React.SetStateAction<ITransformationComponentValues>
  >;
  transformationComponentValues: ITransformationComponentValues;
}

const BoxWrapper = styled(Box)`
  margin-top: 20px;
`;

export default function({
  setTransformationComponentsValue,
  transformationComponentValues,
}: IFilterProps) {
  const [radioOption, setRadioOption] = useState<string>('KEEP');
  const [optionSelected, setOptionSelected] = useState<string>('EMPTY');
  const [ignoreCase, setIgnoreCase] = useState<boolean>(false);
  const [customInput, setCustomInput] = useState<string>('');

  useEffect(() => {
    setTransformationComponentsValue({
      ...transformationComponentValues,
      filterRadioOption: radioOption,
      filterOptionSelected: optionSelected,
    });
  }, []);

  useEffect(() => {
    setTransformationComponentsValue({
      ...transformationComponentValues,
      filterRadioOption: radioOption,
    });
  }, [radioOption]);

  useEffect(() => {
    setTransformationComponentsValue({
      ...transformationComponentValues,
      filterOptionSelected: optionSelected,
    });
  }, [optionSelected]);

  useEffect(() => {
    setTransformationComponentsValue({
      ...transformationComponentValues,
      filterOptionValue: customInput,
    });
  }, [customInput]);

  useEffect(() => {
    setTransformationComponentsValue({ ...transformationComponentValues, ignoreCase });
  }, [ignoreCase]);

  return (
    <BoxWrapper data-testid="filter-parent-wrapper">
      <SubHeadBoldFont data-testid="subheader-select-action">
        {`${T.translate('features.WranglerNewUI.GridPage.transformationUI.filter.selectAction')}`}
      </SubHeadBoldFont>
      <FormGroup>
        <InputRadioWithCustomInputComponent
          options={FILTER_RADIO_OPTION}
          radioValue={radioOption}
          setRadioValue={setRadioOption}
          customInputType="customFormat"
          customInput={customInput}
          setCustomInput={setCustomInput}
        />
      </FormGroup>
      <FormGroup>
        <LabelComponent
          labelText={`${T.translate('features.WranglerNewUI.GridPage.transformationUI.filter.if')}`}
        />
        <SelectInput
          optionSelected={optionSelected}
          setOptionSelected={setOptionSelected}
          options={FILTER_OPTIONS}
          customInput={customInput}
          setCustomInput={setCustomInput}
          customInputPlaceHolder={FILTER_PLACEHOLDER[optionSelected]}
          checkboxValue={ignoreCase}
          setCheckboxValue={setIgnoreCase}
          checkboxLabel={`${T.translate(
            'features.WranglerNewUI.GridPage.transformationUI.filter.ignoreCase'
          )}`}
          transformation="filter"
        />
      </FormGroup>
    </BoxWrapper>
  );
}
