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
  IFieldIdentifier,
  IOnChangePayload,
} from 'components/AbstractWidget/SchemaEditor/EditorTypes';
import { FieldRow } from 'components/AbstractWidget/SchemaEditor/FieldsList/FieldRow';
import { SiblingCommunicationProvider } from 'components/AbstractWidget/SchemaEditor/FieldWrapper/SiblingCommunicationContext';
import { IOnChangeReturnType } from 'components/AbstractWidget/SchemaEditor/Context/SchemaManager';
import VirtualScroll from 'components/shared/VirtualScroll';
import { SchemaValidatorConsumer } from 'components/AbstractWidget/SchemaEditor/SchemaValidator';
import withstyles, {
  WithStyles,
  StyleRules,
} from '@material-ui/core/styles/withStyles';
const styles = (): StyleRules => {
  return {
    errorHighlight: {
      color: 'red',
    },
  };
};

interface IFieldsListState {
  visibleRowCount: number;
  rows: IFlattenRowType[];
  currentRowToFocus: string;
}

interface IFieldsListProps extends WithStyles<typeof styles> {
  visibleRowCount?: number;
  disabled?: boolean;
  value: IFlattenRowType[];
  onChange: (
    id: IFieldIdentifier,
    onChangePayload: IOnChangePayload
  ) => IOnChangeReturnType;
}

class FieldsListBase extends React.Component<
  IFieldsListProps,
  IFieldsListState
> {
  public static visibleNodeCount = 20;
  public static childrenUnderFold = 5;
  public static heightOfRow = 34;

  public state: IFieldsListState = {
    rows: this.props.value || [],
    currentRowToFocus: null,
    visibleRowCount:
      this.props.visibleRowCount || FieldsListBase.visibleNodeCount,
  };
  public componentWillReceiveProps(nextProps: IFieldsListProps) {
    const ids = nextProps.value
      .map((r) => `${r.id}-${r.hidden}-${r.collapsed}`)
      .join(',');
    const existingids = this.state.rows
      .map((r) => `${r.id}-${r.hidden}-${r.collapsed}`)
      .join(',');
    const { visibleRowCount } = nextProps;
    if (ids !== existingids || visibleRowCount !== this.state.visibleRowCount) {
      this.setState({
        rows: nextProps.value,
        visibleRowCount,
      });
    }
  }

  public onChange = (
    field: IFieldIdentifier,
    onChangePayload: IOnChangePayload
  ) => {
    const { fieldIdToFocus } = this.props.onChange(field, onChangePayload);
    if (typeof fieldIdToFocus === 'string') {
      this.setState({
        currentRowToFocus: fieldIdToFocus,
      });
    }
  };

  public renderList = (visibleNodeCount, startNode) => {
    const { currentRowToFocus } = this.state;
    // Remove the first row as that is the top level schema row.
    return this.state.rows
      .slice(1)
      .filter((row) => !row.hidden)
      .slice(startNode, startNode + visibleNodeCount)
      .map((field, i) => {
        if (field.hidden) {
          return null;
        }
        return (
          <FieldRow
            disabled={this.props.disabled}
            autoFocus={currentRowToFocus === field.id}
            key={field.id}
            field={field}
            onChange={this.onChange}
            dataCy={`schema-row-${i}`}
            dataTestId={`schema-row-${i}`}
          />
        );
      });
  };

  public render() {
    const itemCount = this.state.rows.filter((field) => !field.hidden).length;
    const { classes } = this.props;
    return (
      <SiblingCommunicationProvider>
        <SchemaValidatorConsumer>
          {({ errorMap = {} }) => {
            if (Object.hasOwnProperty.call(errorMap, this.state.rows[0].id)) {
              return (
                <div className={classes.errorHighlight}>
                  {errorMap[this.state.rows[0].id] as any}
                </div>
              );
            }
          }}
        </SchemaValidatorConsumer>
        <VirtualScroll
          itemCount={() => itemCount}
          visibleChildCount={this.state.visibleRowCount}
          childHeight={FieldsListBase.heightOfRow}
          renderList={this.renderList.bind(this)}
          childrenUnderFold={FieldsListBase.childrenUnderFold}
          dataCy="schema-fields-list"
        />
      </SiblingCommunicationProvider>
    );
  }
}
const FieldsList = withstyles(styles)(FieldsListBase);
export { FieldsList, FieldsListBase };
