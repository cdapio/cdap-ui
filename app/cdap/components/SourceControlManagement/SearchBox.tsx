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

// TODO: create a unified searchbox component for the entire project

import { IconButton, InputAdornment, TextField } from '@material-ui/core';
import React from 'react';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import styled from 'styled-components';
import T from 'i18n-react';

const PREFIX = 'features.SourceControlManagement.push';

const StyledTextField = styled(TextField)`
  & input {
    padding: 10px 5px;
  }
`;

const StyledDiv = styled.div`
  margin: 12px 0px;
`;

interface ISearchBoxProps {
  nameFilter: string;
  setNameFilter: (nameFilter: string) => void;
}

export const SearchBox = ({ nameFilter, setNameFilter }: ISearchBoxProps) => {
  const handleSearchChange = (e) => {
    setNameFilter(e.target.value);
  };

  return (
    <StyledDiv>
      <StyledTextField
        fullWidth
        id="component-outlined"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: nameFilter ? (
            <InputAdornment position="end">
              <IconButton onClick={() => setNameFilter('')}>
                <CloseIcon />
              </IconButton>
            </InputAdornment>
          ) : (
            undefined
          ),
        }}
        label={T.translate(`${PREFIX}.searchLabel`)}
        variant="outlined"
        onChange={handleSearchChange}
        value={nameFilter}
      />
    </StyledDiv>
  );
};
