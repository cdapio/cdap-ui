import InlayDrawerWidget, { IMenuItem } from 'components/WranglerV2/InlayDrawerWidget';
import React from 'react';

interface IRecipeStepsPanelProps {
  onDrawerCloseIconClick: () => void;
}

export default function RecipeStepsPanel({ onDrawerCloseIconClick }) {
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
        headingText={'Header Text'}
        onClose={onDrawerCloseIconClick}
        position="right"
        showDivider={true}
      />
    </>
  );
}
