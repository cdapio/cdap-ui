import React from 'react';
import { cleanup, fireEvent, render } from '@testing-library/react';
import InlayDrawerWidget from 'components/common/InlayDrawerWidget';
import { IActionsOptions } from 'components/common/InlayDrawerWidget/Menu';
import grey from '@material-ui/core/colors/grey';

const handleDrawerCloseIconClick = jest.fn();
const onSaveButtonClick = jest.fn();
const onApplyButtonClick = jest.fn();
const onDownloadClick = jest.fn();

const actionsOptions: IActionsOptions[] = [
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
    clickHandler: onDownloadClick,
  },
];

let container;

beforeEach(() => {
  container = render(
    <InlayDrawerWidget
      headingText={'Inlay Drawer'}
      onClose={handleDrawerCloseIconClick}
      showDivider={true}
      position={'left'}
      actionsOptions={actionsOptions}
    >
      <div>Child Component</div>
    </InlayDrawerWidget>
  );
});

describe('Test Inlay Drawer Component', () => {
  test('Should trigger onSaveButtonClick function', () => {
    const menuButton = container.getByRole('button', { name: /actions/i });
    fireEvent.click(menuButton);

    const saveButton = container.getByRole('menuitem', { name: /save/i });
    fireEvent.click(saveButton);

    expect(onSaveButtonClick).toHaveBeenCalled();
  });

  test('Should trigger onApplyButtonClick function', () => {
    const menuButton = container.getByRole('button', { name: /actions/i });
    fireEvent.click(menuButton);

    const applyButton = container.getByRole('menuitem', { name: /apply/i });
    fireEvent.click(applyButton);

    expect(onApplyButtonClick).toHaveBeenCalled();
  });

  test('Should trigger onDownloadClick function', () => {
    const menuButton = container.getByRole('button', { name: /actions/i });
    fireEvent.click(menuButton);

    const downloadButton = container.getByRole('menuitem', { name: /download/i });
    fireEvent.click(downloadButton);

    expect(onDownloadClick).toHaveBeenCalled();
  });
});

afterEach(() => {
  cleanup();
});
