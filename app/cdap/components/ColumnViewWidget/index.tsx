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

import { Box, Typography } from '@material-ui/core';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import React, { Fragment, useRef, useState } from 'react';
import DrawerWidgetHeading from 'components/ColumnViewWidget/DrawerWidgetHeading';
import { useStyles } from 'components/ColumnViewWidget/styles';
import SearchIcon from '@material-ui/icons/SearchOutlined';
import { IColumnViewWidget } from 'components/ColumnViewWidget/types';
import styled from 'styled-components';

const DrawerContainerStyle = styled(Box)`
  width: 389px;
  border-top: 1px solid #3994ff;
  height: calc(100vh - 190px);
  border-right: 1px solid #e0e0e0;
`;

const HeaderStyle = styled.header`
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeaderTextWithBackIcon = styled.div`
  display: flex;
  align-items: center;
  padding-left: 30px;
`;

const HeaderRightIconWrapper = styled(Box)`
  display: flex;
  align-items: center;
  padding-right: 24px;
`;

const SearchFormControl = styled(Box)`
  position: relative;
  display: flex;
  margin-right: 16px;
`;

const SearchIconStyle = styled(Typography)`
  margin-top: 3px;
  cursor: pointer;
`;

const DividerLineStyles = styled.div`
  width: 1px;
  height: 28px;
  margin-right: 12px;
  background-color: #dadce0;
`;

const PointerStyle = styled(CloseRoundedIcon)`
  cursor: pointer;
`;

export default function({
  headingText,
  closeClickHandler,
  searchedTermHandler,
  children,
}: IColumnViewWidget) {
  const classes = useStyles();
  const [focused, setFocused] = useState<boolean>(false);
  const ref = useRef(null);

  const InputStyle = styled.input`
    z-index: 0;
    cursor: pointer;
    position: absolute;
    right: 0px;
    ${({ focused }) =>
      focused &&
      `
    border: none;
  border-bottom: 1px solid grey;
  outline: none;
  `}
    ${({ focused }) =>
      !focused &&
      `
  border: none;
  border-bottom: 1px solid transparent;
`}
  `;

  const handleFocus = () => {
    ref?.current.focus();
    setFocused(true);
  };

  return (
    <DrawerContainerStyle role="presentation" data-testid="column-view-panel-parent">
      <HeaderStyle>
        <HeaderTextWithBackIcon>
          <DrawerWidgetHeading headingText={headingText} />
        </HeaderTextWithBackIcon>
        <HeaderRightIconWrapper>
          <SearchFormControl>
            <input
              className={`${classes.searchInput} ${
                focused ? classes.isFocused : classes.isBlurred
              }`}
              onChange={(e) => searchedTermHandler(e.target.value)}
              ref={ref}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              data-testid="search-term-input"
            />
            <SearchIconStyle component="span" onClick={handleFocus} data-testid="search-icon">
              <SearchIcon />
            </SearchIconStyle>
          </SearchFormControl>

          <DividerLineStyles />
          <PointerStyle
            color="action"
            onClick={closeClickHandler}
            data-testid="column-view-panel-close"
          />
        </HeaderRightIconWrapper>
      </HeaderStyle>
      <Fragment>{children}</Fragment>
    </DrawerContainerStyle>
  );
}
