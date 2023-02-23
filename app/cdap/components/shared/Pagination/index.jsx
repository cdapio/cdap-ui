/*
 * Copyright © 2016 Cask Data, Inc.
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
import classNames from 'classnames';
import Mousetrap from 'mousetrap';
import classnames from 'classnames';

require('./Pagination.scss');

export default class Pagination extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numResults: 0,
      leftPressed: false,
      rightPressed: false,
      currentPage: props.currentPage,
      totalPages: props.totalPages,
    };
    this.goToNext = this.goToNext.bind(this);
    this.goToPrev = this.goToPrev.bind(this);
  }

  componentWillMount() {
    Mousetrap.bind('right', this.goToNext);
    Mousetrap.bind('left', this.goToPrev);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      currentPage: nextProps.currentPage,
      totalPages: nextProps.totalPages,
    });
  }
  componentWillUnmount() {
    Mousetrap.unbind('left');
    Mousetrap.unbind('right');
  }

  goToPrev() {
    if (this.state.currentPage - 1 === 0) {
      return;
    }
    // Highlight the side that is pressed
    this.setState({
      leftPressed: true,
    });

    setTimeout(() => {
      this.setState({
        leftPressed: false,
      });
    }, 250);

    if (this.props.setDirection) {
      this.props.setDirection('prev');
    }
    this.props.setCurrentPage(this.state.currentPage - 1);
  }

  goToNext() {
    if (this.state.currentPage + 1 > this.state.totalPages) {
      return;
    }
    // Highlight the side that is pressed
    this.setState({
      rightPressed: true,
    });

    setTimeout(() => {
      this.setState({
        rightPressed: false,
      });
    }, 250);

    if (this.props.setDirection) {
      this.props.setDirection('next');
    }
    this.props.setCurrentPage(this.state.currentPage + 1);
  }

  render() {
    const pageChangeRightClass = classNames(
      'change-page-panel',
      'change-page-panel-right',
      {
        pressed: this.state.rightPressed,
        'last-page': this.state.currentPage + 1 > this.state.totalPages,
      }
    );
    const pageChangeLeftClass = classNames(
      'change-page-panel',
      'change-page-panel-left',
      {
        pressed: this.state.leftPressed,
        'first-page': this.state.currentPage - 1 === 0,
      }
    );
    Mousetrap.bind('right', this.goToNext);
    Mousetrap.bind('left', this.goToPrev);

    return (
      <div className={classnames('pagination-container', this.props.className)}>
        <div onClick={this.goToPrev} className={pageChangeLeftClass} />
        <div className="pagination-content">{this.props.children}</div>
        <div onClick={this.goToNext} className={pageChangeRightClass} />
      </div>
    );
  }
}

Pagination.propTypes = {
  currentPage: PropTypes.number,
  totalPages: PropTypes.number,
  children: PropTypes.node,
  setCurrentPage: PropTypes.func,
  setDirection: PropTypes.func,
  className: PropTypes.string,
};
