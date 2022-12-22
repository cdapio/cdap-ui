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

import React from 'react';
import RecipeList from 'components/RecipeList';
import { SortBy, SortOrder } from 'components/RecipeList/types';
import Box from '@material-ui/core/Box';

export const LastUpdatedRecipes = () => {
  return (
    <Box mb={4} data-testid="last-updated-recipes-homepage">
      <RecipeList
        isOpen={true}
        showAllColumns={true}
        showActions={false}
        showPagination={false}
        sortBy={SortBy.UPDATED}
        sortOrder={SortOrder.DESCENDING}
        pageSize={2}
        enableSorting={false}
      />
    </Box>
  );
};
