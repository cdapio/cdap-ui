/*
 * Copyright © 2023 Cask Data, Inc.
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

import React, { ReactElement, ReactNode, useEffect, useState } from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import { StyledDialog } from './styles';
import PrimaryTextButton from 'components/shared/Buttons/PrimaryTextButton';
import { Status } from './Status';

export enum SeverityType {
  SUCCESS = 'success',
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
}

export interface IExtendedMessage {
  response: string;
}

interface IConfirmDialogProps {
  headerTitle: string | ReactNode;
  isOpen: boolean;
  cancelButtonText: string | ReactNode;
  cancelFn: (arg0: any) => void;
  confirmButtonText: string | ReactNode;
  confirmFn: (arg0: any) => void;
  confirmationElem?: string | ReactNode | ReactElement;
  confirmationText?: string | ReactNode;
  severity?: SeverityType;
  statusMessage?: string | ReactNode;
  extendedMessage?: IExtendedMessage | string;
  disableAction?: boolean;
  copyableExtendedMessage?: string | ReactNode;
  isExpandedDefault?: boolean;
}

export const ConfirmDialog = ({
  headerTitle,
  isOpen,
  cancelButtonText,
  cancelFn,
  confirmButtonText,
  confirmFn,
  confirmationElem,
  confirmationText,
  severity,
  statusMessage,
  extendedMessage,
  disableAction,
  copyableExtendedMessage,
  isExpandedDefault,
}: IConfirmDialogProps) => {
  return (
    <StyledDialog open={isOpen} fullWidth>
      <DialogTitle>{headerTitle}</DialogTitle>
      {statusMessage && (
        <Status
          severity={severity}
          statusMessage={statusMessage}
          extendedMessage={extendedMessage}
          copyableExtendedMessage={copyableExtendedMessage}
          key={statusMessage.toString()}
          isExpandedDefault={isExpandedDefault}
        ></Status>
      )}
      <DialogContent>
        {confirmationText}
        {confirmationElem}
      </DialogContent>
      <DialogActions>
        <PrimaryTextButton onClick={cancelFn} data-testid={cancelButtonText}>
          {cancelButtonText}
        </PrimaryTextButton>
        <PrimaryTextButton
          onClick={confirmFn}
          disabled={disableAction}
          data-testid={confirmButtonText}
        >
          {confirmButtonText}
        </PrimaryTextButton>
      </DialogActions>
    </StyledDialog>
  );
};
