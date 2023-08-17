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
import IconSVG from 'components/shared/IconSVG';
import MyDataPrepApi from 'api/dataprep';
import NamespaceStore from 'services/NamespaceStore';
import classnames from 'classnames';
import T from 'i18n-react';
import replace from 'lodash/replace';
import ee from 'event-emitter';
import { objectQuery } from 'services/helpers';
import CardActionFeedback from 'components/shared/CardActionFeedback';
import uuidV4 from 'uuid/v4';
import LoadingSVG from 'components/shared/LoadingSVG';
import { ConnectionType } from 'components/DataPrepConnections/ConnectionType';
import { WrappedWidgetWrapper } from 'components/shared/ConfigurationGroup/WidgetWrapper';

const CONN_TYPE = {
  basic: 'BASIC',
  advanced: 'ADVANCED',
};

const LABEL_COL_CLASS = 'col-4 col-form-label text-right';
const INPUT_COL_CLASS = 'col-8';

const PREFIX =
  'features.DataPrepConnections.AddConnections.Database.DatabaseDetail';

export default class DatabaseDetail extends Component {
  constructor(props) {
    super(props);

    const defaultPort = this.props.db['default.port'] || '';

    const customId = uuidV4();

    this.state = {
      connType: !this.props.db.basicAllowed
        ? CONN_TYPE.advanced
        : CONN_TYPE.basic,
      name: '',
      hostname: 'localhost',
      port: this.props.mode === 'ADD' ? defaultPort : '',
      username: '',
      password: '',
      database: '',
      connectionString: '',
      connectionResult: null,
      error: null,
      databaseList: ['', customId],
      customId: customId,
      selectedDatabase: '',
      testConnectionLoading: false,
    };

    this.eventEmitter = ee(ee);
    this.addConnection = this.addConnection.bind(this);
    this.editConnection = this.editConnection.bind(this);
    this.testConnection = this.testConnection.bind(this);
    this.preventDefault = this.preventDefault.bind(this);
    this.handleDatabaseChange = this.handleDatabaseChange.bind(this);
    this.handleDatabaseSelect = this.handleDatabaseSelect.bind(this);
  }

  fetchDatabases() {
    const namespace = NamespaceStore.getState().selectedNamespace;
    const requestBody = {
      name: this.state.name,
      type: ConnectionType.DATABASE,
      properties: this.constructProperties(),
    };

    MyDataPrepApi.getDatabaseList(
      { context: namespace },
      requestBody
    ).subscribe(
      (databaseList) => {
        const list = databaseList.values.sort();
        let customId = this.state.customId;

        if (list.indexOf(customId) !== -1) {
          customId = uuidV4();
        }

        list.push(customId);
        list.unshift('');

        this.setState({
          databaseList: list,
          selectedDatabase:
            this.props.mode === 'EDIT' ? this.state.database : '',
          customId,
        });
      },
      (err) => {
        console.log('err fetching database list', err);
      }
    );
  }

  componentWillMount() {
    if (this.props.mode !== 'ADD') {
      const name = this.props.mode === 'EDIT' ? this.props.connInfo.name : '';

      const {
        connectionString = '',
        password = '',
        username = '',
        hostname = '',
        port = '',
        database = '',
      } = this.props.connInfo.properties;

      this.setState(
        {
          name,
          connectionString,
          password,
          username,
          hostname,
          port,
          database,
          selectedDatabase: this.state.customId,
          connType: connectionString ? CONN_TYPE.advanced : CONN_TYPE.basic,
        },
        () => {
          if (this.props.mode === 'EDIT') {
            this.fetchDatabases();
          }
        }
      );
    }
  }

  preventDefault(e) {
    e.preventDefault();
  }

  handleChange = (key, e) => {
    this.setState({
      [key]: e.target.value,
      connectionResult: null,
    });
  };

  handlePasswordChange = (password) => {
    this.setState({
      password,
    });
  };

  handleDatabaseChange(e) {
    this.setState({
      database: e.target.value,
    });
  }

  handleDatabaseSelect(e) {
    this.setState({
      selectedDatabase: e.target.value,
    });
  }

  handleConnTypeChange(type) {
    this.setState({ connType: type });
  }

  constructProperties() {
    let properties;
    const db = this.props.db;

    if (this.state.connType === CONN_TYPE.basic) {
      const selectedDatabase =
        this.state.selectedDatabase === this.state.customId
          ? this.state.database
          : this.state.selectedDatabase;

      properties = {
        hostname: this.state.hostname.trim(),
        port: this.state.port.trim(),
        username: this.state.username.trim(),
        password: this.state.password,
        database: selectedDatabase,
      };
    } else {
      properties = {
        connectionString: this.state.connectionString.trim(),
        username: this.state.username.trim(),
        password: this.state.password,
      };
    }

    properties.name = db.name;
    properties.type = db.pluginInfo.properties.type;
    properties.class = db.pluginInfo.properties.class;
    properties.url = this.interpolateConnectionString(db.pluginInfo.url);

    return properties;
  }

  interpolateConnectionString(url) {
    const state = this.state;
    const required = this.props.db.pluginInfo.fields;

    let interpolatedUrl = url;

    if (this.state.connType === CONN_TYPE.basic) {
      required.forEach((field) => {
        let fieldValue = state[field];
        if (field === 'database') {
          fieldValue =
            state.selectedDatabase === state.customId
              ? state.database
              : state.selectedDatabase;
        }

        interpolatedUrl = replace(
          interpolatedUrl,
          '${' + field + '}',
          fieldValue
        );
      });
    } else {
      interpolatedUrl = this.state.connectionString;
    }

    return interpolatedUrl;
  }

  addConnection() {
    const namespace = NamespaceStore.getState().selectedNamespace;

    const requestBody = {
      name: this.state.name,
      type: ConnectionType.DATABASE,
      properties: this.constructProperties(),
    };

    MyDataPrepApi.createConnection(
      { context: namespace },
      requestBody
    ).subscribe(
      () => {
        this.setState({ error: null });
        this.props.onAdd();
      },
      (err) => {
        console.log('err', err);

        const error =
          objectQuery(err, 'response', 'message') ||
          objectQuery(err, 'response');
        this.setState({ error });
      }
    );
  }

  editConnection() {
    const namespace = NamespaceStore.getState().selectedNamespace;

    const params = {
      context: namespace,
      connectionId: this.props.connectionId,
    };

    const requestBody = {
      name: this.state.name,
      id: this.props.connectionId,
      type: ConnectionType.DATABASE,
      properties: this.constructProperties(),
    };

    MyDataPrepApi.updateConnection(params, requestBody).subscribe(
      () => {
        this.setState({ error: null });
        this.eventEmitter.emit(
          'DATAPREP_CONNECTION_EDIT_DATABASE',
          this.props.connectionId
        );
        this.props.onAdd();
      },
      (err) => {
        console.log('err', err);

        const error =
          objectQuery(err, 'response', 'message') ||
          objectQuery(err, 'response');
        this.setState({ error });
      }
    );
  }

  testConnection() {
    this.setState({ testConnectionLoading: true });

    const namespace = NamespaceStore.getState().selectedNamespace;

    const requestBody = {
      name: this.state.name,
      type: ConnectionType.DATABASE,
      properties: this.constructProperties(),
    };

    MyDataPrepApi.jdbcTestConnection(
      { context: namespace },
      requestBody
    ).subscribe(
      (res) => {
        this.setState({
          connectionResult: {
            type: 'success',
            message: res.message,
          },
          testConnectionLoading: false,
        });

        this.fetchDatabases();
      },
      (err) => {
        console.log('Error testing database connection', err);

        const errorMessage =
          objectQuery(err, 'response', 'message') ||
          objectQuery(err, 'response') ||
          T.translate(`${PREFIX}.defaultTestErrorMessage`);

        this.setState({
          connectionResult: {
            type: 'danger',
            message: errorMessage,
          },
          testConnectionLoading: false,
        });
      }
    );
  }

  renderUsername() {
    return (
      <div className="form-group row">
        <label className={LABEL_COL_CLASS}>
          {T.translate(`${PREFIX}.username`)}
        </label>
        <div className={INPUT_COL_CLASS}>
          <input
            type="text"
            className="form-control"
            value={this.state.username}
            onChange={this.handleChange.bind(this, 'username')}
          />
        </div>
      </div>
    );
  }

  renderPassword() {
    return (
      <div className="form-group row">
        <label className={LABEL_COL_CLASS}>
          {T.translate(`${PREFIX}.password`)}
        </label>
        <div className={INPUT_COL_CLASS}>
          <WrappedWidgetWrapper
            widgetProperty={{
              'widget-type': 'securekey-password',
            }}
            value={this.state.password}
            onChange={this.handlePasswordChange}
            hideLabel={true}
            hideDescription={true}
          />
        </div>
      </div>
    );
  }

  renderTestButton() {
    const disabled = this.state.testConnectionLoading;

    return (
      <div className="form-group row">
        <div className="col-8 offset-4 col-offset-4 col-xs-offset-4">
          <button
            className="btn btn-secondary"
            onClick={this.testConnection}
            disabled={disabled}
          >
            {T.translate(`${PREFIX}.testConnection`)}
          </button>

          {this.state.testConnectionLoading ? (
            <span className="fa loading-indicator">
              <LoadingSVG />
            </span>
          ) : null}

          {this.state.connectionResult ? (
            <span
              className={`connection-check text-${this.state.connectionResult.type}`}
            >
              {this.state.connectionResult.message}
            </span>
          ) : null}
        </div>
      </div>
    );
  }

  renderDatabase() {
    return (
      <div className="form-group row">
        <label className={LABEL_COL_CLASS}>
          {T.translate(`${PREFIX}.database`)}
        </label>
        <div className={INPUT_COL_CLASS}>
          <select
            className="form-control"
            value={this.state.selectedDatabase}
            onChange={this.handleDatabaseSelect}
          >
            {this.state.databaseList.map((dbOption) => {
              return (
                <option key={dbOption} value={dbOption}>
                  {dbOption === this.state.customId
                    ? T.translate(`${PREFIX}.customLabel`)
                    : dbOption}
                </option>
              );
            })}
          </select>

          {this.state.selectedDatabase === this.state.customId ? (
            <div className="custom-input">
              <input
                type="text"
                className="form-control"
                value={this.state.database}
                onChange={this.handleDatabaseChange}
              />
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  renderBasic() {
    return (
      <div>
        <div className="form-group row">
          <label className={LABEL_COL_CLASS}>
            {T.translate(`${PREFIX}.hostname`)}
            <span className="asterisk">*</span>
          </label>
          <div className={INPUT_COL_CLASS}>
            <input
              type="text"
              className="form-control"
              value={this.state.hostname}
              onChange={this.handleChange.bind(this, 'hostname')}
            />
          </div>
        </div>

        <div className="form-group row">
          <label className={LABEL_COL_CLASS}>
            {T.translate(`${PREFIX}.port`)}
            <span className="asterisk">*</span>
          </label>
          <div className={INPUT_COL_CLASS}>
            <input
              type="text"
              className="form-control"
              value={this.state.port}
              onChange={this.handleChange.bind(this, 'port')}
            />
          </div>
        </div>

        {this.renderUsername()}

        {this.renderPassword()}

        {this.renderTestButton()}

        {this.renderDatabase()}
      </div>
    );
  }

  renderAdvanced() {
    const connStringUrl = objectQuery(this.props, 'db', 'pluginInfo', 'url');
    const placeholder = connStringUrl
      ? T.translate(`${PREFIX}.Placeholders.connectionString`, {
          connectionString: connStringUrl,
        })
      : T.translate(`${PREFIX}.Placeholders.connectionStringDefault`);

    return (
      <div>
        <div className="form-group row">
          <label className={LABEL_COL_CLASS}>
            {T.translate(`${PREFIX}.connectionString`)}
            <span className="asterisk">*</span>
          </label>
          <div className={INPUT_COL_CLASS}>
            <input
              type="text"
              className="form-control"
              value={this.state.connectionString || placeholder}
              onChange={this.handleChange.bind(this, 'connectionString')}
              placeholder={placeholder}
            />
          </div>
        </div>

        {this.renderUsername()}

        {this.renderPassword()}

        {this.renderTestButton()}
      </div>
    );
  }

  renderDriverInfo() {
    const db = this.props.db;

    return (
      <div className="row driver-info">
        <div className="col-4 text-right">
          <div className="image-container">
            <div className={`db-image db-${db.tag}`} />
          </div>
          <div className="db-label">
            <span>{db.label}</span>
          </div>
        </div>

        <div className="col-8 driver-detail">
          <span>{db.pluginInfo.version}</span>

          <span>
            <span className="fa fa-fw">
              <IconSVG name="icon-check-circle" />
            </span>

            <span>{T.translate(`${PREFIX}.driverInstalled`)}</span>
          </span>
        </div>
      </div>
    );
  }

  renderConnectionInfo() {
    if (this.state.connType === CONN_TYPE.basic) {
      return this.renderBasic();
    }

    return this.renderAdvanced();
  }

  renderAddConnectionButton() {
    let disabled = !this.state.name;

    if (this.state.connType === CONN_TYPE.basic) {
      disabled = disabled || !this.state.hostname || !this.state.port;
    } else {
      disabled = disabled || !this.state.connectionString;
    }

    let onClickFn = this.addConnection;

    if (this.props.mode === 'EDIT') {
      onClickFn = this.editConnection;
    }

    return (
      <div className="row">
        <div className="col-8 offset-4 col-offset-4 col-xs-offset-4">
          <button
            className="btn btn-primary"
            onClick={onClickFn}
            disabled={disabled}
          >
            {T.translate(`${PREFIX}.Buttons.${this.props.mode}`)}
          </button>
        </div>
      </div>
    );
  }

  renderConnectionType() {
    if (!this.props.db.basicAllowed) {
      return null;
    }

    return (
      <div className="form-group row">
        <label className={LABEL_COL_CLASS}>
          {T.translate(`${PREFIX}.connType`)}
        </label>
        <div className={`${INPUT_COL_CLASS} connection-type`}>
          <span
            onClick={this.handleConnTypeChange.bind(this, CONN_TYPE.basic)}
            className={classnames({
              active: this.state.connType === CONN_TYPE.basic,
            })}
          >
            {T.translate(`${PREFIX}.basic`)}
          </span>
          <span className="divider">|</span>
          <span
            onClick={this.handleConnTypeChange.bind(this, CONN_TYPE.advanced)}
            className={classnames({
              active: this.state.connType === CONN_TYPE.advanced,
            })}
          >
            {T.translate(`${PREFIX}.advanced`)}
          </span>
        </div>
      </div>
    );
  }

  renderError() {
    if (!this.state.error) {
      return null;
    }

    return (
      <div className="error-container">
        <CardActionFeedback
          type="DANGER"
          message={T.translate(`${PREFIX}.ErrorMessages.${this.props.mode}`)}
          extendedMessage={this.state.error}
        />
      </div>
    );
  }

  render() {
    let backlink = (
      <div className="back-link-container">
        <span className="back-link" onClick={this.props.back}>
          <span className="fa fa-fw">
            <IconSVG name="icon-angle-double-left" />
          </span>
          <span>{T.translate(`${PREFIX}.backButton`)}</span>
        </span>
      </div>
    );

    if (this.props.mode !== 'ADD') {
      backlink = null;
    }

    return (
      <div className="database-detail">
        <div className="database-detail-content">
          {this.renderDriverInfo()}

          <form onSubmit={this.preventDefault}>
            <div className="form-group row">
              <label className={LABEL_COL_CLASS}>
                {T.translate(`${PREFIX}.name`)}
                <span className="asterisk">*</span>
              </label>
              <div className={INPUT_COL_CLASS}>
                <input
                  type="text"
                  className="form-control"
                  value={this.state.name}
                  onChange={this.handleChange.bind(this, 'name')}
                  disabled={this.props.mode === 'EDIT'}
                  placeholder={T.translate(`${PREFIX}.Placeholders.name`)}
                />
              </div>
            </div>

            {this.renderConnectionType()}

            {this.renderConnectionInfo()}
          </form>

          {this.renderAddConnectionButton()}
        </div>

        {backlink}

        {this.renderError()}
      </div>
    );
  }
}

DatabaseDetail.propTypes = {
  back: PropTypes.func,
  db: PropTypes.object,
  onAdd: PropTypes.func,
  mode: PropTypes.oneOf(['ADD', 'EDIT', 'DUPLICATE']).isRequired,
  connectionId: PropTypes.string,
  connInfo: PropTypes.object,
};
