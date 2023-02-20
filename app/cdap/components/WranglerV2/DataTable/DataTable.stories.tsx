/*
 * Copyright © 2023 Cask Data, Inc.
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

import React from 'react';

import { IconButton, Typography } from '@material-ui/core';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import { action } from '@storybook/addon-actions';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import DataTable, { DataTableContainer } from 'components/WranglerV2/DataTable';
import {
  getTableBodyCell,
  getTableHeaderCell,
  RecipeStepCellWrapper,
} from 'components/WranglerV2/RecipeStepsTable';

export default {
  title: 'DataTable',
  component: DataTable,
} as ComponentMeta<typeof DataTable>;

const handleDeleteIconClick = () => action('clicked')('Delete Icon Clicked');

const getRecipeStepCell = ({ value }) => () => {
  const prefix = value.split("'")[0];
  const suffix = value.substr(prefix.length);

  const BodyCell = getTableBodyCell({ value: suffix });
  return (
    <RecipeStepCellWrapper>
      <div className="cell-content-div">
        <Typography component="span" variant="body1">
          {prefix}
        </Typography>
        &nbsp;
        <BodyCell />
      </div>
      <IconButton onClick={handleDeleteIconClick}>
        <DeleteOutlineIcon />
      </IconButton>
    </RecipeStepCellWrapper>
  );
};

const columns = [
  {
    name: 'serialNumber',
    value: '#',
    getCellRenderer: getTableBodyCell,
  },
  {
    name: 'recipeStep',
    value: 'Recipe Steps',
    getCellRenderer: getRecipeStepCell,
  },
];

const rows = [
  {
    serialNumber: '01',
    recipeStep: "Parse Column 'body_01' with delimiter 'comma' and set 'first row as header'",
  },
  {
    serialNumber: '02',
    recipeStep: "Delete Column 'body_01'",
  },
];

const Template: ComponentStory<typeof DataTable> = (args) => <DataTable {...args} />;

export const Default = Template.bind({});

Default.args = {
  rows,
  columns,
  Container: DataTableContainer,
  getTableHeaderCell,
};
