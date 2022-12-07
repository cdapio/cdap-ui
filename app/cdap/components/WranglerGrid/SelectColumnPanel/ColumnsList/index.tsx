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

import React, { useEffect, useRef, useState } from 'react';
import { NoDataSVG } from 'components/GridTable/iconStore';
import T from 'i18n-react';
import { ISelectColumnsListProps } from 'components/WranglerGrid/SelectColumnPanel/ColumnsList/types';
import { IHeaderNamesList } from 'components/WranglerGrid/SelectColumnPanel/types';
import ColumnTable from 'components/WranglerGrid/SelectColumnPanel/DataTable';
import { MULTI_SELECTION_COLUMN } from 'components/WranglerGrid/SelectColumnPanel/constants';
import SelectedColumnCountWidget from 'components/WranglerGrid/SelectColumnPanel/CountWidget';
import { IMultipleSelectedFunctionDetail } from 'components/WranglerGrid/SelectColumnPanel/types';
import { SELECT_COLUMN_LIST_PREFIX } from 'components/WranglerGrid/SelectColumnPanel/constants';
import { NormalFont, SubHeadBoldFont } from 'components/common/TypographyText';
import { Box, IconButton } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import styled from 'styled-components';
import { grey } from '@material-ui/core/colors';
import {
  getColumnsSupportedType,
  getFilteredColumn,
} from 'components/WranglerGrid/SelectColumnPanel/utils';

const SearchIconComponent = styled(SearchIcon)`
  &.MuiSvgIcon-root {
    width: 24px;
    height: 24px;
  }
`;

const SelectColumnSearchInput = styled.input`
  margin-right: 5px;
  border: none;
  border-bottom: 1px solid transparent;
  margin-bottom: 5px;
  &:focus {
    border-bottom: 1px solid ${grey[700]};
    outline: none;
  }
`;

const SelectColumnWrapper = styled(Box)`
  height: 90%;
`;

const SelectColumnInnerWrapper = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
`;

const FlexWrapper = styled(Box)`
  display: flex;
  height: 100%;
  align-items: center;
`;

const CenterAlignBox = styled(Box)`
  text-align: center;
`;

const SelectColumnSearchBox = styled(Box)`
  position: relative;
  display: flex;
`;

const SearchIconButton = styled(IconButton)`
  padding: 5px;
  &.MuiIconButton-root:hover {
    background-color: transparent;
  }
  & .MuiTouchRipple-root {
    display: none;
  }
`;

export default function({
  transformationDataType,
  selectedColumnsCount,
  columnsList,
  setSelectedColumns,
  dataQuality,
  transformationName,
  selectedColumns,
}: ISelectColumnsListProps) {
  const [columns, setColumns] = useState<IHeaderNamesList[]>(columnsList);
  const [isSingleSelection, setIsSingleSelection] = useState<boolean>(true);
  const ref = useRef(null);

  const columnsAsPerType = getColumnsSupportedType(transformationDataType, columnsList);
  const filteredColumnsOnType = getFilteredColumn(transformationDataType, columnsList);

  useEffect(() => {
    const multiSelect: IMultipleSelectedFunctionDetail[] = MULTI_SELECTION_COLUMN?.filter(
      (functionDetail: IMultipleSelectedFunctionDetail) =>
        functionDetail.value === transformationName
    );

    if (multiSelect.length) {
      setIsSingleSelection(false);
    }
    setColumns(filteredColumnsOnType);
  }, []);

  const onSingleSelection = (column: IHeaderNamesList) => {
    setSelectedColumns([column]);
  };

  const onMultipleSelection = (
    event: React.ChangeEvent<HTMLInputElement>,
    column: IHeaderNamesList
  ) => {
    if (event.target.checked) {
      setSelectedColumns((prev) => [...prev, column]);
    } else {
      const indexOfUnchecked = selectedColumns.findIndex(
        (columnDetail) => columnDetail.label === column.label
      );
      if (indexOfUnchecked > -1) {
        setSelectedColumns(() => selectedColumns.filter((_, index) => index !== indexOfUnchecked));
      }
    }
  };

  const handleDisableCheckbox = () => {
    const multiSelect: IMultipleSelectedFunctionDetail[] = MULTI_SELECTION_COLUMN.filter(
      (functionDetail: IMultipleSelectedFunctionDetail) =>
        functionDetail.value === transformationName && functionDetail.isMoreThanTwo
    );
    if (selectedColumns?.length === 0 || selectedColumns?.length < 2) {
      return false;
    } else if (multiSelect.length) {
      return false;
    } else {
      return true;
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value) {
      const columnValue: IHeaderNamesList[] = filteredColumnsOnType.length
        ? filteredColumnsOnType.filter((columnDetail: IHeaderNamesList) =>
            columnDetail.label.toLowerCase().includes(event.target.value.toLowerCase())
          )
        : [];
      columnValue?.length ? setColumns(columnValue) : setColumns([]);
    } else {
      setColumns(filteredColumnsOnType);
    }
  };

  const handleFocus = () => {
    ref?.current?.focus();
  };

  return (
    <SelectColumnWrapper data-testid="select-column-list-parent">
      {columnsAsPerType.length === 0 && (
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
      {columnsAsPerType.length > 0 && (
        <>
          <SelectColumnInnerWrapper>
            <SelectedColumnCountWidget selectedColumnsCount={selectedColumnsCount} />
            <SelectColumnSearchBox>
              <SelectColumnSearchInput
                data-testid="input-search-id"
                onChange={handleSearch}
                ref={ref}
              />
              <SearchIconButton onClick={handleFocus} data-testid="click-handle-focus">
                <SearchIconComponent />
              </SearchIconButton>
            </SelectColumnSearchBox>
          </SelectColumnInnerWrapper>
          <ColumnTable
            dataQualityValue={dataQuality}
            onSingleSelection={onSingleSelection}
            handleDisableCheckbox={handleDisableCheckbox}
            onMultipleSelection={onMultipleSelection}
            columns={columnsAsPerType.length === 0 ? [] : columns}
            transformationDataType={transformationDataType}
            isSingleSelection={isSingleSelection}
            selectedColumns={selectedColumns}
            totalColumnCount={columnsAsPerType?.length}
            setSelectedColumns={setSelectedColumns}
            transformationName={transformationName}
          />
        </>
      )}
    </SelectColumnWrapper>
  );
}
