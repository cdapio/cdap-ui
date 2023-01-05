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

import { Box, IconButton, Typography } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import Close from '@material-ui/icons/Close';
import SearchRounded from '@material-ui/icons/SearchRounded';
import CustomTooltip from 'components/ConnectionList/Components/CustomTooltip';
import { IHeaderContentProps } from 'components/ConnectionList/types';
import T from 'i18n-react';
import React, { ChangeEvent, MouseEvent } from 'react';
import styled from 'styled-components';

const PREFIX = 'features.WranglerNewUI';

const ConnectionListHeaderWrapper = styled(Box)`
  justify-content: space-between;
  align-items: center;
  height: 50px;
  padding-left: 30px;
`;

const ConnectionListHeaderWrapperWhileSearching = styled(ConnectionListHeaderWrapper)`
  display: none;
`;

const ConnectionListHeaderWrapperWhileNotSearching = styled(ConnectionListHeaderWrapper)`
  display: flex;
`;

const ConnectionListSearchWrapper = styled(Box)`
  background-color: #fff;
  align-items: center;
  height: 50px;
  padding-left: 18px;
  text-decoration: none;
`;

const ConnectionListSearchWrapperWhileSearching = styled(ConnectionListSearchWrapper)`
  display: flex;
`;

const ConnectionListSearchWrapperWhileNotSearching = styled(ConnectionListSearchWrapper)`
  display: none;
`;

const HeaderContainer = styled(Box)`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 50px;
  padding-left: 38px;
`;

const RenderInput = styled.input`
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 150%;
  color: #000000;
  width: 100%;
  background-color: #ffffff;
  border: none;
  height: 21px;
  outline: 0;
`;

const RenderLabel = styled(Typography)`
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 150%;
  color: ${grey[900]};
  max-width: 230px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SearchInput = styled(RenderInput)`
  margin-left: 9px;
`;

const getConnectionListHeaderWrapper = (toggleSearch: Boolean) => {
  return toggleSearch
    ? ConnectionListHeaderWrapperWhileSearching
    : ConnectionListHeaderWrapperWhileNotSearching;
};

const getConnectionListSearchWrapper = (toggleSearch: Boolean) => {
  return toggleSearch
    ? ConnectionListSearchWrapperWhileSearching
    : ConnectionListSearchWrapperWhileNotSearching;
};

export default function Header({
  levelIndex,
  eachFilteredData,
  headersRefs,
  columnIndex,
  tabsData,
  filteredData,
  searchHandler,
  makeCursorFocused,
  handleSearch,
  refs,
  handleClearSearch,
}: IHeaderContentProps) {
  const HeaderWrapper = getConnectionListHeaderWrapper(eachFilteredData.toggleSearch);
  const SearchWrapper = getConnectionListSearchWrapper(eachFilteredData.toggleSearch);

  const tooltipRequired =
    headersRefs?.current[columnIndex]?.offsetWidth < headersRefs?.current[columnIndex]?.scrollWidth;

  const HeaderForConnectors = (
    <HeaderContainer>
      <Typography variant="body2" component="div">
        {T.translate(`${PREFIX}.ConnectionsList.labels.dataConnections`)}
      </Typography>
    </HeaderContainer>
  );

  const HeaderForDatasets = (
    <>
      <HeaderWrapper>
        <CustomTooltip
          title={tooltipRequired ? filteredData[columnIndex - 1].selectedTab : ''}
          arrow
        >
          <RenderLabel
            variant="body2"
            ref={(element) => {
              headersRefs.current[columnIndex] = element;
            }}
          >
            {filteredData[columnIndex - 1]?.selectedTab}
          </RenderLabel>
        </CustomTooltip>
        <IconButton
          onClick={() => searchHandler(columnIndex)}
          data-testid={`search-icon-${columnIndex}`}
        >
          <SearchRounded />
        </IconButton>
      </HeaderWrapper>
      <SearchWrapper onMouseOver={() => makeCursorFocused(columnIndex)}>
        <SearchRounded />
        <SearchInput
          inputHeight="21px"
          type="text"
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleSearch(e, columnIndex)}
          onBlur={(e: ChangeEvent<HTMLInputElement>) => handleSearch(e, columnIndex)}
          ref={(e: HTMLInputElement) => {
            refs.current[columnIndex] = e;
          }}
          data-testid={`search-field-${columnIndex}`}
        />
        <IconButton
          onClick={(e: MouseEvent<HTMLInputElement>) => {
            return handleClearSearch(e, columnIndex);
          }}
          data-testid={`clear-search-icon-${columnIndex}`}
        >
          <Close />
        </IconButton>
      </SearchWrapper>
    </>
  );

  return !!levelIndex ? HeaderForDatasets : HeaderForConnectors;
}
