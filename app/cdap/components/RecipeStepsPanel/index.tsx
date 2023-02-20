import React from 'react';

import styled from 'styled-components';

import InlayDrawerWidget, { IMenuItem } from 'components/WranglerV2/InlayDrawerWidget';
import RecipeStepsTable, {
  RecipeStepsTableContainer,
} from 'components/WranglerV2/RecipeStepsTable';

const mockRecipe = [
  "Delete Column 'body1'",
  "Parse Column 'body2' with delimiter 'comma' and set first row as header",
  "Change data type 'body2' to string",
  "Parse Column 'body2' with delimiter 'comma'",
];

interface IRecipeStepsPanelProps {
  onDrawerCloseIconClick: () => void;
}

const RecipeStepsPanelTableContainer = styled(RecipeStepsTableContainer)`
  &&& {
    max-height: calc(100vh - 361px);
  }
`;

export default function RecipeStepsPanel({ onDrawerCloseIconClick }: IRecipeStepsPanelProps) {
  const onSaveButtonClick = () => {
    // do nothing
  };

  const onApplyButtonClick = () => {
    // do nothing
  };

  const onDownloadButtonClick = () => {
    // do nothing
  };

  const actionsOptions: IMenuItem[] = [
    {
      label: 'Save',
      value: 'save',
      clickHandler: onSaveButtonClick,
    },
    {
      label: 'Apply',
      value: 'apply',
      clickHandler: onApplyButtonClick,
    },
    {
      label: 'Download',
      value: 'download',
      clickHandler: onDownloadButtonClick,
    },
  ];

  return (
    <>
      <InlayDrawerWidget
        actionsOptions={actionsOptions}
        headingText={'Recipe'}
        onClose={onDrawerCloseIconClick}
        position="right"
        showDivider={true}
      >
        {Boolean(mockRecipe.length) && (
          <RecipeStepsTable recipeSteps={mockRecipe} Container={RecipeStepsPanelTableContainer} />
        )}
      </InlayDrawerWidget>
    </>
  );
}
