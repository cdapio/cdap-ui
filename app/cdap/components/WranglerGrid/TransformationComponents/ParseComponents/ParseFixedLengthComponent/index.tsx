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
import FormInputFieldComponent from 'components/common/TransformationInputComponents/FormInputFieldComponent';
import ParseComponent from 'components/WranglerGrid/TransformationComponents/ParseComponents';
import { IParseCSVProps } from 'components/WranglerGrid/TransformationComponents/ParseComponents/types';
import {
  COLUMN_WIDTHS,
  COLUMN_WIDTHS_PLACEHOLDER,
  PADDING,
  PADDING_PLACEHOLDER,
  PARSE_AS_FIXED_LENGTH,
} from 'components/WranglerGrid/TransformationComponents/ParseComponents/constants';
import React, { useEffect, useState } from 'react';
import { SubHeadNormalFont } from 'components/common/TypographyText';

export default function({
  setTransformationComponentsValue,
  transformationComponentValues,
}: IParseCSVProps) {
  const [columnWidths, setColumnWidths] = useState<string>('');
  const [padding, setPadding] = useState<string>('');

  useEffect(() => {
    setTransformationComponentsValue({
      ...transformationComponentValues,
      columnWidths,
    });
  }, [columnWidths]);

  useEffect(() => {
    setTransformationComponentsValue({
      ...transformationComponentValues,
      optionPaddingParam: padding,
    });
  }, [padding]);

  return (
    <ParseComponent sectionHeading={PARSE_AS_FIXED_LENGTH}>
      <FormGroup>
        <SubHeadNormalFont>{COLUMN_WIDTHS}</SubHeadNormalFont>
        <FormInputFieldComponent
          formInputValue={columnWidths}
          inputProps={{
            type: 'number',
            value: columnWidths,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setColumnWidths(e.target.value),
            color: 'primary',
            placeholder: COLUMN_WIDTHS_PLACEHOLDER,
          }}
        />
        <SubHeadNormalFont>{PADDING}</SubHeadNormalFont>
        <FormInputFieldComponent
          formInputValue={padding}
          inputProps={{
            type: 'number',
            value: padding,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setPadding(e.target.value),
            color: 'primary',
            placeholder: PADDING_PLACEHOLDER,
          }}
        />
      </FormGroup>
    </ParseComponent>
  );
}
