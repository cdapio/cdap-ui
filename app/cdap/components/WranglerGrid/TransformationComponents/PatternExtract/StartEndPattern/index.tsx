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
import FormInputFieldComponent from 'components/common/TransformationInputComponents/FormInputFieldComponent';
import LabelComponent from 'components/common/TransformationInputComponents/LabelInputComponent';
import { FormGroup } from '@material-ui/core';
import T from 'i18n-react';

export default function({ setStartValue, setEndValue, endValue, startValue }) {
  return (
    <FormGroup>
      <LabelComponent
        labelText={`${T.translate(
          'features.WranglerNewUI.GridPage.transformationUI.extract.extractTextStart'
        )}`}
      />
      <FormInputFieldComponent
        formInputValue={startValue}
        inputProps={{
          type: 'text',
          value: startValue,
          onChange: (e) => setStartValue(e.target.value),
          color: 'primary',
          placeholder: `${T.translate(
            'features.WranglerNewUI.GridPage.transformationUI.extract.startPlaceholder'
          )}`,
          inputProps: {
            'data-testid': 'custom-input-start-value',
          },
        }}
      />
      <LabelComponent
        labelText={`${T.translate(
          'features.WranglerNewUI.GridPage.transformationUI.extract.extractTextEnd'
        )}`}
      />
      <FormInputFieldComponent
        formInputValue={endValue}
        inputProps={{
          type: 'text',
          value: endValue,
          onChange: (e) => setEndValue(e.target.value),
          color: 'primary',
          placeholder: `${T.translate(
            'features.WranglerNewUI.GridPage.transformationUI.extract.endPlaceholder'
          )}`,
          inputProps: {
            'data-testid': 'custom-input-end-value',
          },
        }}
      />
    </FormGroup>
  );
}
