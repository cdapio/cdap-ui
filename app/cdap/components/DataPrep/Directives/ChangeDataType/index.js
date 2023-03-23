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
import debounce from 'lodash/debounce';
import ee from 'event-emitter';
import T from 'i18n-react';
import { preventPropagation } from 'services/helpers';
import { UncontrolledTooltip } from 'components/UncontrolledComponents';
import If from 'components/shared/If';
import { DecimalOptions } from 'components/DataPrep/Directives/ChangeDataType/DecimalOptions';

const PREFIX = 'features.DataPrep.Directives.ChangeDataType';

require('./ChangeDataType.scss');

const DATATYPE_OPTIONS = [
  'string',
  'boolean',
  'decimal',
  'integer',
  'long',
  'short',
  'float',
  'double',
  'bytes',
];

const DATATYPES_WITH_SUBMENU = {
  decimal: DecimalOptions,
}

const DISABLED_TYPE = ['localdate', 'localtime', 'zoneddatetime'];

export default class ChangeDataTypeDirective extends Component {
  constructor(props) {
    super(props);

    this.columnType = DataPrepStore.getState().dataprep.typesCheck[this.props.column];
    this.columnType = this.columnType === 'bigdecimal' ? 'decimal' : this.columnType;

    this.state = {
      showSubmenu: false,
      selectedChangeDataType: null,
      isDisabled: DISABLED_TYPE.indexOf(this.columnType) !== -1,
    };

    window.addEventListener('resize', this.offsetCalcDebounce);

    this.eventEmitter = ee(ee);
  }

  static getDerivedStateFromProps(props, state) {
    if (!props.isOpen) {
      return { ...state, showSubmenu: false };
    }
  }

  componentDidUpdate() {
    if (this.props.isOpen && this.calculateOffset && !this.state.isDisabled) {
      this.calculateOffset();
    }
  }

  componentDidMount() {
    this.calculateOffset = setPopoverOffset.bind(
      this,
      document.getElementById('change-data-type-directive')
    );
    this.offsetCalcDebounce = debounce(this.calculateOffset, 1000);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.offsetCalcDebounce);
  }

  applyDirective(option, extraArgs='') {
    let directive = `set-type :${this.props.column} ${option} ${extraArgs}`;
    execute([directive]).subscribe(
      () => {
        this.eventEmitter.emit('DATAPREP_DATA_TYPE_CHANGED', this.props.column);
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

  openSubmenu(option) {
    this.setState({ showSubmenu: DATATYPES_WITH_SUBMENU[option] });
  }

  closeSubmenu(event) {
    event.stopPropagation();
    this.setState({ showSubmenu: false });
  }

  handleOptionSelect(option) {
    if (DATATYPES_WITH_SUBMENU[option]) {
      return this.openSubmenu(option);
    }
    return this.applyDirective(option);
  }

  renderSubmenu() {
    const SubmenuComponent = this.state.showSubmenu;
    if (!SubmenuComponent) { return null; }

    return (<SubmenuComponent
      onApply={this.applyDirective.bind(this)}
      onCancel={this.closeSubmenu.bind(this)}
    />);
  }

  renderDetail() {
    if (!this.props.isOpen || this.props.isDisabled || this.state.isDisabled) {
      return null;
    }
    return (
      <div className="change-data-type-options second-level-popover" onClick={preventPropagation}>
        {this.props.options.map((option, i) => {
          return (
            <div
              className='option clearfix'
              key={i}
              onClick={this.handleOptionSelect.bind(this, option)}
            >
              <span>{T.translate(`${PREFIX}.Options.${option}`)}</span>
              { !!DATATYPES_WITH_SUBMENU[option] &&
                <>
                  <span className="float-right">
                    <span className="fa fa-caret-right" />
                  </span>
                  {this.renderSubmenu()}
                </>
              }
            </div>
          );
        })}
      </div>
    );
  }

  render() {
    const id = 'change-data-type-directive';
    return (
      <div>
        <div
          id={id}
          className={classnames('change-data-type-directive clearfix action-item', {
            active: this.props.isOpen && !this.state.isDisabled,
            disabled: this.state.isDisabled,
          })}
        >
          <span>{T.translate(`${PREFIX}.title`)}</span>

          <span className="float-right">
            <span className="fa fa-caret-right" />
          </span>

          {this.renderDetail()}
        </div>

        <If condition={this.state.isDisabled}>
          <UncontrolledTooltip target={id} delay={{ show: 250, hide: 0 }}>
            {T.translate(`${PREFIX}.disabledTooltip`)}
          </UncontrolledTooltip>
        </If>
      </div>
    );
  }
}

ChangeDataTypeDirective.defaultProps = {
  options: DATATYPE_OPTIONS,
};

ChangeDataTypeDirective.propTypes = {
  column: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  options: PropTypes.arrayOf(PropTypes.string),
  onComplete: PropTypes.func,
  isOpen: PropTypes.bool,
  isDisabled: PropTypes.bool,
  close: PropTypes.func,
};
