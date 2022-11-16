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
import { useStyles } from 'components/RecipeSteps/styles';
import { IRecipeStepTebleProps } from 'components/RecipeSteps/RecipeStepsTableComponent/types';
import { DeleteIcon } from 'components/RecipeSteps/iconStore';
import { headerData } from 'components/RecipeSteps/RecipeStepsTableComponent/utils';
import styled from 'styled-components';

const RecipeStepsTableRow = styled(TableRow)`
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 150%;
  letter-spacing: 0.15;
  color: #5f6368;
  padding: 15px 10px;
`;

const RecipeStepsTableHead = styled(TableCell)`
  &.MuiTableCell-head {
    padding: 10px;
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 150%;
    letter-spacing: 0.15;
    color: #5f6368;
  }
`;

const RecipeStepsTableBodyRow = styled(TableRow)`
  &:hover {
    background: #eff0f2;
    & td {
      &:last-child: {
        visibility: visible;
      }
    }
  }
`;

const RecipeStepsBodyTableRow = styled(TableCell)`
  &.MuiTableCell-root {
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 150%;
    letter-spacing: 0.15;
    color: #5f6368;
    padding: 15px 10px;
  }
`;

const RecipeStepsDeleteStyle = styled(Box)`
  width: 18px;
  height: 20px;
  cursor: pointer;
`;

export default function({ recipeSteps, handleDeleteRecipeSteps }) {
  const classes = useStyles();

  const handleDelete = (eachStep, i) => {
    handleDeleteRecipeSteps(
      recipeSteps.filter((x, index) => index < i),
      recipeSteps.filter((x, index) => index >= i)
    );
  };

  return (
    <TableContainer component={Box}>
      <Table aria-label="recipe steps table">
        <TableHead>
          <RecipeStepsTableRow>
            {headerData?.map((i) => (
              <RecipeStepsTableHead data-testid={i.textId}>{i.text}</RecipeStepsTableHead>
            ))}
          </RecipeStepsTableRow>
        </TableHead>
        <TableBody>
          {recipeSteps?.map((eachStep, index) => (
            <TableRow className={classes.recipeStepsTableBodyRowStyles} key={index}>
              <RecipeStepsBodyTableRow data-testid="index-num">
                {index + 1 > 10 ? index + 1 : `0${index + 1}`}
              </RecipeStepsBodyTableRow>
              <RecipeStepsBodyTableRow data-testid="each-recipe-step">
                <span data-testid={'recipe-steps-span' + index}>{eachStep}</span>
              </RecipeStepsBodyTableRow>
              <TableCell
                className={[classes.recipeStepsTableRowStyles, classes.displayNone].join(' ')}
                data-testid="delete-styles"
              >
                <RecipeStepsDeleteStyle
                  onClick={() => handleDelete(eachStep, index)}
                  data-testid="step-table-delete"
                >
                  {DeleteIcon}
                </RecipeStepsDeleteStyle>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
