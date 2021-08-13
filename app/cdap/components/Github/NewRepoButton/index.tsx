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
import uuidV4 from 'uuid/v4';
import { GithubApi } from 'api/github';
import { async } from 'q';
import ErrorModal from 'components/Github/NewRepoButton/ErrorOnSubmit';
import If from 'components/If';

export default function AddNewRepoModal({ onSubmit, addRepo, addedRepo }) {
  const [open, setOpen] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);
  const [contents, setContents] = React.useState({
    nickname: '',
    url: '',
    defaultBranch: '',
    authString: '',
  });

  const values = [
    { id: 'nickname', label: 'Repository Nickname' },
    { id: 'url', label: 'Repository URL' },
    { id: 'defaultBranch', label: 'Default Branch' },
    { id: 'authString', label: 'Authorization Token' },
  ];

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    const updateContents = {
      nickname: '',
      url: '',
      defaultBranch: '',
      authString: '',
    };
    setContents(updateContents);
  };

  const handleSubmit = async () => {
    const updateContents = {
      nickname: '',
      url: '',
      defaultBranch: '',
      authString: '',
    };

    try {
      const response = await GithubApi.updateGithubCredentials(
        { repo: contents.nickname },
        contents
      ).toPromise();
      setOpen(false);
      addRepo(true);
      onSubmit(contents);
      setContents(updateContents);
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
      {addedRepo ? (
        undefined
      ) : (
        <Button variant="outlined" color="primary" onClick={handleClickOpen}>
          Add New Repository
        </Button>
      )}
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To access your Github repository. Enter your Github Repository Name(nickname), Default
            Branch, Repository URL, and Authorization Token in the text boxes below.
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
