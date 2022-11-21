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
import Close from '@material-ui/icons/Close';
import SearchRounded from '@material-ui/icons/SearchRounded';
import HeaderLabelWrapper from 'components/ConnectionList/Components/Header/Components/HeaderLabelWrapper';
import { IHeaderContentProps } from 'components/ConnectionList/types';
import React, { ChangeEvent, Fragment, MouseEvent } from 'react';
import styled from 'styled-components';
import T from 'i18n-react';

const PREFIX = 'features.WranglerNewUI';

const ConnectionListHeaderWrapper = styled(Box)`
  display: ${(props) => (props.toggleSearch ? 'none' : 'flex')};
  justify-content: space-between;
  align-items: center;
  height: 50px;
  padding-right: 18px;
  padding-left: 30px;
`;

const ConnectionListSearchWrapper = styled(Box)`
  display: ${(props) => (props.toggleSearch ? 'flex' : 'none')};
  background-color: #fff;
  align-items: center;
  height: 50px;
  padding-right: 20px;
  padding-left: 18px;
  text-decoration: none;
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
  height: ${(props) => (props.inputHeight ? props.inputHeight : '35px')};
  outline: 0;
`;

const SearchInput = styled(RenderInput)`
  margin-left: 9px;
`;

export default function({
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
  const HeaderForConnectors = (
    <HeaderContainer>
      <Typography variant="body2" component="div">
        {T.translate(`${PREFIX}.ConnectionsList.labels.dataConnections`)}
      </Typography>
    </HeaderContainer>
  );

  const HeaderForDatasets = (
    <>
      <ConnectionListHeaderWrapper toggleSearch={eachFilteredData.toggleSearch}>
        <HeaderLabelWrapper
          headersRefs={headersRefs}
          columnIndex={columnIndex}
          tabsData={tabsData}
          filteredData={filteredData}
        />
        <IconButton
          onClick={() => searchHandler(columnIndex)}
          data-testid={`search-icon-${columnIndex}`}
        >
          <SearchRounded />
        </IconButton>
      </ConnectionListHeaderWrapper>
      <ConnectionListSearchWrapper
        toggleSearch={eachFilteredData.toggleSearch}
        onMouseOver={() => makeCursorFocused(columnIndex)}
      >
        <SearchRounded />
        <SearchInput
          inputHeight="21px"
          type="text"
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleSearch(e, columnIndex)}
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
      </ConnectionListSearchWrapper>
    </>
  );

  return <Fragment>{!!levelIndex ? HeaderForDatasets : HeaderForConnectors}</Fragment>;
}
