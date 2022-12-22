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

import React, { useRef, useState } from 'react';
import T from 'i18n-react';
import { PrimaryTextLowercaseButton } from 'components/shared/Buttons/PrimaryTextLowercaseButton';
import RecipeList from 'components/RecipeList';
import IconSVG from 'components/shared/IconSVG';
import { SortBy, SortOrder } from 'components/RecipeList/types';
import Box from '@material-ui/core/Box';

const PREFIX = 'features.WranglerNewUI.Recipe';

export const RecipeImportButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);

  const toggleButton = () => {
    setIsOpen(!isOpen);
  };
  const handleSelectRecipe = (selectedObject: any) => {
    // alert(`Selected Recipe to apply : ${JSON.stringify(selectedObject)}`);
    // To do : Implement apply functionality from here
  };

  const renderRecipeImportBtn = () => {
    return (
      <div className="btn recipe-action-btn" ref={buttonRef}>
        <PrimaryTextLowercaseButton
          onClick={toggleButton}
          data-cy="recipe-import-btn"
          data-testid="recipe-import-btn"
        >
          <div className="btn-container">
            <div>
              <IconSVG name="icon-import"></IconSVG>
              <div className="button-label">{T.translate(`${PREFIX}.import`)}</div>
            </div>
          </div>
        </PrimaryTextLowercaseButton>
      </div>
    );
  };

  return (
    <Box m={2}>
      {renderRecipeImportBtn()}
      <RecipeList
        isOpen={isOpen}
        showAllColumns={false}
        showActions={false}
        selectHandler={handleSelectRecipe}
        sortBy={SortBy.UPDATED}
        sortOrder={SortOrder.DESCENDING}
        pageSize={6}
        showPagination={true}
        enableSorting={true}
      />
    </Box>
  );
};
