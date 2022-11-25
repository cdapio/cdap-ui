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

import { Box, Typography, Input, IconButton } from '@material-ui/core';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import React, { Fragment, useRef, useState } from 'react';
import DrawerWidgetHeading from 'components/ColumnViewPanel/components/ColumnViewWidget/DrawerWidgetHeading';
import SearchIcon from '@material-ui/icons/SearchOutlined';
import styled from 'styled-components';
import { ReactNode } from 'react';

export interface IColumnViewWidget {
  headingText: ReactNode;
  closeClickHandler: () => void;
  searchedTermHandler: (searchedTerm: string) => void;
  children: JSX.Element;
  searchValue: string;
}

const CommonInputStyle = styled(Input)`
  width: 140px !important;
  border: none !important;
  padding-right: 5px !important;
`;

const DividerLineStyles = styled.div`
  width: 1px;
  height: 28px;
  background-color: #dadce0;
`;

const DrawerContainerStyle = styled(Box)`
  width: 389px;
  border-top: 1px solid #3994ff;
  height: calc(100vh - 190px);
  border-right: 1px solid #e0e0e0;
`;

const FocusedInput = styled(CommonInputStyle)`
  border-bottom: 1px solid grey !important;
  outline: none !important;
`;

const NormalInput = styled(CommonInputStyle)`
  border: none !important;
  border-bottom: 1px solid transparent !important;
  & .MuiInput-underline::before {
    border: none !important;
    border-bottom: 1px solid transparent !important;
  }
  & .MuiInputBase-input {
    border: none !important;
    border-bottom: 1px solid transparent !important;
  }
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
  padding-right: 8px;
`;

const SearchFormControl = styled(Box)`
  position: relative;
  display: flex;
  margin-right: 16px;
`;

const SearchIconStyle = styled(Typography)`
  margin-top: 5px;
  cursor: pointer;
`;

const CloseButtonStyle = styled(IconButton)`
  cursor: pointer;
  display: flex;
  justify-content: flex-end !important;
`;

const getInputStyle = (isFocused) => {
  return isFocused ? FocusedInput : NormalInput;
};

export default function({
  headingText,
  closeClickHandler,
  searchedTermHandler,
  children,
  searchValue,
}: IColumnViewWidget) {
  const [focus, setFocus] = useState<boolean>(false);
  const ref = useRef(null);

  const InputStyleWrapper = getInputStyle(focus);

  const handleFocus = () => {
    ref?.current.focus();
    setFocus(true);
  };

  return (
    <DrawerContainerStyle role="presentation" data-testid="column-view-panel-parent">
      <HeaderStyle>
        <HeaderTextWithBackIcon>
          <DrawerWidgetHeading headingText={headingText} />
        </HeaderTextWithBackIcon>
        <HeaderRightIconWrapper>
          <SearchFormControl>
            <InputStyleWrapper
              onChange={(e) => searchedTermHandler(e.target.value)}
              inputRef={ref}
              onFocus={() => setFocus(true)}
              onBlur={() => setFocus(false)}
              inputProps={{
                'data-testid': 'search-term-input',
              }}
              disableUnderline={true}
              defaultValue={searchValue}
              autoFocus={focus}
            />
            <SearchIconStyle component="span" onClick={handleFocus} data-testid="search-icon">
              <SearchIcon />
            </SearchIconStyle>
          </SearchFormControl>

          <DividerLineStyles />
          <CloseButtonStyle aria-label="close-icon" onClick={closeClickHandler}>
            <CloseRoundedIcon color="action" data-testid="column-view-panel-close" />
          </CloseButtonStyle>
        </HeaderRightIconWrapper>
      </HeaderStyle>
      <Fragment>{children}</Fragment>
    </DrawerContainerStyle>
  );
}
