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
import ColumnTextSelection from 'components/DataPrep/ColumnTextSelection';
import { Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import T from 'i18n-react';
import TextboxOnValium from 'components/TextboxOnValium';
import classnames from 'classnames';
import isNil from 'lodash/isNil';
import { execute } from 'components/DataPrep/store/DataPrepActionCreator';
import DataPrepActions from 'components/DataPrep/store/DataPrepActions';
import DataPrepStore from 'components/DataPrep/store';

require('./CutDirective.scss');

const CELLHIGHLIGHTCLASSNAME = 'cl-highlight';
const POPOVERTHETHERCLASSNAME = 'highlight-popover';
const PREFIX = `features.DataPrep.Directives.CutDirective`;

export default class CutDirective extends Component {
  constructor(props) {
    super(props);
    this.state = {
      textSelectionRange: { start: null, end: null, index: null },
      showPopover: false,
    };
    this.newColName = '';
    this.onTextSelection = this.onTextSelection.bind(this);
    this.renderPopover = this.renderPopover.bind(this);
    this.togglePopover = this.togglePopover.bind(this);
    this.applyDirective = this.applyDirective.bind(this);
    this.handleColNameChange = this.handleColNameChange.bind(this);
  }

  handleColNameChange(value, isChanged, keyCode) {
    this.newColName = value;
    if (keyCode === 13) {
      this.applyDirective();
    }
  }

  applyDirective() {
    if (!this.newColName || this.newColName.length === 0) {
      return;
    }
    let { start, end } = this.state.textSelectionRange;
    if (!isNil(start) && !isNil(end)) {
      let directive = `cut-character :${this.props.columns[0]} :${this.newColName} ${start +
        1}-${end}`;
      execute([directive]).subscribe(
        () => {
          this.props.onClose();
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
  }

  onTextSelection({ textSelectionRange }) {
    this.setState({
      textSelectionRange,
    });
  }
  togglePopover(showPopover) {
    this.setState({
      showPopover,
    });
  }
  renderPopover() {
    if (!this.state.showPopover) {
      return null;
    }
    let { start, end } = this.state.textSelectionRange;
    let tableContainer = document.getElementById('dataprep-table-id');
    let targetId = `highlight-cell-${this.state.textSelectionRange.index}`;
    /*
      FIXME: Follow up on this issue: https://github.com/FezVrasta/popper.js/issues/276
    */
    return (
      <Popover
        placement="bottom-start"
        className="highlight-popover"
        innerClassName="cut-directive-popover"
        isOpen={this.state.showPopover}
        target={targetId}
        container={tableContainer}
        modifiers={{
          shift: {
            order: 800,
            enabled: true,
          },
        }}
        hideArrow
      >
        <PopoverHeader className={`${CELLHIGHLIGHTCLASSNAME} popover-title`}>
          {T.translate(`${PREFIX}.popoverTitle`)}
        </PopoverHeader>
        <PopoverBody
          className={`${CELLHIGHLIGHTCLASSNAME} popover-content`}
          onClick={this.preventPropagation}
        >
          <span className={CELLHIGHLIGHTCLASSNAME}>
            {T.translate(`${PREFIX}.extractDescription`, { range: `${start + 1}-${end}` })}
          </span>
          <div className={classnames('col-input-container', CELLHIGHLIGHTCLASSNAME)}>
            <strong className={CELLHIGHLIGHTCLASSNAME}>
              {T.translate(`${PREFIX}.inputLabel`)}
            </strong>
            <TextboxOnValium
              className={classnames('form-control mousetrap', CELLHIGHLIGHTCLASSNAME)}
              onChange={this.handleColNameChange}
              value={this.newColName}
              validCharacterRegex={/^\w+$/}
            />
          </div>
          <div
            className={`btn btn-primary ${CELLHIGHLIGHTCLASSNAME}`}
            onClick={this.applyDirective}
          >
            {T.translate('features.DataPrep.Directives.apply')}
          </div>
          <div className={`btn ${CELLHIGHLIGHTCLASSNAME}`} onClick={this.props.onClose}>
            {T.translate(`${PREFIX}.cancelBtnLabel`)}
          </div>
        </PopoverBody>
      </Popover>
    );
  }

  render() {
    return (
      <ColumnTextSelection
        className="cut-directive"
        renderPopover={this.renderPopover}
        onApply={this.applyDirective}
        onClose={this.props.onClose}
        columns={this.props.columns}
        classNamesToExclude={[POPOVERTHETHERCLASSNAME]}
        onSelect={this.onTextSelection}
        togglePopover={this.togglePopover}
      />
    );
  }
}

CutDirective.propTypes = {
  onClose: PropTypes.func,
  columns: PropTypes.arrayOf(PropTypes.string),
};
