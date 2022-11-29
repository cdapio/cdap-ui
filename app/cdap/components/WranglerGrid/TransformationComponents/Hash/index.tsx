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

import { Box, FormGroup } from '@material-ui/core';
import SelectInputComponent from 'components/common/TransformationInputComponents/SelectInputComponent';
import { ITransformationComponentValues } from 'components/WranglerGrid/AddTransformationPanel/types';
import T from 'i18n-react';
import React, { useEffect, useState } from 'react';
import { HASH_ALGORITHM_OPTIONS } from 'components/WranglerGrid/TransformationComponents/Hash/options';
import InputCheckbox from 'components/common/TransformationInputComponents/InputCheckbox';
import styled from 'styled-components';
import { SubHeadBoldFont } from 'components/common/TypographyText';

const PREFIX = `features.WranglerNewUI.GridPage.transformationUI.hash`;

interface IHashProps {
  transformationComponentValues: ITransformationComponentValues;
  setTransformationComponentsValue: React.Dispatch<
    React.SetStateAction<ITransformationComponentValues>
  >;
  functionName: string;
}

const CustomizedLabel = styled(SubHeadBoldFont)`
  font-style: normal;
  margin-top: 10px;
  line-height: 150%;
  letter-spacing: 0.15px;
  margin-bottom: 10px;
`;

export default function({
  setTransformationComponentsValue,
  functionName,
  transformationComponentValues,
}: IHashProps) {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>(
    HASH_ALGORITHM_OPTIONS[0].value
  );
  const [encode, setEncode] = useState<boolean>(false);

  useEffect(() => {
    setTransformationComponentsValue({
      ...transformationComponentValues,
      hashValue: selectedAlgorithm,
    });
  }, []);

  useEffect(() => {
    setTransformationComponentsValue({
      ...transformationComponentValues,
      hashValue: selectedAlgorithm,
    });
  }, [selectedAlgorithm]);

  useEffect(() => {
    setTransformationComponentsValue({ ...transformationComponentValues, encode });
  }, [encode]);

  return (
    <FormGroup data-testid="hash-container">
      <Box>
        <CustomizedLabel>{T.translate(`${PREFIX}.selectHashAlgorithm`)}</CustomizedLabel>
      </Box>
      <SelectInputComponent
        optionSelected={selectedAlgorithm}
        setOptionSelected={setSelectedAlgorithm}
        options={HASH_ALGORITHM_OPTIONS}
        checkboxValue={encode}
        setCheckboxValue={setEncode}
        checkboxLabel={T.translate(`${PREFIX}.encode`).toString()}
        transformation={functionName}
      />
      <InputCheckbox
        label={T.translate(`${PREFIX}.encode`).toString()}
        value={encode}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEncode(e.target.checked)}
        inputProps={{
          'data-testid': `hash-encode-checkbox`,
        }}
      />
    </FormGroup>
  );
}
