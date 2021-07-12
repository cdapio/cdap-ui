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

import React, { useState } from 'react';
import AddNewRepoModal from 'components/Github/NewRepoButton';
import RepoDataTable from 'components/Github/Table';
import ViewRepoTable from './RepoMenu/ViewTable';
import EditContents from 'components/Github/RepoMenu/EditValue';
import If from 'components/If';
import { async } from 'q';

function Github() {
  const [showTable, setShowTable] = useState(false);
  const [content, setContent] = useState({});
  const [edit, setEdit] = useState(false);
  const [addedRepo, setAddedRepo] = useState(false);

  const onView = (showTable) => {
    setShowTable(showTable);
  };

  const onEdit = (edit) => {
    setEdit(edit);
  };

  const onSubmit = (content) => {
    setContent(content);
  };

  const onDelete = (content) => {
    setContent(content);
  };

  const addRepo = (addedRepo) => {
    setAddedRepo(addedRepo);
  };

  return (
    <div>
      <div>
        <AddNewRepoModal
          onSubmit={onSubmit}
          addRepo={addRepo}
          addedRepo={addedRepo}
        ></AddNewRepoModal>
      </div>
      <div>
        <RepoDataTable
          tableData={content}
          onView={onView}
          onEdit={onEdit}
          onSubmit={onSubmit}
          addRepo={addRepo}
          onDelete={onDelete}
        ></RepoDataTable>
      </div>
      <div>
        <ViewRepoTable tableData={content} openTable={showTable} onView={onView}></ViewRepoTable>
      </div>
      <div>
        <If condition={edit}>
          <EditContents
            tableData={content}
            onSubmit={onSubmit}
            editTableOn={edit}
            onEdit={onEdit}
          ></EditContents>
        </If>
      </div>
    </div>
  );
}

export default Github;
