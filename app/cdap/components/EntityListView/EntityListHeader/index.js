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

import React, { Component } from 'react';
import { Dropdown, DropdownToggle, DropdownItem } from 'reactstrap';
import CustomDropdownMenu from 'components/shared/CustomDropdownMenu';
import T from 'i18n-react';
import debounce from 'lodash/debounce';
import PlusButton from 'components/shared/PlusButton';
import { isDescendant } from 'services/helpers';
import { Observable } from 'rxjs/Observable';
import SearchStore from 'components/EntityListView/SearchStore';
import SearchStoreActions from 'components/EntityListView/SearchStore/SearchStoreActions';
import {
  DEFAULT_SEARCH_SORT_OPTIONS,
  DEFAULT_SEARCH_QUERY,
} from 'components/EntityListView/SearchStore/SearchConstants';
import { search, updateQueryString } from 'components/EntityListView/SearchStore/ActionCreator';
import IconSVG from 'components/shared/IconSVG';

require('./EntityListHeader.scss');

export default class EntityListHeader extends Component {
  constructor(props) {
    super(props);
    let searchState = SearchStore.getState().search;
    this.state = {
      isFilterExpanded: false,
      isSortExpanded: false,
      searchText: searchState.query === '*' ? '' : searchState.query,
      sortOptions: searchState.sort,
      filterOptions: searchState.filters,
      activeFilters: searchState.activeFilters,
      activeSort: searchState.activeSort,
    };
    this.debouncedHandleSearch = debounce(this.handleSearch.bind(this), 500);
  }

  componentWillMount() {
    this.searchStoreSubscription = SearchStore.subscribe(() => {
      let { query, activeFilters, activeSort } = SearchStore.getState().search;
      this.setState({
        searchText: query === '*' ? '' : query,
        activeFilters,
        activeSort,
      });
    });
  }
  componentWillUnmount() {
    if (this.documentClick$ && this.documentClick$.unsubscribe) {
      this.documentClick$.unsubscribe();
    }
    if (this.searchStoreSubscription) {
      this.searchStoreSubscription();
    }
  }

  handleFilterToggle() {
    let newState = !this.state.isFilterExpanded;

    this.setState({ isFilterExpanded: newState });

    if (newState) {
      let element = document.getElementById('app-container');

      this.documentClick$ = Observable.fromEvent(element, 'click').subscribe((e) => {
        if (isDescendant(this.dropdownButtonRef, e.target) || !this.state.isFilterExpanded) {
          return;
        }

        this.handleFilterToggle();
      });
    } else {
      this.documentClick$.unsubscribe();
    }
  }

  handleSortToggle() {
    this.setState({ isSortExpanded: !this.state.isSortExpanded });
  }

  onSearchChange(e) {
    this.setState(
      {
        searchText: e.target.value,
      },
      this.debouncedHandleSearch.bind(this)
    );
  }

  handleSearch() {
    SearchStore.dispatch({
      type: SearchStoreActions.SETQUERY,
      payload: {
        query: this.state.searchText,
      },
    });
    if (!this.state.searchText.length) {
      SearchStore.dispatch({
        type: SearchStoreActions.SETACTIVESORT,
        payload: {
          activeSort: DEFAULT_SEARCH_SORT_OPTIONS[4],
        },
      });
    }
    search();
    updateQueryString();
  }

  onFilterClick(option, event) {
    event.preventDefault();
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
    let activeFilters = SearchStore.getState().search.activeFilters;
    if (activeFilters.indexOf(option.id) !== -1) {
      activeFilters = activeFilters.filter((entityFilter) => entityFilter !== option.id);
    } else {
      activeFilters.push(option.id);
    }
    SearchStore.dispatch({
      type: SearchStoreActions.SETACTIVEFILTERS,
      payload: {
        activeFilters,
      },
    });
    this.setState(
      {
        activeFilters,
      },
      () => {
        search();
        updateQueryString();
      }
    );
  }

  onSortClick(option) {
    SearchStore.dispatch({
      type: SearchStoreActions.SETACTIVESORT,
      payload: {
        activeSort: option,
        query: DEFAULT_SEARCH_QUERY,
      },
    });
    this.setState(
      {
        activeSort: option,
      },
      () => {
        search();
        updateQueryString();
      }
    );
  }

  render() {
    let tooltipId = 'filter-tooltip-target-id';
    const placeholder = T.translate('features.EntityListView.Header.search-placeholder');
    const sortDropdown = (
      <Dropdown
        isOpen={this.state.isSortExpanded}
        toggle={this.handleSortToggle.bind(this)}
        id={tooltipId}
      >
        <DropdownToggle tag="div" className="sort-toggle">
          <span>{this.state.activeSort.displayName}</span>
          <span className="float-right">
            <IconSVG name="icon-angle-down" />
          </span>
        </DropdownToggle>
        <CustomDropdownMenu>
          {this.state.sortOptions.slice(1).map((option, index) => {
            return (
              <DropdownItem
                tag="li"
                key={index}
                className="clearfix"
                onClick={this.onSortClick.bind(this, option)}
              >
                <span className="float-left">{option.displayName}</span>
                {this.state.activeSort.fullSort === option.fullSort ? (
                  <span className="float-right">
                    <IconSVG name="icon-check" />
                  </span>
                ) : null}
              </DropdownItem>
            );
          })}
        </CustomDropdownMenu>
      </Dropdown>
    );

    const filterDropdown = (
      <Dropdown
        isOpen={this.state.isFilterExpanded}
        toggle={() => {}}
        onClick={this.handleFilterToggle.bind(this)}
      >
        <DropdownToggle
          tag="div"
          className="filter-toggle"
          data-cy="filter-dropdown"
          data-testid="filter-dropdown"
        >
          <span>{T.translate('features.EntityListView.Header.filterBy')}</span>
          <span className="float-right">
            <IconSVG name="icon-angle-down" />
          </span>
        </DropdownToggle>
        <CustomDropdownMenu onClick={(e) => e.stopPropagation()}>
          {this.state.filterOptions.map((option) => {
            return (
              <DropdownItem tag="li" key={option.id}>
                <div
                  className="form-group form-check"
                  onClick={this.onFilterClick.bind(this, option)}
                >
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={this.state.activeFilters.indexOf(option.id) !== -1}
                    data-cy={`${option.displayName}-input`}
                    data-testid={`${option.displayName}-input`}
                  />
                  <label className="form-check-label">{option.displayName}</label>
                </div>
              </DropdownItem>
            );
          })}
        </CustomDropdownMenu>
      </Dropdown>
    );

    return (
      <div className="entity-list-header-container">
        <div className="entity-list-header">
          <div className="search-box input-group">
            <div className="input-feedback input-group-prepend">
              <div className="input-group-text">
                <IconSVG name="icon-search" />
              </div>
            </div>
            <input
              type="text"
              className="search-input form-control"
              placeholder={placeholder}
              value={this.state.searchText}
              onChange={this.onSearchChange.bind(this)}
            />
          </div>
          <div className="filter" ref={(ref) => (this.dropdownButtonRef = ref)}>
            {filterDropdown}
          </div>
          <div className="sort">
            <span className="sort-label">
              {T.translate('features.EntityListView.Header.sortLabel')}
            </span>
            {sortDropdown}
          </div>
        </div>
        <PlusButton mode={PlusButton.MODE.resourcecenter} />
      </div>
    );
  }
}
