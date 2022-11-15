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

import { Checkbox, FormControlLabel, Typography } from '@material-ui/core';
import { IInputCheckboxProps } from 'components/ParsingDrawer/types';
import React from 'react';
import styled from 'styled-components';

const Label = styled(Typography)`
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 150%;
  letter-spacing: 0.15px;
  color: #5f6368; /* Mui Colors not available */
  opacity: 0.8;
`;

export default function({ label, value, onChange, className }: IInputCheckboxProps) {
  return (
    <FormControlLabel
      className={className}
      control={
        <Checkbox
          onChange={onChange}
          checked={value}
          color="primary"
          data-testid={`parsing-checkbox-${label}`}
        />
      }
      label={<Label>{label}</Label>}
    />
  );
}
