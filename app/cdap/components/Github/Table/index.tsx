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
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import LongMenu from 'components/Github/RepoMenu';
import If from 'components/If';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

export default function RepoDataTable({ tableData, onView, onEdit, onSubmit, addRepo, onDelete }) {
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Type</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <If condition={tableData.nickname}>
            <TableRow>
              <TableCell>{tableData.nickname}</TableCell>
              <TableCell align="right">Github</TableCell>
              <TableCell align="right">
                <LongMenu
                  onView={onView}
                  onEdit={onEdit}
                  addRepo={addRepo}
                  tableData={tableData}
                  onDelete={onDelete}
                ></LongMenu>
              </TableCell>
            </TableRow>
          </If>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
