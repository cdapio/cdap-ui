/*
 * Copyright © 2021 Cask Data, Inc.
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

import React, { useState } from 'react';
import T from 'i18n-react';
import Search from '@material-ui/icons/Search';
import styled from 'styled-components';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import ResourceCenterButton from 'components/ResourceCenterButton';

const I18N_PREFIX = 'features.MetadataSearch';

const Container = styled.div`
  background: var(--grey06);
  border-bottom: 1px solid var(--grey05);
  padding: 10px;
`;

const SearchForm = styled(Paper)`
  display: flex;
  align-items: center;
  padding: 2px 4px;
  min-width: 400px;
  width: 25%;
  height: 40px;
`;

const SearchInput = styled(InputBase)`
  flex: 1;
  margin-left: 8px;
  font-size: 13px;
`;

const ResourceAddButton = styled(ResourceCenterButton)`
  top: 80px;
`;

interface ISearchBarProps {
  query: string;
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<ISearchBarProps> = ({ query, onSearch }) => {
  const searchQueryRegex = new RegExp('^(?![*]).*$');
  const searchPlaceholder = T.translate(`${I18N_PREFIX}.searchPlaceholder`);
  const [error, setError] = useState(false);

  const handleSearch = (event) => {
    const searchQuery = event.target.value;
    const isValid = searchQueryRegex.test(searchQuery);
    setError(!isValid);
    if (event.key === 'Enter' && searchQuery.trim() !== '' && isValid) {
      onSearch(searchQuery.trim());
    }
  };

  return (
    <>
      <Container>
        <SearchForm>
          <SearchInput
            defaultValue={query}
            error={error}
            onKeyUp={handleSearch}
            placeholder={searchPlaceholder}
            inputProps={{ 'aria-label': searchPlaceholder }}
          />
          <IconButton type="submit" aria-label={`${searchPlaceholder}`}>
            <Search />
          </IconButton>
        </SearchForm>
      </Container>
      <ResourceAddButton />
    </>
  );
};

export default SearchBar;
