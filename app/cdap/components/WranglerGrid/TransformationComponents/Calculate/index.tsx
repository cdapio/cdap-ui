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
import { CALCULATE_OPTIONS } from 'components/WranglerGrid/NestedMenu/menuOptions/calculateOptions';
import FormInputFieldComponent from 'components/common/TransformationInputComponents/FormInputFieldComponent';
import { Box, FormGroup } from '@material-ui/core';
import InputCheckbox from 'components/common/TransformationInputComponents/InputCheckbox';
import T from 'i18n-react';
import NewColumnInput from 'components/common/TransformationInputComponents/NewColumnInput';
import { SubHeadBoldFont } from 'components/common/TypographyText';
import { FlexAlignCenter } from 'components/common/BoxContainer';
import { FormGroupFullWidthComponent } from 'components/common/FormComponents';
import styled from 'styled-components';
import { ITransformationComponentValues } from 'components/WranglerGrid/AddTransformationPanel/types';

interface ICalculateProps {
  transformationName: string;
  setTransformationComponentsValue: React.Dispatch<
    React.SetStateAction<ITransformationComponentValues>
  >;
  transformationComponentValues: ITransformationComponentValues;
}

const CalculateWrapper = styled(Box)`
  margin: 10px 0 0;
`;

const CalculateSignWrapper = styled(Box)`
  margin-right: 5px;
`;

const CALCULATE_PREFIX = 'features.WranglerNewUI.GridPage.transformationUI.calculate';

export default function({
  transformationName,
  setTransformationComponentsValue,
  transformationComponentValues,
}: ICalculateProps) {
  const [customInput, setCustomInput] = useState<string>('');
  const [copyToNewColumn, setCopyToNew] = useState<boolean>(false);
  const [column, setColumnName] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const CALCULATE_UI_INPUT =
    CALCULATE_OPTIONS?.length > 0
      ? CALCULATE_OPTIONS.filter((option) => option?.value === transformationName)
      : [];
  useEffect(() => {
    setTransformationComponentsValue({ ...transformationComponentValues, customInput });
  }, [customInput]);
  useEffect(() => {
    setTransformationComponentsValue({ ...transformationComponentValues, copyToNewColumn });
  }, [copyToNewColumn]);
  useEffect(() => {
    if (
      transformationComponentValues?.columnNames?.filter((name: string) => name === column).length
    ) {
      setIsError(true);
    } else {
      setIsError(false);
    }
    setTransformationComponentsValue({ ...transformationComponentValues, copyColumnName: column });
  }, [column]);

  return (
    <CalculateWrapper>
      {CALCULATE_UI_INPUT?.length > 0 &&
        CALCULATE_UI_INPUT.map((item) =>
          item.value === 'CHARCOUNT' ? (
            <NewColumnInput column={column} setColumnName={setColumnName} isError={isError} />
          ) : (
            item.inputRequired && (
              <Box>
                <SubHeadBoldFont>
                  {item?.sign &&
                    `${T.translate(`${CALCULATE_PREFIX}.enterValueTo`)} ${transformationName}`}
                </SubHeadBoldFont>
                <FlexAlignCenter>
                  {item?.sign && (
                    <CalculateSignWrapper>
                      <SubHeadBoldFont>{item?.sign}</SubHeadBoldFont>
                    </CalculateSignWrapper>
                  )}
                  <FormGroupFullWidthComponent>
                    <FormInputFieldComponent
                      formInputValue={customInput}
                      inputProps={{
                        type: 'number',
                        value: customInput,
                        onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                          setCustomInput(e.target.value),
                        color: 'primary',
                        placeholder: `${T.translate(`${CALCULATE_PREFIX}.examplePlaceholder`)}`,
                        inputProps: {
                          'data-testid': `calculate-input-value`,
                        },
                      }}
                    />
                  </FormGroupFullWidthComponent>
                </FlexAlignCenter>
              </Box>
            )
          )
        )}
      {transformationName !== 'CHARCOUNT' && (
        <FormGroup>
          <InputCheckbox
            label={`${T.translate(`${CALCULATE_PREFIX}.copyToNewColumn`)}`}
            value={copyToNewColumn}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCopyToNew(e.target.checked)}
            inputProps={{
              'data-testid': `copy-to-new-column`,
            }}
          />
          {copyToNewColumn && (
            <NewColumnInput column={column} setColumnName={setColumnName} isError={isError} />
          )}
        </FormGroup>
      )}
    </CalculateWrapper>
  );
}
