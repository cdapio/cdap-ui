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

import React from 'react';
import { styled } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import Box from '@material-ui/core/Box';

export const StyledTableContainer = styled(TableContainer)({
  padding: '0 3px',
  borderRadius: '4px',
  'box-shadow':
    '0px 1px 5px 0px rgba(0, 0, 0, 0.12), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 1px 0px rgba(0, 0, 0, 0.20)',
});

export const SubtitleSection = styled(Box)({
  marginBottom: '15px',
});

export const StyledTable = styled(Table)({
  '& .MuiTableCell-root': {
    fontSize: '12px',
    height: '48px',
    '&:last-child': {
      textAlign: 'center',
    },
  },
  '& .MuiTableCell-head': {
    color: '#757575',
    fontWeight: '700',
  },
  '& .MuiTableBody-root tr.MuiTableRow-root:last-child td': {
    border: 'none',
  },
});
