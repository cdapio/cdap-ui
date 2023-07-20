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

// import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Popover from 'components/shared/Popover';
import PlusButtonModal from 'components/shared/PlusButtonModal';
import { Link } from 'react-router-dom';
import PlusButtonStore from 'services/PlusButtonStore';
import ee from 'event-emitter';
import globalEvents from 'services/global-events';
require('./PlusButton.scss');

const PLUSBUTTON_DIMENSION = 58;

export default class PlusButton extends Component {
  static MODE = {
    marketplace: 'marketplace',
    resourcecenter: 'resourcecenter',
  };

  // static propTypes = {
  //   contextItems: PropTypes.arrayOf(
  //     PropTypes.shape({
  //       label: PropTypes.string,
  //       to: PropTypes.string,
  //       onClick: PropTypes.func,
  //     })
  //   ),
  //   mode: PropTypes.oneOf([
  //     PlusButton.MODE.marketplace,
  //     PlusButton.MODE.resourcecenter,
  //   ]),
  // };

  eventemitter = ee(ee);
  constructor(props) {
    super(props);
    if (this.props.mode === PlusButton.MODE.resourcecenter) {
      this.eventemitter.on(globalEvents.OPENRESOURCECENTER, this.toggleModal);
      this.eventemitter.on(globalEvents.CLOSERESOURCECENTER, this.toggleModal);
    }
  }

  componentDidMount() {
    this.plusButtonSubscription = PlusButtonStore.subscribe(() => {
      const modalState = PlusButtonStore.getState().modalState;
      this.setState({
        showModal: modalState,
      });
    });
  }

  componentWillUnmount() {
    if (this.plusButtonSubscription) {
      this.plusButtonSubscription();
    }
    if (this.props.mode === PlusButton.MODE.resourcecenter) {
      this.eventemitter.off(globalEvents.OPENRESOURCECENTER, this.toggleModal);
      this.eventemitter.off(globalEvents.CLOSERESOURCECENTER, this.toggleModal);
    }
  }

  static defaultProps = {
    contextItems: [],
  };

  state = {
    showModal: false,
  };

  targetElement = ({ onClick = () => {} }) => {
    return (
      <img
        id="resource-center-btn"
        className="button-container"
        src="/cdap_assets/img/plus_ico.svg"
        onClick={!this.props.contextItems.length ? this.toggleModal : onClick}
      />
    );
  };

  toggleModal = () => {
    this.setState({ showModal: !this.state.showModal });
  };

  renderResourceCenterMenu = () => {
    if (!this.props.contextItems.length) {
      return null;
    }
    return (
      <ul>
        {this.props.contextItems.map((item) => {
          if (item.to) {
            return (
              <Link to={item.to} key={item.label}>
                <li>{item.label}</li>
              </Link>
            );
          }
          return (
            <li onClick={item.onClick} key={item.label}>
              {item.label}
            </li>
          );
        })}
        <li onClick={this.toggleModal} className="more-button">
          More
        </li>
      </ul>
    );
  };

  renderResourceCenter = () => {
    return (
      <Popover
        target={this.targetElement}
        targetDimension={{
          width: PLUSBUTTON_DIMENSION,
          height: PLUSBUTTON_DIMENSION,
        }}
        placement="bottom"
      >
        {this.renderResourceCenterMenu()}
      </Popover>
    );
  };

  renderMarket = () => {
    return PlusButton.targetElement({ onClick: this.toggleModal });
  };

  render() {
    return (
      <div className="plus-button">
        {this.props.mode === PlusButton.MODE.marketplace
          ? this.renderMarket()
          : this.renderResourceCenter()}
        <PlusButtonModal
          isOpen={this.state.showModal}
          mode={this.props.mode}
          onCloseHandler={this.toggleModal}
        />
      </div>
    );
  }
}
