/*
 * Copyright © 2019 Cask Data, Inc.
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

import * as React from 'react';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import { WithStyles, StyleRules } from '@material-ui/core/styles/withStyles';
import { KEY_CODE } from 'services/global-constants';
import { IErrorObj } from 'components/shared/ConfigurationGroup/utilities';
import classnames from 'classnames';

export const AbstractRowStyles = (theme): StyleRules => {
  return {
    root: {
      height: '44px',
      display: 'grid',
      gridTemplateColumns: '1fr 40px 40px',
      alignItems: 'end',
      '& > *:first-child': {
        marginRight: '10px',
      },
    },
    disabledRoot: {
      gridTemplateColumns: '1fr',
    },
    errorText: {
      color: theme.palette.red[50],
    },
  };
};

export interface IAbstractRowProps<S extends typeof AbstractRowStyles> extends WithStyles<S> {
  // any is needed here because we cannot override types in TS.
  value: string | any;
  id: string;
  index: number;
  autofocus: boolean;
  disabled: boolean;
  addRowDisabled?: boolean;
  onChange: (id: string, value: string) => void;
  addRow: () => void;
  removeRow: () => void;
  changeFocus: (index: number) => void;
  forwardedRef: () => void;
  errors: IErrorObj[];
  dataCy?: string;
  dataTestId?: string;
  deleteDisabled?: boolean;
}

export default class AbstractRow<
  P extends IAbstractRowProps<typeof AbstractRowStyles>,
  State
> extends React.PureComponent<P, State> {
  public onChange = (value) => {
    this.props.onChange(this.props.id, value);
  };

  public handleKeyPress = (e) => {
    if (e.nativeEvent.keyCode !== KEY_CODE.Enter) {
      return;
    }

    this.props.addRow();
  };

  public handleKeyDown = (e) => {
    switch (e.nativeEvent.keyCode) {
      case KEY_CODE.Up:
        e.preventDefault();
        this.props.changeFocus(this.props.index - 1);
        return;
      case KEY_CODE.Down:
        this.props.changeFocus(this.props.index + 1);
        return;
    }
  };

  public renderInput = () => {
    return null;
  };

  public render() {
    const { errors, value, dataCy, index } = this.props;
    let errorMsg: string | null = null;
    if (errors && value) {
      const errorObj = errors.find((error: IErrorObj) => error.element === value);
      if (errorObj) {
        errorMsg = errorObj.msg;
      }
    }

    return (
      <React.Fragment>
        <div
          className={classnames(this.props.classes.root, {
            [this.props.classes.disabledRoot]: this.props.disabled,
          })}
          data-cy={`${index}`}
          data-testid={`${index}`}
        >
          {this.renderInput()}

          {!this.props.disabled && (
            <React.Fragment>
              <IconButton
                disabled={this.props.addRowDisabled}
                onClick={this.props.addRow}
                data-cy="add-row"
                data-testid="add-row"
              >
                <AddIcon fontSize="small" />
              </IconButton>
              {!this.props.deleteDisabled && (
                <IconButton
                  color="secondary"
                  onClick={this.props.removeRow}
                  data-cy="remove-row"
                  data-testid="remove-row"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              )}
            </React.Fragment>
          )}
        </div>
        {errorMsg && (
          <div
            className={this.props.classes.errorText}
            data-cy={`error-text-${index}`}
            data-testid={`error-text-${index}`}
          >
            {errorMsg}
          </div>
        )}
      </React.Fragment>
    );
  }
}
