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
import React, { useState, useEffect } from 'react';
import FormInputFieldComponent from 'components/common/TransformationInputComponents/FormInputFieldComponent';
import SelectInputComponent from 'components/common/TransformationInputComponents/SelectInputComponent';
import { SubHeadBoldFont } from 'components/common/TypographyText';
import styled from 'styled-components';
import { ITransformationComponentValues } from 'components/WranglerGrid/AddTransformationPanel/types';
import T from 'i18n-react';

interface ISetCounterActionProps {
  setTransformationComponentsValue: React.Dispatch<
    React.SetStateAction<ITransformationComponentValues>
  >;
  transformationComponentValues: ITransformationComponentValues;
  transformationName: string;
}

const PREFIX = 'features.WranglerNewUI.GridPage.transformationUI.setCounter';

const SET_COUNTER_OPTION = [
  {
    label: 'Always',
    value: 'always',
  },
  {
    label: 'If condition is true',
    value: 'custom',
    isInputRequired: true,
  },
];

const TransformationActionFieldWrapper = styled.div`
  padding-top: 15px;
`;

export default function({
  setTransformationComponentsValue,
  transformationComponentValues,
  transformationName,
}: ISetCounterActionProps) {
  const [filterCondition, setFilterCondition] = useState<string>('always');
  const [filterValue, setFilterValue] = useState<string>('');
  const [counter, setCounter] = useState<number>(1);
  const [counterName, setCounterName] = useState<string>('');

  useEffect(() => {
    setTransformationComponentsValue({
      ...transformationComponentValues,
      filterCondition,
      filterConditionValue: 'true',
      counter,
    });
  }, []);

  useEffect(() => {
    if (filterCondition == 'always') {
      setTransformationComponentsValue({
        ...transformationComponentValues,
        filterCondition,
        filterConditionValue: 'true',
      });
    } else {
      setTransformationComponentsValue({
        ...transformationComponentValues,
        filterCondition,
        filterConditionValue: filterValue,
      });
    }
  }, [filterCondition]);

  useEffect(() => {
    setTransformationComponentsValue({
      ...transformationComponentValues,
      filterConditionValue: filterValue,
    });
  }, [filterValue]);

  useEffect(() => {
    setTransformationComponentsValue({
      ...transformationComponentValues,
      counter,
    });
  }, [counter]);

  useEffect(() => {
    setTransformationComponentsValue({
      ...transformationComponentValues,
      counterName,
    });
  }, [counterName]);

  return (
    <TransformationActionFieldWrapper>
      <SubHeadBoldFont data-testid="set-counter-sub-head">
        {T.translate(`${PREFIX}.selectActionToTake`)}
      </SubHeadBoldFont>
      <SelectInputComponent
        optionSelected={filterCondition}
        setOptionSelected={setFilterCondition}
        options={SET_COUNTER_OPTION}
        checkboxValue={false}
        setCheckboxValue={() => false}
        checkboxLabel={T.translate(`${PREFIX}.encode`).toString()}
        transformation={transformationName}
        customInput={filterValue}
        setCustomInput={setFilterValue}
        customInputPlaceHolder={T.translate(`${PREFIX}.customPlaceholder`).toString()}
      />
      <FormGroup>
        <SubHeadBoldFont data-testid="set-counter-sub-head-two">
          {T.translate(`${PREFIX}.incrementCountBy`)}
        </SubHeadBoldFont>
        <FormInputFieldComponent
          formInputValue={counter}
          inputProps={{
            type: 'number',
            value: counter,
            onChange: (e) => setCounter(Number(e.target.value)),
            color: 'primary',
            placeholder: '',
            'data-testid': 'set-counter-input',
          }}
        />
      </FormGroup>
      <FormGroup>
        <SubHeadBoldFont>{T.translate(`${PREFIX}.nameThisCounter`)}</SubHeadBoldFont>
        <FormInputFieldComponent
          formInputValue={counterName}
          inputProps={{
            type: 'text',
            value: counterName,
            onChange: (e) => setCounterName(e.target.value),
            color: 'primary',
            placeholder: T.translate(`${PREFIX}.enterCounterNamePlaceholder`).toString(),
            'data-testid': 'set-counter-input-two',
          }}
        />
      </FormGroup>
    </TransformationActionFieldWrapper>
  );
}
