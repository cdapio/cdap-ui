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

import React, { useState } from 'react';
import T from 'i18n-react';
import { IRecipe } from './types';
import ActionsPopover, { IAction } from 'components/shared/ActionsPopover';
import MyDataPrepApi from 'api/dataprep';
import { getCurrentNamespace } from 'services/NamespaceStore';
import fileDownload from 'js-file-download';
import ConfirmationModal from 'components/shared/ConfirmationModal';
import { IState, reset } from './reducer';
import { format, TYPES } from 'services/DataFormatter';

interface IRecipeTableRowProps {
  recipe: IRecipe;
  createdTimeMillis?: any;
  isShowAllColumns: boolean;
  isShowActions: boolean;
  onViewRecipe: (selectedRecipe: IRecipe) => void;
  onEditRecipe: (selectedRecipe: IRecipe) => void;
  onSelectRecipe: (selectedRecipe: IRecipe) => void;
  state: IState;
  dispatch: (action: any) => void;
}

const PREFIX = 'features.WranglerNewUI.Recipe';
const DATE_FORMAT = 'MM-DD-YYYY HH:mm A';

export const RecipeTableRow = ({
  recipe,
  isShowAllColumns,
  isShowActions,
  onViewRecipe,
  onEditRecipe,
  onSelectRecipe,
  state,
  dispatch,
}: IRecipeTableRowProps) => {
  const [showPopover, setShowPopover] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleteLoading, setDeleteLoading] = useState(false);
  const [deleteErrMsg, setDeleteErrMsg] = useState(null);
  const [extendedDeleteErrMsg, setExtendedDeleteErrMsg] = useState(null);

  const handleActionsClick = (e) => {
    e.preventDefault();
  };

  const togglePopover = () => {
    setShowPopover(!showPopover);
  };

  const getRecipeDetailsById = (responseHandler) => {
    MyDataPrepApi.getRecipeById({
      context: getCurrentNamespace(),
      recipeId: recipe.recipeId.recipeId,
    }).subscribe((res) => {
      responseHandler(res);
    });
  };

  const selectRecipeHandler = () => {
    getRecipeDetailsById(onSelectRecipe);
  };

  const handleRecipeView = () => {
    setShowPopover(!showPopover);
    getRecipeDetailsById(onViewRecipe);
  };

  const handleRecipeEdit = () => {
    setShowPopover(!showPopover);
    getRecipeDetailsById(onEditRecipe);
  };

  const handleDownloadRecipe = () => {
    setShowPopover(!showPopover);
    getRecipeDetailsById(downloadRecipe);
  };

  const downloadRecipe = (res) => {
    const data = res.directives.join('\n');
    const filename = `${recipe.recipeName}-directives.txt`;
    fileDownload(data, filename);
  };

  const toggleDeleteConfirmation = () => {
    setDeleteModalOpen(!isDeleteModalOpen);
  };

  const showDeleteConfirmation = () => {
    setShowPopover(!showPopover);
    toggleDeleteConfirmation();
  };

  const handleDeleteRecipe = () => {
    setDeleteLoading(true);
    MyDataPrepApi.deleteRecipe({
      context: getCurrentNamespace(),
      recipeId: recipe.recipeId.recipeId,
    }).subscribe(
      () => {
        setDeleteLoading(false);
        toggleDeleteConfirmation();
        reset(dispatch, state);
      },
      (err) => {
        setDeleteErrMsg(T.translate(`${PREFIX}.common.deleteError`));
        setExtendedDeleteErrMsg(err.message);
        setDeleteLoading(false);
      }
    );
  };

  const renderDeleteConfirmation = () => {
    if (!isDeleteModalOpen) {
      return null;
    }
    const confirmationText = T.translate(`${PREFIX}.common.deleteConfirmation`, {
      recipeName: recipe.recipeName,
    });
    const confirmationElem = <span title={recipe.recipeName}>{confirmationText}</span>;

    return (
      <ConfirmationModal
        headerTitle={T.translate(`${PREFIX}.common.deleteTitle`)}
        toggleModal={toggleDeleteConfirmation}
        confirmationElem={confirmationElem}
        confirmButtonText={T.translate('commons.delete')}
        confirmFn={handleDeleteRecipe}
        cancelFn={toggleDeleteConfirmation}
        isOpen={isDeleteModalOpen}
        errorMessage={deleteErrMsg}
        extendedMessage={extendedDeleteErrMsg}
        isLoading={isDeleteLoading}
      />
    );
  };

  const actions: IAction[] = [
    {
      label: T.translate('commons.view'),
      actionFn: handleRecipeView,
    },
    {
      label: T.translate('commons.edit'),
      actionFn: handleRecipeEdit,
    },
    {
      label: T.translate('commons.download'),
      actionFn: handleDownloadRecipe,
      className: 'Download',
    },
    {
      label: 'separator',
    },
    {
      label: T.translate('commons.delete'),
      actionFn: showDeleteConfirmation,
      className: 'delete',
    },
  ];

  return (
    <>
      <div className="grid-row" onClick={!isShowAllColumns ? selectRecipeHandler : undefined}>
        <div>{recipe.recipeName}</div>
        <div>{recipe.recipeStepsCount}</div>
        {isShowAllColumns && <div>{recipe.description}</div>}
        <div>{format(recipe.updatedTimeMillis, TYPES.TIMESTAMP_MILLIS)}</div>
        {isShowActions && (
          <span onClick={handleActionsClick}>
            <ActionsPopover
              actions={actions}
              showPopover={showPopover}
              togglePopover={togglePopover}
            />
          </span>
        )}
        {renderDeleteConfirmation()}
      </div>
    </>
  );
};
