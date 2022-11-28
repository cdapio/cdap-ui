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
import InputRadioWithCustomInputComponent from 'components/common/TransformationInputComponents/InputRadioWithCustomInputComponent';
import { FormGroup } from '@material-ui/core';
import T from 'i18n-react';
import { ITransformationComponentValues } from 'components/WranglerGrid/AddTransformationPanel/types';
import { SubHeadBoldFont } from 'components/common/TypographyText';
import styled from 'styled-components';

export interface IDelimiterExtractProps {
  setTransformationComponentsValue: React.Dispatch<
    React.SetStateAction<ITransformationComponentValues>
  >;
  transformationComponentValues: ITransformationComponentValues;
}

const FormGroupWrapper = styled(FormGroup)`
  margin-top: 20px;
`;

const PREFIX = 'features.WranglerNewUI.GridPage.transformationUI.explode';
const DELIMITER_OPTION_EXPLODE = [
  {
    value: ',',
    label: `${T.translate(`${PREFIX}.explodeDelimiterOptions.comma`)}`,
  },
  {
    value: '\\t',
    label: `${T.translate(`${PREFIX}.explodeDelimiterOptions.tab`)}`,
  },
  {
    value: '\\s+',
    label: `${T.translate(`${PREFIX}.explodeDelimiterOptions.whitespace`)}`,
  },
  {
    value: '\\|',
    label: `${T.translate(`${PREFIX}.explodeDelimiterOptions.pipe`)}`,
  },
  {
    value: 'customDelimiter',
    label: `${T.translate(`${PREFIX}.explodeDelimiterOptions.customDelimiter`)}`,
  },
];

export default function({
  setTransformationComponentsValue,
  transformationComponentValues,
}: IDelimiterExtractProps) {
  const [selectedParseType, setSelectedParseType] = useState<string>('');
  const [delimiter, setDelimiter] = useState<string>('');

  useEffect(() => {
    setTransformationComponentsValue((prevState) => ({
      ...prevState,
      radioOption: selectedParseType,
    }));
  }, [selectedParseType]);

  useEffect(() => {
    setTransformationComponentsValue((prevState) => ({ ...prevState, customInput: delimiter }));
  }, [delimiter]);

  return (
    <FormGroupWrapper>
      <SubHeadBoldFont>{T.translate(`${PREFIX}.selectDelimiter`)}</SubHeadBoldFont>
      <InputRadioWithCustomInputComponent
        options={DELIMITER_OPTION_EXPLODE}
        radioValue={selectedParseType}
        setRadioValue={setSelectedParseType}
        customInputType="customDelimiter"
        customInput={delimiter}
        setCustomInput={setDelimiter}
      />
    </FormGroupWrapper>
  );
}
