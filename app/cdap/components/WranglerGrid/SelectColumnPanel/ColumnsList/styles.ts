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

import styled from 'styled-components';
import { grey } from '@material-ui/core/colors';
import { Box, IconButton } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

export const ColumnWrapper = styled(Box)`
  height: 90%;
`;

export const ColumnInnerWrapper = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
`;

export const CenterAlignBox = styled(Box)`
  text-align: center;
`;

export const FlexWrapper = styled(Box)`
  display: flex;
  height: 100%;
  align-items: center;
`;

export const SearchWrapper = styled(Box)`
  position: relative;
  display: flex;
`;

export const SearchIconButton = styled(IconButton)`
  padding: 5px 0px 5px 5px;

  &.MuiIconButton-root:hover {
    background-color: transparent;
  }
  & .MuiTouchRipple-root {
    display: none;
  }
`;

export const StyledSearchIcon = styled(SearchIcon)`
  &.MuiSvgIcon-root {
    width: 24px;
    height: 24px;
  }
`;

export const SearchInputField = styled.input`
  margin-right: 5px;
  border: none;
  border-bottom: 1px solid transparent;
  margin-bottom: 5px;
  &:focus {
    border-bottom: 1px solid ${grey[700]};
    outline: none;
  }
`;
