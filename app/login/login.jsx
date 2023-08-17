/*
 * Copyright © 2016 Cask Data, Inc.
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
import ReactDOM from 'react-dom';
import Cookies from 'universal-cookie';

import Card from 'components/shared/Card';
import CardActionFeedback from 'components/shared/CardActionFeedback';

import * as util from './utils';
import Footer from '../cdap/components/shared/Footer';

require('./styles/lib-styles.scss');
require('./login.scss');
import T from 'i18n-react';
T.setTexts(require('./text/text-en.yaml'));

const cookie = new Cookies();

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: localStorage.getItem('login_username') || '',
      password: '',
      message: '',
      formState: false,
      rememberUser: false,
    };
  }
  login(e) {
    e.preventDefault();
    if (this.state.rememberUser) {
      localStorage.setItem('login_username', this.state.username);
    }
    fetch('/login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
      }),
    })
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return response.json();
        } else {
          this.setState({
            message: 'Login failed. Username or Password incorrect.',
          });
          return Promise.reject();
        }
      })
      .then((res) => {
        const { isSecure, access_token } = res;
        cookie.set('CDAP_Auth_Token', access_token, {
          path: '/',
          secure: isSecure,
          sameSite: 'strict',
        });
        cookie.set('CDAP_Auth_User', this.state.username, {
          secure: isSecure,
          sameSite: 'strict',
        });
        const queryObj = util.getQueryParams(location.search);
        let validRedirectUrl;
        // Require that redirectUrl be a relative path to avoid open redirects
        if (queryObj.redirectUrl?.startsWith('/')) {
          validRedirectUrl = queryObj.redirectUrl;
        } else {
          validRedirectUrl = '/';
        }
        window.location.href = validRedirectUrl;
      });
  }
  onUsernameUpdate(e) {
    this.setState({
      username: e.target.value,
      formState: e.target.value.length && this.state.password.length,
      message: '',
    });
  }
  onPasswordUpdate(e) {
    this.setState({
      password: e.target.value,
      formState: this.state.username.length && e.target.value.length,
      message: '',
    });
  }
  rememberUser() {
    this.setState({
      rememberUser: true,
    });
  }
  render() {
    let footer;
    if (this.state.message) {
      footer = (
        <CardActionFeedback type="DANGER" message={this.state.message} />
      );
    }

    return (
      <div>
        <Card footer={footer}>
          <div className="cdap-logo" />
          <form role="form" onSubmit={this.login.bind(this)}>
            <div className="form-group">
              <input
                id="username"
                className="form-control"
                name="username"
                value={this.state.username}
                placeholder={T.translate('login.placeholders.username')}
                onChange={this.onUsernameUpdate.bind(this)}
              />
            </div>
            <div className="form-group">
              <input
                id="password"
                className="form-control"
                placeholder={T.translate('login.placeholders.password')}
                onChange={this.onPasswordUpdate.bind(this)}
                type="password"
              />
            </div>
            <div className="form-group">
              <div className="clearfix">
                <div className="float-xs-left">
                  <div className="checkbox form-check">
                    <label className="form-check-label">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        value={this.state.rememberUser}
                        onClick={this.rememberUser.bind(this)}
                      />
                      {T.translate('login.labels.rememberme')}
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="form-group">
              <button
                id="submit"
                type="submit"
                className="btn btn-primary btn-block"
                disabled={!this.state.formState}
                onClick={this.login.bind(this)}
              >
                {T.translate('login.labels.loginbtn')}
              </button>
            </div>
          </form>
        </Card>
      </div>
    );
  }
}
ReactDOM.render(<Login />, document.getElementById('login-form'));
ReactDOM.render(
  <Footer showNamespace={false} />,
  document.getElementById('footer-container')
);
