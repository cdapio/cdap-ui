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

import React, { Component } from 'react';
import { UncontrolledDropdown } from 'components/UncontrolledComponents';
import { DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import DataPrepStore from 'components/DataPrep/store';
import DataPrepActions from 'components/DataPrep/store/DataPrepActions';
import uuidV4 from 'uuid/v4';
import ColumnsTabRow from 'components/DataPrep/DataPrepSidePanel/ColumnsTab/ColumnsTabRow';
import ColumnsTabDetail from 'components/DataPrep/DataPrepSidePanel/ColumnsTab/ColumnsTabDetail';
import findIndex from 'lodash/findIndex';
import T from 'i18n-react';
import ColumnActions from 'components/DataPrep/Directives/ColumnActions';
import IconSVG from 'components/shared/IconSVG';
const PREFIX = 'features.DataPrep.DataPrepSidePanel.ColumnsTab';

require('./ColumnsTab.scss');

export default class ColumnsTab extends Component {
  constructor(props) {
    super(props);
    const {
      dataprep: dataprepstate,
      columnsInformation: columnInfo,
    } = DataPrepStore.getState();

    this.state = {
      columns: columnInfo.columns,
      headers: dataprepstate.headers.map((res) => ({
        name: res,
        uniqueId: uuidV4(), // FIXME: This might be costly. Need to find a better way to avoid having unique IDs
        isNew: false,
      })),
      selectedHeaders: dataprepstate.selectedHeaders,
      workspaceId: dataprepstate.workspaceId,
      loading: dataprepstate.loading,
      error: null,
      searchText: '',
      searchFocus: false,
    };

    this.handleChangeSearch = this.handleChangeSearch.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
    this.renderDropdown = this.renderDropdown.bind(this);
    this.clearAllColumns = this.clearAllColumns.bind(this);
    this.selectAllColumns = this.selectAllColumns.bind(this);
    this.setSelect = this.setSelect.bind(this);
    this.lastNewRowRef = null;
  }

  componentDidMount() {
    this._isMounted = true;
    this.sub = DataPrepStore.subscribe(() => {
      if (this._isMounted) {
        const {
          dataprep: dataprepstate,
          columnsInformation: columnInfo,
        } = DataPrepStore.getState();
        this.setState({
          selectedHeaders: dataprepstate.selectedHeaders,
          columns: columnInfo.columns,
          headers: dataprepstate.headers.map((res) => {
            const obj = {
              name: res,
              uniqueId: uuidV4(),
              isNew: dataprepstate.newHeaders.includes(res),
            };
            return obj;
          }),
          loading: dataprepstate.loading,
        });
      }
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
    if (this.sub && typeof this.sub === 'function') {
      this.sub();
    }
  }

  componentDidUpdate() {
    if (this.state.searchFocus) {
      this.searchBox.focus();
    }
    if (this.lastNewRowRef) {
      this.lastNewRowRef.scrollIntoView({ behavior: 'smooth' });
    }
  }

  clearAllColumns() {
    DataPrepStore.dispatch({
      type: DataPrepActions.setSelectedHeaders,
      payload: {
        selectedHeaders: [],
      },
    });
  }

  selectAllColumns() {
    DataPrepStore.dispatch({
      type: DataPrepActions.setSelectedHeaders,
      payload: {
        selectedHeaders: DataPrepStore.getState().dataprep.headers,
      },
    });
  }

  setSelect(columnName, selectStatus) {
    const currentSelectedHeaders = this.state.selectedHeaders.slice();
    if (selectStatus) {
      currentSelectedHeaders.push(columnName);
    } else {
      currentSelectedHeaders.splice(
        currentSelectedHeaders.indexOf(columnName),
        1
      );
    }
    DataPrepStore.dispatch({
      type: DataPrepActions.setSelectedHeaders,
      payload: {
        selectedHeaders: currentSelectedHeaders,
      },
    });
  }

  handleChangeSearch(e) {
    this.setState({ searchText: e.target.value });
  }

  clearSearch() {
    this.setState({ searchText: '' });
  }

  renderDropdown() {
    return (
      <UncontrolledDropdown className="columns-tab-toggle-all-dropdown">
        <DropdownToggle className="columns-tab-dropdown-toggle">
          <IconSVG name="icon-caret-square-o-down" />
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem
            className="toggle-all-option"
            onClick={this.clearAllColumns}
          >
            {T.translate(`${PREFIX}.toggle.clearAll`)}
          </DropdownItem>
          <DropdownItem
            className="toggle-all-option"
            onClick={this.selectAllColumns}
          >
            {T.translate(`${PREFIX}.toggle.selectAll`)}
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    );
  }

  setNewRowRef(isNew, element) {
    if (isNew) {
      // Capture last new column
      this.lastNewRowRef = element;
    }
  }

  showDetail(rowId) {
    const index = findIndex(
      this.state.headers,
      (header) => header.uniqueId === rowId
    );
    const match = this.state.headers[index];
    let modifiedHeaders = this.state.headers.slice(0);
    if (match.expanded) {
      match.expanded = false;
      modifiedHeaders = [
        ...modifiedHeaders.slice(0, index + 1),
        ...modifiedHeaders.slice(index + 2),
      ];
    } else {
      match.expanded = true;
      modifiedHeaders = [
        ...modifiedHeaders.slice(0, index + 1),
        Object.assign({}, modifiedHeaders[index], {
          isDetail: true,
          uniqueId: uuidV4(),
        }),
        ...modifiedHeaders.slice(index + 1),
      ];
    }
    this.setState({
      headers: modifiedHeaders,
    });
  }

  render() {
    if (this.state.loading) {
      return (
        <div className="columns-tab text-center">
          <span className="fa fa-spin fa-spinner" />
        </div>
      );
    }

    this.lastNewRowRef;
    let index = -1;
    let displayHeaders = this.state.headers.map((header) => {
      if (!header.isDetail) {
        index += 1;
        return Object.assign({}, header, { index });
      }
      return header;
    });

    if (this.state.searchText.length > 0) {
      displayHeaders = displayHeaders.filter((head) => {
        const headerLower = head.name.toLowerCase();
        const search = this.state.searchText.toLowerCase();

        return headerLower.indexOf(search) !== -1;
      });
    }

    const renderContents = () => {
      if (!displayHeaders.length && this.state.searchText.length) {
        return (
          <div className="columns-tab empty-search-container">
            <div className="empty-search">
              <strong>
                {T.translate(`${PREFIX}.EmptyMessage.title`, {
                  searchText: this.state.searchText,
                })}
              </strong>
              <hr />
              <span>
                {' '}
                {T.translate(`${PREFIX}.EmptyMessage.suggestionTitle`)}{' '}
              </span>
              <ul>
                <li>
                  <span
                    className="link-text"
                    onClick={() => {
                      this.setState({
                        searchText: '',
                        searchFocus: true,
                      });
                    }}
                  >
                    {T.translate(`${PREFIX}.EmptyMessage.clearLabel`)}
                  </span>
                  <span>
                    {T.translate(`${PREFIX}.EmptyMessage.suggestion1`)}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        );
      } else {
        return (
          <table className="table table-sm table-responsive table-hover">
            <thead>
              <tr>
                <th />
                <th>{this.renderDropdown()}</th>
                <th>#</th>
                <th>{T.translate(`${PREFIX}.Header.name`)}</th>
                <th>{T.translate(`${PREFIX}.Header.completion`)}</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {displayHeaders.map((head) => {
                if (head.isDetail) {
                  return (
                    <ColumnsTabDetail
                      key={`${head.name}_detail`}
                      columnInfo={this.state.columns[head.name]}
                    />
                  );
                }
                return (
                  <ColumnsTabRow
                    rowInfo={this.state.columns[head.name]}
                    onShowDetails={this.showDetail.bind(this, head.uniqueId)}
                    columnName={head.name}
                    index={head.index}
                    key={head.name}
                    selected={
                      this.state.selectedHeaders.indexOf(head.name) !== -1
                    }
                    setSelect={this.setSelect}
                    isNew={head.isNew}
                    ref={this.setNewRowRef.bind(this, head.isNew)}
                  />
                );
              })}
            </tbody>
          </table>
        );
      }
    };

    return (
      <div className="columns-tab">
        <div className="columns-tab-heading">
          <div className="search-box">
            <input
              type="text"
              className="form-control"
              placeholder={T.translate(`${PREFIX}.searchPlaceholder`)}
              value={this.state.searchText}
              onChange={this.handleChangeSearch}
              ref={(ref) => (this.searchBox = ref)}
            />

            {this.state.searchText.length === 0 ? (
              <span className="fa fa-search" />
            ) : (
              <span className="fa fa-times-circle" onClick={this.clearSearch} />
            )}
          </div>
          <ColumnActions />
        </div>
        <div className="columns-list">{renderContents()}</div>
      </div>
    );
  }
}
