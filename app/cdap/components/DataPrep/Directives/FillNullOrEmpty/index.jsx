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
import classnames from 'classnames';
import { execute } from 'components/DataPrep/store/DataPrepActionCreator';
import DataPrepStore from 'components/DataPrep/store';
import DataPrepActions from 'components/DataPrep/store/DataPrepActions';
import { setPopoverOffset } from 'components/DataPrep/helper';
import T from 'i18n-react';

const PREFIX = 'features.DataPrep.Directives.FillNullOrEmpty';

export default class FillNullOrEmptyDirective extends Component {
  constructor(props) {
    super(props);

    this.state = {
      input: '',
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.applyDirective = this.applyDirective.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  componentDidMount() {
    this.calculateOffset = setPopoverOffset.bind(
      this,
      document.getElementById('fill-null-or-empty-directive')
    );
  }

  componentDidUpdate() {
    if (this.props.isOpen && this.state.input.length === 0) {
      this.inputBox.focus();
    }
    if (this.props.isOpen && this.calculateOffset) {
      this.calculateOffset();
    }
  }

  preventPropagation(e) {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    e.preventDefault();
  }

  handleInputChange(e) {
    this.setState({ input: e.target.value });
  }

  handleKeyPress(e) {
    if (e.nativeEvent.keyCode !== 13 || this.state.input.length === 0) {
      return;
    }

    this.applyDirective();
  }

  applyDirective() {
    if (this.state.input.length === 0) {
      return;
    }
    let column = this.props.column;
    let value = this.state.input;

    let directive = `fill-null-or-empty :${column} '${value}'`;

    execute([directive]).subscribe(
      () => {
        this.props.close();
        this.props.onComplete();
      },
      (err) => {
        console.log('error', err);

        DataPrepStore.dispatch({
          type: DataPrepActions.setError,
          payload: {
            message: err.message || err.response.message,
          },
        });
      }
    );
  }

  renderDetail() {
    if (!this.props.isOpen) {
      return null;
    }

    return (
      <div className="second-level-popover" onClick={this.preventPropagation}>
        <h5>{T.translate(`${PREFIX}.title`)}</h5>

        <div className="input">
          <input
            type="text"
            className="form-control"
            value={this.state.input}
            onChange={this.handleInputChange}
            onKeyPress={this.handleKeyPress}
            placeholder="Enter value to set"
            ref={(ref) => (this.inputBox = ref)}
          />
        </div>

        <hr />

        <div className="action-buttons">
          <button
            className="btn btn-primary float-left"
            onClick={this.applyDirective}
            disabled={this.state.input.length === 0}
          >
            {T.translate('features.DataPrep.Directives.apply')}
          </button>

          <button className="btn btn-link float-right" onClick={this.props.close}>
            {T.translate('features.DataPrep.Directives.cancel')}
          </button>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div
        id="fill-null-or-empty-directive"
        className={classnames('clearfix action-item', {
          active: this.props.isOpen,
        })}
      >
        <span>{T.translate(`${PREFIX}.title`)}</span>

        <span className="float-right">
          <span className="fa fa-caret-right" />
        </span>

        {this.renderDetail()}
      </div>
    );
  }
}

FillNullOrEmptyDirective.propTypes = {
  column: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  onComplete: PropTypes.func,
  isOpen: PropTypes.bool,
  close: PropTypes.func,
};
