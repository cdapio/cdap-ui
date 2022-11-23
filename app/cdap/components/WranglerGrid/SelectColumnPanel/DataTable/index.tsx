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

import { TableBody, Checkbox, Divider } from '@material-ui/core';
import React from 'react';
import T from 'i18n-react';
import TableRowWidget from 'components/WranglerGrid/SelectColumnPanel/DataTable/TableRow';
import { IColumnTableProps } from 'components/WranglerGrid/SelectColumnPanel/DataTable/types';
import { ADD_TRANSFORMATION_PREFIX } from 'components/WranglerGrid/SelectColumnPanel/constants';
import { multipleColumnSelected } from 'components/WranglerGrid/SelectColumnPanel/constants';
import { TableContainer, Table, TableHead, TableRow, TableCell } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import styled from 'styled-components';

const SelectColumnTableContainer = styled(TableContainer)`
  height: 100%;
`;

const SelectColumnTable = styled(Table)`
  display: flex;
  flex-direction: column;
`;

const SelectColumnTableHead = styled(TableHead)`
  height: 54px;
`;

const SelectColumnTableRow = styled(TableRow)`
  font-weight: 400;
  font-size: 16px;
  line-height: 150%;
  letter-spacing: 0.15px;
  color: ${grey[700]};
  display: grid;
  grid-template-columns: 8% 45% 45%;
  align-items: center;
  height: 100%;
`;

const SelectColumnTableHeadCell = styled(TableCell)`
  &.MuiTableCell-head {
    padding: 0;
    font-weight: 400;
    font-size: 16px;
    line-height: 150%;
    letter-spacing: 0.15px;
    color: ${grey[900]};
    border-bottom: none !important;
  }
`;

export default function({
  columns,
  transformationDataType,
  onSingleSelection,
  selectedColumns,
  dataQualityValue,
  isSingleSelection,
  handleDisableCheckbox,
  onMultipleSelection,
  totalColumnCount,
  setSelectedColumns,
  transformationName,
}: IColumnTableProps) {
  const handleChange = () => {
    if (
      multipleColumnSelected?.filter(
        (option) => option.value === transformationName && option.isMoreThanTwo === false
      ).length > 0
    ) {
      if (selectedColumns.length) {
        setSelectedColumns([]);
      } else {
        if (columns?.length > 2) {
          setSelectedColumns(columns.slice(0, 2));
        } else {
          setSelectedColumns(columns);
        }
      }
    } else {
      if (selectedColumns?.length) {
        setSelectedColumns([]);
      } else {
        setSelectedColumns(columns);
      }
    }
  };

  return (
    <SelectColumnTableContainer data-testid="column-table-parent">
      <SelectColumnTable aria-label="recipe steps table">
        <Divider />
        <SelectColumnTableHead>
          <SelectColumnTableRow>
            <SelectColumnTableHeadCell>
              {multipleColumnSelected?.filter((option) => option.value === transformationName)
                .length > 0 && (
                <Checkbox
                  color="primary"
                  checked={selectedColumns?.length ? true : false}
                  onClick={handleChange}
                  indeterminate={selectedColumns?.length ? true : false}
                  data-testid="column-table-check-box"
                />
              )}
            </SelectColumnTableHeadCell>
            <SelectColumnTableHeadCell data-testid="panel-columns">
              {T.translate(`${ADD_TRANSFORMATION_PREFIX}.columns`)}
              {` (${columns.length})`}
            </SelectColumnTableHeadCell>
            <SelectColumnTableHeadCell data-testid="panel-values">
              {T.translate(`${ADD_TRANSFORMATION_PREFIX}.nullValues`)}
            </SelectColumnTableHeadCell>
          </SelectColumnTableRow>
        </SelectColumnTableHead>
        <Divider />
        <TableBody>
          {columns.map((eachColumn, columnIndex) =>
            transformationDataType?.includes('all') ? (
              <TableRowWidget
                onSingleSelection={onSingleSelection}
                selectedColumns={selectedColumns}
                dataQualityValue={dataQualityValue}
                isSingleSelection={isSingleSelection}
                handleDisableCheckbox={handleDisableCheckbox}
                onMultipleSelection={onMultipleSelection}
                columnIndex={columnIndex}
                columnDetail={eachColumn}
              />
            ) : (
              transformationDataType?.includes(eachColumn?.type[0]?.toLowerCase()) && (
                <TableRowWidget
                  onSingleSelection={onSingleSelection}
                  selectedColumns={selectedColumns}
                  dataQualityValue={dataQualityValue}
                  isSingleSelection={isSingleSelection}
                  handleDisableCheckbox={handleDisableCheckbox}
                  onMultipleSelection={onMultipleSelection}
                  columnIndex={columnIndex}
                  columnDetail={eachColumn}
                />
              )
            )
          )}
        </TableBody>
      </SelectColumnTable>
    </SelectColumnTableContainer>
  );
}
