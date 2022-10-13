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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';
import React from 'react';
import { useStyles } from '../styles';
import T from 'i18n-react';

export default function(props) {
  const { recipeSteps } = props;
  const classes = useStyles();

  const handleDelete = () => {};

  return (
    <TableContainer component={Box}>
      <Table aria-label="recipe steps table">
        <TableHead>
          <TableRow className={classes.recipeStepsTableRowStyles}>
            <TableCell classes={{ head: classes.recipeStepsTableHeadStyles }}>
              {T.translate('features.WranglerNewRecipeSteps.serialNo')}
            </TableCell>
            <TableCell classes={{ head: classes.recipeStepsTableHeadStyles }}>
              {T.translate('features.WranglerNewRecipeSteps.recipeSteps')}
            </TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {recipeSteps.map((eachStep, index) => (
            <TableRow className={classes.recipeStepsTableBodyRowStyles} key={index}>
              <TableCell classes={{ body: classes.recipeStepsTableRowStyles }}>
                {index + 1 > 10 ? index + 1 : `0${index + 1}`}
              </TableCell>
              <TableCell
                classes={{ body: classes.recipeStepsTableRowStyles }}
                // component="th"
                // scope="row"
              >
                <span className={classes.recipeStepsActionTypeStyles}>{eachStep.actionType}</span>
                &nbsp;
                {eachStep.description}
              </TableCell>
              <TableCell
                className={[classes.recipeStepsTableRowStyles, classes.displayNone].join(' ')}
              >
                <img
                  className={classes.recipeStepsDeleteStyles}
                  onClick={handleDelete}
                  src="/cdap_assets/img/delete.svg"
                  alt="delete"
                  data-testid={'recipe-steps-table-component-image-click' + index}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
