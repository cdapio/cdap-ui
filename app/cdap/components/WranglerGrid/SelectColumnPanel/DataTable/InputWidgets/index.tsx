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

import { Checkbox, Radio } from '@material-ui/core';
import { IInputWidgetsProps } from 'components/WranglerGrid/SelectColumnPanel/DataTable/types';
import React from 'react';
import styled from 'styled-components';

const StyledRadio = styled(Radio)`
  &.MuiRadio-root {
    padding: 0;
    vertical-align: text-top;
  }
`;

const StyledCheckbox = styled(Checkbox)`
  padding: 0;
  vertical-align: text-top;
`;

export default function InputWidgets({
  isSingleSelection,
  selectedColumns,
  handleSingleSelection,
  columnDetail,
  isCheckboxDisabled,
  handleMultipleSelection,
  columnIndex,
}: IInputWidgetsProps) {
  const isColumnSelected = selectedColumns.some((column) => column.label === columnDetail.label);

  const onRadioInputChange = () => handleSingleSelection(columnDetail);
  const onCheckBoxInputChange = (event) => handleMultipleSelection(event, columnDetail);

  if (isSingleSelection) {
    return (
      <StyledRadio
        color="primary"
        onChange={onRadioInputChange}
        checked={isColumnSelected}
        data-testid={`radio-input-${columnIndex}`}
      />
    );
  }

  return (
    <StyledCheckbox
      color="primary"
      checked={isColumnSelected}
      onChange={onCheckBoxInputChange}
      disabled={!isColumnSelected && isCheckboxDisabled()}
      data-testid={`check-box-input-${columnIndex}`}
    />
  );
}
