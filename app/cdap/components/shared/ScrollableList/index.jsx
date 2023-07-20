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
import IconSVG from 'components/shared/IconSVG';
import findIndex from 'lodash/findIndex';
import classnames from 'classnames';

require('./ScrollableList.scss');

export default class ScrollableList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      children: this.props.children,
      numberOfElemsToDisplay: null,
      startingIndex: 0,
    };
    this.computeHeight = this.computeHeight.bind(this);
    this.scrollUp = this.scrollUp.bind(this);
    this.scrollDown = this.scrollDown.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);
    this.shouldScrollDown = this.shouldScrollDown.bind(this);
    this.shouldScrollUp = this.shouldScrollUp.bind(this);

    this.HEIGHT_OF_ELEM = 29;
  }
  componentDidMount() {
    this.computeHeight();
  }
  componentWillReceiveProps(nextProps) {
    const { children: newChildren } = this.getItemsInWindow(
      this.state.startingIndex,
      nextProps.children
    );
    this.setState({
      children: newChildren,
    });
  }
  computeHeight() {
    let heightOfList = document.body.getBoundingClientRect().height;
    const FOOTER_HEIGHT = 54;

    if (this.props.target) {
      const targetTop = document
        .getElementById(this.props.target)
        .getBoundingClientRect().top;
      const bodyBottom =
        document.body.getBoundingClientRect().bottom - FOOTER_HEIGHT;
      const scrollDownHeight = 20;
      heightOfList = bodyBottom - targetTop - scrollDownHeight;
    }

    if (document.getElementsByClassName('column-type-label').length > 0) {
      const labelHeight = document
        .getElementsByClassName('column-type-label')[0]
        .getBoundingClientRect().height;
      heightOfList = heightOfList - labelHeight;
    }

    const numberOfElemsToDisplay = Math.floor(
      heightOfList / this.HEIGHT_OF_ELEM
    );

    const numberOfActualElements = this.props.children.filter(
      (child) => child.props.className.indexOf('column-action-divider') === -1
    );

    const nonDividerChildren = numberOfActualElements.slice(
      0,
      numberOfElemsToDisplay
    );
    const actualLastIndex = findIndex(
      this.props.children,
      nonDividerChildren[nonDividerChildren.length - 1]
    );

    const children = this.props.children.slice(0, actualLastIndex + 1);

    this.setState({
      children,
      numberOfElemsToDisplay,
      startingIndex: 0,
    });
  }

  // This is to exclude considering line divider as a child.
  getItemsInWindow(startIndex, children = this.props.children) {
    let nonDividerChildren = children.filter(
      (child) => child.props.className.indexOf('column-action-divider') === -1
    );
    nonDividerChildren = nonDividerChildren.slice(
      startIndex,
      startIndex + this.state.numberOfElemsToDisplay
    );

    const actualStartIndex = findIndex(children, nonDividerChildren[0]);
    const actualLastIndex = findIndex(
      children,
      nonDividerChildren[nonDividerChildren.length - 1]
    );
    return {
      children: children.slice(actualStartIndex, actualLastIndex + 1),
    };
  }
  scrollDown() {
    if (!this.shouldScrollDown()) {
      return null;
    }
    const startIndex = this.state.startingIndex + 1;
    const { children: newChildren } = this.getItemsInWindow(startIndex);
    this.setState({
      children: newChildren,
      startingIndex: startIndex,
    });
  }
  scrollUp() {
    if (!this.shouldScrollUp()) {
      return null;
    }
    const startIndex = this.state.startingIndex - 1;
    const { children: newChildren } = this.getItemsInWindow(startIndex);
    this.setState({
      children: newChildren,
      startingIndex: startIndex,
    });
  }
  onMouseEnter(listener) {
    this.interval = setInterval(listener, 500);
  }
  onMouseOut() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
  shouldScrollDown() {
    if (
      this.props.children.length ===
      this.state.startingIndex + this.state.children.length
    ) {
      return false;
    }
    const lastChildInWindow = this.state.children[
      this.state.children.length - 1
    ].key;
    const lastChild = this.props.children[this.props.children.length - 1].key;
    if (lastChild === lastChildInWindow) {
      return false;
    }
    return true;
  }
  shouldScrollUp() {
    return this.state.startingIndex !== 0;
  }
  renderScrollDownContainer() {
    return (
      <div
        className={classnames('scroll-down-container text-center', {
          disabled: !this.shouldScrollDown(),
        })}
        onClick={this.scrollDown}
        onMouseEnter={this.onMouseEnter.bind(this, this.scrollDown)}
        onMouseOut={this.onMouseOut}
      >
        <IconSVG name="icon-caret-down" />
      </div>
    );
  }
  renderScrollUpContainer() {
    return (
      <div
        className={classnames('scroll-up-container text-center', {
          disabled: !this.shouldScrollUp(),
        })}
        onClick={this.scrollUp}
        onMouseEnter={this.onMouseEnter.bind(this, this.scrollUp)}
        onMouseOut={this.onMouseOut}
      >
        <IconSVG name="icon-caret-up" />
      </div>
    );
  }
  render() {
    return (
      <div className="scrollable-list">
        {this.renderScrollUpContainer()}
        {this.state.children}
        {this.renderScrollDownContainer()}
      </div>
    );
  }
}
ScrollableList.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
  target: PropTypes.string,
};
