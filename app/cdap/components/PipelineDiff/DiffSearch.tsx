/*
 * Copyright © 2023 Cask Data, Inc.
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
import React from 'react';
import { InputBase } from '@material-ui/core';
import styled from 'styled-components';
import SearchIcon from '@material-ui/icons/Search';
import { blue } from '@material-ui/core/colors';

const DiffSearchRoot = styled.div`
  align-items: center;
  background-color: ${blue[100]};
  display: flex;
  padding: 5px 16px;
  position: relative;
  width: 100%;
`;

const SearchBar = styled.div`
  background-color: ${blue[50]};
  border-radius: 4px;
  display: flex;
  height: 100%;
  max-height: 100%;
  padding: 0 5px;
  position: relative;
  width: 100%;
`;

const SearchBarIconContainer = styled.div`
  align-items: center;
  display: flex;
  height: 100%;
  justify-content: center;
  padding: 0 5px;
  pointer-events: none;
`;

const SearchInputContainer = styled.div`
  background-color: inherit;
  flex: 1;
  & > .MuiInputBase-root,
  & > .MuiInputBase-input {
    width: 100%;
  }
`;

export const DiffSearch = ({ search, setSearch }) => {
  return (
    <DiffSearchRoot>
      <SearchBar>
        <SearchBarIconContainer>
          <SearchIcon />
        </SearchBarIconContainer>
        <SearchInputContainer>
          <InputBase
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            placeholder="Search"
          />
        </SearchInputContainer>
      </SearchBar>
    </DiffSearchRoot>
  );
};
