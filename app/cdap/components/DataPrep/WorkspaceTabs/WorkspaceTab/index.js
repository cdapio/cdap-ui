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
import { Link } from 'react-router-dom';
import NamespaceStore from 'services/NamespaceStore';
import IconSVG from 'components/IconSVG';

require('./WorkspaceTab.scss');

const MAX_NAME_WIDTH = 140;

export default class WorkspaceTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      overflow: false,
    };

    this.namespace = NamespaceStore.getState().selectedNamespace;
  }

  componentDidUpdate() {
    let workspaceElem = document.getElementById(this.props.workspace.workspaceId);
    if (!workspaceElem) {
      return;
    }

    let nameElem = workspaceElem.querySelector('span.original-name');

    if (nameElem) {
      let nameBBox = nameElem.getBoundingClientRect();
      let newState = nameBBox.width > MAX_NAME_WIDTH;

      if (this.state.overflow !== newState) {
        this.setState({ overflow: newState });
      }
    }
  }

  renderName() {
    return <span className="original-name">{this.props.workspace.workspaceName}</span>;
  }

  renderOverflow() {
    let name = this.props.workspace.workspaceName;

    return (
      <span className="display-name">
        <span className="full-name">{name}</span>

        <span className="overflow-layer">{name}</span>
      </span>
    );
  }

  renderActiveWorkspace() {
    let workspace = this.props.workspace;

    return (
      <div
        id={workspace.id}
        className="workspace-tab active clearfix"
        title={workspace.workspaceName}
      >
        <span className="display-name-container float-left">
          {this.state.overflow ? this.renderOverflow() : this.renderName()}
        </span>

        <span className="fa fa-fw delete-workspace float-right" onClick={this.props.onDelete}>
          <IconSVG name="icon-close" />
        </span>
      </div>
    );
  }

  renderInactiveWorkspace() {
    let workspace = this.props.workspace;

    return (
      <div id={workspace.id} className="workspace-tab clearfix" title={workspace.workspaceName}>
        <span className="display-name-container float-left">
          <Link to={`/ns/${this.namespace}/wrangler/${workspace.workspaceId}`}>
            {this.state.overflow ? this.renderOverflow() : this.renderName()}
          </Link>
        </span>

        <span className="fa fa-fw delete-workspace float-right" onClick={this.props.onDelete}>
          <IconSVG name="icon-close" />
        </span>
      </div>
    );
  }

  render() {
    return this.props.active ? this.renderActiveWorkspace() : this.renderInactiveWorkspace();
  }
}

WorkspaceTab.propTypes = {
  workspace: PropTypes.object,
  active: PropTypes.bool,
  onDelete: PropTypes.func,
};
