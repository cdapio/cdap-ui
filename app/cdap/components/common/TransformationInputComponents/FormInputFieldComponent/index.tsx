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

import React from 'react';
import { InputComponent } from 'components/common/InputFieldComponent';
import { FormControlLabelComponent } from 'components/common/FormComponents';
import { string } from 'prop-types';

interface IInputProps {
  [key: string]: string;
}

interface IInput {
  type: 'text' | 'number';
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  color: 'primary' | 'secondary';
  placeholder: string;
  inputProps?: IInputProps;
}

interface IFormInputFieldComponentProps {
  formInputValue: string | number;
  inputProps: IInput;
}

export default function({ formInputValue, inputProps }: IFormInputFieldComponentProps) {
  return (
    <FormControlLabelComponent
      value={formInputValue}
      control={<InputComponent {...inputProps} />}
      label={''}
    />
  );
}
