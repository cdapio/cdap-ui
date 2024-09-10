/*
 * Copyright © 2024 Cask Data, Inc.
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

import { Button, DialogActions, DialogTitle } from '@material-ui/core';
import T from 'i18n-react';
import React from 'react';
import { useDispatch } from 'react-redux';

const PREFIX = 'features.Studio.modals.unsavedPipelineConfirmation';

export default function DirtyStateConfirmationModal({
  onClose,
}) {
  const dispatch = useDispatch();

  function handleSave() {
    // save pipeline draft
    onClose(true);
  }

  function handleCloseNoSave() {
    onClose(true);
  }

  function handleCancel() {
    onClose(false);
  }

  return (
    <>
      <DialogTitle id="alert-dialog-title">{T.translate(`${PREFIX}.text`)}</DialogTitle>
      <DialogActions>
        <Button onClick={handleCloseNoSave} color="primary">
        {T.translate(`${PREFIX}.dontSaveButton`)}
        </Button>
        <Button onClick={handleCancel} color="primary" autoFocus>
          {T.translate(`${PREFIX}.cancelButton`)}
        </Button>
        <Button onClick={handleSave} color="primary" autoFocus>
          {T.translate(`${PREFIX}.saveButton`)}
        </Button>
      </DialogActions>
    </>
  );
}
