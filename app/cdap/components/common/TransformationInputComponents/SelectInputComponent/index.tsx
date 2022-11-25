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
import React, { useState } from 'react';
import { MenuItem, FormControl, Select, FormGroup } from '@material-ui/core';
import FormInputFieldComponent from 'components/common/TransformationInputComponents/FormInputFieldComponent';
import InputCheckbox from 'components/common/TransformationInputComponents/InputCheckbox';
import styled from 'styled-components';
import { grey } from '@material-ui/core/colors';

interface ISelectOptions {
  label: string;
  value: string;
  isInputRequired?: boolean;
  isCheckboxRequired?: boolean;
  directive?: (condition: string, column: string, ignoreCase: boolean, textValue: string) => string;
}

interface ISelectColumnProps {
  optionSelected: string;
  setOptionSelected: React.Dispatch<React.SetStateAction<string>>;
  options: ISelectOptions[];
  customInput: string;
  setCustomInput: React.Dispatch<React.SetStateAction<string>>;
  customInputPlaceHolder: string;
  checkboxValue: boolean;
  setCheckboxValue: React.Dispatch<React.SetStateAction<boolean>>;
  checkboxLabel: string;
  transformation?: string;
}

const SelectFormControlWrapper = styled(FormControl)`
  width: calc(100% - 60px);
  margin: 0 60px 5px 0;
  border: 1px solid #dadce0;
  height: 40px;
  padding: 5px 15px;
  fontsize: 14px;
  background: #ffffff;
  border-radius: 4px;
`;

const SelectInputRoot = styled(Select)`
  color: ${grey[700]};
  & .MuiSelect-select:focus {
    background: transparent;
  }
  &:before {
    border: none;
  }
`;

export default function({
  optionSelected,
  setOptionSelected,
  options,
  customInput,
  setCustomInput,
  customInputPlaceHolder,
  checkboxValue,
  setCheckboxValue,
  checkboxLabel,
  transformation,
}: ISelectColumnProps) {
  const [inputRequired, setInputRequired] = useState<boolean | undefined>(false);
  const [checkboxRequired, setCheckboxRequired] = useState<boolean | undefined>(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOptionSelected(event.target.value);
  };

  const onOptionClick = (item: ISelectOptions) => {
    setInputRequired(item?.isInputRequired);
    setCheckboxRequired(item?.isCheckboxRequired);
  };

  return (
    <>
      <SelectFormControlWrapper>
        <SelectInputRoot
          value={optionSelected}
          onChange={handleChange}
          disableUnderline
          inputProps={{
            'data-testid': 'select-filter-option',
          }}
        >
          {options?.length > 0 &&
            options.map((optionItem, optionIndex) => (
              <MenuItem
                onClick={() => onOptionClick(optionItem)}
                value={optionItem.value}
                data-testid={`select-option-list-${optionIndex}`}
              >
                {optionItem.label}
              </MenuItem>
            ))}
        </SelectInputRoot>
      </SelectFormControlWrapper>
      {inputRequired && (
        <FormGroup>
          <FormInputFieldComponent
            formInputValue={customInput}
            inputProps={{
              type: 'text',
              value: customInput,
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => setCustomInput(e.target.value),
              color: 'primary',
              placeholder: customInputPlaceHolder,
              inputProps: {
                'data-testid': `${transformation}-custom-input`,
              },
            }}
          />
          {checkboxRequired && (
            <InputCheckbox
              label={checkboxLabel}
              value={checkboxValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setCheckboxValue(e.target.checked)
              }
              inputProps={{
                'data-testid': `${transformation}-checkbox`,
              }}
            />
          )}
        </FormGroup>
      )}
    </>
  );
}
