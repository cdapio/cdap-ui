/*
 * Copyright © 2016-2018 Cask Data, Inc.
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

import CardActionFeedback from 'components/shared/CardActionFeedback';
import IconSVG from 'components/shared/IconSVG';
import If from 'components/shared/If';
import T from 'i18n-react';
import Mousetrap from 'mousetrap';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

require('./ConfirmationModal.scss');

export default class ConfirmationModal extends Component {
  static propTypes = {
    cancelButtonText: PropTypes.string,
    cancelFn: PropTypes.func,
    confirmationElem: PropTypes.element,
    confirmButtonText: PropTypes.string,
    confirmationText: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.node])),
    ]),
    confirmFn: PropTypes.func,
    headerTitle: PropTypes.string,
    isOpen: PropTypes.bool,
    toggleModal: PropTypes.func,
    isLoading: PropTypes.bool,
    errorMessage: PropTypes.string,
    extendedMessage: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        response: PropTypes.string,
      }),
    ]),
    disableAction: PropTypes.bool,
    closeable: PropTypes.bool,
    keyboard: PropTypes.bool,
  };

  static defaultProps = {
    confirmButtonText: T.translate('features.ConfirmationModal.confirmDefaultText'),
    cancelButtonText: T.translate('features.ConfirmationModal.cancelDefaultText'),
    closeable: false,
    keyboard: true,
  };

  componentWillMount() {
    Mousetrap.bind('enter', this.props.confirmFn);
  }

  componentWillUnmount() {
    Mousetrap.unbind('enter');
  }

  renderModalBody() {
    if (this.props.isLoading) {
      return (
        <ModalBody className="loading">
          <h3 className="text-center">
            <IconSVG name="icon-spinner" className="fa-spin" />
          </h3>
        </ModalBody>
      );
    }
    let confirmation = this.props.confirmationElem
      ? this.props.confirmationElem
      : this.props.confirmationText;

    let actionBtn;

    if (this.props.disableAction) {
      actionBtn = (
        <button
          className="btn btn-primary disabled-btn"
          disabled
          data-cy={this.props.confirmButtonText}
          data-testid={this.props.confirmButtonText}
        >
          {this.props.confirmButtonText}
        </button>
      );
    } else {
      actionBtn = (
        <button
          className="btn btn-primary"
          onClick={this.props.confirmFn}
          data-cy={this.props.confirmButtonText}
          data-testid={this.props.confirmButtonText}
        >
          {this.props.confirmButtonText}
        </button>
      );
    }
    return (
      <React.Fragment>
        <ModalBody>
          <div className="confirmation">{confirmation}</div>
        </ModalBody>
        <ModalFooter>
          <div className="confirmation-button-options">
            {actionBtn}
            <button
              className="btn btn-secondary"
              onClick={this.props.cancelFn}
              data-testid={this.props.cancelButtonText}
            >
              {this.props.cancelButtonText}
            </button>
          </div>
        </ModalFooter>
      </React.Fragment>
    );
  }

  render() {
    let footer;
    if (this.props.errorMessage) {
      footer = (
        <CardActionFeedback
          type="DANGER"
          message={this.props.errorMessage}
          extendedMessage={this.props.extendedMessage}
        />
      );
    }

    return (
      <Modal
        isOpen={this.props.isOpen}
        toggle={this.props.toggleModal}
        className="confirmation-modal cdap-modal"
        data-testid="confirmation-modal"
        backdrop="static"
        zIndex={1061}
        keyboard={this.props.keyboard}
        data-cy="confirm-dialog"
      >
        <ModalHeader>
          {this.props.headerTitle}
          <If condition={this.props.closeable}>
            <div className="close-section float-right" onClick={this.props.toggleModal}>
              <IconSVG name="icon-close" />
            </div>
          </If>
        </ModalHeader>

        {this.renderModalBody()}
        {footer}
      </Modal>
    );
  }
}
