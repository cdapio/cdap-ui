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
import ParseComponent from 'components/WranglerGrid/TransformationComponents/ParseComponents/index';
import { ISetTransformationValues } from 'components/WranglerGrid/TransformationComponents/ParseComponents/types';
import {
  DEPTH,
  DEPTH_PLACEHOLDER,
  PARSE_AS_XML_TO_JSON,
} from 'components/WranglerGrid/TransformationComponents/ParseComponents/constants';
import React, { useEffect, useState } from 'react';
import { SubHeadNormalFont } from 'components/common/TypographyText';

export default function({
  setTransformationComponentsValue,
  transformationComponentValues,
}: ISetTransformationValues) {
  const [depth, setDepth] = useState<number>(1);

  useEffect(() => {
    setTransformationComponentsValue({ ...transformationComponentValues, depth });
  }, [depth]);

  return (
    <ParseComponent sectionHeading={PARSE_AS_XML_TO_JSON}>
      <FormGroup>
        <SubHeadNormalFont>{DEPTH}</SubHeadNormalFont>
        <FormInputFieldComponent
          formInputValue={depth}
          inputProps={{
            type: 'number',
            value: depth,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setDepth(Number(e.target.value)),
            color: 'primary',
            placeholder: DEPTH_PLACEHOLDER,
          }}
        />
      </FormGroup>
    </ParseComponent>
  );
}
