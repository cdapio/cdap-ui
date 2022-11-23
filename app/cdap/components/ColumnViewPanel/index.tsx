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

import { Box } from '@material-ui/core';
import SelectColumnsList from 'components/ColumnViewPanel/components/SelectColumnsList';
import ColumnViewWidget from 'components/ColumnViewPanel/components/ColumnViewWidget';
import T from 'i18n-react';
import React, { Fragment, useState } from 'react';
import styled from 'styled-components';
import { IHeaderNamesList } from 'components/GridTable/types';

export const HEADING_TEXT = T.translate('features.WranglerNewUI.ColumnViewPanel.columnView');

export interface IColumnViewProps {
  columnData: IHeaderNamesList[];
  closeClickHandler: () => void;
  dataQuality: IDataQuality;
  setColumnSelected: (columName: string) => void;
  onColumnSelection: (column: string) => void;
  selectedColumn: string;
  handleCoumnDeSelect: () => void;
}

export interface IDataQuality {
  [key: string]: unknown;
}

const SelectColumnListWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  padding: 0;
`;

export default function({
  columnData,
  dataQuality,
  closeClickHandler,
  setColumnSelected,
  onColumnSelection,
  selectedColumn,
  handleCoumnDeSelect,
}: IColumnViewProps) {
  const [searchValue, setSearchValue] = useState<string>('');

  return (
    <Fragment>
      <ColumnViewWidget
        headingText={HEADING_TEXT}
        closeClickHandler={closeClickHandler}
        searchedTermHandler={(searchValue: string) => setSearchValue(searchValue)}
        searchValue={searchValue}
      >
        <SelectColumnListWrapper data-testid="select-column-list-parent">
          <SelectColumnsList
            columnData={columnData}
            dataQuality={dataQuality}
            searchTerm={searchValue}
            setColumnSelected={setColumnSelected}
            onColumnSelection={onColumnSelection}
            selectedColumn={selectedColumn}
            handleCoumnDeSelect={handleCoumnDeSelect}
          />
        </SelectColumnListWrapper>
      </ColumnViewWidget>
    </Fragment>
  );
}
