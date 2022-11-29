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
import { FormGroup, Box } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import FormInputFieldComponent from 'components/common/TransformationInputComponents/FormInputFieldComponent';
import InputRadioWithCustomInputComponent from 'components/common/TransformationInputComponents/InputRadioWithCustomInputComponent';
import SwapVertIcon from '@material-ui/icons/SwapVert';
import { SubHeadBoldFont } from 'components/common/TypographyText';
import T from 'i18n-react';
import NewColumnInput from 'components/common/TransformationInputComponents/NewColumnInput';
import styled from 'styled-components';

const Wrapper = styled(Box)`
  margin-top: 20px;
`;

const SwapIconWrapper = styled(Box)`
  cursor: pointer;
  text-align: center;
  width: calc(100% - 60px);
  margin-bottom: 10px;
  margin-top: 5px;
`;

const PREFIX = 'features.WranglerNewUI.GridPage.transformationUI.joinColumn';

const JOIN_COLUMN_OPTIONS = [
  {
    label: `${T.translate(`${PREFIX}.comma`)}`,
    value: ',',
  },
  {
    label: `${T.translate(`${PREFIX}.pipe`)}`,
    value: '|',
  },
  {
    label: `${T.translate(`${PREFIX}.colon`)}`,
    value: ':',
  },
  {
    label: `${T.translate(`${PREFIX}.period`)}`,
    value: '.',
  },
  {
    label: `${T.translate(`${PREFIX}.dash`)}`,
    value: '-',
  },
  {
    label: `${T.translate(`${PREFIX}.underscore`)}`,
    value: '_',
  },
  {
    label: `${T.translate(`${PREFIX}.space`)}`,
    value: `' '`,
  },
  {
    label: `${T.translate(`${PREFIX}.custom`)}`,
    value: 'custom',
  },
];

export default function({ setTransformationComponentsValue, transformationComponentValues }) {
  const [customFormat, setCustomFormat] = useState('');
  const [selectedParseType, setSelectedParseType] = useState('');
  const [firstColumn, setFirstColumn] = useState('');
  const [secondColumn, setSecondColumn] = useState('');
  const [newColumn, setNewColumn] = useState('');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setFirstColumn(transformationComponentValues.firstColumn);
  }, [transformationComponentValues.firstColumn]);

  useEffect(() => {
    setSecondColumn(transformationComponentValues.secondColumn);
  }, [transformationComponentValues.secondColumn]);

  useEffect(() => {
    setFirstColumn(transformationComponentValues.firstColumn);
    setSecondColumn(transformationComponentValues.secondColumn);
  }, []);

  useEffect(() => {
    setTransformationComponentsValue({ ...transformationComponentValues, firstColumn });
  }, [firstColumn]);
  useEffect(() => {
    setTransformationComponentsValue({ ...transformationComponentValues, secondColumn });
  }, [secondColumn]);
  useEffect(() => {
    if (
      transformationComponentValues?.columnNames?.filter((name: string) => name === newColumn)
        .length
    ) {
      setIsError(true);
    } else {
      setIsError(false);
    }
    setTransformationComponentsValue({
      ...transformationComponentValues,
      copyColumnName: newColumn,
    });
  }, [newColumn]);
  useEffect(() => {
    setTransformationComponentsValue({
      ...transformationComponentValues,
      customInput: customFormat,
    });
  }, [customFormat]);
  useEffect(() => {
    setTransformationComponentsValue({
      ...transformationComponentValues,
      radioOption: selectedParseType,
    });
  }, [selectedParseType]);

  const handleChange = () => {
    setTransformationComponentsValue({
      ...transformationComponentValues,
      secondColumn: firstColumn,
      firstColumn: secondColumn,
    });
    setFirstColumn(secondColumn);
    setSecondColumn(firstColumn);
  };

  return (
    <Wrapper>
      <SubHeadBoldFont data-testid="join-column-head-font">
        {T.translate(`${PREFIX}.setOrder`)}
      </SubHeadBoldFont>
      <FormInputFieldComponent
        formInputValue={firstColumn}
        inputProps={{
          type: 'text',
          value: firstColumn,
          color: 'primary',
          placeholder: '',
          disabled: true,
        }}
      />
      <SwapIconWrapper onClick={handleChange} data-testid="join-column-swap-icon-wrapper">
        <SwapVertIcon />
      </SwapIconWrapper>
      <FormInputFieldComponent
        formInputValue={secondColumn}
        inputProps={{
          type: 'text',
          value: secondColumn,
          color: 'primary',
          placeholder: '',
          disabled: true,
        }}
      />
      <Wrapper>
        <SubHeadBoldFont data-testid="join-column-sub-head">
          {T.translate(`${PREFIX}.chooseDelimiter`)}
        </SubHeadBoldFont>
        <InputRadioWithCustomInputComponent
          options={JOIN_COLUMN_OPTIONS}
          radioValue={selectedParseType}
          setRadioValue={setSelectedParseType}
          customInputType="custom"
          customInput={customFormat}
          setCustomInput={setCustomFormat}
        />
      </Wrapper>
      <NewColumnInput column={newColumn} setColumnName={setNewColumn} isError={isError} />
    </Wrapper>
  );
}
