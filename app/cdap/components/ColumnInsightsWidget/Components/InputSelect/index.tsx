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

import { MenuItem, Select } from '@material-ui/core';
import RenderLabel from 'components/ColumnInsights/Components/common/RenderLabel';
import React from 'react';
import styled from 'styled-components';

interface IInputSelect {
  options: IOption[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fullWidth: boolean;
  defaultValue: string;
  type: string;
  classes?: any;
}

interface IOption {
  value: string;
  label: string;
}

const CustomizedInputSelect = styled(Select)`
  width: 350px;
  height: 40px;
  background: #ffffff;
  border: 1px solid #dadce0;
  border-radius: 4px;
  padding: 2px 15px;
  font-size: 14px;
  margin-top: 9px;
  display: block;

  &:before {
    display: none;
  }

  &:focus-visible {
    outline: none !important;
  }

  &:after {
    display: none;
  }

  & .select:focus {
    background-color: transparent;
  }
  & .iconStyles {
    top: calc(50% - 10px);
    right: 8px;
  }
`;

export default function({ options, value, onChange, fullWidth, defaultValue, type }: IInputSelect) {
  return (
    <CustomizedInputSelect
      classes={{ select: 'select', icon: 'iconStyles' }}
      fullWidth={fullWidth}
      value={value}
      onChange={onChange}
      displayEmpty={false}
      defaultValue={defaultValue}
      MenuProps={{
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'left',
        },
        getContentAnchorEl: null,
      }}
      data-testid={`input-select-${type}`}
    >
      {options &&
        options.map((option: IOption, index: number) => {
          return (
            <MenuItem value={option.value} key={option.value} data-testid={`select-${index}`}>
              <RenderLabel dataTestId={`select-option-${option.label}`}>
                <>{option.label}</>
              </RenderLabel>
            </MenuItem>
          );
        })}
    </CustomizedInputSelect>
  );
}
