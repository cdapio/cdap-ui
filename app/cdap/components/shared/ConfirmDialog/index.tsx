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
import isObject from 'lodash/isObject';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

import IconButton from '@material-ui/core/IconButton';
import { StyledBox, StyledDialog, StyledAlert, CopyContentBox } from './styles';
import PrimaryTextButton from 'components/shared/Buttons/PrimaryTextButton';
import { copyToClipBoard } from 'services/Clipboard';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';

export enum SeverityType {
  SUCCESS = 'success',
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
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
  extendedMessage?: { response: string };
  disableAction?: boolean;
  copyableExtendedMessage?: string | ReactNode;
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
}: IConfirmDialogProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setIsExpanded(false);
  }, [statusMessage]);

  const showStatusMessage = () => {
    if (statusMessage) {
      return (
        <StyledAlert severity={severity}>
          {statusMessage}
          {getExtendedMessage()}
        </StyledAlert>
      );
    }
  };

  const handleToggleExtendedMessage = () => {
    setIsExpanded(!isExpanded);
  };

  const getExtendedMessage = () => {
    if (extendedMessage || copyableExtendedMessage) {
      return (
        <>
          <IconButton
            size="small"
            onClick={handleToggleExtendedMessage}
            color="inherit"
            title={isExpanded ? 'Hide details' : 'Show details'}
          >
            {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
          {isExpanded && (
            <StyledBox>
              {isObject(extendedMessage) ? (
                <pre>{extendedMessage.response}</pre>
              ) : (
                <div>{extendedMessage}</div>
              )}
              {copyableExtendedMessage && (
                <CopyContentBox>
                  <IconButton
                    onClick={() => copyToClipBoard(copyableExtendedMessage)}
                    size="small"
                    style={{ float: 'right' }}
                    title="Copy to clipboard"
                  >
                    <FileCopyOutlinedIcon />
                  </IconButton>
                  <pre>{copyableExtendedMessage}</pre>
                </CopyContentBox>
              )}
            </StyledBox>
          )}
        </>
      );
    }
  };

  return (
    <StyledDialog open={isOpen} fullWidth>
      <DialogTitle>{headerTitle}</DialogTitle>
      {showStatusMessage()}
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
