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
import { Box } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import FormInputFieldComponent from 'components/common/TransformationInputComponents/FormInputFieldComponent';
import { SubHeadBoldFont } from 'components/common/TypographyText';
import { ITransformationComponentValues } from 'components/WranglerGrid/AddTransformationPanel/types';
import styled from 'styled-components';
import T from 'i18n-react';

const Wrapper = styled(Box)`
  margin-top: 20px;
`;

interface IFillNullOrEmptyProps {
  setTransformationComponentsValue: React.Dispatch<
    React.SetStateAction<ITransformationComponentValues>
  >;
  transformationComponentValues: ITransformationComponentValues;
}

const PREFIX = 'features.WranglerNewUI.GridPage.transformationUI.fillNullOrEmpty';

export default function({
  setTransformationComponentsValue,
  transformationComponentValues,
}: IFillNullOrEmptyProps) {
  const [replaceValue, setReplaceValue] = useState('');

  useEffect(() => {
    setTransformationComponentsValue({
      ...transformationComponentValues,
      customInput: replaceValue,
    });
  }, [replaceValue]);

  return (
    <Wrapper>
      <SubHeadBoldFont data-testid="null-empty-sub-header">
        {T.translate(`${PREFIX}.fillNullEmpty`)}
      </SubHeadBoldFont>
      <FormInputFieldComponent
        formInputValue={replaceValue}
        inputProps={{
          type: 'text',
          value: replaceValue,
          onChange: (e) => setReplaceValue(e.target.value),
          color: 'primary',
          placeholder: `${T.translate(`${PREFIX}.fillInputPlaceholder`)}`,
          'data-testid': 'form-input-fill-null-empty-input',
          inputProps: {
            'data-testid': 'fill-null-empty-input',
          },
        }}
      />
    </Wrapper>
  );
}
