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
import T from 'i18n-react';
import LabelComponent from 'components/common/TransformationInputComponents/LabelInputComponent';
import { ITransformationComponentValues } from 'components/WranglerGrid/AddTransformationPanel/types';

interface ICustomTransformationProps {
  setTransformationComponentsValue: React.Dispatch<
    React.SetStateAction<ITransformationComponentValues>
  >;
  transformationComponentValues: ITransformationComponentValues;
}

const PREFIX = 'features.WranglerNewUI.GridPage.transformationUI.customTransform';

export default function({
  setTransformationComponentsValue,
  transformationComponentValues,
}: ICustomTransformationProps) {
  const [customExp, setCustomExp] = useState<string>('');

  useEffect(() => {
    setTransformationComponentsValue({ ...transformationComponentValues, customInput: customExp });
  }, [customExp]);

  return (
    <FormGroup data-testid="form-group-parent">
      <LabelComponent labelText={`${T.translate(`${PREFIX}.typeCustomExpression`)}`} />
      <FormInputFieldComponent
        formInputValue={customExp}
        inputProps={{
          type: 'text',
          value: customExp,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => setCustomExp(e.target.value),
          color: 'primary',
          placeholder: `${T.translate(`${PREFIX}.exampleCustomExpression`)}`,
          inputProps: {
            'data-testid': 'custom-input-value',
          },
        }}
      />
    </FormGroup>
  );
}
