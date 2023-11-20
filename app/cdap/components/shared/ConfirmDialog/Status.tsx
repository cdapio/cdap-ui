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

import React, { ReactNode, useState } from 'react';

import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import T from 'i18n-react';
import IconButton from '@material-ui/core/IconButton';
import { StyledBox, StyledAlert, CopyContentBox } from './styles';
import { copyToClipBoard } from 'services/Clipboard';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import { IExtendedMessage, SeverityType } from './index';

interface IStatusProps {
  severity?: SeverityType;
  statusMessage?: string | ReactNode;
  extendedMessage?: IExtendedMessage | string;
  copyableExtendedMessage?: string | ReactNode;
  isExpandedDefault?: boolean;
}

export const Status = ({
  severity,
  statusMessage,
  extendedMessage,
  copyableExtendedMessage,
  isExpandedDefault,
}: IStatusProps) => {
  const [isExpanded, setIsExpanded] = useState(isExpandedDefault);

  const handleToggleExtendedMessage = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <StyledAlert severity={severity}>
      {statusMessage}
      {(extendedMessage || copyableExtendedMessage) && (
        <>
          <IconButton
            size="small"
            onClick={handleToggleExtendedMessage}
            color="inherit"
            title={
              isExpanded
                ? T.translate('commons.hideDetails').toString()
                : T.translate('commons.showDetails').toString()
            }
          >
            {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
          {isExpanded && (
            <StyledBox>
              {typeof extendedMessage === 'string' ? (
                <div dangerouslySetInnerHTML={{ __html: extendedMessage.toString() }}></div>
              ) : (
                <pre>{extendedMessage.response}</pre>
              )}
              {copyableExtendedMessage && (
                <CopyContentBox>
                  <IconButton
                    onClick={() => copyToClipBoard(copyableExtendedMessage)}
                    size="small"
                    style={{ float: 'right' }}
                    title={T.translate('commons.copyToClipboard').toString()}
                  >
                    <FileCopyOutlinedIcon />
                  </IconButton>
                  <pre>{copyableExtendedMessage}</pre>
                </CopyContentBox>
              )}
            </StyledBox>
          )}
        </>
      )}
    </StyledAlert>
  );
};
