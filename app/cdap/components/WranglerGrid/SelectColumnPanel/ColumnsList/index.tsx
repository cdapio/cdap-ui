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

import NoRecordScreen from 'components/NoRecordScreen';
import {
  MULTI_SELECTION_COLUMN,
  PREFIX,
} from 'components/WranglerGrid/SelectColumnPanel/constants';
import DataTable from 'components/WranglerGrid/SelectColumnPanel/DataTable';
import {
  ColumnInnerWrapper,
  ColumnWrapper,
  FlexWrapper,
  SearchIconButton,
  SearchInputField,
  SearchWrapper,
  StyledClearIcon,
  StyledSearchIcon,
} from 'components/WranglerGrid/SelectColumnPanel/styles';
import {
  IHeaderNamesList,
  IMultipleSelectedFunctionDetail,
} from 'components/WranglerGrid/SelectColumnPanel/types';
import { NormalFont } from 'components/WranglerV2/Label';
import T from 'i18n-react';
import React, { ChangeEvent, Dispatch, SetStateAction, useRef, useState } from 'react';

export interface IColumnsListProps {
  transformationDataType: string[];
  selectedColumnsCount: number;
  setSelectedColumns: Dispatch<SetStateAction<IHeaderNamesList[]>>;
  dataQuality: Array<Record<string, string | number>>;
  transformationName: string;
  selectedColumns: IHeaderNamesList[];
  filteredColumnsOnTransformationType: IHeaderNamesList[];
  isSingleSelection: boolean;
}

export default function ColumnsList({
  transformationDataType,
  selectedColumnsCount,
  setSelectedColumns,
  dataQuality,
  transformationName,
  selectedColumns,
  filteredColumnsOnTransformationType,
  isSingleSelection,
}: IColumnsListProps) {
  const [columns, setColumns] = useState(filteredColumnsOnTransformationType);
  const [isFocused, setIsFocused] = useState(false);

  const inputRef = useRef(null);

  // handle multiple column selection
  const handleMultipleSelection = (
    event: ChangeEvent<HTMLInputElement>,
    column: IHeaderNamesList
  ) => {
    if (event.target.checked) {
      setSelectedColumns([...selectedColumns, column]);
    } else {
      if (selectedColumns.some((columnDetail) => columnDetail.label === column.label)) {
        const indexOfUnchecked = selectedColumns.findIndex(
          (columnDetail) => columnDetail.label === column.label
        );
        setSelectedColumns(selectedColumns.filter((_, index) => index !== indexOfUnchecked));
      }
    }
  };

  // disable checkbox when the selection limit is reached for e.g. in join and swap we can select only two column
  const isCheckboxDisabled = () => {
    const isMultiSelect = MULTI_SELECTION_COLUMN.some(
      (functionDetail: IMultipleSelectedFunctionDetail) =>
        functionDetail.value === transformationName && functionDetail.isMoreThanTwo
    );
    return !(selectedColumns.length < 2 || isMultiSelect);
  };

  // search a column by it's name from the column list
  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value) {
      let columnValue: IHeaderNamesList[] = [];
      if (filteredColumnsOnTransformationType.length) {
        columnValue = filteredColumnsOnTransformationType.filter((columnDetail: IHeaderNamesList) =>
          columnDetail.label.toLowerCase().includes(event.target.value.toLowerCase())
        );
      }
      setColumns(columnValue);
      if (selectedColumns.some((el) => !el.label.includes(event.target.value))) {
        // If search result does not match selected column then needs to set selected columns to empty
        setSelectedColumns([]);
      }
    } else {
      setColumns(filteredColumnsOnTransformationType);
    }
  };

  // focus input field when a search icon is clicked
  const handleFocus = () => {
    inputRef?.current?.focus();
    setIsFocused(true);
  };

  // Clear search input text and makes input blur
  const handleClearSearch = () => {
    inputRef.current.value = '';
    setIsFocused(false);
    setColumns(filteredColumnsOnTransformationType);
  };

  if (filteredColumnsOnTransformationType.length) {
    return (
      <ColumnWrapper data-testid="select-column-list-parent">
        <ColumnInnerWrapper>
          <NormalFont component="p" data-testid="no-column-title">
            {T.translate(`${PREFIX}.selectedColumnsCount`, {
              context: selectedColumnsCount,
            })}
          </NormalFont>
          <SearchWrapper>
            {isFocused && (
              <>
                <SearchInputField
                  data-testid="input-search-id"
                  onChange={handleSearch}
                  isFocused={isFocused}
                  ref={inputRef}
                />
                <SearchIconButton onClick={handleClearSearch} data-testid="click-handle-blur">
                  <StyledClearIcon />
                </SearchIconButton>
              </>
            )}
            {!isFocused && (
              <SearchIconButton onClick={handleFocus} data-testid="click-handle-focus">
                <StyledSearchIcon />
              </SearchIconButton>
            )}
          </SearchWrapper>
        </ColumnInnerWrapper>
        <DataTable
          dataQualityValue={dataQuality}
          handleSingleSelection={(column) => setSelectedColumns([column])}
          isCheckboxDisabled={isCheckboxDisabled}
          handleMultipleSelection={handleMultipleSelection}
          columns={columns}
          transformationDataType={transformationDataType}
          isSingleSelection={isSingleSelection}
          selectedColumns={selectedColumns}
          totalColumnCount={filteredColumnsOnTransformationType.length}
          setSelectedColumns={setSelectedColumns}
          transformationName={transformationName}
        />
      </ColumnWrapper>
    );
  }

  return (
    <ColumnWrapper data-testid="select-column-list-parent">
      <FlexWrapper>
        <NoRecordScreen
          title={T.translate(`${PREFIX}.noColumns`)}
          subtitle={T.translate(`${PREFIX}.noMatchColumnDatatype`)}
        />
      </FlexWrapper>
    </ColumnWrapper>
  );
}
