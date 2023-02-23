/*
 * Copyright © 2017 Cask Data, Inc.
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
import orderBy from 'lodash/orderBy';
import classnames from 'classnames';
require('./SortableTable.scss');

export default class SortableTable extends Component {
  state = {
    entities: this.props.entities,
    sortByHeader: '',
    sortOrder: 'asc',
    sortOnInitialLoad:
      typeof this.props.sortOnInitialLoad !== 'boolean'
        ? true
        : this.props.sortOnInitialLoad,
  };

  componentWillMount() {
    if (!this.state.sortOnInitialLoad) {
      return;
    }
    let entities = this.state.entities;
    const sortByHeader = this.getDefaultSortedHeader();
    entities = orderBy(entities, [sortByHeader], [this.state.sortOrder]);
    this.setState({
      entities,
      sortByHeader,
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      entities: nextProps.entities,
    });
  }

  getDefaultSortedHeader() {
    let defaultHeader = '';
    for (let i = 0; i < this.props.tableHeaders.length; i++) {
      if (this.props.tableHeaders[i].defaultSortby) {
        defaultHeader = this.props.tableHeaders[i].property;
        break;
      }
    }
    return defaultHeader || this.props.tableHeaders[0].property;
  }

  sortBy(header) {
    const headerProp = header.property;
    let entities = this.state.entities;
    let sortOrder = this.state.sortOrder;
    let sortByHeader = this.state.sortByHeader;
    if (sortByHeader === headerProp) {
      if (sortOrder === 'asc') {
        // already sorting in this column, sort the other way
        sortOrder = 'desc';
      } else {
        sortOrder = 'asc';
      }
    } else {
      // a new sort, so start with ascending sort
      sortByHeader = headerProp;
      sortOrder = 'asc';
    }
    if (header.sortFunc) {
      entities = orderBy(entities, [header.sortFunc], [sortOrder]);
    } else {
      entities = orderBy(entities, [sortByHeader], [sortOrder]);
    }
    this.setState({
      entities,
      sortOrder,
      sortByHeader,
    });
  }

  renderSortableTableHeader(header) {
    if (this.state.sortByHeader !== header.property) {
      return (
        <span onClick={this.sortBy.bind(this, header)}>{header.label}</span>
      );
    }
    return (
      <span onClick={this.sortBy.bind(this, header)}>
        <span className="text-underline">{header.label}</span>
        {this.state.sortOrder === 'asc' ? (
          <i className="fa fa-caret-down fa-lg" />
        ) : (
          <i className="fa fa-caret-up fa-lg" />
        )}
      </span>
    );
  }

  render() {
    const tableClasses = classnames('table', this.props.className);
    return (
      <table className={tableClasses}>
        <thead>
          <tr>
            {this.props.tableHeaders.map((tableHeader, i) => {
              return (
                <th key={i}>
                  {tableHeader.property
                    ? this.renderSortableTableHeader(tableHeader)
                    : tableHeader.label}
                </th>
              );
            })}
          </tr>
        </thead>
        {this.props.renderTableBody(this.state.entities)}
      </table>
    );
  }
}
SortableTable.propTypes = {
  tableHeaders: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      property: PropTypes.string,
      defaultSortby: PropTypes.bool,
    })
  ),
  renderTableBody: PropTypes.func,
  entities: PropTypes.arrayOf(PropTypes.object),
  className: PropTypes.string,
  sortOnInitialLoad: PropTypes.bool,
};
