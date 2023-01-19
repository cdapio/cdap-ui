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

import { Divider, TableBody } from '@material-ui/core';
import NoRecordScreen from 'components/NoRecordScreen';
import {
  MULTI_SELECTION_COLUMN,
  PREFIX,
} from 'components/WranglerGrid/SelectColumnPanel/constants';
import {
  CheckboxBlankIcon,
  CheckboxCheckedIcon,
  CheckboxIndeterminateIcon,
  FlexWrapper,
  MultiSelectionCheckbox,
  StyledCheckbox,
  StyledInputTableBodyCell,
  StyledRadio,
  StyledTable,
  StyledTableBodyCell,
  StyledTableContainer,
  StyledTableHead,
  StyledTableHeadCell,
  StyledTableRow,
} from 'components/WranglerGrid/SelectColumnPanel/styles';
import { IHeaderNamesList } from 'components/WranglerGrid/SelectColumnPanel/types';
import DataQualityCircularProgressBar from 'components/WranglerV2/DataQualityCircularProgressBar';
import { TableCellText } from 'components/WranglerV2/Label';
import T from 'i18n-react';
import React, { ChangeEvent, Dispatch, SetStateAction } from 'react';

export interface ICommonInputProps {
  handleSingleSelection: (value: IHeaderNamesList) => void;
  handleMultipleSelection: (event: ChangeEvent<HTMLInputElement>, value: IHeaderNamesList) => void;
  isSingleSelection: boolean;
  selectedColumns: IHeaderNamesList[];
  isCheckboxDisabled?: () => boolean;
}

export interface IDataTableProps extends ICommonInputProps {
  columns: IHeaderNamesList[];
  transformationDataType: string[];
  dataQualityValue: Array<Record<string, string | number>>;
  totalColumnCount: number;
  setSelectedColumns: Dispatch<SetStateAction<IHeaderNamesList[]>>;
  transformationName: string;
}

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
  const isMultiSelectMode = MULTI_SELECTION_COLUMN.some(
    (option) => option.value === transformationName && option.isMoreThanTwo === false
  );

  // This function is used to either select all checkbox or uncheck the selected once
  const handleChange = () => {
    if (isMultiSelectMode) {
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
      {!Boolean(columnsToDisplay.length) && (
        <FlexWrapper>
          <NoRecordScreen
            title={T.translate(`${PREFIX}.noColumns`)}
            subtitle={T.translate(`${PREFIX}.noMatchInSearchMode`)}
          />
        </FlexWrapper>
      )}
      {Boolean(columnsToDisplay.length) && (
        <StyledTable aria-label="recipe steps table">
          <StyledTableHead>
            <StyledTableRow>
              <StyledTableHeadCell>
                {MULTI_SELECTION_COLUMN.some((option) => option.value === transformationName) && (
                  <MultiSelectionCheckbox
                    color="primary"
                    checked={Boolean(selectedColumns.length)}
                    onChange={handleChange}
                    data-testid="column-table-check-box"
                    aria-checked="true"
                    checkedIcon={<CheckboxIndeterminateIcon />}
                    icon={<CheckboxBlankIcon />}
                  />
                )}
              </StyledTableHeadCell>
              <StyledTableHeadCell data-testid="panel-columns">
                {T.translate(`${PREFIX}.columns`)}
                {` (${columns.length})`}
              </StyledTableHeadCell>
              <StyledTableHeadCell data-testid="panel-columns-type">
                {T.translate(`${PREFIX}.columnType`)}
              </StyledTableHeadCell>
              <StyledTableHeadCell data-testid="panel-values">
                {T.translate(`${PREFIX}.nullValues`)}
              </StyledTableHeadCell>
            </StyledTableRow>
          </StyledTableHead>
          <Divider />
          <TableBody>
            {columnsToDisplay.map((eachColumn, columnIndex) => {
              const isChecked = selectedColumns.some((column) => column.label === eachColumn.label);
              return (
                <>
                  <StyledTableRow key={`column-${columnIndex}`}>
                    <StyledInputTableBodyCell>
                      {isSingleSelection && (
                        <StyledRadio
                          color="primary"
                          onChange={() => handleSingleSelection(eachColumn)}
                          checked={isChecked}
                          data-testid={`radio-input-${columnIndex}`}
                        />
                      )}
                      {!isSingleSelection && (
                        <StyledCheckbox
                          color="primary"
                          checked={isChecked}
                          onChange={(event: ChangeEvent<HTMLInputElement>) =>
                            handleMultipleSelection(event, eachColumn)
                          }
                          disabled={!isChecked && isCheckboxDisabled()}
                          data-testid={`check-box-input-${columnIndex}`}
                          checkedIcon={<CheckboxCheckedIcon />}
                          icon={<CheckboxBlankIcon />}
                        />
                      )}
                    </StyledInputTableBodyCell>
                    <StyledTableBodyCell>
                      <TableCellText component="div">{eachColumn.label}</TableCellText>
                    </StyledTableBodyCell>
                    <StyledTableBodyCell>
                      <TableCellText component="div">{eachColumn.type}</TableCellText>
                    </StyledTableBodyCell>
                    <StyledTableBodyCell>
                      {dataQualityValue.length && (
                        <DataQualityCircularProgressBar
                          dataQualityPercentValue={parseInt(
                            dataQualityValue[columnIndex].value.toString()
                          )}
                        />
                      )}
                    </StyledTableBodyCell>
                  </StyledTableRow>
                  {columnIndex !== columnsToDisplay.length - 1 && <Divider />}
                </>
              );
            })}
          </TableBody>
        </StyledTable>
      )}
    </StyledTableContainer>
  );
}
