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

import styled from 'styled-components';
import { TableCell, TableRow, TableContainer, Table } from '@material-ui/core';
import Popover from 'components/shared/Popover';

export const TableBox = styled(TableContainer)`
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 20%);
  margin-top: 10px;
  margin-bottom: 30px;
  max-height: calc(80vh - 200px);
  min-height: calc(80vh - 300px);
`;

export const StyledTableCell = styled(TableCell)`
  font-size: 14px;
`;

export const StyledFixedWidthCell = styled(StyledTableCell)`
  width: 200px;
  div {
    display: flex;
  }
`;

export const StyledPopover = styled(Popover)`
  margin-left: 10px;
`;

export const StyledTableRow = styled(TableRow)`
  .MuiTableCell-body {
    ${(props) => (props.disabled ? `color: ${props.theme.palette.grey[300]};` : '')}
  }

  &&.Mui-selected {
    background-color: ${(props) => props.theme.palette.blue[500]};
  }
`;

export const PipelineListContainer = styled.div`
  height: calc(100% - 150px);
  margin: 5px 10px;
`;

export const StyledTable = styled(Table)`
  min-height: 400px;
`;

export const StatusCell = styled(TableCell)`
  width: 40px;
`;

export const StyledSelectionStatusDiv = styled.div`
  display: flex;
  text-align: center;
  margin: 10px 2px;

  div {
    margin-right: 10px;
    padding-top: 4px;
  }
`;

export const FailStatusDiv = styled.div`
  color: #d15668;
`;

export const AlertErrorView = styled.p`
  margin: 1rem 0;
`;
