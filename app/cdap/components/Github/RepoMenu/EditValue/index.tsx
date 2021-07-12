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
import ErrorModal from 'components/Github/NewRepoButton/ErrorOnSubmit';
import DialogTitle from '@material-ui/core/DialogTitle';
import { GithubApi } from 'api/github';
import { async } from 'q';
import If from 'components/If';

export default function EditContents({ onSubmit, editTableOn, tableData, onEdit }) {
  const [contents, setContents] = React.useState({ ...tableData });
  const [errorMessage, setErrorMessage] = React.useState(false);

  const values = [
    { id: 'nickname', label: 'Repository Nickname' },
    { id: 'url', label: 'Repository URL' },
    { id: 'defaultBranch', label: 'Default Branch' },
    { id: 'authString', label: 'Authorization Token' },
  ];

  const handleClose = () => {
    onEdit(false);
    const updateContents = {
      nickname: '',
      url: '',
      defaultBranch: '',
      authString: '',
    };
    setContents(updateContents);
  };

  const handleError = (errorMessage) => {
    setErrorMessage(errorMessage);
  };

  const handleSubmit = async () => {
    try {
      const response = await GithubApi.updateGithubCredentials(
        { repo: contents.nickname },
        contents
      ).toPromise();
      onEdit(false);
      onSubmit(contents);
    } catch (e) {
      setErrorMessage(true);
    }
  };

  function handleChange(event) {
    const updateContents = { ...contents };
    const id = event.target.id;
    updateContents[id] = event.target.value;
    setContents(updateContents);
  }

  return (
    <div>
      <Dialog open={editTableOn} onClose={handleClose} aria-labelledby="form-dialog-title">
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
              defaultValue={items.id == 'authString' ? '****' : contents[items.id]}
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
          <Button onClick={contents.valueOf() ? handleSubmit : null} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <If condition={errorMessage}>
        <ErrorModal openErrorModal={errorMessage} handleError={handleError}></ErrorModal>
      </If>
    </div>
  );
}
