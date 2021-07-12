/*
 * Copyright © 2016 Cask Data, Inc.
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

import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { GithubApi } from 'api/github';
import { async } from 'q';
import ErrorModal from 'components/PipelineList/CheckoutPipeline/ErrorOnSubmit';
import If from 'components/If';
import { MyPipelineApi } from 'api/pipeline';

export default function CheckInPipelineModal({ getNamespace, pipeline, open, openModal }) {
  const [hasError, setHasError] = React.useState(false);
  const [contents, setContents] = React.useState({
    nickname: '',
    branch: '',
    path: '',
    message: '',
    content: '',
  });

  const values = [
    { id: 'nickname', label: 'Name of Repository' },
    { id: 'branch', label: 'Name of Branch' },
    { id: 'path', label: 'Path of Repository' },
    { id: 'message', label: 'Commit Message' },
  ];

  const handleClose = () => {
    openModal();
    const updateContents = {
      nickname: '',
      branch: '',
      path: '',
      message: '',
      content: '',
    };
    setContents(updateContents);
  };

  const handleSubmit = async () => {
    const namespace = getNamespace();
    const pipelineJson = await MyPipelineApi.get({ namespace, appId: pipeline.name }).toPromise();
    const updateContentsJson = { ...contents };
    updateContentsJson.content = pipelineJson;
    setContents(updateContentsJson);
    const removeContents = {
      nickname: '',
      branch: '',
      path: '',
      message: '',
      content: '',
    };
    const parsedContents = (({ branch, path, message, content }) => ({
      branch,
      path,
      message,
      content,
    }))(updateContentsJson);

    try {
      await GithubApi.checkInPipeline({ repo: updateContentsJson.nickname }, parsedContents);
      openModal();
      setContents(removeContents);
    } catch (e) {
      setHasError(true);
    }
  };

  const handleError = (hasError) => {
    setHasError(hasError);
  };

  function handleChange(event) {
    const updateContents = { ...contents };
    const id = event.target.id;
    updateContents[id] = event.target.value;
    setContents(updateContents);
  }

  return (
    <div>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">CheckIn</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To checkin your pipeline. Enter your Github Repository Name(nickname), the Repository
            Branch, the Repository Path, and a Commit Message in the text boxes below.
          </DialogContentText>
          {values.map((items) => (
            <TextField
              onChange={handleChange}
              autoFocus
              margin="dense"
              id={items.id}
              label={items.label}
              type={items.id}
              key={items.id}
              fullWidth
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <If condition={hasError}>
        <ErrorModal openErrorModal={hasError} handleError={handleError}></ErrorModal>
      </If>
    </div>
  );
}
