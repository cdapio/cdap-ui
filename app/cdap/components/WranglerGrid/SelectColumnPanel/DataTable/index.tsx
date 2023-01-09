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

import { TableBody, Checkbox, Divider, Box } from '@material-ui/core';
import React from 'react';
import T from 'i18n-react';
import TableRowWidget from 'components/WranglerGrid/SelectColumnPanel/DataTable/TableRowWidget';
import { IDataTableProps } from 'components/WranglerGrid/SelectColumnPanel/DataTable/types';
import {
  ADD_TRANSFORMATION_PREFIX,
  SELECT_COLUMN_LIST_PREFIX,
} from 'components/WranglerGrid/SelectColumnPanel/constants';
import { MULTI_SELECTION_COLUMN } from 'components/WranglerGrid/SelectColumnPanel/constants';
import { TableContainer, Table, TableHead, TableRow, TableCell } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import styled, { css } from 'styled-components';
import { NormalFont, SubHeadBoldFont } from 'components/common/TypographyText';
import { NoDataSVG } from 'components/GridTable/iconStore';
import { IHeaderNamesList } from 'components/WranglerGrid/SelectColumnPanel/types';

const cellFontCSS = css`
  font-weight: 400;
  font-size: 16px;
  line-height: 150%;
  letter-spacing: 0.15px;
`;

const CenterAlignWrapper = styled(Box)`
  text-align: center;
`;

const FlexWrapper = styled(Box)`
  display: flex;
  height: 100%;
  align-items: center;
`;

export const StyledTableRow = styled(TableRow)`
  ${cellFontCSS}
  color: ${grey[700]};
  display: grid;
  grid-template-columns: 8% 45% 45%;
  align-items: center;
  height: 100%;
`;

const StyledTableContainer = styled(TableContainer)`
  height: 100%;
`;

const StyledTable = styled(Table)`
  display: flex;
  flex-direction: column;
`;

const StyledTableHead = styled(TableHead)`
  height: 54px;
`;

const StyledTableHeadCell = styled(TableCell)`
  &.MuiTableCell-head {
    ${cellFontCSS}
    padding: 0;
    color: ${grey[900]};
    border-bottom: none !important;
  }
`;

export default function DataTable({
  columns,
  transformationDataType,
  handleSingleSelection,
  selectedColumns,
  dataQualityValue,
  isSingleSelection,
  isCheckboxDisabled,
  handleMultipleSelection,
  setSelectedColumns,
  transformationName,
}: IDataTableProps) {
  const indexOfMultiSelectOption = MULTI_SELECTION_COLUMN.findIndex(
    (option) => option.value === transformationName && option.isMoreThanTwo === false
  );

  // This function is used to either select all checkbox or uncheck the selected once
  const handleChange = () => {
    if (indexOfMultiSelectOption > -1) {
      // If only two column selection is possible
      if (selectedColumns.length) {
        setSelectedColumns([]); // If columns are already selected then those all will be unchecked
      } else {
        if (columns.length > 2) {
          setSelectedColumns(columns.slice(0, 2)); // When clicked on a checkbox then first two column will be selected in case if transformation present is join/swap
        } else {
          setSelectedColumns(columns); // When clicked on a checkbox then all columns will be selected
        }
      }
    } else {
      if (selectedColumns.length) {
        setSelectedColumns([]); // If columns are already selected then those all will be unchecked
      } else {
        setSelectedColumns(columns); // When clicked on a checkbox then all columns will be selected
      }
    }
  };

  // This function is used to filter column based on their datatype which matches with the supported types of transformation to be applied
  const getColumnsToDisplay = () => {
    if (transformationDataType.includes('all')) {
      return columns;
    }
    return columns.filter((column) =>
      transformationDataType.includes(column.type[0].toLowerCase())
    );
  };

  const columnsToDisplay: IHeaderNamesList[] = getColumnsToDisplay();

  return (
    <StyledTableContainer data-testid="column-table-parent">
      {columnsToDisplay.length === 0 && (
        <FlexWrapper>
          <CenterAlignWrapper>
            {NoDataSVG}
            <SubHeadBoldFont component="p" data-testid="no-column-title">
              {T.translate(`${SELECT_COLUMN_LIST_PREFIX}.noColumns`)}
            </SubHeadBoldFont>
            <NormalFont component="p" data-testid="no-column-subTitle">
              {T.translate(`${SELECT_COLUMN_LIST_PREFIX}.noMatchColumnDatatype`)}
            </NormalFont>
          </CenterAlignWrapper>
        </FlexWrapper>
      )}
      {columnsToDisplay.length > 0 && (
        <StyledTable aria-label="recipe steps table">
          <Divider />
          <StyledTableHead>
            <StyledTableRow>
              <StyledTableHeadCell>
                {MULTI_SELECTION_COLUMN.some((option) => option.value === transformationName) && (
                  <Checkbox
                    color="primary"
                    checked={selectedColumns.length ? true : false}
                    onChange={handleChange}
                    indeterminate={selectedColumns.length ? true : false}
                    data-testid="column-table-check-box"
                    aria-checked="true"
                  />
                )}
              </StyledTableHeadCell>
              <StyledTableHeadCell data-testid="panel-columns">
                {T.translate(`${ADD_TRANSFORMATION_PREFIX}.columns`)}
                {` (${columns.length})`}
              </StyledTableHeadCell>
              <StyledTableHeadCell data-testid="panel-values">
                {T.translate(`${ADD_TRANSFORMATION_PREFIX}.nullValues`)}
              </StyledTableHeadCell>
            </StyledTableRow>
          </StyledTableHead>
          <Divider />
          <TableBody>
            {columnsToDisplay.map((eachColumn, columnIndex) => (
              <TableRowWidget
                handleSingleSelection={handleSingleSelection}
                selectedColumns={selectedColumns}
                dataQualityValue={dataQualityValue}
                isSingleSelection={isSingleSelection}
                isCheckboxDisabled={isCheckboxDisabled}
                handleMultipleSelection={handleMultipleSelection}
                columnIndex={columnIndex}
                columnDetail={eachColumn}
              />
            ))}
          </TableBody>
        </StyledTable>
      )}
    </StyledTableContainer>
  );
}
