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

export default function(props) {
  const { options, classes, optionClassName } = props;

  return (
    <Select
      classes={{ ...classes }}
      {...props}
      MenuProps={{
        dataTestid: 'input-select-menu',
      }}
    >
      {options.map((option, index) => {
        return (
          <MenuItem
            classes={{ ...optionClassName }}
            value={option.value}
            key={option.value}
            data-testid={`input-select-${index}`}
          >
            {option.label}
          </MenuItem>
        );
      })}
    </Select>
  );
}
