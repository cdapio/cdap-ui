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
import { Checkbox, FormControlLabel } from '@material-ui/core';
import { ICheckBoxInputProps } from 'components/WranglerGrid/SelectColumnPanel/DataTable/types';

export default function({
  selectedColumns,
  handleDisableCheckbox,
  columnDetail,
  onMultipleSelection,
  label,
  columnIndex,
}: ICheckBoxInputProps) {
  const disabled =
    selectedColumns?.filter((column) => column.label === columnDetail.label).length ||
    !handleDisableCheckbox()
      ? false
      : true;

  const checked =
    selectedColumns?.length &&
    selectedColumns?.filter((column) => column.label === columnDetail.label).length
      ? true
      : false;

  return (
    <FormControlLabel
      disabled={disabled}
      control={
        <Checkbox
          color="primary"
          checked={checked}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            onMultipleSelection(event, columnDetail)
          }
          data-testid={`check-box-input-${columnIndex}`}
        />
      }
      label={label}
      data-testid={`form-control-label-parent-${columnIndex}`}
    />
  );
}
