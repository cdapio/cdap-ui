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
import InputWidgets from 'components/WranglerGrid/SelectColumnPanel/DataTable/InputWidgets';
import DataQualityCircularProgressBar from 'components/common/DataQualityCircularProgressBar';
import { ITableRowWidgetProps } from 'components/WranglerGrid/SelectColumnPanel/DataTable/types';
import { TableCellText } from 'components/common/TypographyText';
import { TableCell } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import styled from 'styled-components';
import { StyledTableRow } from 'components/WranglerGrid/SelectColumnPanel/DataTable';

const StyledTableBodyCell = styled(TableCell)`
  &.MuiTableCell-body {
    font-weight: 400;
    font-size: 16px;
    line-height: 150%;
    letter-spacing: 0.15px;
    color: ${grey[700]};
    padding: 5px;
    height: 64px;
  }
  &:nth-child(2) {
    padding-left: 0px;
  }
`;

const StyledInputTableBodyCell = styled(StyledTableBodyCell)`
  &.MuiTableCell-body {
    padding-left: 11px;
  }
`;

export default function TableRowWidget({
  handleSingleSelection,
  selectedColumns,
  dataQualityValue,
  isSingleSelection,
  isCheckboxDisabled,
  handleMultipleSelection,
  columnIndex,
  columnDetail,
}: ITableRowWidgetProps) {
  return (
    <StyledTableRow key={`column-${columnIndex}`}>
      <StyledInputTableBodyCell>
        <InputWidgets
          isSingleSelection={isSingleSelection}
          selectedColumns={selectedColumns}
          handleSingleSelection={handleSingleSelection}
          columnDetail={columnDetail}
          isCheckboxDisabled={isCheckboxDisabled}
          handleMultipleSelection={handleMultipleSelection}
          columnIndex={columnIndex}
        />
      </StyledInputTableBodyCell>
      <StyledTableBodyCell>
        <TableCellText component="div">{columnDetail.label}</TableCellText>
        <TableCellText component="div">{columnDetail.type}</TableCellText>
      </StyledTableBodyCell>
      <StyledTableBodyCell>
        {dataQualityValue.length && (
          <DataQualityCircularProgressBar
            dataQualityPercentValue={parseInt(dataQualityValue[columnIndex].value.toString())}
          />
        )}
      </StyledTableBodyCell>
    </StyledTableRow>
  );
}
