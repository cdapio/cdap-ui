import React from 'react';

import styled from 'styled-components';

import DataPrepStore from 'components/DataPrep/store';
import InlayDrawerWidget, { IMenuItem } from 'components/WranglerV2/InlayDrawerWidget';
import RecipeStepsTable, {
  RecipeStepsTableContainer,
} from 'components/WranglerV2/RecipeStepsTable';

interface IRecipeStepsPanelProps {
  onDrawerCloseIconClick: () => void;
}

const RecipeStepsPanelTableContainer = styled(RecipeStepsTableContainer)`
  &&& {
    max-height: calc(100vh - 361px);
  }
`;

export default function RecipeStepsPanel({ onDrawerCloseIconClick }: IRecipeStepsPanelProps) {
  const { dataprep } = DataPrepStore.getState();

  const recipeSteps = dataprep.directives;

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
        {Boolean(recipeSteps.length) && (
          <RecipeStepsTable recipeSteps={recipeSteps} Container={RecipeStepsPanelTableContainer} />
        )}
      </InlayDrawerWidget>
    </>
  );
}
