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
import { RecipeTableRow } from './RecipeTableRow';
import { IRecipe } from './types';
import SortableHeader from './SortableHeader';
import { IState, setSort } from './reducer';

interface IRecipeTableProps {
  allRecipies: IRecipe[];
  showAllColumns: boolean;
  showActions: boolean;
  enableSorting: boolean;
  viewHandler: (selectedRecipe: IRecipe) => void;
  editHandler: (selectedRecipe: IRecipe) => void;
  selectHandler?: (selectedRecipe: IRecipe) => void;
  state: IState;
  dispatch: (action: any) => void;
}

const PREFIX = 'features.WranglerNewUI.Recipe';

export const RecipesTable = ({
  allRecipies,
  showAllColumns,
  showActions,
  enableSorting,
  viewHandler,
  editHandler,
  selectHandler,
  state,
  dispatch,
}: IRecipeTableProps) => {
  const renderSortableHeaderColumn = (columnName: string) => {
    const { sortColumn, sortOrder } = state;

    return (
      <SortableHeader
        sortColumn={sortColumn}
        sortOrder={sortOrder}
        columnName={columnName}
        setSort={() => {
          setSort(dispatch, state, columnName);
        }}
      ></SortableHeader>
    );
  };

  const renderTableHeader = () => {
    return (
      <div className="grid-header">
        <div className="grid-row">
          {enableSorting ? (
            renderSortableHeaderColumn('name')
          ) : (
            <strong>{T.translate(`${PREFIX}.name`)}</strong>
          )}
          <strong>{T.translate(`${PREFIX}.steps`)}</strong>
          {showAllColumns && <strong>{T.translate(`${PREFIX}.description`)}</strong>}
          {enableSorting ? (
            renderSortableHeaderColumn('updated')
          ) : (
            <strong>{T.translate(`${PREFIX}.updated`)}</strong>
          )}
          {showActions && <strong></strong>}
        </div>
      </div>
    );
  };

  const renderTableBody = () => {
    return (
      <div className="grid-body">
        {allRecipies.map((recipe) => {
          return (
            <RecipeTableRow
              key={recipe.recipeId.recipeId}
              recipe={recipe}
              showAllColumns={showAllColumns}
              onViewRecipe={viewHandler}
              onEditRecipe={editHandler}
              onSelectRecipe={selectHandler}
              showActions={showActions}
              state={state}
              dispatch={dispatch}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="grid grid-container">
      {renderTableHeader()}
      {renderTableBody()}
    </div>
  );
};
