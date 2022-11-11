/*
 * Copyright © 2019 Cask Data, Inc.
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
import CardActionFeedback from 'components/shared/CardActionFeedback';
import SessionStore from 'services/SessionTokenStore';
import T from 'i18n-react';

import './AccessTokenModal.scss';

interface IAccessTokenModalProps {
  isOpen: boolean;
  toggle: () => void;
  cdapVersion: string;
}

interface IAccessTokenModalState {
  usernameInput: string;
  passwordInput: string;
  accessToken: string;
  error: string | null;
  loading: boolean;
}

export default class AccessTokenModal extends Component<
  IAccessTokenModalProps,
  IAccessTokenModalState
> {
  constructor(props) {
    super(props);

    this.state = {
      usernameInput: '',
      passwordInput: '',
      accessToken: '',
      error: null,
      loading: false,
    };

    this.toggleModal = this.toggleModal.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  public toggleModal() {
    this.setState({
      usernameInput: '',
      passwordInput: '',
      accessToken: '',
      error: null,
    });
    this.props.toggle();
  }

  public handleUsernameChange(e) {
    this.setState({ usernameInput: e.target.value });
  }
  public handlePasswordChange(e) {
    this.setState({ passwordInput: e.target.value });
  }

  public onSubmit() {
    this.setState({
      loading: true,
    });
    fetch('/login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        sessionToken: SessionStore.getState(),
      },
      body: JSON.stringify({
        username: this.state.usernameInput,
        password: this.state.passwordInput,
      }),
      credentials: 'include',
    })
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return response.json();
        } else {
          this.setState({
            error: T.translate('features.AccessTokenModal.login.error').toString(),
            loading: false,
          });
          return Promise.reject();
        }
      })
      .then((res) => {
        this.setState({
          accessToken: res.access_token,
          error: null,
          loading: false,
        });
      });
  }

  public renderLogin() {
    const disabled =
      this.state.usernameInput.length === 0 ||
      this.state.passwordInput.length === 0 ||
      this.state.loading;
    return (
      <div>
        <span>{T.translate('features.AccessTokenModal.login.textContent')}</span>
        <div className="username-password">
          <input
            type="text"
            className="form-control username"
            placeholder={T.translate(
              'features.AccessTokenModal.login.usernamePlaceholder'
            ).toString()}
            value={this.state.usernameInput}
            onChange={this.handleUsernameChange}
          />
          <input
            type="password"
            className="form-control password"
            placeholder={T.translate(
              'features.AccessTokenModal.login.passwordPlaceholder'
            ).toString()}
            value={this.state.passwordInput}
            onChange={this.handlePasswordChange}
          />
        </div>
        <div className="text-xs-left submit-button">
          <button className="btn btn-primary" onClick={this.onSubmit} disabled={disabled}>
            {T.translate('features.AccessTokenModal.login.submit')}
          </button>
        </div>
      </div>
    );
  }

  public renderAccessToken() {
    return (
      <div>
        <span className="access-token">
          {T.translate('features.AccessTokenModal.accessToken')}
          <strong>{this.state.accessToken}</strong>
        </span>
        <div className="text-xs-left done-button">
          <button className="btn btn-primary" onClick={this.toggleModal}>
            {T.translate('features.AccessTokenModal.close')}
          </button>
        </div>
      </div>
    );
  }

  public renderFeedback() {
    if (!this.state.error) {
      return null;
    }
    return (
      <ModalFooter>
        <CardActionFeedback type="DANGER" message={this.state.error} />
      </ModalFooter>
    );
  }

  public render() {
    return (
      <Modal
        isOpen={this.props.isOpen}
        toggle={this.toggleModal}
        size="md"
        className="access-token-modal cdap-modal"
        backdrop="static"
      >
        <ModalHeader>
          <span>{T.translate('features.AccessTokenModal.modalHeader')}</span>
          <div className="close-section float-xs-right" onClick={this.toggleModal}>
            <span className="fa fa-times" />
          </div>
        </ModalHeader>
        <ModalBody>
          {this.state.accessToken.length > 0 ? this.renderAccessToken() : this.renderLogin()}
        </ModalBody>
        {this.renderFeedback()}
      </Modal>
    );
  }
}
