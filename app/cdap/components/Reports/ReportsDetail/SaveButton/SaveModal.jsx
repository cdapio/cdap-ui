/*
 * Copyright © 2018 Cask Data, Inc.
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
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { MyReportsApi } from 'api/reports';
import ReportsStore, {
  ReportsActions,
} from 'components/Reports/store/ReportsStore';
import T from 'i18n-react';

const PREFIX = 'features.Reports.ReportsDetail';

export default class SaveModal extends Component {
  static propTypes = {
    toggle: PropTypes.func,
    name: PropTypes.string,
    reportId: PropTypes.string,
  };

  state = {
    name: this.props.name,
    error: null,
  };

  onTextChange = (e) => {
    this.setState({
      name: e.target.value,
    });
  };

  save = () => {
    const params = {
      reportId: this.props.reportId,
    };

    const detailParams = {
      'report-id': this.props.reportId,
    };

    const body = {
      name: this.state.name,
    };

    MyReportsApi.saveReport(params, body).subscribe(
      () => {
        MyReportsApi.getReport(detailParams).subscribe((res) => {
          ReportsStore.dispatch({
            type: ReportsActions.setInfoStatus,
            payload: {
              info: {
                ...res,
                expiry: null,
              },
            },
          });
        });

        this.props.toggle();
      },
      (err) => {
        console.log('Error', err);

        this.setState({
          error: err.response,
        });
      }
    );
  };

  renderError() {
    if (!this.state.error) {
      return null;
    }

    return (
      <div className="error-container text-danger">{this.state.error}</div>
    );
  }

  render() {
    return (
      <Modal
        isOpen={true}
        toggle={this.props.toggle}
        size="md"
        backdrop="static"
        zIndex="1061"
        className="report-save-button-modal cdap-modal"
      >
        <ModalHeader>
          <span>{T.translate(`${PREFIX}.saveReport`)}</span>

          <div
            className="close-section float-right"
            onClick={this.props.toggle}
          >
            <span className="fa fa-times" />
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="field-row">
            <label className="control-label">
              {T.translate('features.Reports.reportName')}
            </label>

            <input
              type="text"
              className="form-control"
              value={this.state.name}
              onChange={this.onTextChange}
            />
          </div>
        </ModalBody>

        <ModalFooter>
          <button
            className="btn btn-primary"
            onClick={this.save}
            disabled={this.state.name.length === 0}
          >
            {T.translate(`${PREFIX}.save`)}
          </button>

          {this.renderError()}
        </ModalFooter>
      </Modal>
    );
  }
}
