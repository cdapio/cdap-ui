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
import EmptyMessageContainer from 'components/EmptyMessageContainer';
import SortableHeader from './SortableHeader';
import { IState, setSort } from './reducer';

interface IRecipeTableProps {
  allRecipies: IRecipe[];
  isShowAllColumns: boolean;
  isShowActions: boolean;
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
  isShowAllColumns,
  isShowActions,
  enableSorting,
  viewHandler,
  editHandler,
  selectHandler,
  state,
  dispatch,
}: IRecipeTableProps) => {
  const renderSortableHeaderColumn = (columnName: string) => {
    const { sortColumn, sortedOrder } = state;
    const setSorting = () => {
      setSort(dispatch, state, columnName);
    };
    return (
      <SortableHeader
        sortColumn={sortColumn}
        sortOrder={sortedOrder}
        columnName={columnName}
        setSort={setSorting}
      ></SortableHeader>
    );
  };

  const renderTableHeader = () => {
    if (allRecipies && allRecipies.length > 0) {
      return (
        <div className="grid-header">
          <div className="grid-row">
            {enableSorting ? (
              renderSortableHeaderColumn('name')
            ) : (
              <strong>{T.translate(`${PREFIX}.name`)}</strong>
            )}
            <strong>{T.translate(`${PREFIX}.steps`)}</strong>
            {isShowAllColumns && <strong>{T.translate(`${PREFIX}.description`)}</strong>}
            {enableSorting ? (
              renderSortableHeaderColumn('updated')
            ) : (
              <strong>{T.translate(`${PREFIX}.updated`)}</strong>
            )}
            {isShowActions && <strong></strong>}
          </div>
        </div>
      );
    }
  };

  const renderTableBody = () => {
    if (!allRecipies || (Array.isArray(allRecipies) && allRecipies.length === 0)) {
      return (
        <EmptyMessageContainer title={T.translate(`${PREFIX}.emptyListMessage`)}>
          <></>
        </EmptyMessageContainer>
      );
    }
    return (
      <div className="grid-body">
        {allRecipies.map((recipe) => {
          return (
            <RecipeTableRow
              key={recipe.recipeId.recipeId}
              recipe={recipe}
              isShowAllColumns={isShowAllColumns}
              viewHandler={viewHandler}
              editHandler={editHandler}
              selectHandler={selectHandler}
              isShowActions={isShowActions}
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
