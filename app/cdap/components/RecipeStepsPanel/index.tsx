import InlayDrawerWidget, { IMenuItem } from 'components/WranglerV2/InlayDrawerWidget';
import React from 'react';

export default function RecipeStepsPanel() {
  const onSaveButtonClick = () => {
    // do nothing
  };

  const onApplyButtonClick = () => {
    // do nothing
  };

  const onDownloadButtonClick = () => {
    // do nothing
  };

  const handleDrawerCloseIconClick = () => {
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
        onClose={handleDrawerCloseIconClick}
        position="right"
        showDivider={true}
        disableActionsButton={true}
      />
    </>
  );
}
