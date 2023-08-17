/*
 * Copyright © 2018-2019 Cask Data, Inc.
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
import NamespaceStore from 'services/NamespaceStore';
import T from 'i18n-react';
import LoadingSVG from 'components/shared/LoadingSVG';
import MyDataPrepApi from 'api/dataprep';
import CardActionFeedback, {
  CARD_ACTION_TYPES,
} from 'components/shared/CardActionFeedback';
import { objectQuery } from 'services/helpers';
import ee from 'event-emitter';
import BtnWithLoading from 'components/shared/BtnWithLoading';
import { ConnectionType } from 'components/DataPrepConnections/ConnectionType';

const PREFIX = 'features.DataPrepConnections.AddConnections.BigQuery';
const ADDCONN_PREFIX = 'features.DataPrepConnections.AddConnections';

const LABEL_COL_CLASS = 'col-3 col-form-label text-right';
const INPUT_COL_CLASS = 'col-8';

require('./BigQueryConnection.scss');

export default class BigQueryConnection extends Component {
  static propTypes = {
    close: PropTypes.func,
    onAdd: PropTypes.func,
    mode: PropTypes.oneOf(['ADD', 'EDIT', 'DUPLICATE']).isRequired,
    connectionId: PropTypes.string,
  };

  state = {
    error: null,
    name: '',
    projectId: '',
    bucket: '',
    serviceAccountKeyfile: '',
    testConnectionLoading: false,
    connectionResult: {
      message: null,
      type: null,
    },
  };

  componentWillMount() {
    this.eventEmitter = ee(ee);
    if (this.props.mode === 'ADD') {
      return;
    }

    this.setState({ loading: true });

    const namespace = NamespaceStore.getState().selectedNamespace;

    const params = {
      context: namespace,
      connectionId: this.props.connectionId,
    };

    MyDataPrepApi.getConnection(params).subscribe(
      (res) => {
        const projectId = objectQuery(res, 'properties', 'projectId'),
          serviceAccountKeyfile = objectQuery(
            res,
            'properties',
            'service-account-keyfile'
          ),
          bucket = objectQuery(res, 'properties', 'bucket');

        const name = this.props.mode === 'EDIT' ? res.name : '';

        this.setState({
          name,
          projectId,
          serviceAccountKeyfile,
          bucket,
          loading: false,
        });
      },
      (err) => {
        console.log('failed to fetch connection detail', err);

        this.setState({
          loading: false,
        });
      }
    );
  }

  constructProperties = () => {
    const properties = {};

    if (this.state.projectId && this.state.projectId.length > 0) {
      properties.projectId = this.state.projectId.trim();
    }

    if (
      this.state.serviceAccountKeyfile &&
      this.state.serviceAccountKeyfile.length > 0
    ) {
      properties[
        'service-account-keyfile'
      ] = this.state.serviceAccountKeyfile.trim();
    }

    if (this.state.bucket && this.state.bucket.length > 0) {
      properties.bucket = this.state.bucket.trim();
    }

    return properties;
  };

  addConnection = () => {
    const namespace = NamespaceStore.getState().selectedNamespace;

    const requestBody = {
      name: this.state.name,
      type: 'BIGQUERY',
      properties: this.constructProperties(),
    };

    MyDataPrepApi.createConnection(
      { context: namespace },
      requestBody
    ).subscribe(
      () => {
        this.setState({ error: null });
        this.props.onAdd();
        this.props.close();
      },
      (err) => {
        console.log('err', err);

        const error =
          objectQuery(err, 'response', 'message') ||
          objectQuery(err, 'response');
        this.setState({ error });
      }
    );
  };

  editConnection = () => {
    const namespace = NamespaceStore.getState().selectedNamespace;

    const params = {
      context: namespace,
      connectionId: this.props.connectionId,
    };

    const requestBody = {
      name: this.state.name,
      id: this.props.connectionId,
      type: 'BIGQUERY',
      properties: this.constructProperties(),
    };

    MyDataPrepApi.updateConnection(params, requestBody).subscribe(
      () => {
        this.setState({ error: null });
        this.eventEmitter.emit(
          'DATAPREP_CONNECTION_EDIT_BIGQUERY',
          this.props.connectionId
        );
        this.props.onAdd();
        this.props.close();
      },
      (err) => {
        console.log('err', err);

        const error =
          objectQuery(err, 'response', 'message') ||
          objectQuery(err, 'response');
        this.setState({ error });
      }
    );
  };

  testConnection = () => {
    this.setState({
      testConnectionLoading: true,
      connectionResult: {
        message: null,
        type: null,
      },
      error: null,
    });

    const namespace = NamespaceStore.getState().selectedNamespace;

    const requestBody = {
      name: this.state.name,
      type: 'BIGQUERY',
      properties: this.constructProperties(),
    };

    MyDataPrepApi.bigQueryTestConnection(
      { context: namespace },
      requestBody
    ).subscribe(
      (res) => {
        this.setState({
          connectionResult: {
            type: CARD_ACTION_TYPES.SUCCESS,
            message: res.message,
          },
          testConnectionLoading: false,
        });
      },
      (err) => {
        console.log('Error testing Google BigQuery connection', err);

        const errorMessage =
          objectQuery(err, 'response', 'message') ||
          objectQuery(err, 'response') ||
          T.translate(`${PREFIX}.defaultTestErrorMessage`);

        this.setState({
          connectionResult: {
            type: CARD_ACTION_TYPES.DANGER,
            message: errorMessage,
          },
          testConnectionLoading: false,
        });
      }
    );
  };

  handleChange = (key, e) => {
    this.setState({
      [key]: e.target.value,
    });
  };

  renderTestButton = () => {
    const disabled = !this.state.name;

    return (
      <span className="test-connection-button">
        <BtnWithLoading
          className="btn btn-secondary"
          onClick={this.testConnection}
          disabled={disabled}
          loading={this.state.testConnectionLoading}
          label={T.translate(`${PREFIX}.testConnection`)}
          darker={true}
          data-cy={`wrangler-${ConnectionType.BIGQUERY}-test-connection-button`}
        />
      </span>
    );
  };

  renderAddConnectionButton = () => {
    const disabled = !this.state.name || this.state.testConnectionLoading;

    let onClickFn = this.addConnection;

    if (this.props.mode === 'EDIT') {
      onClickFn = this.editConnection;
    }

    return (
      <ModalFooter>
        <button
          className="btn btn-primary"
          onClick={onClickFn}
          disabled={disabled}
          data-cy={`wrangler-${ConnectionType.BIGQUERY}-add-connection-button`}
        >
          {T.translate(`${PREFIX}.Buttons.${this.props.mode}`)}
        </button>

        {this.renderTestButton()}
      </ModalFooter>
    );
  };

  renderContent() {
    if (this.state.loading) {
      return (
        <div className="bigquery-detail text-center">
          <br />
          <LoadingSVG />
        </div>
      );
    }

    return (
      <div className="bigquery-detail">
        <div className="form">
          <div className="form-group row">
            <label className={LABEL_COL_CLASS}>
              {T.translate(`${PREFIX}.name`)}
              <span className="asterisk">*</span>
            </label>
            <div className={INPUT_COL_CLASS}>
              <div className="input-text">
                <input
                  type="text"
                  className="form-control"
                  value={this.state.name}
                  onChange={this.handleChange.bind(this, 'name')}
                  disabled={this.props.mode === 'EDIT'}
                  placeholder={T.translate(`${PREFIX}.Placeholders.name`)}
                  data-cy={`wrangler-${ConnectionType.BIGQUERY}-connection-name`}
                />
              </div>
            </div>
          </div>

          <div className="form-group row">
            <label className={LABEL_COL_CLASS}>
              {T.translate(`${PREFIX}.projectId`)}
            </label>
            <div className={INPUT_COL_CLASS}>
              <div className="input-text">
                <input
                  type="text"
                  className="form-control"
                  value={this.state.projectId}
                  onChange={this.handleChange.bind(this, 'projectId')}
                  placeholder={T.translate(`${PREFIX}.Placeholders.projectId`)}
                  data-cy={`wrangler-${ConnectionType.BIGQUERY}-connection-projectid`}
                />
              </div>
            </div>
          </div>

          <div className="form-group row">
            <label className={LABEL_COL_CLASS}>
              {T.translate(`${PREFIX}.serviceAccountKeyfile`)}
            </label>
            <div className={INPUT_COL_CLASS}>
              <div className="input-text">
                <input
                  type="text"
                  className="form-control"
                  value={this.state.serviceAccountKeyfile}
                  onChange={this.handleChange.bind(
                    this,
                    'serviceAccountKeyfile'
                  )}
                  placeholder={T.translate(
                    `${PREFIX}.Placeholders.serviceAccountKeyfile`
                  )}
                  data-cy={`wrangler-${ConnectionType.BIGQUERY}-connection-serviceaccount-filepath`}
                />
              </div>
            </div>
          </div>

          <div className="form-group row">
            <label className={LABEL_COL_CLASS}>
              {T.translate(`${PREFIX}.bucket`)}
            </label>
            <div className={INPUT_COL_CLASS}>
              <div className="input-text">
                <input
                  type="text"
                  className="form-control"
                  value={this.state.bucket}
                  onChange={this.handleChange.bind(this, 'bucket')}
                  placeholder={T.translate(`${PREFIX}.Placeholders.bucket`)}
                  data-cy={`wrangler-${ConnectionType.BIGQUERY}-connection-temp-bucket`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderMessage() {
    if (!this.state.error && !this.state.connectionResult.message) {
      return null;
    }

    if (this.state.error) {
      return (
        <CardActionFeedback
          type={CARD_ACTION_TYPES.DANGER}
          message={T.translate(`${PREFIX}.ErrorMessages.${this.props.mode}`)}
          extendedMessage={this.state.error}
        />
      );
    }

    const connectionResultType = this.state.connectionResult.type;
    return (
      <CardActionFeedback
        message={T.translate(
          `${ADDCONN_PREFIX}.TestConnectionLabels.${connectionResultType.toLowerCase()}`
        )}
        extendedMessage={
          connectionResultType === CARD_ACTION_TYPES.SUCCESS
            ? null
            : this.state.connectionResult.message
        }
        type={connectionResultType}
      />
    );
  }

  render() {
    return (
      <div>
        <Modal
          isOpen={true}
          toggle={this.props.close}
          size="lg"
          className="bigquery-connection-modal cdap-modal"
          backdrop="static"
          zIndex="1061"
        >
          <ModalHeader toggle={this.props.close}>
            {T.translate(`${PREFIX}.ModalHeader.${this.props.mode}`, {
              connection: this.props.connectionId,
            })}
          </ModalHeader>

          <ModalBody>{this.renderContent()}</ModalBody>

          {this.renderAddConnectionButton()}
          {this.renderMessage()}
        </Modal>
      </div>
    );
  }
}
