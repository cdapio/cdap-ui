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
import T from 'i18n-react';
import Timer from 'components/shared/Timer';

export default class HomeErrorMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: this.props.errorMessage || '',
      errorStatusCode: this.props.errorStatusCode || 200,
      retrying: false,
      retryCounter: this.props.retryCounter,
    };
    this.resetRetryCounter = this.resetRetryCounter.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if (
      this.props.errorMessage !== nextProps.errorMessage ||
      this.props.errorStatusCode !== nextProps.errorStatusCode ||
      this.props.retryCounter !== nextProps.retryCounter
    ) {
      this.setState({
        errorMessage: nextProps.errorMessage || '',
        errorStatusCode: nextProps.errorStatusCode || 200,
        retrying: false,
        retryCounter: nextProps.retryCounter,
      });
    }
  }
  resetRetryCounter() {
    this.setState(
      {
        retrying: true,
        retryCounter: 0,
      },
      this.props.onRetry
    );
  }
  render() {
    const retryMap = {
      1: 10,
      2: 60,
      3: 120,
      4: 300,
      5: 600,
    };

    const normalError = (
      <h3 className="text-center empty-message text-danger">
        <span className="fa fa-exclamation-triangle" />
        <span>{this.state.errorMessage}</span>
      </h3>
    );

    const retryNow = (
      <button
        className="btn btn-primary retry-now"
        onClick={this.resetRetryCounter}
        disabled={this.state.retrying ? 'disabled' : false}
      >
        {this.state.retrying
          ? T.translate('features.EntityListView.Errors.retrying')
          : T.translate('features.EntityListView.Errors.retryNow')}
      </button>
    );

    const tryAgainError = (
      <h3 className="text-center empty-message text-danger">
        <span className="fa fa-exclamation-triangle" />
        <span>
          {T.translate('features.EntityListView.Errors.tryAgain')}
          <Timer
            time={retryMap[this.state.retryCounter]}
            onDone={this.resetRetryCounter}
          />
          {T.translate('features.EntityListView.Errors.secondsLabel')}
          <br />
          {retryNow}
        </span>
      </h3>
    );

    const timeOut = (
      <h3 className="text-center empty-message text-danger">
        <span className="fa fa-exclamation-triangle" />
        <span>{T.translate('features.EntityListView.Errors.timeOut')}</span>
      </h3>
    );

    const CHECK_ERROR_CODE = 500;

    if (
      this.state.retryCounter > 5 &&
      this.state.errorStatusCode >= CHECK_ERROR_CODE
    ) {
      return timeOut;
    } else if (this.state.errorStatusCode >= CHECK_ERROR_CODE) {
      return tryAgainError;
    } else {
      return normalError;
    }
  }
}

HomeErrorMessage.propTypes = {
  errorMessage: PropTypes.string,
  errorStatusCode: PropTypes.number,
  onRetry: PropTypes.func,
  retryCounter: PropTypes.number,
};
