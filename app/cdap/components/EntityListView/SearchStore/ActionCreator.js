/*
 * Copyright © 2017-2018 Cask Data, Inc.
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

import { MySearchApi } from 'api/search';
import { getCurrentNamespace } from 'services/NamespaceStore';
import { parseMetadata } from 'services/metadata-parser';
import uuidV4 from 'uuid/v4';
import SearchStore from 'components/EntityListView/SearchStore';
import SearchStoreActions from 'components/EntityListView/SearchStore/SearchStoreActions';
import { DEFAULT_SEARCH_QUERY } from 'components/EntityListView/SearchStore/SearchConstants';
import isNil from 'lodash/isNil';
import { Theme } from 'services/ThemeHelper';

const search = () => {
  const namespace = getCurrentNamespace();
  const {
    offset,
    limit,
    activeFilters,
    activeSort,
    query,
  } = SearchStore.getState().search;

  const params = {
    namespace: namespace,
    target: activeFilters,
    limit,
    offset,
    sort: activeSort.fullSort,
    query,
    responseFormat: 'v6',
    cursorRequested: true,
  };
  if (query !== DEFAULT_SEARCH_QUERY) {
    delete params.sort;
    delete params.cursorRequested;
    params.query = params.query + '*';
  }

  searchRequest(params);
};

const searchRequest = (params) => {
  SearchStore.dispatch({
    type: SearchStoreActions.LOADING,
    payload: {
      loading: true,
    },
  });

  MySearchApi.search(params)
    .map((res) => {
      const responseObj = {
        total: res.totalResults,
        limit: res.limit,
        results: res.results.map(parseMetadata).map((entity) => {
          entity.uniqueId = uuidV4();
          return entity;
        }),
      };

      if (res.cursor) {
        responseObj.cursor = res.cursor;
      }

      return responseObj;
    })
    .subscribe(
      (response) => {
        const state = SearchStore.getState().search;
        const currentPage = state.currentPage;
        if (
          response.total > 0 &&
          Math.ceil(response.total / state.limit) < currentPage
        ) {
          SearchStore.dispatch({
            type: SearchStoreActions.SETERROR,
            payload: {
              errorStatusCode: 'PAGE_NOT_FOUND',
              errorMessage: null,
            },
          });
          return;
        }
        SearchStore.dispatch({
          type: SearchStoreActions.SETRESULTS,
          payload: { response },
        });
      },
      (error) => {
        SearchStore.dispatch({
          type: SearchStoreActions.SETERROR,
          payload: {
            errorStatusCode: error.statusCode,
            errorMessage: typeof error === 'object' ? error.response : error,
          },
        });
      }
    );
};

const updateQueryString = () => {
  let queryString = '';
  let sort = '';
  let filter = '';
  let query = '';
  let page = '';
  let queryParams = [];

  const searchState = SearchStore.getState().search;
  const {
    activeSort,
    activeFilters,
    query: searchQuery,
    currentPage,
    overviewEntity,
  } = searchState;

  // Generate sort params
  if (activeSort.sort !== 'none') {
    sort = 'sort=' + activeSort.sort + '&order=' + activeSort.order;
  }

  // Generate filter params
  if (activeFilters.length === 1) {
    filter = 'filter=' + activeFilters[0];
  } else if (activeFilters.length > 1) {
    filter = 'filter=' + activeFilters.join('&filter=');
  }

  // Generate search param
  if (searchQuery.length > 0) {
    query = 'q=' + searchQuery;
  }

  // Generate page param
  page = 'page=' + currentPage;

  // Combine query parameters into query string
  queryParams = [query, sort, filter, page].filter((element) => {
    return element.length > 0;
  });
  queryString = queryParams.join('&');

  if (queryString.length > 0) {
    queryString = '?' + queryString;
  }

  if (!isNil(overviewEntity)) {
    queryString += `&overviewid=${overviewEntity.id}&overviewtype=${overviewEntity.type}`;
  }

  const obj = {
    title: Theme.productName,
    url: location.pathname + queryString,
  };

  // Modify URL to match application state
  history.pushState(obj, obj.title, obj.url);
};
export { search, updateQueryString };
