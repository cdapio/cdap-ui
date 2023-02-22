import React from 'react';

import { useSelector } from 'react-redux';
import styled from 'styled-components';

import NoRecordScreen from 'components/NoRecordScreen';
import { ISnackbar } from 'components/Snackbar';
import InlayDrawerWidget, { IMenuItem } from 'components/WranglerV2/InlayDrawerWidget';
import RecipeStepsTable, {
  RecipeStepsTableContainer,
} from 'components/WranglerV2/RecipeStepsTable';

interface IRecipeStepsPanelProps {
  onDrawerCloseIconClick: () => void;
  setSnackbar: (value: ISnackbar) => void;
}

const RecipeStepsPanelTableContainer = styled(RecipeStepsTableContainer)`
  &&& {
    max-height: calc(100vh - 361px);
  }
`;

export default function RecipeStepsPanel({
  onDrawerCloseIconClick,
  setSnackbar,
}: IRecipeStepsPanelProps) {
  const directives = useSelector((state) => state.dataprep.directives);

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
    <InlayDrawerWidget
      actionsOptions={actionsOptions}
      headingText={'Recipe'}
      onClose={onDrawerCloseIconClick}
      position="right"
      showDivider={true}
    >
      {Boolean(directives.length) && (
        <RecipeStepsTable
          recipeSteps={directives}
          Container={RecipeStepsPanelTableContainer}
          setSnackbar={setSnackbar}
        />
      )}
      {!Boolean(directives.length) && (
        <NoRecordScreen
          title="Start Wrangling your data"
          subtitle="Select a column or function to add your first recipe step"
        />
      )}
    </InlayDrawerWidget>
  );
}
