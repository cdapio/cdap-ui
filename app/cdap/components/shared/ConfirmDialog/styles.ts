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

import styled from 'styled-components';
import Dialog from '@material-ui/core/Dialog';
import Alert from '@material-ui/lab/Alert';
import Box from '@material-ui/core/Box';

export const StyledDialog = styled(Dialog)`
  & .MuiDialogTitle-root {
    h2 {
      font-size: 24px;
    }
  }
  & .MuiDialogActions-root {
    margin-right: 16px;
    & .MuiButton-label {
      font-size: 13px;
    }
  }
`;

export const StyledAlert = styled(Alert)`
  font-size: 12px;
  margin-bottom: 8px;
`;

export const StyledBox = styled(Box)`
  overflow-y: auto;
  max-height: 14vh;
  word-break: break-all;

  & pre {
    word-break: break-word;
    margin-bottom: 0;
    white-space: pre-wrap;
    color: inherit;
    border: 0;
    border-radius: 0;
    padding: 0px 8px;
  }
`;

export const CopyContentBox = styled(Box)`
  background-color: #f1f3f4;
  border-radius: 3px;
  padding: 0.5rem;
  margin-top: 0.5rem;
`;
