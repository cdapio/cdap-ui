/*
 * Copyright © 2018 Cask Data, Inc.
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
import PropTypes from 'prop-types';
import Popover from 'components/shared/Popover';
import NamespaceStore, { getCurrentNamespace } from 'services/NamespaceStore';
import IconSVG from 'components/shared/IconSVG';
import { UncontrolledDropdown } from 'components/UncontrolledComponents';
import { DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import T from 'i18n-react';

const PREFIX = 'features.NamespacesPicker';

class NamespacesPopover extends Component {
  static propTypes = {
    namespacesPick: PropTypes.array,
    setNamespacesPick: PropTypes.func,
  };

  state = {
    namespace: getCurrentNamespace(),
    namespaces: this.getNamespaceList(),
  };

  componentWillMount() {
    this.namespaceStoreSub = NamespaceStore.subscribe(() => {
      this.setState({
        namespaces: this.getNamespaceList(),
      });
    });
  }

  componentWillUnmount() {
    if (this.namespaceStoreSub) {
      this.namespaceStoreSub();
    }
  }

  getNamespaceList() {
    const namespace = getCurrentNamespace();

    return NamespaceStore.getState()
      .namespaces.map((ns) => ns.name)
      .filter((ns) => ns !== namespace);
  }

  namespaceClick = (ns) => {
    const index = this.props.namespacesPick.indexOf(ns);
    const namespacesPick = [...this.props.namespacesPick];
    if (index === -1) {
      namespacesPick.push(ns);
    } else {
      namespacesPick.splice(index, 1);
    }

    this.props.setNamespacesPick(namespacesPick);
  };

  selectAll = () => {
    this.props.setNamespacesPick(this.state.namespaces);
  };

  clearAll = () => {
    this.props.setNamespacesPick([]);
  };

  render() {
    if (this.state.namespaces.length === 0) {
      return null;
    }

    const targetElem = (
      <div className="monitor-more text-right">
        {T.translate(`${PREFIX}.monitorMore`)}
      </div>
    );

    return (
      <Popover
        target={() => targetElem}
        className="namespaces-list-popover"
        placement="top"
        bubbleEvent={false}
        enableInteractionInPopover={true}
      >
        <div className="popover-content">
          <div className="title">{T.translate(`${PREFIX}.popoverHeader`)}</div>

          <div className="namespaces-count">
            {T.translate(`${PREFIX}.namespacesCount`, {
              context: this.state.namespaces.length + 1,
            })}
          </div>

          <div className="namespaces-list">
            <div className="namespace-row non-selectable">
              <div className="checkbox-column">
                <UncontrolledDropdown className="toggle-all-dropdown">
                  <DropdownToggle className="dropdown-toggle-btn">
                    <IconSVG name="icon-caret-square-o-down" />
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem
                      className="toggle-option"
                      onClick={this.selectAll}
                    >
                      {T.translate(`${PREFIX}.selectAll`)}
                    </DropdownItem>
                    <DropdownItem
                      className="toggle-option"
                      onClick={this.clearAll}
                    >
                      {T.translate(`${PREFIX}.clearAll`)}
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </div>

              <div className="namespace-section">
                {T.translate(`${PREFIX}.namespaceName`)}
              </div>
            </div>

            <hr />

            <div className="list">
              <div className="namespace-row non-selectable">
                <div className="checkbox-column">
                  <IconSVG name="icon-check" />
                </div>
                <div className="namespace-section">{this.state.namespace}</div>
              </div>

              {this.state.namespaces.map((ns) => {
                const isPicked = this.props.namespacesPick.indexOf(ns) !== -1;

                return (
                  <div
                    key={ns}
                    className="namespace-row"
                    onClick={this.namespaceClick.bind(this, ns)}
                  >
                    <div className="checkbox-column">
                      <IconSVG
                        name={isPicked ? 'icon-check-square' : 'icon-square-o'}
                      />
                    </div>
                    <div className="namespace-section">{ns}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Popover>
    );
  }
}

export default NamespacesPopover;
