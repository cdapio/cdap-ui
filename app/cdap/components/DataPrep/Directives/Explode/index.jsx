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
const PREFIX = 'features.DataPrep.Directives.Explode';
import T from 'i18n-react';
import UsingDelimiterModal from 'components/DataPrep/Directives/ExtractFields/UsingDelimiterModal';
import DataPrepStore from 'components/DataPrep/store';
import { execute } from 'components/DataPrep/store/DataPrepActionCreator';
import DataPrepActions from 'components/DataPrep/store/DataPrepActions';
import { setPopoverOffset } from 'components/DataPrep/helper';

require('./Explode.scss');
export default class Explode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeModal: null,
    };
    this.explodeUsingFilters = this.explodeUsingFilters.bind(this);
    this.preventPropagation = this.preventPropagation.bind(this);
    this.explodeByFlattening = this.explodeByFlattening.bind(this);
    this.explodeRecordByFlattening = this.explodeRecordByFlattening.bind(this);
    this.handleUsingFilters = this.handleUsingFilters.bind(this);
  }
  componentDidMount() {
    this.calculateOffset = setPopoverOffset.bind(
      this,
      document.getElementById('explode-fields-directive')
    );
  }

  componentDidUpdate() {
    if (this.props.isOpen && this.calculateOffset) {
      this.calculateOffset();
    }
  }

  execute(addDirective) {
    execute(addDirective).subscribe(
      () => {
        this.props.onComplete();
        this.setState({ activeModal: null });
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

  handleUsingFilters(delimiter) {
    const directive = `split-to-rows :${this.props.column} ${delimiter}`;
    this.execute([directive]);
  }

  explodeUsingFilters() {
    this.setState({
      activeModal: (
        <UsingDelimiterModal
          isOpen={true}
          onClose={() => this.setState({ activeModal: null })}
          onApply={this.handleUsingFilters}
        />
      ),
    });
  }

  explodeByFlattening() {
    let column = `:${this.props.column.toString()}`;
    if (Array.isArray(this.props.column) && this.props.column.length > 1) {
      column = this.props.column.map(c => `:${c}`).join(',');
    }
    const directive = `flatten ${column}`;
    this.execute([directive]);
  }

  explodeRecordByFlattening() {
    let column = `:${this.props.column.toString()}`;
    if (Array.isArray(this.props.column) && this.props.column.length > 1) {
      column = this.props.column.map(c => `:${c}`).join(',');
    }
    const directive = `flatten-record ${column}`;
    this.execute([directive]);
  }

  renderModal() {
    return this.state.activeModal;
  }

  preventPropagation(e) {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    e.preventDefault();
  }

  renderDetail() {
    if (!this.props.isOpen) {
      return null;
    }
    let disableFilterSubmenu = DataPrepStore.getState().dataprep.selectedHeaders.length > 1;
    return (
      <div className="explode-fields second-level-popover" onClick={this.preventPropagation}>
        <div
          className={classnames('explode-field-options', {
            disabled: disableFilterSubmenu,
          })}
        >
          <div onClick={this.explodeUsingFilters} className="option">
            {T.translate(`${PREFIX}.filtersSubmenuTitle`)}
          </div>
        </div>
        <div className="explode-field-options">
          <div onClick={this.explodeByFlattening} className="option">
            {T.translate(`${PREFIX}.flatteningSubmenuTitle`)}
          </div>
        </div>
        <div className="explode-field-options">
          <div onClick={this.explodeRecordByFlattening} className="option">
            {T.translate(`${PREFIX}.recordFlatteningSubmenuTitle`)}
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div
        id="explode-fields-directive"
        className={classnames('clearfix action-item', {
          active: this.props.isOpen,
        })}
      >
        <span className="option">{T.translate(`${PREFIX}.title`)}</span>

        <span className="float-right">
          <span className="fa fa-caret-right" />
        </span>

        {this.renderDetail()}
        {this.renderModal()}
      </div>
    );
  }
}

Explode.propTypes = {
  isOpen: PropTypes.bool,
  column: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  onComplete: PropTypes.func,
};
