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
import T from 'i18n-react';
import DataPrepStore from 'components/DataPrep/store';
import DataPrepActions from 'components/DataPrep/store/DataPrepActions';
import MouseTrap from 'mousetrap';
import { Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import IconSVG from 'components/shared/IconSVG';
import { setPopoverOffset } from 'components/DataPrep/helper';

require('./FilterDirective.scss');

const PREFIX = 'features.DataPrep.Directives.Filter';

const DIRECTIVES_MAP = {
  KEEP: {
    EMPTY: 'filter-rows-on condition-false',
    TEXTEXACTLY: 'filter-rows-on regex-not-match',
    TEXTCONTAINS: 'filter-rows-on regex-not-match',
    TEXTSTARTSWITH: 'filter-rows-on condition-false',
    TEXTENDSWITH: 'filter-rows-on condition-false',
    TEXTREGEX: 'filter-rows-on regex-not-match',
    CUSTOMCONDITION: 'filter-rows-on condition-false',
  },
  REMOVE: {
    EMPTY: 'filter-rows-on condition-true',
    TEXTEXACTLY: 'filter-rows-on regex-match',
    TEXTCONTAINS: 'filter-rows-on regex-match',
    TEXTSTARTSWITH: 'filter-rows-on condition-true',
    TEXTENDSWITH: 'filter-rows-on condition-true',
    TEXTREGEX: 'filter-rows-on regex-match',
    CUSTOMCONDITION: 'filter-rows-on condition-true',
  },
};

export default class FilterDirective extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedCondition: 'EMPTY',
      textFilter: '',
      rowFilter: 'KEEP',
      customFilter: '',
      ignoreCase: false,
      customConditionTooltip: false,
    };

    this.handleConditionSelect = this.handleConditionSelect.bind(this);
    this.handleTextFilterChange = this.handleTextFilterChange.bind(this);
    this.applyDirective = this.applyDirective.bind(this);
    this.preventPropagation = this.preventPropagation.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleCustomFilterChange = this.handleCustomFilterChange.bind(this);
    this.toggleIgnoreCase = this.toggleIgnoreCase.bind(this);

    this.conditionsOptions = [
      'EMPTY',
      'TEXTEXACTLY',
      'TEXTCONTAINS',
      'TEXTSTARTSWITH',
      'TEXTENDSWITH',
      'TEXTREGEX',
    ];
  }

  componentDidMount() {
    this.calculateOffset = setPopoverOffset.bind(this, document.getElementById('filter-directive'));
  }

  componentDidUpdate() {
    if (this.props.isOpen) {
      if (this.calculateOffset) {
        this.calculateOffset();
      }
      // This is not in componentDidMount as Mousetrap can bind to 'enter' only once.
      // So the last .bind will get the callback always when all the directives are rendered in ColumnActionDropdown
      // So we bind to enter key only when the directive is opened.
      MouseTrap.bind('enter', this.applyDirective);
    }
    if (
      this.state.selectedCondition.substr(0, 4) === 'TEXT' &&
      this.state.textFilter.length === 0 &&
      this.textFilterRef
    ) {
      this.textFilterRef.focus();
    } else if (
      this.state.selectedCondition.substr(0, 6) === 'CUSTOM' &&
      this.state.customFilter.length === 0 &&
      this.customFilterRef
    ) {
      this.customFilterRef.focus();
    }
  }

  componentWillUnmount() {
    // We can safely unbind here as we just need to unbind the last bind
    // The ugh.. part is we don't know what was last bound but we can unbind multiple
    // times and it shouldn't affect anything.
    MouseTrap.unbind('enter');
  }

  preventPropagation(e) {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    e.preventDefault();
  }

  handleConditionSelect(e) {
    this.setState({ selectedCondition: e.target.value });
  }

  handleTextFilterChange(e) {
    this.setState({ textFilter: e.target.value });
  }

  handleCustomFilterChange(e) {
    this.setState({ customFilter: e.target.value });
  }

  toggleIgnoreCase() {
    this.setState({ ignoreCase: !this.state.ignoreCase });
  }

  handleKeyPress(e) {
    if (e.nativeEvent.keyCode !== 13 || this.state.textFilter.length === 0) {
      return;
    }

    this.applyDirective();
  }

  handleRowFilter(type) {
    this.setState({ rowFilter: type });
  }

  applyDirective() {
    if (
      this.state.selectedCondition.substr(0, 4) === 'TEXT' &&
      this.state.textFilter.length === 0
    ) {
      return;
    }
    let directive;
    let column = this.props.column;
    let textValue = this.state.textFilter;

    let condition = DIRECTIVES_MAP[this.state.rowFilter][this.state.selectedCondition];

    let configuration;

    switch (this.state.selectedCondition) {
      case 'EMPTY':
        directive = `${condition} ${column}===null || ${column} =~ "^\\W*$"`;
        break;
      case 'TEXTCONTAINS':
        if (this.state.ignoreCase) {
          textValue = `(?i)${textValue}`;
        }
        directive = `${condition} ${column} .*${textValue}.*`;
        break;
      case 'TEXTSTARTSWITH':
        configuration = `"${textValue}"`;
        if (this.state.ignoreCase) {
          column = `${column}.toLowerCase()`;
          configuration = `"${textValue}".toLowerCase()`;
        }
        directive = `${condition} ${column} =^ ${configuration}`;
        break;
      case 'TEXTENDSWITH':
        configuration = `"${textValue}"`;
        if (this.state.ignoreCase) {
          column = `${column}.toLowerCase()`;
          configuration = `"${textValue}".toLowerCase()`;
        }
        directive = `${condition} ${column} =$ ${configuration}`;
        break;
      case 'TEXTEXACTLY':
        if (this.state.ignoreCase) {
          textValue = `(?i)${textValue}`;
        }
        directive = `${condition} ${column} ^${textValue}$`;
        break;
      case 'TEXTREGEX':
        directive = `${condition} ${column} ${textValue}`;
        break;
      case 'CUSTOMCONDITION':
        directive = `${condition} ${column} ${this.state.customFilter}`;
        break;
    }

    this.execute([directive]);
  }

  execute(addDirective) {
    execute(addDirective).subscribe(
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

  toggleCustomTooltip() {
    this.setState({
      customConditionTooltip: !this.state.customConditionTooltip,
    });
  }

  renderCustomFilter() {
    if (this.state.selectedCondition.substr(0, 6) !== 'CUSTOM') {
      return null;
    }

    return (
      <div>
        <div className="custom-condition-container">
          <strong>{this.props.column}</strong>
          <div id="customConditionTooltip">
            <IconSVG name="icon-info-circle" onClick={this.toggleCustomTooltip.bind(this)} />
          </div>
          <Popover
            placement="right"
            className="filter-popover-element"
            isOpen={this.state.customConditionTooltip}
            target="customConditionTooltip"
            toggle={this.toggleCustomTooltip.bind(this)}
          >
            <PopoverHeader className="popover-title">
              {T.translate(`${PREFIX}.customconditiontooltiptitle`)}
            </PopoverHeader>
            <PopoverBody className="popover-content">
              <span>{T.translate(`${PREFIX}.customconditiontooltip`)}</span>
              <a
                href="http://commons.apache.org/proper/commons-jexl/"
                target="_blank"
                rel="noopener noreferrer"
              >
                {T.translate(`${PREFIX}.customconditiontooltiplink`)}
              </a>
            </PopoverBody>
          </Popover>
        </div>

        <textarea
          className="form-control"
          value={this.state.customFilter}
          onChange={this.handleCustomFilterChange}
          ref={(ref) => (this.customFilterRef = ref)}
          placeholder={T.translate(`${PREFIX}.Placeholders.CUSTOMCONDITION`)}
        />
      </div>
    );
  }

  renderTextFilter() {
    if (this.state.selectedCondition.substr(0, 4) !== 'TEXT') {
      return null;
    }

    let ignoreCase;
    if (this.state.selectedCondition !== 'TEXTREGEX') {
      ignoreCase = (
        <div>
          <span className="cursor-pointer" onClick={this.toggleIgnoreCase}>
            <span
              className={classnames('fa', {
                'fa-square-o': !this.state.ignoreCase,
                'fa-check-square': this.state.ignoreCase,
              })}
            />
            <span>{T.translate(`${PREFIX}.ignoreCase`)}</span>
          </span>
        </div>
      );
    }

    return (
      <div>
        <br />
        <div>
          <input
            type="text"
            className="form-control mousetrap"
            value={this.state.textFilter}
            onChange={this.handleTextFilterChange}
            placeholder={T.translate(`${PREFIX}.Placeholders.${this.state.selectedCondition}`)}
            ref={(ref) => (this.textFilterRef = ref)}
            onKeyPress={this.handleKeyPress}
          />
        </div>
        {ignoreCase}
      </div>
    );
  }

  renderCondition() {
    let filterConditions = this.conditionsOptions.map((filter) => {
      return {
        filter: filter,
        displayText: T.translate(`${PREFIX}.Conditions.${filter}`),
      };
    });

    return (
      <div>
        <div className="row-filter-container">
          <span
            className={classnames('cursor-pointer row-filter', {
              active: this.state.rowFilter === 'KEEP',
            })}
            onClick={this.handleRowFilter.bind(this, 'KEEP')}
          >
            {T.translate(`${PREFIX}.KEEP`)}
          </span>
          <span> | </span>
          <span
            className={classnames('cursor-pointer row-filter', {
              active: this.state.rowFilter === 'REMOVE',
            })}
            onClick={this.handleRowFilter.bind(this, 'REMOVE')}
          >
            {T.translate(`${PREFIX}.REMOVE`)}
          </span>
        </div>

        <div className="filter-condition">
          <div className="condition-select">
            <span>{T.translate(`${PREFIX}.if`)}</span>
            <div>
              <select
                className="form-control mousetrap"
                value={this.state.selectedCondition}
                onChange={this.handleConditionSelect}
              >
                {filterConditions.map((condition) => {
                  return (
                    <option value={condition.filter} key={condition.filter}>
                      {condition.displayText}
                    </option>
                  );
                })}
                <option disabled="disabled" role="separator">
                  &#x2500;&#x2500;&#x2500;&#x2500;
                </option>
                <option value="CUSTOMCONDITION">
                  {T.translate(`${PREFIX}.Conditions.CUSTOMCONDITION`)}
                </option>
              </select>
            </div>
          </div>

          {this.renderTextFilter()}
          {this.renderCustomFilter()}
        </div>
      </div>
    );
  }

  renderDetail() {
    if (!this.props.isOpen) {
      MouseTrap.unbind('enter');
      return null;
    }

    let disabled =
      this.state.selectedCondition.substr(0, 4) === 'TEXT' && this.state.textFilter.length === 0;

    return (
      <div className="filter-detail second-level-popover" onClick={this.preventPropagation}>
        {this.renderCondition()}

        <hr />

        <div className="action-buttons">
          <button
            className="btn btn-primary float-left"
            onClick={this.applyDirective}
            disabled={disabled}
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
        id="filter-directive"
        className={classnames('filter-directive clearfix action-item', {
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

FilterDirective.propTypes = {
  column: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  onComplete: PropTypes.func,
  isOpen: PropTypes.bool,
  close: PropTypes.func,
};
