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

import React, { Component } from 'react';
import DataPrepStore from 'components/DataPrep/store';
import DataPrepActions from 'components/DataPrep/store/DataPrepActions';
import Alert from 'components/shared/Alert';

export default class DataPrepErrorAlert extends Component {
  constructor(props) {
    super(props);

    let state = DataPrepStore.getState().error;

    this.state = {
      showError: state.showError,
      workspaceError: state.workspaceError,
    };

    this.dismissError = this.dismissError.bind(this);
  }

  componentWillMount() {
    this.sub = DataPrepStore.subscribe(() => {
      let state = DataPrepStore.getState().error;

      this.setState({
        showError: state.showError,
        workspaceError: state.workspaceError,
      });
    });
  }

  componentWillUnmount() {
    if (this.sub) {
      this.sub();
    }
  }

  dismissError() {
    DataPrepStore.dispatch({
      type: DataPrepActions.dismissError,
    });
  }

  getErrorMessage() {
    if (this.state.showError) {
      return this.state.showError;
    } else if (this.state.workspaceError) {
      return this.state.workspaceError.message;
    }
  }

  render() {
    const errorMessage = this.getErrorMessage();

    if (!errorMessage) {
      return null;
    }

    return (
      <Alert showAlert={true} type="error" message={errorMessage} onClose={this.dismissError} />
    );
  }
}
