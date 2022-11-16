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
import { IRecipeStepTebleProps } from 'components/RecipeSteps/RecipeStepsTableComponent/types';
import { DeleteIcon } from 'components/RecipeSteps/IconStore/DeleteIcon';
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
    & td:last-child {
      visibility: visible;
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

const RecipeStepsTableRowStyle = styled(TableCell)`
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 150%;
  letter-spacing: 0.15;
  color: #5f6368;
  padding: 15px 10px;
  visibility: hidden;
`;

export default function({ recipeSteps, handleDeleteRecipeSteps }: IRecipeStepTebleProps) {
  const handleDelete = (eachStep, i) => {
    handleDeleteRecipeSteps(
      recipeSteps.filter((x, index) => index < i),
      recipeSteps.filter((x, index) => index >= i)
    );
  };

  return (
    <TableContainer component={Box} data-testid="recipe-step-container">
      <Table aria-label="recipe steps table">
        <TableHead>
          <RecipeStepsTableRow>
            {headerData?.map((i) => (
              <RecipeStepsTableHead data-testid={i.textId}>{i.text}</RecipeStepsTableHead>
            ))}
          </RecipeStepsTableRow>
        </TableHead>
        <TableBody>
          {recipeSteps?.map((eachStep, eachStepIndex) => (
            <RecipeStepsTableBodyRow
              key={eachStepIndex}
              data-testid={`recipe-step-row-${eachStepIndex}`}
            >
              <RecipeStepsBodyTableRow
                data-testid={`recipe-step-row-${eachStepIndex}-number-column`}
              >
                {eachStepIndex + 1 > 10 ? eachStepIndex + 1 : `0${eachStepIndex + 1}`}
              </RecipeStepsBodyTableRow>
              <RecipeStepsBodyTableRow data-testid={`${eachStep}-recipe-step`}>
                <span data-testid={'recipe-steps-span' + eachStepIndex}>{eachStep}</span>
              </RecipeStepsBodyTableRow>
              <RecipeStepsTableRowStyle data-testid={`recipe-step-row-${eachStepIndex}-delete`}>
                <RecipeStepsDeleteStyle
                  onClick={() => handleDelete(eachStep, eachStepIndex)}
                  data-testid={`recipe-step-${eachStepIndex}-delete`}
                >
                  {DeleteIcon}
                </RecipeStepsDeleteStyle>
              </RecipeStepsTableRowStyle>
            </RecipeStepsTableBodyRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
