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
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
import React from 'react';
import { IRecipeStepTableProps } from 'components/RecipeSteps/RecipeStepsTableComponent/types';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineRounded';
import styled from 'styled-components';
import { grey } from '@material-ui/core/colors';
import T from 'i18n-react';

const headerData = [
  {
    textId: 'serial-no',
    text: '#',
  },
  {
    textId: 'recipe-steps',
    text: T.translate('features.WranglerNewUI.WranglerNewRecipeSteps.labels.recipeSteps'),
  },
  {
    textId: '',
    text: '',
  },
];

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

const RecipeStepsBodyTableCell = styled(TableCell)`
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

const RecipeStepsDeleteStyle = styled(IconButton)`
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

const StyledDeleteOutlineOutlinedIcon = styled(DeleteOutlineOutlinedIcon)`
  font-size: 24px;
  color: ${grey[600]};
`;

const RecipeStepLabel = styled(Typography)`
  word-break: break-all;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 150%;
  letter-spacing: 0.15px;
  color: #616161;
`;

export default function({ recipeSteps, onDeleteRecipeSteps }: IRecipeStepTableProps) {
  const onDelete = (recipeStepIndex: number) => {
    onDeleteRecipeSteps(recipeSteps.slice(0, recipeStepIndex), recipeSteps.slice(recipeStepIndex));
  };

  return (
    <TableContainer component={Box} data-testid="recipe-step-container">
      <Table aria-label="recipe steps table">
        <TableHead>
          <RecipeStepsTableRow>
            {headerData?.map((eachHeaderData) => (
              <RecipeStepsTableHead data-testid={eachHeaderData.textId}>
                {eachHeaderData.text}
              </RecipeStepsTableHead>
            ))}
          </RecipeStepsTableRow>
        </TableHead>
        <TableBody>
          {recipeSteps?.map((eachStep, eachStepIndex) => (
            <RecipeStepsTableBodyRow
              key={eachStepIndex}
              data-testid={`recipe-step-row-${eachStepIndex}`}
            >
              <RecipeStepsBodyTableCell
                data-testid={`recipe-step-row-${eachStepIndex}-number-column`}
              >
                {eachStepIndex + 1 > 10 ? eachStepIndex + 1 : `${eachStepIndex + 1}`}
              </RecipeStepsBodyTableCell>
              <RecipeStepsBodyTableCell data-testid={`${eachStep}-recipe-step`}>
                <RecipeStepLabel data-testid={'recipe-steps-span' + eachStepIndex}>
                  {eachStep}
                </RecipeStepLabel>
              </RecipeStepsBodyTableCell>
              <RecipeStepsTableRowStyle data-testid={`recipe-step-row-${eachStepIndex}-delete`}>
                <RecipeStepsDeleteStyle
                  onClick={() => onDelete(eachStepIndex)}
                  data-testid={`recipe-step-${eachStepIndex}-delete`}
                >
                  <StyledDeleteOutlineOutlinedIcon />
                </RecipeStepsDeleteStyle>
              </RecipeStepsTableRowStyle>
            </RecipeStepsTableBodyRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
