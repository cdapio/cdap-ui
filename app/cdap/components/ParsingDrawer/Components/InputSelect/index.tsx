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
import { MenuItem, Select } from '@material-ui/core';
import { IInputSelectProps } from 'components/ParsingDrawer/types';
import styled from 'styled-components';

const SelectField = styled(Select)`
  height: 40px;
  background: #ffffff;
  border: 1px solid #dadce0;
  border-radius: 4px;
  padding: 5px 15px 0px 15px;
  font-size: 14px;
  &:before {
    display: none;
  }
  &:focus-visible {
    outline: none !important;
  }
  &:after {
    display: none;
  }
  & .MuiInputBase-input {
    padding: 6px 0px 11px;
  }
  & .MuiBox-root {
    font-size: 14px;
    line-height: 150%;
    letter-spacing: 0.15;
    color: #000000;
  }
  & .MuiSelect-icon {
    top: calc(50% - 10px);
    right: 10px;
  }
  & .MuiSelect-select {
    &:focus {
      background-color: transparent;
    }
  }
`;

export default function({ options, value, onChange, fullWidth, defaultValue }: IInputSelectProps) {
  return (
    <SelectField
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
    >
      {Array.isArray(options) &&
        options?.length &&
        options.map((option, index) => {
          return (
            <MenuItem value={option.value} key={option.value} data-testid={`input-select-${index}`}>
              {option.label}
            </MenuItem>
          );
        })}
    </SelectField>
  );
}
