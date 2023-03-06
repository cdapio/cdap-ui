import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import { useShell } from 'components/Shell';

interface IModalContainerProps {
  content?: React.ReactElement<any> | null;
}

export const ModalContainer: React.FC<IModalContainerProps> = ({ content }) => {
  const shellApi = useShell();

  function onModalClose(): void {
    shellApi.dialog.hide();
  }

  if (!content) {
    return null;
  }

  return (
    <Dialog open={shellApi.dialog.isVisible} onClose={onModalClose}>
      {content as React.ReactElement<any>}
    </Dialog>
  );
};
