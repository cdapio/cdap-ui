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
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { GithubApi } from 'api/github';
import ConnectionModal from 'components/Github/RepoMenu/TestConnection';
import { async } from 'q';
import If from 'components/If';

export default function LongMenu({ onView, onEdit, addRepo, tableData, onDelete }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isConnected, setIsConnected] = React.useState(true);
  const [openConnectionModal, setOpenConnectionModal] = React.useState(false);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleView = () => {
    onView(true);
  };
  const handleEdit = () => {
    onEdit(true);
  };
  const handleConnection = async () => {
    try {
      const response = await GithubApi.testGithubConnection({
        repo: tableData.nickname,
      }).toPromise();
      setIsConnected(true);
      setOpenConnectionModal(true);
    } catch (e) {
      setIsConnected(false);
      setOpenConnectionModal(true);
    }
  };

  const handleConnectionModal = (openConnectionModal) => {
    setOpenConnectionModal(openConnectionModal);
  };
  const handleDelete = async () => {
    const deleteContent = {
      nickname: '',
      url: '',
      defaultBranch: '',
      authString: '',
    };
    await GithubApi.deleteGithubCredentials({ repo: tableData.nickname });
    onDelete({});
    addRepo(false);
  };

  return (
    <div>
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu id="long-menu" anchorEl={anchorEl} keepMounted open={open} onClose={handleClose}>
        <MenuItem key="view" onClick={handleView}>
          View
        </MenuItem>
        <MenuItem key="edit" onClick={handleEdit}>
          Edit
        </MenuItem>
        <MenuItem key="delete" onClick={handleDelete}>
          Delete
        </MenuItem>
        <MenuItem key="testConnection" onClick={handleConnection}>
          Test Connection
        </MenuItem>
      </Menu>
      <If condition={openConnectionModal}>
        <ConnectionModal
          openConnectionModal={openConnectionModal}
          handleConnection={handleConnectionModal}
          isConnected={isConnected}
        ></ConnectionModal>
      </If>
    </div>
  );
}
