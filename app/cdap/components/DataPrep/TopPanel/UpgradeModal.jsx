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

import PropTypes from 'prop-types';

import React, { Component } from 'react';
import T from 'i18n-react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import enableSystemApp from 'services/ServiceEnablerUtilities';
import CardActionFeedback from 'components/shared/CardActionFeedback';
import ee from 'event-emitter';

import MyDataPrepApi from 'api/dataprep';
import isObject from 'lodash/isObject';
import { Theme } from 'services/ThemeHelper';

const i18nPrefix = 'features.DataPrep.Upgrade';
const MIN_DATAPREP_VERSION = '4.0.0-SNAPSHOT';
const artifactName = 'wrangler-service';

// the variables above were circular dependencies - leaving for debugging if necessary
// import {
//   i18nPrefix,
//   MIN_DATAPREP_VERSION,
//   artifactName,
// } from 'components/DataPrep';

const PREFIX = 'features.DataPrep.TopPanel.UpgradeModal';

export default class UpgradeModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      error: null,
      extendedMessage: null,
    };

    this.eventEmitter = ee(ee);
    this.attemptClose = this.attemptClose.bind(this);
    this.upgradeClick = this.upgradeClick.bind(this);
  }

  attemptClose() {
    if (this.state.loading) {
      return;
    }

    this.props.toggle();
  }

  upgradeClick() {
    this.setState({ loading: true });

    const featureName = Theme.featureNames.dataPrep;

    enableSystemApp({
      shouldStopService: true,
      artifactName,
      api: MyDataPrepApi,
      i18nPrefix,
      MIN_VERSION: MIN_DATAPREP_VERSION,
      featureName,
    }).subscribe(
      () => {
        this.eventEmitter.emit('REFRESH_DATAPREP');
      },
      (err) => {
        const extendedMessage = isObject(err.extendedMessage)
          ? err.extendedMessage.response || err.extendedMessage.message
          : err.extendedMessage;
        this.setState({
          loading: false,
          error: err.error,
          extendedMessage,
        });
      }
    );
  }

  renderError() {
    if (!this.state.error) {
      return null;
    }

    return (
      <CardActionFeedback
        type="DANGER"
        message={this.state.error}
        extendedMessage={this.state.extendedMessage}
      />
    );
  }

  render() {
    let content;

    if (this.state.loading) {
      content = (
        <div className="loading-container">
          <h3 className="text-center">
            <span className="fa fa-spin fa-spinner" />
          </h3>
        </div>
      );
    } else {
      content = (
        <div>
          <div className="message">{T.translate(`${PREFIX}.confirmation`)}</div>

          <div className="action-buttons">
            <button className="btn btn-secondary" onClick={this.upgradeClick}>
              {T.translate('commons.yesLabel')}
            </button>
            <button className="btn btn-secondary" onClick={this.attemptClose}>
              {T.translate('commons.noLabel')}
            </button>
          </div>
        </div>
      );
    }

    return (
      <Modal
        isOpen={true}
        toggle={this.attemptClose}
        className="dataprep-upgrade-modal cdap-modal"
        zIndex="1061"
      >
        <ModalHeader>
          <span>{T.translate(`${PREFIX}.modalHeader`)}</span>
          {this.state.loading ? null : (
            <div className="close-section float-right">
              <span className="fa fa-times" onClick={this.attemptClose} />
            </div>
          )}
        </ModalHeader>
        <ModalBody>
          {content}
          {this.renderError()}
        </ModalBody>
      </Modal>
    );
  }
}

UpgradeModal.propTypes = {
  toggle: PropTypes.func,
};
