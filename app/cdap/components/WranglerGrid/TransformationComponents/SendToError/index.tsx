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
import T from 'i18n-react';
import LabelComponent from 'components/common/TransformationInputComponents/LabelInputComponent';
import { FormGroup, Box } from '@material-ui/core';
import {
  SEND_TO_ERROR_OPTIONS,
  SEND_TO_ERROR_PLACEHOLDER,
} from 'components/WranglerGrid/TransformationComponents/SendToError/options';
import { ITransformationComponentValues } from 'components/WranglerGrid/AddTransformationPanel/types';
import styled from 'styled-components';

interface ISendToErrorProps {
  setTransformationComponentsValue: React.Dispatch<
    React.SetStateAction<ITransformationComponentValues>
  >;
  transformationComponentValues: ITransformationComponentValues;
}

const PREFIX = 'features.WranglerNewUI.GridPage.transformationUI.sendToError';

const SendToErrorWrapper = styled(Box)`
  display: block;
  margin-top: 10px;
`;

const FormGroupWrapper = styled(FormGroup)`
  width: 100%;
`;

export default function({
  setTransformationComponentsValue,
  transformationComponentValues,
}: ISendToErrorProps) {
  const [optionSelected, setOptionSelected] = useState<string>('EMPTY');
  const [ignoreCase, setIgnoreCase] = useState<boolean>(false);
  const [customInput, setCustomInput] = useState<string>('');

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
    <SendToErrorWrapper data-testid="send-to-error-wrapper">
      <FormGroupWrapper>
        <LabelComponent labelText={`${T.translate(`${PREFIX}.if`)}`} />
        <SelectInput
          optionSelected={optionSelected}
          setOptionSelected={setOptionSelected}
          options={SEND_TO_ERROR_OPTIONS}
          customInput={customInput}
          setCustomInput={setCustomInput}
          customInputPlaceHolder={SEND_TO_ERROR_PLACEHOLDER[optionSelected]}
          checkboxValue={ignoreCase}
          setCheckboxValue={setIgnoreCase}
          checkboxLabel={`${T.translate(`${PREFIX}.ignoreCase`)}`}
          transformation="send-to-error"
        />
      </FormGroupWrapper>
    </SendToErrorWrapper>
  );
}
