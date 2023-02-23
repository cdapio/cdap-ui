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
import uuidV4 from 'uuid/v4';
import classnames from 'classnames';
import { UncontrolledDropdown } from 'components/UncontrolledComponents';
import { DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { preventPropagation } from 'services/helpers';
import NavLinkWrapper from 'components/shared/NavLinkWrapper';

require('./FilePath.scss');

const VIEW_LIMIT = 3;

export default class FilePath extends Component {
  constructor(props) {
    super(props);

    this.state = {
      originalPath: '',
      paths: [],
    };
    this.handlePropagation = this.handlePropagation.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.originalPath === nextProps.fullpath) {
      return;
    }

    this.processPath(nextProps);
  }

  processPath(props) {
    const splitPath = props.fullpath.split('/').filter((directory) => {
      return directory.length > 0;
    });
    let bspath = this.props.baseStatePath;
    if (bspath[bspath.length - 1] !== '/') {
      bspath = `${bspath}/`;
    }
    const paths = [
      {
        id: uuidV4(),
        name: 'Root',
        link: bspath,
      },
    ];

    splitPath.forEach((value, index) => {
      const directoryPath = splitPath.slice(0, index + 1).join('/');

      let link = this.props.baseStatePath;
      link = `${link}/${directoryPath}`;

      paths.push({
        id: uuidV4(),
        name: value,
        link,
      });
    });

    this.setState({
      paths,
      originalPath: props.fullpath,
    });
  }

  handlePropagation(fullPath, e) {
    if (!this.props.enableRouting) {
      preventPropagation(e);
      if (
        this.props.onPathChange &&
        typeof this.props.onPathChange === 'function'
      ) {
        const path = fullPath.slice(this.props.baseStatePath.length);
        this.props.onPathChange(path);
        return false;
      }
    }
  }

  renderCollapsedDropdown(collapsedLinks) {
    return (
      <div className="collapsed-dropdown">
        <UncontrolledDropdown className="collapsed-dropdown-toggle">
          <DropdownToggle>...</DropdownToggle>
          <DropdownMenu>
            {collapsedLinks.map((path, i) => {
              return (
                <DropdownItem key={i} title={path.name} tag="div">
                  <NavLinkWrapper
                    key={path.id}
                    to={path.link}
                    onClick={this.handlePropagation.bind(this, path.link)}
                    isNativeLink={!this.props.enableRouting}
                  >
                    {path.name}
                  </NavLinkWrapper>
                </DropdownItem>
              );
            })}
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
    );
  }

  renderBreadcrumb(links) {
    const pathsTitle = links.map((path) => path.name).join('/') || '';
    return (
      <div className="paths" title={pathsTitle}>
        {links.map((path, index) => {
          return (
            <NavLinkWrapper
              key={path.id}
              to={path.link}
              className={classnames({
                'active-directory': index === links.length - 1,
              })}
              onClick={this.handlePropagation.bind(this, path.link)}
              isNativeLink={!this.props.enableRouting}
            >
              <span>{path.name}</span>
              {index !== links.length - 1 ? (
                <span className="path-divider">/</span>
              ) : null}
            </NavLinkWrapper>
          );
        })}
      </div>
    );
  }

  renderCollapsedView() {
    const splitIndex = this.state.paths.length - VIEW_LIMIT + 1;

    const collapsedLinks = this.state.paths.slice(0, splitIndex);
    const displayLinks = this.state.paths.slice(splitIndex);

    const collapsed = this.renderCollapsedDropdown(collapsedLinks);
    const breadcrumb = this.renderBreadcrumb(displayLinks);

    return (
      <div className="collapsed-paths">
        {collapsed}
        <span className="path-divider">/</span>
        {breadcrumb}
      </div>
    );
  }

  render() {
    return (
      <div className="file-path-container">
        {this.state.paths.length > VIEW_LIMIT
          ? this.renderCollapsedView()
          : this.renderBreadcrumb(this.state.paths)}
      </div>
    );
  }
}

FilePath.propTypes = {
  baseStatePath: PropTypes.string,
  fullpath: PropTypes.string,
  enableRouting: PropTypes.bool,
  onPathChange: PropTypes.func,
  originalPath: PropTypes.string,
};
