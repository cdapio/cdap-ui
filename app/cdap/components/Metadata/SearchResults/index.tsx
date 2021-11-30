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

import React, { useState, useEffect } from 'react';
import T from 'i18n-react';
import styled from 'styled-components';
import { MySearchApi } from 'api/search';
import { getCurrentNamespace } from 'services/NamespaceStore';
import SearchBar from 'components/Metadata/SearchBar';
import ResultList from 'components/Metadata/SearchResults/ResultList';
import Filters, { IFilterItem, Operations } from 'components/Metadata/SearchResults/Filters';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import orderBy from 'lodash/orderBy';
import PaginationWithTitle from 'components/shared/PaginationWithTitle';
import Helmet from 'react-helmet';
import { useParams } from 'react-router';
import { Theme } from 'services/ThemeHelper';
import { getMetadataPageUrl } from 'components/Metadata/urlHelper';

import {
  parseResult,
  METADATA_FILTERS,
  getMatchedFiltersCount,
  applyFilter,
  getResultCount,
  ISearchResponse,
} from 'components/Metadata/SearchResults/helper';

const I18N_PREFIX = 'features.MetadataSearch';

const Container = styled.div`
  display: flex;
  min-height: calc(100% - 62px);
  background: var(--grey07);
`;

const FilterSection = styled.div`
  width: 300px;
  border-right: 1px solid var(--grey05);
`;

const TitleBar = styled.div`
  background: var(--grey07);
  border-bottom: 1px solid var(--grey05);
  display: flex;
  align-items: center;
  height: 50px;
  padding: 0 15px;
`;

const SortByControl = styled(FormControl)`
  margin: 0 20px 0 10px;
`;

const Title = styled.h3`
  font-weight: 700;
  font-size: 14px !important;
  margin: 0;
`;

const TrackerFilter = styled.div`
  margin: 0 20px 0 10px;
  font-weight: 500;
`;

const ResultsSection = styled.div`
  width: calc(100% - 300px);
  min-height: 100%;
  background: var(--white);
`;

const ResultsCount = styled.p`
  color: var(--grey03);
  margin: 0;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin: 12px 0;
`;

const Loader = styled.h3`
  font-size: 1.4rem !important;
  margin: 15px;
  font-weight: 500;
  color: var(--grey01);
  white-space: nowrap;
`;

const NoResults = styled.h4`
  margin: 150px 0 0 0;
  padding: 0;
  color: var(--grey01);
  font-size: 1.23rem !important;
  font-weight: 500;
  text-align: center;
  flex-grow: 1;
`;

const PAGE_SIZE = 10;

const SearchResults: React.FC = () => {
  const params = useParams();
  const query = (params as any).query;
  const sortByLabel = T.translate(`${I18N_PREFIX}.sortBy`);
  const metadataLabel = T.translate(`${I18N_PREFIX}.filters.metadata`);
  const entitiesLabel = T.translate(`${I18N_PREFIX}.filters.entities`);
  const sortByOptions = [
    {
      name: T.translate(`${I18N_PREFIX}.sortOptions.oldest`),
      sort: 'createDate',
      order: 'asc',
    },
    {
      name: T.translate(`${I18N_PREFIX}.sortOptions.newest`),
      sort: 'createDate',
      order: 'desc',
    },
    {
      name: T.translate(`${I18N_PREFIX}.sortOptions.ascending`),
      sort: 'name',
      order: 'asc',
    },
    {
      name: T.translate(`${I18N_PREFIX}.sortOptions.descending`),
      sort: 'name',
      order: 'desc',
    },
  ];
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState(sortByOptions[0]);
  const [metadataFiltersMatched, setMetadataFiltersMatched] = useState(0);
  const [searchResults, setSearchResults] = useState([]);
  const [fullResults, setFullResults] = useState([]);
  const [entityFilters, setEntityFilters] = useState([
    {
      name: 'Datasets',
      isActive: true,
      filter: 'Dataset',
      count: 0,
    },
  ]);
  const [metadataFilters, setMetadataFilters] = useState(
    METADATA_FILTERS.map((name) => ({
      name,
      isActive: true,
      filter: '',
      count: 0,
    }))
  );

  const searchParams = {
    target: ['dataset'],
    limit: 25,
    query,
    responseFormat: 'v6',
    namespace: getCurrentNamespace(),
    sort: '',
  };

  if (query === '*') {
    searchParams.sort = 'creation-time desc';
  } else if (query.charAt(query.length - 1) !== '*') {
    searchParams.query = `${query}*`;
    delete searchParams.sort;
  }

  useEffect(() => {
    setLoading(true);
    MySearchApi.search(searchParams).subscribe((response) => {
      setLoading(false);
      const results = response.results as ISearchResponse[];
      if (results.length > 0) {
        const parsedResponse = parseResult(query, results, metadataFilters);
        setFullResults(parsedResponse.results);
        setSearchResults(orderBy(parsedResponse.results, [sortBy.sort], [sortBy.order]));
        setMetadataFiltersMatched(getMatchedFiltersCount(metadataFilters));
        const updatedEntitiyFilter = Object.assign(entityFilters[0], {
          count: parsedResponse.count,
        });
        setEntityFilters([updatedEntitiyFilter]);
        setMetadataFilters(metadataFilters);
      }
    });
  }, []);

  function onFilterChange(operation: Operations, filter: IFilterItem, isMetadata: false) {
    const filtered = applyFilter(
      operation,
      filter,
      isMetadata,
      fullResults,
      entityFilters,
      metadataFilters
    );
    setSearchResults(orderBy(filtered.results, [sortBy.sort], [sortBy.order]));
    setMetadataFilters(filtered.metadataFilters);
    setEntityFilters(filtered.entityFilters);
  }

  function onChangeSort(event) {
    const selected = event.target.value;
    const sort = selected.split('-');
    setSortBy({ name: '', sort: sort[0], order: sort[1] });
    setSearchResults(orderBy(searchResults, [sort[0]], [sort[1]]));
  }

  function onPageChange({ selected }) {
    setCurrentPage(++selected);
  }

  function onSearch(searchQuery: string) {
    window.location.href = getMetadataPageUrl('search', { query: searchQuery });
  }

  const page = getResultCount(currentPage, searchResults.length, PAGE_SIZE);

  return (
    <>
      <Helmet
        title={T.translate(`${I18N_PREFIX}.pageTitle`, {
          productName: Theme.productName,
        })}
      />
      <SearchBar query={query} onSearch={onSearch} />
      <Container>
        {loading && (
          <Loader>
            <span className="fa fa-spinner fa-spin"></span>{' '}
            <span>{T.translate(`${I18N_PREFIX}.loading`, { query })}</span>
          </Loader>
        )}
        {fullResults.length === 0 && !loading && (
          <NoResults>{T.translate(`${I18N_PREFIX}.emptyResults`, { query })}</NoResults>
        )}
        {fullResults.length > 0 && !loading && (
          <>
            <FilterSection>
              <TitleBar>
                <Title>{T.translate(`${I18N_PREFIX}.filterBy`)}</Title>
              </TitleBar>
              <TrackerFilter>
                <Filters
                  title={`${entitiesLabel}`}
                  list={entityFilters}
                  onChange={onFilterChange}
                  isMetadata={false}
                />
                {metadataFiltersMatched > 0 && (
                  <Filters
                    title={`${metadataLabel}`}
                    list={metadataFilters}
                    onChange={onFilterChange}
                    isMetadata={true}
                  />
                )}
              </TrackerFilter>
            </FilterSection>
            <ResultsSection>
              <TitleBar>
                <Title>{sortByLabel}</Title>
                <SortByControl variant="standard">
                  <Select
                    value={`${sortBy.sort}-${sortBy.order}`}
                    inputProps={{ 'aria-label': `${sortBy}` }}
                    onChange={onChangeSort}
                  >
                    {sortByOptions.map((option) => (
                      <MenuItem value={`${option.sort}-${option.order}`}>{option.name}</MenuItem>
                    ))}
                  </Select>
                </SortByControl>
                <ResultsCount>
                  {T.translate(`${I18N_PREFIX}.resultCount`, {
                    page,
                    total: searchResults.length,
                    context: searchResults.length,
                  })}
                </ResultsCount>
              </TitleBar>
              {searchResults.length === 0 && (
                <NoResults>{T.translate(`${I18N_PREFIX}.noResults`)}</NoResults>
              )}
              {searchResults.length > 0 && (
                <ResultList
                  results={searchResults}
                  currentPage={currentPage}
                  pageSize={PAGE_SIZE}
                  query={query}
                />
              )}
              {searchResults.length > PAGE_SIZE && (
                <Pagination>
                  <PaginationWithTitle
                    handlePageChange={onPageChange}
                    currentPage={currentPage}
                    totalPages={searchResults.length / PAGE_SIZE}
                  />
                </Pagination>
              )}
            </ResultsSection>
          </>
        )}
      </Container>
    </>
  );
};

export default SearchResults;
