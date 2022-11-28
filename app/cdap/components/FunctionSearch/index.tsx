/*
 *  Copyright © 2022 Cask Data, Inc.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"); you may not
 *  use this file except in compliance with the License. You may obtain a copy of
 *  the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 *  WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 *  License for the specific language governing permissions and limitations under
 *  the License.
 */

import { Box, IconButton, InputAdornment } from '@material-ui/core';
import {
  ArrowIcon,
  AutoSearch,
  ClearSearchIcon,
  DirectiveContainer,
  DirectiveDescription,
  DirectiveDescriptionContainer,
  DirectiveName,
  SearchBox,
  SearchIcon,
  SearchResultsContainer,
  SearchResultsHeader,
  SearchResultsHeaderText,
  StyledPaperComponent,
  StyledTextField,
  Underline,
} from 'components/FunctionSearch/StyledComponents';
import { FUNCTIONS_LIST } from 'components/WranglerGrid/NestedMenu/menuOptions/datatypeOptions';
import T from 'i18n-react';
import React, { ChangeEvent, useEffect, useState } from 'react';

const PREFIX = 'features.WranglerNewUI.GridPage';

interface ISearchResult {
  description: string;
  value: string;
  label: string;
  supportedDataType: string;
  infoLink: string;
}

export default function({ transformationPanel }) {
  const [searchResults, setSeachResults] = useState([]);
  const [displayRecentSearches, setDisplayRecentSearches] = useState(false);
  const [textFieldInput, setTextFieldInput] = useState('');
  const [selectedDirective, setSelectedDirective] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);

  const getDirectivesList = () => {
    setSeachResults([...FUNCTIONS_LIST]);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTextFieldInput(e.target.value);
    if (e.target.value === '') {
      setDisplayRecentSearches(true);
    } else {
      setDisplayRecentSearches(false);
    }
  };

  const handleClose = () => {
    setDisplayRecentSearches(true);
  };

  const handleOptionClick = (selectedOption: ISearchResult) => {
    setTextFieldInput('');
    setSelectedDirective(selectedOption.value);
    transformationPanel(
      selectedOption.value,
      selectedOption.supportedDataType,
      selectedOption.infoLink
    );
    const currentRecentSearch = selectedOption;
    const array = [...recentSearches];
    const filterredSearchResults = array.filter((item) => item.label !== currentRecentSearch.label);
    if (recentSearches.length >= 4) {
      array.splice(-1);
      setRecentSearches([currentRecentSearch, ...filterredSearchResults]);
    } else {
      setRecentSearches([currentRecentSearch, ...filterredSearchResults]);
    }
    setDisplayRecentSearches(false);
  };

  useEffect(() => {
    getDirectivesList();
    if (textFieldInput === '') {
      setDisplayRecentSearches(true);
    }
  }, []);

  useEffect(() => {
    if (textFieldInput === '') {
      setDisplayRecentSearches(true);
    } else {
      setDisplayRecentSearches(false);
    }
  }, [textFieldInput]);

  const StyledPaper = (props) => {
    return (
      <Box>
        {recentSearches.length > 0 && displayRecentSearches && (
          <SearchResultsHeader>
            <SearchResultsHeaderText component="p" data-testid="functions-search-recent-results">
              {T.translate(`${PREFIX}.toolbarIcons.labels.recentResults`)}
            </SearchResultsHeaderText>
            {Underline}
          </SearchResultsHeader>
        )}
        {searchResults.length > 0 && textFieldInput?.length > 0 && (
          <SearchResultsHeader>
            <SearchResultsHeaderText component="p" data-testid="functions-search-results">
              {T.translate(`${PREFIX}.toolbarIcons.labels.searchResults`)}
            </SearchResultsHeaderText>
            {Underline}
          </SearchResultsHeader>
        )}
        <StyledPaperComponent elevation={0} {...props} />
      </Box>
    );
  };

  return (
    <SearchBox data-testid="search-box">
      <AutoSearch
        options={displayRecentSearches ? recentSearches : searchResults}
        getOptionLabel={(option) =>
          searchResults.length ? option.label.concat(`(${option.description})`) : ''
        }
        autoHighlight={true}
        PaperComponent={StyledPaper}
        onClose={handleClose}
        selectOnFocus
        clearOnBlur={true}
        clearOnEscape={true}
        inputValue={textFieldInput}
        renderOption={(option) => (
          <SearchResultsContainer
            key={option.directive}
            onClick={() => handleOptionClick(option)}
            role="button"
            data-testid={`search-result-${option.label
              .toLowerCase()
              .split(' ')
              .join('-')}`}
          >
            <DirectiveContainer>
              <DirectiveName variant="body1">{option.label}</DirectiveName>
              <DirectiveDescriptionContainer>
                <DirectiveDescription variant="body1">{option.description}</DirectiveDescription>
                <ArrowIcon />
              </DirectiveDescriptionContainer>
            </DirectiveContainer>
          </SearchResultsContainer>
        )}
        renderInput={(params) => (
          <StyledTextField
            placeholder={T.translate(`${PREFIX}.toolbarIcons.labels.placeHolder`)}
            {...params}
            variant="outlined"
            onBlur={() => setTextFieldInput('')}
            onChange={(e) => handleInputChange(e)}
            InputProps={{
              ...params.InputProps,
              'data-testid': 'function-search-input-field',
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),

              endAdornment: (
                <InputAdornment position="end">
                  {textFieldInput?.length > 0 && (
                    <IconButton onClick={() => setTextFieldInput('')}>
                      <ClearSearchIcon data-testid="clear-search-icon" />
                    </IconButton>
                  )}
                </InputAdornment>
              ),
            }}
          />
        )}
      />
    </SearchBox>
  );
}
