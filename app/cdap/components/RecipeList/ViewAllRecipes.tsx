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
import T from 'i18n-react';
import RecipeList from 'components/RecipeList';

import Box from '@material-ui/core/Box';
import { SortBy, SortOrder } from './types';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { getCurrentNamespace } from 'services/NamespaceStore';

const PREFIX = 'features.WranglerNewUI.Recipe';

const redirectToObj = `/ns/${getCurrentNamespace()}/wrangle`;

const ViewAllRecipies = () => {
  const viewRecipeHandler = (selectedObject: any) => {
    // To do : Integrate view recipe details panel
  };

  const handleEditRecipe = (selectedObject: any) => {
    // To do : Integrate Edit recipe details panel
  };

  return (
    <>
      <Box ml={4} m={2}>
        <Breadcrumbs separator="›" aria-label="breadcrumb">
          <Link underline="hover" key="2" color="inherit" to={redirectToObj}>
            {T.translate(`${PREFIX}.home`)}
          </Link>

          <Typography key="3">{T.translate(`${PREFIX}.savedRecipes`)}</Typography>
        </Breadcrumbs>
      </Box>
      <Box ml={4} mb={2}>
        <Typography variant="h5" key="3">
          {T.translate(`${PREFIX}.savedRecipes`)}
        </Typography>
      </Box>

      <Box ml={4} mr={4}>
        <RecipeList
          isOpen={true}
          showAllColumns={true}
          showActions={true}
          viewHandler={viewRecipeHandler}
          editHandler={handleEditRecipe}
          pageSize={12}
          sortBy={SortBy.UPDATED}
          sortOrder={SortOrder.DESCENDING}
          showPagination={true}
          enableSorting={true}
        />
      </Box>
    </>
  );
};

export default ViewAllRecipies;
