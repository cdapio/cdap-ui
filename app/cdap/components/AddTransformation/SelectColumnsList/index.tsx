/*
 * Copyright © 2022 Cask Data, Inc.
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

import {
  Box,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';
import React, { useState } from 'react';
import { useStyles } from '../styles';
import T from 'i18n-react';

const columnsData = [
  {
    label: 'Customer name',
    domainType: 'ABC',
    dataType: 'String',
    dataQuality: '65',
    isSelected: false,
  },
  {
    label: 'Customer name',
    domainType: 'ABC',
    dataType: 'String',
    dataQuality: '65',
    isSelected: false,
  },
  {
    label: 'Customer name',
    domainType: 'ABC',
    dataType: 'String',
    dataQuality: '65',
    isSelected: false,
  },
  {
    label: 'Customer name',
    domainType: 'ABC',
    dataType: 'String',
    dataQuality: '65',
    isSelected: false,
  },
  {
    label: 'Customer name',
    domainType: 'ABC',
    dataType: 'String',
    dataQuality: '65',
    isSelected: false,
  },
  {
    label: 'Customer name',
    domainType: 'ABC',
    dataType: 'String',
    dataQuality: '65',
    isSelected: false,
  },
];

export default function(props) {
  const { selectedColumnsCount } = props;
  const [columns, setColumns] = useState(columnsData);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const classes = useStyles();

  const onSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedColumns(columns);
      return;
    }
    setSelectedColumns([]);
  };

  return (
    <section className={classes.columnsCountTextStyles}>
      <div className={classes.selectColumnsHeaderStyles}>
        <div>
          {selectedColumnsCount
            ? selectedColumnsCount > 10
              ? selectedColumnsCount
              : `0${selectedColumnsCount}`
            : 'No '}{' '}
          {T.translate('features.WranglerNewAddTransformation.columnsSelected')}
        </div>
        <img src="/cdap_assets/img/search.svg" alt="search" />
      </div>
      <TableContainer component={Box}>
        <Table aria-label="recipe steps table">
          <TableHead>
            <TableRow className={classes.recipeStepsTableRowStyles}>
              <TableCell classes={{ head: classes.recipeStepsTableHeadStyles }}>
                <Checkbox
                  color="primary"
                  indeterminate={
                    selectedColumns.length > 0 && selectedColumns.length < columns.length
                  }
                  checked={columns.length > 0 && selectedColumns.length === columns.length}
                  onChange={onSelectAllClick}
                  inputProps={{
                    'aria-label': 'select all columns',
                    "id": "transformation-checkbox-select-all-columns"
                  }}
                />
              </TableCell>
              <TableCell classes={{ head: classes.recipeStepsTableHeadStyles }}>
                {T.translate('features.WranglerNewAddTransformation.columns')}
              </TableCell>
              <TableCell classes={{ head: classes.recipeStepsTableHeadStyles }}>
                {T.translate('features.WranglerNewAddTransformation.dataQuality')}
              </TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {columns.map((eachColumn, index) => (
              <TableRow className={classes.recipeStepsTableBodyRowStyles} key={index}>
                <TableCell classes={{ body: classes.recipeStepsTableRowStyles }}>
                  <Checkbox
                    color="primary"
                    indeterminate={
                      selectedColumns.length > 0 && selectedColumns.length < columns.length
                    }
                    checked={columns.length > 0 && selectedColumns.length === columns.length}
                    onChange={onSelectAllClick}
                    inputProps={{
                      'aria-label': 'select all columns',
                    }}
                  />
                </TableCell>
                <TableCell
                  classes={{ body: classes.recipeStepsTableRowStyles }}
                  // component="th"
                  // scope="row"
                >
                  <span className={classes.recipeStepsActionTypeStyles}>{eachColumn.label}</span>
                  &nbsp;
                  {eachColumn.label}
                </TableCell>
                <TableCell
                  className={[classes.recipeStepsTableRowStyles, classes.displayNone].join(' ')}
                >
                  <img
                    className={classes.recipeStepsDeleteStyles}
                    src="/cdap_assets/img/delete.svg"
                    alt="delete"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </section>
  );
}
