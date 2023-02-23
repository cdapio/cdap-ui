/*
 * Copyright © 2016-2017 Cask Data, Inc.
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
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Market from 'components/Market';
import ResourceCenter from 'components/ResourceCenter';
import IconSVG from 'components/shared/IconSVG';
import CardActionFeedback from 'components/shared/CardActionFeedback';
import classnames from 'classnames';
import { CSSTransition } from 'react-transition-group';
import T from 'i18n-react';
import { Theme } from 'services/ThemeHelper';

require('./PlusButtonModal.scss');

export default class PlusButtonModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewMode: this.props.mode,
      error: null,
    };

    this.closeHandler = this.closeHandler.bind(this);
  }
  closeHandler() {
    this.setState({
      viewMode: this.props.mode,
      error: null,
      extendedError: null,
    });
    this.props.onCloseHandler();
  }

  onError = (error, extendedError) => {
    this.setState({
      error,
      extendedError,
    });
  };
  renderError() {
    if (!this.state.error) {
      return null;
    }

    return (
      <ModalFooter>
        <CardActionFeedback
          type="DANGER"
          message={this.state.error}
          extendedMessage={this.state.extendedError}
        />
      </ModalFooter>
    );
  }
  render() {
    const market = Theme.featureNames.hub;
    const resourceCenter = T.translate('commons.resource-center');

    return (
      <Modal
        isOpen={this.props.isOpen}
        toggle={this.closeHandler.bind(this)}
        className={classnames('plus-button-modal cdap-modal', {
          'cask-market': this.state.viewMode === 'marketplace',
          'add-entity-modal': this.state.viewMode === 'resourcecenter',
        })}
        size="lg"
        zIndex="1061"
        fade
      >
        <ModalHeader>
          <span className="float-left">
            <span className="plus-modal-header-text">
              {this.state.viewMode === 'resourcecenter'
                ? resourceCenter
                : market}
            </span>
          </span>
          <div className="float-right">
            <div
              className="modal-close-btn"
              onClick={this.closeHandler}
              data-cy="hub-close-btn"
            >
              <IconSVG name="icon-close" />
            </div>
          </div>
        </ModalHeader>
        <ModalBody>
          <CSSTransition
            transitionName="plus-button-modal-content"
            transitionEnterTimeout={500}
            transitionLeaveTimeout={300}
            timeout={5000}
            component="div"
          >
            {this.state.viewMode === 'marketplace' ? (
              <Market key="1" />
            ) : (
              <ResourceCenter key="2" onError={this.onError} />
            )}
          </CSSTransition>
        </ModalBody>
        {this.renderError()}
      </Modal>
    );
  }
}

PlusButtonModal.defaultProps = {
  mode: 'marketplace',
};

PlusButtonModal.propTypes = {
  onCloseHandler: PropTypes.func,
  isOpen: PropTypes.bool,
  mode: PropTypes.oneOf(['marketplace', 'resourcecenter']),
};
