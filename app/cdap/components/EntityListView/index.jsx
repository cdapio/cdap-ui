/*
 * Copyright © 2016-2017 Cask Data, Inc.
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

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import SearchStore from 'components/EntityListView/SearchStore';
import {
  search,
  updateQueryString,
} from 'components/EntityListView/SearchStore/ActionCreator';
import HomeListView from 'components/EntityListView/ListView';
import isNil from 'lodash/isNil';
import EntityListHeader from 'components/EntityListView/EntityListHeader';
import EntityListInfo from 'components/EntityListView/EntityListInfo';
import NamespaceStore from 'services/NamespaceStore';
import NamespaceActions from 'services/NamespaceStore/NamespaceActions';
import SearchStoreActions from 'components/EntityListView/SearchStore/SearchStoreActions';
import globalEvents from 'services/global-events';
import ee from 'event-emitter';
import PageErrorMessage from 'components/EntityListView/ErrorMessage/PageErrorMessage';
import HomeErrorMessage from 'components/EntityListView/ErrorMessage';
import Overview from 'components/shared/Overview';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import intersection from 'lodash/intersection';
import { objectQuery } from 'services/helpers';
import Page404 from 'components/404';
import classnames from 'classnames';
import T from 'i18n-react';
import queryString from 'query-string';
import Helmet from 'react-helmet';
import { Theme } from 'services/ThemeHelper';

import {
  DEFAULT_SEARCH_FILTERS,
  DEFAULT_SEARCH_SORT,
  DEFAULT_SEARCH_QUERY,
  DEFAULT_SEARCH_SORT_OPTIONS,
  DEFAULT_SEARCH_PAGE_SIZE,
} from 'components/EntityListView/SearchStore/SearchConstants';

require('./EntityListView.scss');

export default class EntityListView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      entities: [],
      loading: false,
      limit: DEFAULT_SEARCH_PAGE_SIZE,
      total: 0,
      overview: true, // Start showing spinner until we get a response from backend.
      namespaceNotFound: false,
    };
    this.unmounted = false;
    this.eventEmitter = ee(ee);
    // Maintaining a retryCounter outside the state as it doesn't affect the state/view directly.
    // We just need to retry for 5 times exponentially and then stop with a message.
    this.retryCounter = 0;
    this.refreshSearchByCreationTime = this.refreshSearchByCreationTime.bind(
      this
    );
    this.eventEmitter.on(
      globalEvents.APPUPLOAD,
      this.refreshSearchByCreationTime
    );
    this.eventEmitter.on(
      globalEvents.PUBLISHPIPELINE,
      this.refreshSearchByCreationTime
    );
    this.eventEmitter.on(
      globalEvents.ARTIFACTUPLOAD,
      this.refreshSearchByCreationTime
    );
  }
  componentDidMount() {
    const namespaces = NamespaceStore.getState().namespaces.map(
      (ns) => ns.name
    );
    // for when we are already on the non-existing namespace
    if (namespaces.length) {
      const selectedNamespace = NamespaceStore.getState().selectedNamespace;
      if (namespaces.indexOf(selectedNamespace) === -1) {
        !this.unmounted &&
          this.setState({
            namespaceNotFound: true,
          });
      }
    }
    this.namespaceStoreSubscription = NamespaceStore.subscribe(() => {
      const selectedNamespace = NamespaceStore.getState().selectedNamespace;
      const namespaces = NamespaceStore.getState().namespaces.map(
        (ns) => ns.name
      );
      if (namespaces.length && namespaces.indexOf(selectedNamespace) === -1) {
        !this.unmounted &&
          this.setState({
            namespaceNotFound: true,
          });
      } else {
        !this.unmounted &&
          this.state.namespaceNotFound &&
          this.setState({
            namespaceNotFound: false,
          });
      }
    });
    this.searchStoreSubscription = SearchStore.subscribe(() => {
      const {
        results: entities,
        loading,
        limit,
        total,
        overviewEntity,
      } = SearchStore.getState().search;
      !this.unmounted &&
        this.setState({
          entities,
          loading,
          limit,
          total,
          overview: !isNil(overviewEntity),
        });
    });
    SearchStore.dispatch({
      type: SearchStoreActions.SETPAGESIZE,
      payload: {
        element: document.getElementsByClassName('entity-list-view'),
      },
    });
    this.parseUrlAndUpdateStore();
  }
  parseUrlAndUpdateStore(nextProps) {
    const props = nextProps || this.props;
    const queryObject = this.getQueryObject(
      queryString.parse(props.location.search)
    );
    const pageSize = SearchStore.getState().search.limit;
    SearchStore.dispatch({
      type: SearchStoreActions.SETSORTFILTERSEARCHCURRENTPAGE,
      payload: {
        activeSort: queryObject.sort,
        activeFilters: queryObject.filters,
        query: queryObject.query,
        currentPage: queryObject.page,
        offset: (queryObject.page - 1) * pageSize,
        overviewEntity: queryObject.overview,
      },
    });
    search();
  }
  componentWillReceiveProps(nextProps) {
    const searchState = SearchStore.getState().search;
    const queryObject = this.getQueryObject(
      queryString.parse(nextProps.location.search)
    );
    if (
      nextProps.match.params.namespace !== this.props.match.params.namespace ||
      !isEqual(queryObject.filters, searchState.activeFilters) ||
      queryObject.sort.fullSort !== searchState.activeSort.fullSort ||
      queryObject.query !== searchState.query ||
      queryObject.page !== searchState.currentPage ||
      objectQuery(queryObject, 'overview', 'id') !==
        objectQuery(searchState, 'overviewEntity', 'id') ||
      objectQuery(queryObject, 'overview', 'type') !==
        objectQuery(searchState, 'overviewEntity', 'type')
    ) {
      if (
        nextProps.match.params.namespace !== this.props.match.params.namespace
      ) {
        NamespaceStore.dispatch({
          type: NamespaceActions.selectNamespace,
          payload: {
            selectedNamespace: nextProps.match.params.namespace,
          },
        });
      }
      this.parseUrlAndUpdateStore(nextProps);
    }
  }
  componentWillUnmount() {
    SearchStore.dispatch({
      type: SearchStoreActions.RESETSTORE,
    });
    if (this.searchStoreSubscription) {
      this.searchStoreSubscription();
    }
    if (this.namespaceStoreSubscription) {
      this.namespaceStoreSubscription();
    }
    this.eventEmitter.off(
      globalEvents.APPUPLOAD,
      this.refreshSearchByCreationTime
    );
    this.eventEmitter.off(
      globalEvents.PUBLISHPIPELINE,
      this.refreshSearchByCreationTime
    );
    this.eventEmitter.off(
      globalEvents.ARTIFACTUPLOAD,
      this.refreshSearchByCreationTime
    );
    this.unmounted = true;
  }
  refreshSearchByCreationTime() {
    SearchStore.dispatch({
      type: SearchStoreActions.SETACTIVESORT,
      payload: {
        activeSort: SearchStore.getState().search.sort[4],
      },
    });
    search();
    updateQueryString();
  }
  getQueryObject(query) {
    if (isNil(query)) {
      query = {};
    }
    const {
      q = '*',
      sort = DEFAULT_SEARCH_SORT.sort,
      order = DEFAULT_SEARCH_SORT.order,
      filter = DEFAULT_SEARCH_FILTERS,
      page = 1,
      overviewid = null,
      overviewtype = null,
    } = query;
    const getSort = (sortOption, order, q) => {
      const isValidSortOption = DEFAULT_SEARCH_SORT_OPTIONS.find(
        (sortOpt) => sortOpt.sort === sortOption && sortOpt.order === order
      );
      if (!isValidSortOption) {
        return DEFAULT_SEARCH_SORT;
      }
      if (q !== DEFAULT_SEARCH_QUERY) {
        return DEFAULT_SEARCH_SORT_OPTIONS[0];
      }
      return isValidSortOption;
    };
    const getFilters = (filters) => {
      if (!Array.isArray(filters)) {
        filters = [filters];
      }
      const validFilters = intersection(filters, DEFAULT_SEARCH_FILTERS);
      if (!validFilters.length) {
        return DEFAULT_SEARCH_FILTERS;
      }
      return validFilters;
    };
    const getPageNum = (page) => {
      if (isNaN(page)) {
        return 1;
      }
      return parseInt(page, 10);
    };
    const getSearchQuery = (q) => {
      if (isNil(q) || isEmpty(q)) {
        return DEFAULT_SEARCH_QUERY;
      }
      return q;
    };
    const getOverviewEntity = (overviewid, overviewtype) => {
      if (!isNil(overviewid) && !isNil(overviewtype)) {
        return {
          id: overviewid,
          type: overviewtype,
        };
      }
      return null;
    };
    const queryObject = {
      sort: getSort(sort, order, q),
      filters: getFilters(filter),
      page: getPageNum(page),
      query: getSearchQuery(q),
      overview: getOverviewEntity(overviewid, overviewtype),
    };
    return queryObject;
  }
  retrySearch() {
    this.retryCounter += 1;
    search();
  }
  onFastActionSuccess(action) {
    if (action === 'delete') {
      this.onOverviewCloseAndRefresh();
      updateQueryString();
      return;
    }
    search();
  }
  onOverviewCloseAndRefresh() {
    !this.unmounted &&
      this.setState({
        overview: false,
      });
    SearchStore.dispatch({
      type: SearchStoreActions.RESETOVERVIEWENTITY,
    });
    search();
  }
  render() {
    const namespace = NamespaceStore.getState().selectedNamespace;
    const searchState = SearchStore.getState();
    const currentPage = searchState.search.currentPage;
    const query = searchState.search.query;
    const searchText = searchState.search.query;
    const numCursors = searchState.search.numCursors;
    const offset = searchState.search.offset;
    const {
      statusCode: errorStatusCode,
      message: errorMessage,
    } = searchState.search.error;
    let errorContent;
    if (this.state.namespaceNotFound) {
      return (
        <Page404 entityType="namespace" entityName={namespace}>
          <div className="namespace-not-found">
            <h4>
              <strong>
                {T.translate(
                  'features.EntityListView.NamespaceNotFound.optionsSubtitle'
                )}
              </strong>
            </h4>
            <div>
              {T.translate(
                'features.EntityListView.NamespaceNotFound.createMessage'
              )}
              <span
                className="open-namespace-wizard-link"
                onClick={() => {
                  this.eventEmitter.emit(globalEvents.CREATENAMESPACE);
                }}
              >
                {T.translate(
                  'features.EntityListView.NamespaceNotFound.createLinkLabel'
                )}
              </span>
            </div>
            <div>
              {T.translate(
                'features.EntityListView.NamespaceNotFound.switchMessage'
              )}
            </div>
          </div>
        </Page404>
      );
    }
    if (!isNil(errorStatusCode)) {
      if (errorStatusCode === 'PAGE_NOT_FOUND') {
        errorContent = <PageErrorMessage pageNum={currentPage} query={query} />;
      } else {
        errorContent = (
          <HomeErrorMessage
            errorMessage={errorMessage}
            errorStatusCode={errorStatusCode}
            onRetry={this.retrySearch.bind(this)}
            retryCounter={this.retryCounter}
          />
        );
      }
    }

    const featureName = Theme.featureNames.controlCenter;

    return (
      <div>
        <Helmet
          title={T.translate('features.EntityListView.Title', {
            productName: Theme.productName,
            featureName,
          })}
        />
        <EntityListHeader />
        <div className="entity-list-view">
          {!isNil(errorContent) ? null : (
            <EntityListInfo
              className="entity-list-info"
              namespace={namespace}
              numberOfEntities={this.state.total}
              numberOfPages={this.state.total / this.state.limit}
              currentPage={currentPage}
              allEntitiesFetched={
                this.state.total < this.state.limit * (numCursors + 1) + offset
              }
            />
          )}
          <div
            className={classnames('entities-container', {
              'error-holder': errorContent,
            })}
          >
            {!isNil(errorContent) ? (
              errorContent
            ) : (
              <HomeListView
                id="home-list-view-container"
                loading={this.state.loading}
                className={classnames('home-list-view-container', {
                  'show-overview-main-container': this.state.overview,
                })}
                list={this.state.entities}
                pageSize={this.state.limit}
                showJustAddedSection={searchText === DEFAULT_SEARCH_QUERY}
                onFastActionSuccess={this.onFastActionSuccess.bind(this)}
              />
            )}
            <Overview
              history={this.props.history}
              onCloseAndRefresh={this.onOverviewCloseAndRefresh.bind(this)}
            />
          </div>
        </div>
      </div>
    );
  }
}

EntityListView.propTypes = {
  match: PropTypes.object,
  location: PropTypes.object,
  history: PropTypes.object,
  pathname: PropTypes.string,
  currentPage: PropTypes.string,
};
