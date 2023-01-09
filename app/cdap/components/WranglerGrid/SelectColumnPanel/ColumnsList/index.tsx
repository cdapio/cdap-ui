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

import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { NoDataSVG } from 'components/GridTable/iconStore';
import T from 'i18n-react';
import { IColumnsListProps } from 'components/WranglerGrid/SelectColumnPanel/ColumnsList/types';
import { IHeaderNamesList } from 'components/WranglerGrid/SelectColumnPanel/types';
import DataTable from 'components/WranglerGrid/SelectColumnPanel/DataTable';
import { MULTI_SELECTION_COLUMN } from 'components/WranglerGrid/SelectColumnPanel/constants';
import CountWidget from 'components/WranglerGrid/SelectColumnPanel/CountWidget';
import { IMultipleSelectedFunctionDetail } from 'components/WranglerGrid/SelectColumnPanel/types';
import { SELECT_COLUMN_LIST_PREFIX } from 'components/WranglerGrid/SelectColumnPanel/constants';
import { NormalFont, SubHeadBoldFont } from 'components/common/TypographyText';
import {
  ColumnWrapper,
  CenterAlignBox,
  FlexWrapper,
  ColumnInnerWrapper,
  SearchWrapper,
  StyledSearchIcon,
  SearchInputField,
  SearchIconButton,
} from 'components/WranglerGrid/SelectColumnPanel/ColumnsList/styles';

export default function ColumnsList({
  transformationDataType,
  selectedColumnsCount,
  columnsList,
  setSelectedColumns,
  dataQuality,
  transformationName,
  selectedColumns,
  filteredColumnsOnTransformationType,
  isSingleSelection,
}: IColumnsListProps) {
  const [columns, setColumns] = useState(columnsList);
  const ref = useRef(null);

  useEffect(() => {
    setColumns(filteredColumnsOnTransformationType);
  }, []);

  // handle multiple column selection
  const handleMultipleSelection = (
    event: ChangeEvent<HTMLInputElement>,
    column: IHeaderNamesList
  ) => {
    if (event.target.checked) {
      setSelectedColumns([...selectedColumns, column]);
    } else {
      const indexOfUnchecked = selectedColumns.findIndex(
        (columnDetail) => columnDetail.label === column.label
      );
      if (indexOfUnchecked > -1) {
        setSelectedColumns(() => selectedColumns.filter((_, index) => index !== indexOfUnchecked));
      }
    }
  };

  // disable checkbox when the selection limit is reached for e.g. in join and swap we can select only two column
  const isCheckboxDisabled = () => {
    const multiSelect = MULTI_SELECTION_COLUMN.findIndex(
      (functionDetail: IMultipleSelectedFunctionDetail) =>
        functionDetail.value === transformationName && functionDetail.isMoreThanTwo
    );
    return !(selectedColumns.length < 2 || multiSelect > -1);
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
    } else {
      setColumns(filteredColumnsOnTransformationType);
    }
  };

  // focus input field when a search icon is clicked
  const handleFocus = () => {
    ref?.current?.focus();
  };

  return (
    <ColumnWrapper data-testid="select-column-list-parent">
      {filteredColumnsOnTransformationType.length === 0 && (
        <FlexWrapper>
          <CenterAlignBox>
            {NoDataSVG}
            <SubHeadBoldFont component="p" data-testid="no-column-title">
              {T.translate(`${SELECT_COLUMN_LIST_PREFIX}.noColumns`)}
            </SubHeadBoldFont>
            <NormalFont component="p" data-testid="no-column-subTitle">
              {T.translate(`${SELECT_COLUMN_LIST_PREFIX}.noMatchColumnDatatype`)}
            </NormalFont>
          </CenterAlignBox>
        </FlexWrapper>
      )}
      {filteredColumnsOnTransformationType.length > 0 && (
        <>
          <ColumnInnerWrapper>
            <CountWidget selectedColumnsCount={selectedColumnsCount} />
            <SearchWrapper>
              <SearchInputField data-testid="input-search-id" onChange={handleSearch} ref={ref} />
              <SearchIconButton onClick={handleFocus} data-testid="click-handle-focus">
                <StyledSearchIcon />
              </SearchIconButton>
            </SearchWrapper>
          </ColumnInnerWrapper>
          <DataTable
            dataQualityValue={dataQuality}
            handleSingleSelection={(column) => setSelectedColumns([column])}
            isCheckboxDisabled={isCheckboxDisabled}
            handleMultipleSelection={handleMultipleSelection}
            columns={filteredColumnsOnTransformationType.length === 0 ? [] : columns}
            transformationDataType={transformationDataType}
            isSingleSelection={isSingleSelection}
            selectedColumns={selectedColumns}
            totalColumnCount={filteredColumnsOnTransformationType.length}
            setSelectedColumns={setSelectedColumns}
            transformationName={transformationName}
          />
        </>
      )}
    </ColumnWrapper>
  );
}
