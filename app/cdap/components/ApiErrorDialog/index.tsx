/*
 * Copyright © 2021 Cask Data, Inc.
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

import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import T from 'i18n-react';

const I18N_PREFIX = 'features.ApiError.CmekError';

const ErrorMsg = styled(DialogContent)`
  font-size: 1.1rem;
`;

const Suggestion = styled(Button)`
  font-size: 1.1rem !important;
`;

const ApiErrorDialog: React.FC = () => {
  function redirect() {
    window.open('https://cloud.google.com/data-fusion/docs/support/troubleshooting', '_blank');
  }

  return (
    <Dialog open={true}>
      <DialogTitle>{T.translate(`${I18N_PREFIX}.mainTitle`)}</DialogTitle>
      <ErrorMsg>{T.translate(`${I18N_PREFIX}.secondaryTitle`)}</ErrorMsg>
      <DialogActions>
        <Suggestion onClick={redirect} color="primary">
          {T.translate(`${I18N_PREFIX}.suggestionPart1`)}
          &nbsp;{T.translate(`${I18N_PREFIX}.suggestionPart2`)}&nbsp;
          {T.translate(`${I18N_PREFIX}.suggestionPart3`)}
        </Suggestion>
      </DialogActions>
    </Dialog>
  );
};

export default ApiErrorDialog;
