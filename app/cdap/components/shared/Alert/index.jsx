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

import IconSVG from 'components/shared/IconSVG';
import { Modal } from 'reactstrap';
import PropTypes from 'prop-types';
import { ALERT_STATUS } from 'services/AlertStatus';

require('./Alert.scss');
const CLOSE_TIMEOUT = 3000;

export default class Alert extends Component {
  state = {
    showAlert: this.props.showAlert || false,
    message: this.props.message,
    element: this.props.element,
    type: this.props.type,
  };

  static propTypes = {
    showAlert: PropTypes.bool,
    message: PropTypes.string,
    element: PropTypes.node,
    onClose: PropTypes.func,
    type: PropTypes.oneOf(['success', 'error', 'info']),
    canEditPageWhileOpen: PropTypes.bool,
    actionElements: PropTypes.element,
  };

  alertTimeout = null;

  componentDidMount() {
    this.resetTimeout();
  }

  componentWillReceiveProps(nextProps) {
    const { showAlert, type, message, element } = nextProps;
    if (
      showAlert !== this.state.showAlert ||
      type !== this.state.type ||
      message !== this.state.message
    ) {
      this.setState({
        showAlert,
        type,
        message,
        element,
      });
    }
    this.resetTimeout();
  }

  componentWillUnmount() {
    clearTimeout(this.alertTimeout);
  }

  resetTimeout = () => {
    if (
      this.state.type === ALERT_STATUS.Success ||
      this.state.type === ALERT_STATUS.Info
    ) {
      clearTimeout(this.alertTimeout);
      this.alertTimeout = setTimeout(this.onClose, CLOSE_TIMEOUT);
    }
  };

  onClose = () => {
    this.setState({
      showAlert: false,
      message: '',
      element: null,
      type: '',
    });
    if (this.props.onClose) {
      this.props.onClose();
    }
  };

  render() {
    let msgElem = null;
    if (this.state.element) {
      msgElem = <span className="message truncate">{this.state.element}</span>;
    } else if (this.state.message) {
      let message = this.state.message;
      if (typeof message !== 'string') {
        message = JSON.stringify(message);
      }

      msgElem = (
        <span className="message truncate" title={this.state.message}>
          {message}
        </span>
      );
    }
    return (
      /**
       * TODO: This should be a toast, not a modal at least in some scenarios
       * - In some scenarios (eg cdap/components/ErrorBanner) this is being used as a toast, which means
       * its an error message at the top of the page. This makes the rest of the page uninteractable, which
       * is not intended. To fix this bug https://cdap.atlassian.net/browse/CDAP-18193 I had to disable
       * the height: 100% overlay with the canEditPageWhileOpen prop. The long term fix should be using a toast.
       */
      <Modal
        modalClassName={
          this.props.canEditPageWhileOpen ? 'can-edit-page-while-open' : ''
        }
        isOpen={this.state.showAlert}
        toggle={() => {}}
        backdrop={false}
        keyboard={true}
        className="global-alert"
        zIndex={1062 /* This is required for showing error in angular side*/}
      >
        <div className={this.state.type} data-cy="alert" data-testid="alert">
          {msgElem}
          {this.props.actionElements}
          <IconSVG
            name="icon-close"
            onClick={this.onClose}
            dataCy="alert-close"
            dataTestId="alert-close"
          />
        </div>
      </Modal>
    );
  }
}
