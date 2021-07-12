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
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import If from 'components/If';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';

const useStyles = makeStyles({
  table: {
    minWidth: 200,
  },
});

export default function ViewRepoTable({ tableData, openTable, onView }) {
  const classes = useStyles();

  const values = [
    { id: 'nickname', label: 'Repository Nickname' },
    { id: 'url', label: 'Repository URL' },
    { id: 'defaultBranch', label: 'Default Branch' },
    { id: 'authString', label: 'Authorization Token' },
  ];

  function handleClose() {
    onView(false);
  }
  return (
    <If condition={openTable}>
      <Dialog open={openTable} onClose={handleClose} aria-labelledby="form-dialog-title">
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableBody>
              {values.map((items) => (
                <TableRow key={items.id}>
                  <TableCell>{items.label}</TableCell>
                  <TableCell>{items.id == 'authString' ? '****' : tableData[items.id]}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button onClick={handleClose}>Cancel</Button>
        </TableContainer>
      </Dialog>
    </If>
  );
}
