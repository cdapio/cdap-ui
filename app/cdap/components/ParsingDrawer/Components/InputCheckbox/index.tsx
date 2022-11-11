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
import { useStyles } from 'components/ParsingDrawer/styles';
import { IInputCheckboxProps } from 'components/ParsingDrawer/types';
import React from 'react';

export default function({ label, value, onChange, className }: IInputCheckboxProps) {
  const classes = useStyles();

  return (
    <FormControlLabel
      className={className}
      control={
        <Checkbox
          onChange={onChange}
          checked={value}
          color="primary"
          data-testid={`parsing-checkbox`}
        />
      }
      label={<Typography className={classes.labelTextStyles}>{label}</Typography>}
    />
  );
}
