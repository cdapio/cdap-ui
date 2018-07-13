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
import classnames from 'classnames';
import T from 'i18n-react';

const PREFIX = 'features.FieldLevelLineage.OperationsModal.Table';

export default class OperationsTable extends Component {
  static propTypes = {
    operations: PropTypes.array
  };

  state = {
    activeId: null
  };

  componentWillReceiveProps() {
    this.setState({
      activeId: null
    });
  }

  handleInputClick(id) {
    this.setState({
      activeId: id
    });
  }

  joinEndpoints(endpoints) {
    if (!endpoints || !endpoints.endPoint) { return null; }

    return endpoints.endPoint.name;
  }

  renderInput(operation) {
    return this.joinEndpoints(operation.inputs);
  }

  renderOutput(operation) {
    return this.joinEndpoints(operation.outputs);
  }

  renderInputFields(operation) {
    const fields = operation.inputs.fields;
    if (!fields) { return '--'; }

    return fields.map((field, i) => {
      return (
        <span>
          <span
            className={classnames('input-field', { 'selected': this.state.activeId === field.origin })}
            onClick={this.handleInputClick.bind(this, field.origin)}
          >
            {field.name}
          </span>
          { i !== fields.length - 1 ? ', ' : null }
        </span>
      );
    });
  }

  renderOutputFields(operation) {
    if (!operation.outputs.fields) { return '--'; }

    return operation.outputs.fields
      .join(', ');
  }

  renderHeader() {
    const headers = [
      'input',
      'inputFields',
      'operation',
      'description',
      'outputFields',
      'output'
    ];

    return (
      <div className="grid-header">
        <div className="grid-row">
          <div></div>
          {
            headers.map((head) => {
              return (
                <div key={head}>
                  {T.translate(`${PREFIX}.${head}`)}
                </div>
              );
            })
          }
        </div>
      </div>
    );
  }

  renderBody() {
    return (
      <div className="grid-body">
        {
          this.props.operations.map((operation, i) => {
            return (
              <div
                key={operation.id}
                className={classnames('grid-row', {'active': operation.name === this.state.activeId})}
              >
                <div>{ i + 1 }</div>
                <div>{ this.renderInput(operation) }</div>
                <div>{ this.renderInputFields(operation) }</div>
                <div title={operation.name}>{ operation.name }</div>
                <div title={operation.description}>{ operation.description }</div>
                <div>{ this.renderOutputFields(operation) }</div>
                <div>{ this.renderOutput(operation) }</div>
              </div>
            );
          })
        }
      </div>
    );
  }

  render() {
    return (
      <div className="operations-table-container">
        <div className="grid-wrapper">
          <div className="grid grid-container">
            {this.renderHeader()}
            {this.renderBody()}
          </div>
        </div>
      </div>
    );
  }
}
