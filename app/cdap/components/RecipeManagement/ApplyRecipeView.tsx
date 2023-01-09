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

import React, { useEffect, useState } from 'react';
import T from 'i18n-react';
import RecipeList from 'components/RecipeList';
import { IRecipe, SortBy, SortOrder } from 'components/RecipeList/types';
import Box from '@material-ui/core/Box';
import { applyRecipe } from 'components/RecipeManagement/helper';
import { directiveRequestBodyCreator } from 'components/DataPrep/helper';
import useSnackbar from 'components/Snackbar/useSnackbar';
import Snackbar from 'components/Snackbar';
import DrawerWidget from 'components/common/DrawerWidget';
import PrimaryContainedButton from 'components/shared/Buttons/PrimaryContainedButton';
import styled from 'styled-components';
import { format, TYPES } from 'services/DataFormatter';

const PREFIX = 'features.WranglerNewUI.Recipe';
const RECIPE_LIST_PAGE_SIZE = 6;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: 150px;
`;

interface IApplyRecipeViewProps {
  isOpen: boolean;
  toggleOpen: (x: boolean) => void;
  workspaceId: string;
  directives: string[];
}

export const ApplyRecipeView = ({
  isOpen,
  toggleOpen,
  workspaceId,
  directives,
}: IApplyRecipeViewProps) => {
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [snackbarState, setSnackbarState] = useSnackbar();

  let timeoutId;

  const handleSelectRecipe = (selectedObject: IRecipe) => {
    setSelectedRecipe(selectedObject);
  };

  const applySelectedRecipe = (recipeId) => {
    const requestBody = directiveRequestBodyCreator(directives);
    applyRecipe(recipeId, workspaceId, requestBody, applyResponseHandler, applyErrorHandler);
  };

  const applyResponseHandler = (res) => {
    toggleOpen(false);
    setSelectedRecipe(null);
    setSnackbarState({
      open: true,
      isSuccess: true,
      message: T.translate(`${PREFIX}.applyRecipeSuccess`).toString(),
    });
  };

  const applyErrorHandler = (err) => {
    toggleOpen(false);
    setSelectedRecipe(null);
    const errorMessage = err.message;
    setSnackbarState({
      open: true,
      isSuccess: false,
      message: T.translate(`${PREFIX}.applyRecipeFailed`, {
        errorDetails: errorMessage,
      }).toString(),
    });
  };

  const closeSnackBar = () => {
    setSnackbarState(() => ({
      open: false,
    }));
  };

  useEffect(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    if (snackbarState.open && snackbarState.isSuccess) {
      timeoutId = setTimeout(closeSnackBar, 5000);
    }
  }, [snackbarState.open]);

  const renderRecipeList = () => {
    return (
      <>
        <h6>{T.translate(`${PREFIX}.selectRecipeToApply`)}</h6>
        <RecipeList
          isOpen={isOpen}
          showAllColumns={false}
          showActions={false}
          selectHandler={handleSelectRecipe}
          sortBy={SortBy.UPDATED}
          sortOrder={SortOrder.DESCENDING}
          pageSize={RECIPE_LIST_PAGE_SIZE}
          showPagination={true}
          enableSorting={true}
        />
      </>
    );
  };

  /* TO DO : Remove this function once Recipe Details UI component is integrated  */
  const renderRecipeDetailsView = () => {
    const Container = styled.div`
      display: flex;
    `;
    const MainContainer = styled.div`
      line-height: 2.5;
    `;
    const StepsTable = styled.table`
      box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.2), 0px 2px 2px rgba(0, 0, 0, 0.14),
        0px 1px 5px rgba(0, 0, 0, 0.12);
      width: 100%;
    `;
    const Divider = styled.div`
      width: 1px;
      height: 20px;
      background-color: #dadce0;
      margin: 7px 15px;
    `;
    return (
      <>
        <MainContainer>
          <div>
            <strong>{selectedRecipe.recipeName}</strong>
          </div>
          <Container>
            <span>
              {`${selectedRecipe.recipeStepsCount} `} {T.translate(`${PREFIX}.recipeSteps`)}
            </span>
            <Divider></Divider>
            <span>{format(selectedRecipe.updatedTimeMillis, TYPES.TIMESTAMP_MILLIS)}</span>
          </Container>
          <div>{selectedRecipe.description}</div>
          <div className="table">
            <StepsTable>
              <tbody className="table table-hover">
                <tr>
                  <th>{'#'}</th>
                  <th>{T.translate(`${PREFIX}.recipeSteps`)}</th>
                </tr>
                {Object.keys(selectedRecipe.directives).map((key, index) => (
                  <tr className="table-row" key={`tablevalue-${index}`}>
                    <td>{index}</td>
                    <td>{selectedRecipe.directives[key] + ' ' + key}</td>
                  </tr>
                ))}
              </tbody>
            </StepsTable>
          </div>
        </MainContainer>
      </>
    );
  };

  const renderRecipeDetailsWithApply = () => {
    return (
      <Box>
        {/* TO DO : Replace renderRecipeDetailsView()  with Recipe Details UI component once ready  */}
        {renderRecipeDetailsView()}
        <ButtonsContainer>
          <PrimaryContainedButton
            onClick={() => applySelectedRecipe(selectedRecipe.recipeId.recipeId)}
            data-testid="recipe-apply-btn"
          >
            {T.translate(`${PREFIX}.applyRecipe`)}
          </PrimaryContainedButton>
          <PrimaryContainedButton
            color="default"
            onClick={() => setSelectedRecipe(null)}
            data-testid="recipe-apply-cancel-btn"
          >
            {T.translate(`${PREFIX}.cancel`)}
          </PrimaryContainedButton>
        </ButtonsContainer>
      </Box>
    );
  };
  return (
    <>
      <Snackbar
        handleClose={closeSnackBar}
        open={snackbarState.open}
        message={snackbarState.message}
        isSuccess={snackbarState.isSuccess}
      />
      <DrawerWidget
        anchor="right"
        closeClickHandler={() => {
          toggleOpen(false);
        }}
        headingText={T.translate(`${PREFIX}.applyRecipeHeading`)}
        showBackIcon={selectedRecipe ? true : false}
        onBackIconClick={() => setSelectedRecipe(null)}
        showDivider={false}
        open={isOpen}
        dataTestId={'apply-recipe-drawer-widget'}
        showHeaderSeparator={false}
        children={selectedRecipe === null ? renderRecipeList() : renderRecipeDetailsWithApply()}
      />
    </>
  );
};
