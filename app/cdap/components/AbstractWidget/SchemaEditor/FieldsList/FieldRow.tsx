/*
 * Copyright © 2020 Cask Data, Inc.
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
import {
  IFlattenRowType,
  IRowOnChangeHandler,
} from 'components/AbstractWidget/SchemaEditor/EditorTypes';
import {
  InternalTypesEnum,
  OperationTypesEnum,
} from 'components/AbstractWidget/SchemaEditor/SchemaConstants';
import { FieldType } from 'components/AbstractWidget/SchemaEditor/FieldType';
import { UnionType } from 'components/AbstractWidget/SchemaEditor/UnionType';
import { MapType } from 'components/AbstractWidget/SchemaEditor/MapType';
import { EnumType } from 'components/AbstractWidget/SchemaEditor/EnumType';
import { ArrayType } from 'components/AbstractWidget/SchemaEditor/ArrayType';
import { FieldWrapper } from 'components/AbstractWidget/SchemaEditor/FieldWrapper';
import { SchemaValidatorConsumer } from 'components/AbstractWidget/SchemaEditor/SchemaValidator';
import If from 'components/shared/If';
import ErrorIcon from '@material-ui/icons/ErrorOutline';
import classnames from 'classnames';
import withStyles, {
  WithStyles,
  StyleRules,
} from '@material-ui/core/styles/withStyles';
import Tooltip from '@material-ui/core/Tooltip';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';

const styles = (theme): StyleRules => {
  return {
    errorIcon: {
      position: 'absolute',
      right: '5px',
      color: theme.palette.red[200],
      '& *': {
        color: `${theme.palette.red[200]} !important`,
      },
    },
    erroredRow: {
      outline: `2px solid ${theme.palette.red[200]}`,
    },
    tooltip: {
      backgroundColor: theme.palette.red[200],
      color: 'white',
      fontSize: '12px',
      wordBreak: 'break-word',
    },
  };
};

interface IFieldRowState {
  collapsed: boolean;
}

interface IFieldRowProps extends WithStyles<typeof styles> {
  field: IFlattenRowType;
  onChange: IRowOnChangeHandler;
  autoFocus?: boolean;
  disabled?: boolean;
  dataCy?: string;
  dataTestId?: string;
}

class FieldRowBase extends React.Component<IFieldRowProps, IFieldRowState> {
  /**
   * We maintain the collapsed state along in the FieldRow for two reasons.
   *
   * - It is not strictly associated with any specific row type. We store name, type, nullable and
   * typeProperties on each specific types because this can be saved independent of the state
   * of the other rows, however for collapsed is not the case. Collapsed directly affects how
   * other rows (children) are shown or hidden.
   *
   * - We still don't access prop changes to FieldRow to avoid re-rendering every row during
   * each update.
   *
   * So we store the collapsed here as a state variable and still pass on the collapsed state to parent so that
   * the list gets refreshed based on the state of collapsed of this particular row.
   */
  public state: IFieldRowState = {
    collapsed: this.props.field.collapsed,
  };

  public componentWillReceiveProps(nextProps) {
    if (nextProps.field.collapsed !== this.state.collapsed) {
      this.setState({
        collapsed: nextProps.field.collapsed,
      });
    }
    return;
  }

  public onChange = (property: string, value) => {
    if (
      ['name', 'type', 'nullable', 'typeProperties'].indexOf(property) === -1
    ) {
      return;
    }
    const { onChange, field } = this.props;
    if (onChange) {
      this.props.onChange(
        { id: field.id, ancestors: field.ancestors },
        {
          property,
          value,
          type: OperationTypesEnum.UPDATE,
        }
      );
    }
    return;
  };

  public onAdd = () => {
    const { onChange, field } = this.props;
    const { id, ancestors } = field;
    if (onChange) {
      this.props.onChange(
        { id, ancestors },
        {
          type: OperationTypesEnum.ADD,
        }
      );
    }
  };

  public onRemove = () => {
    const { onChange, field } = this.props;
    const { id, ancestors } = field;
    if (onChange) {
      onChange({ id, ancestors }, { type: OperationTypesEnum.REMOVE });
    }
  };

  public onToggleCollapse = () => {
    const { onChange, field } = this.props;
    const { id, ancestors, collapsed } = field;
    if (onChange) {
      onChange({ id, ancestors }, { type: OperationTypesEnum.COLLAPSE });
    }
    this.setState({
      collapsed: !collapsed,
    });
  };

  public RenderSubType = (field) => {
    switch (field.internalType) {
      case InternalTypesEnum.RECORD_SIMPLE_TYPE:
      case InternalTypesEnum.RECORD_COMPLEX_TYPE_ROOT:
        return (
          <FieldType
            internalType={this.props.field.internalType}
            disabled={this.props.disabled}
            name={this.props.field.name}
            type={this.props.field.type}
            nullable={this.props.field.nullable}
            onChange={this.onChange}
            onAdd={this.onAdd}
            onRemove={this.onRemove}
            autoFocus={this.props.autoFocus}
            typeProperties={this.props.field.typeProperties}
          />
        );
      case InternalTypesEnum.ARRAY_SIMPLE_TYPE:
      case InternalTypesEnum.ARRAY_COMPLEX_TYPE:
      case InternalTypesEnum.ARRAY_COMPLEX_TYPE_ROOT:
        return (
          <ArrayType
            disabled={this.props.disabled}
            type={this.props.field.type}
            nullable={this.props.field.nullable}
            onChange={this.onChange}
            onAdd={this.onAdd}
            onRemove={this.onRemove}
            autoFocus={this.props.autoFocus}
            typeProperties={this.props.field.typeProperties}
          />
        );
      case InternalTypesEnum.ENUM_SYMBOL:
        return (
          <EnumType
            disabled={this.props.disabled}
            typeProperties={this.props.field.typeProperties}
            onChange={this.onChange}
            onAdd={this.onAdd}
            onRemove={this.onRemove}
            autoFocus={this.props.autoFocus}
          />
        );
      case InternalTypesEnum.MAP_KEYS_COMPLEX_TYPE_ROOT:
      case InternalTypesEnum.MAP_KEYS_SIMPLE_TYPE:
      case InternalTypesEnum.MAP_VALUES_COMPLEX_TYPE_ROOT:
      case InternalTypesEnum.MAP_VALUES_SIMPLE_TYPE:
        return (
          <MapType
            disabled={this.props.disabled}
            internalType={this.props.field.internalType}
            type={this.props.field.type}
            nullable={this.props.field.nullable}
            onChange={this.onChange}
            onAdd={this.onAdd}
            onRemove={this.onRemove}
            autoFocus={this.props.autoFocus}
            typeProperties={this.props.field.typeProperties}
          />
        );
      case InternalTypesEnum.UNION_SIMPLE_TYPE:
      case InternalTypesEnum.UNION_COMPLEX_TYPE_ROOT:
        return (
          <UnionType
            disabled={this.props.disabled}
            type={this.props.field.type}
            nullable={this.props.field.nullable}
            onChange={this.onChange}
            onAdd={this.onAdd}
            onRemove={this.onRemove}
            autoFocus={this.props.autoFocus}
            typeProperties={this.props.field.typeProperties}
          />
        );
      default:
        return null;
    }
  };

  public render() {
    const { classes, dataCy, dataTestId } = this.props;
    const { ancestors, internalType } = this.props.field;
    if (internalType === InternalTypesEnum.SCHEMA) {
      return null;
    }
    return (
      <SchemaValidatorConsumer>
        {({ errorMap = {} }) => {
          const hasError = Object.hasOwnProperty.call(
            errorMap,
            this.props.field.id
          );
          return (
            <FieldWrapper
              ancestors={ancestors}
              className={classnames({
                [classes.erroredRow]: hasError,
              })}
              dataCy={dataCy}
              dataTestId={dataTestId}
            >
              <React.Fragment>
                <If condition={hasError}>
                  <Tooltip
                    classes={{ tooltip: classes.tooltip }}
                    title={errorMap[this.props.field.id] as any}
                    placement="right"
                  >
                    <ErrorIcon
                      data-cy="error-icon"
                      className={classes.errorIcon}
                    />
                  </Tooltip>
                </If>
                <If
                  condition={typeof this.state.collapsed === 'boolean'}
                  invisible
                >
                  <If condition={this.state.collapsed}>
                    <KeyboardArrowRightIcon
                      onClick={this.onToggleCollapse}
                      data-cy="expand-button"
                    />
                  </If>
                  <If condition={!this.state.collapsed}>
                    <KeyboardArrowDownIcon
                      onClick={this.onToggleCollapse}
                      data-cy="collapse-button"
                    />
                  </If>
                </If>
                {this.RenderSubType(this.props.field)}
              </React.Fragment>
            </FieldWrapper>
          );
        }}
      </SchemaValidatorConsumer>
    );
  }
}

const FieldRow = React.memo(withStyles(styles)(FieldRowBase));
export { FieldRow };
