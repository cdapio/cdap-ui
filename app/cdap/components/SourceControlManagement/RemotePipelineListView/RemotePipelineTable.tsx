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

import React, { useState } from 'react';
import T from 'i18n-react';
import {
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  TableSortLabel,
  TablePagination,
} from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import { setSelectedRemotePipelines } from '../store/ActionCreator';
import { IRepositoryPipeline, TSyncStatusFilter } from '../types';
import StatusButton from 'components/StatusButton';
import { SUPPORT } from 'components/StatusButton/constants';
import {
  StyledFixedWidthCell,
  StyledTableCell,
  StyledTableRow,
  SyncStatusWrapper,
  TableBox,
} from '../styles';
import { compareSyncStatus, filterOnSyncStatus, stableSort } from '../helpers';
import LoadingSVG from 'components/shared/LoadingSVG';
import { green, red } from '@material-ui/core/colors';

const PREFIX = 'features.SourceControlManagement.table';

interface IRepositoryPipelineTableProps {
  remotePipelines: IRepositoryPipeline[];
  selectedPipelines: string[];
  showFailedOnly: boolean;
  multiPullEnabled?: boolean;
  disabled?: boolean;
  syncStatusFilter?: TSyncStatusFilter;
  lastOperationInfoShown?: boolean;
}

export const RemotePipelineTable = ({
  remotePipelines,
  selectedPipelines,
  showFailedOnly,
  multiPullEnabled = false,
  disabled = false,
  syncStatusFilter = 'all',
  lastOperationInfoShown = true,
}: IRepositoryPipelineTableProps) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const isSelected = (name: string) => selectedPipelines.indexOf(name) !== -1;
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const syncStatusComparator = (a: IRepositoryPipeline, b: IRepositoryPipeline) => {
    return sortOrder === 'desc' ? compareSyncStatus(a, b) : -compareSyncStatus(a, b);
  };

  const filteredPipelines = filterOnSyncStatus(remotePipelines, syncStatusFilter);
  const displayedPipelines = stableSort(filteredPipelines, syncStatusComparator).slice(
    page * rowsPerPage,
    (page + 1) * rowsPerPage
  );
  const displayedPipelineNames = displayedPipelines.map((pipeline) => pipeline.name);

  const selectedPipelinesSet = new Set(selectedPipelines);
  const isAllDisplayedPipelinesSelected = displayedPipelineNames.reduce((acc, pipelineName) => {
    return acc && selectedPipelinesSet.has(pipelineName);
  }, true);

  const handleClick = (event: React.MouseEvent, name: string) => {
    if (disabled) {
      return;
    }

    if (multiPullEnabled) {
      handleMultipleSelection(name);
      return;
    }
    handleSingleSelection(name);
  };

  const handleSingleSelection = (name: string) => {
    // currently only 1 application pull at a time is allowed, so single selection
    const selectedIndex = selectedPipelines.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = [name];
    }
    setSelectedRemotePipelines(newSelected);
  };

  const handleMultipleSelection = (name: string) => {
    const selectedIndex = selectedPipelines.indexOf(name);
    const newSelected = [...selectedPipelines];

    if (selectedIndex === -1) {
      // not currently selected
      newSelected.push(name);
    } else {
      newSelected.splice(selectedIndex, 1);
    }
    setSelectedRemotePipelines(newSelected);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) {
      return;
    }

    if (event.target.checked) {
      setSelectedRemotePipelines(displayedPipelineNames);
      return;
    }
    setSelectedRemotePipelines([]);
  };

  const handleSort = () => {
    const isAsc = sortOrder === 'asc';
    setSortOrder(isAsc ? 'desc' : 'asc');
  };

  const handleChangePage = (event, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TableBox lastOperationInfoShown={lastOperationInfoShown}>
      <Table data-testid="remote-pipelines-table" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              {multiPullEnabled && (
                <Checkbox
                  color="primary"
                  indeterminate={selectedPipelines.length > 0 && !isAllDisplayedPipelinesSelected}
                  checked={isAllDisplayedPipelinesSelected}
                  onChange={handleSelectAllClick}
                  disabled={disabled}
                />
              )}
            </TableCell>
            <TableCell></TableCell>
            <StyledTableCell>{T.translate(`${PREFIX}.pipelineName`)}</StyledTableCell>
            {multiPullEnabled && (
              <StyledFixedWidthCell>
                <TableSortLabel active={true} direction={sortOrder} onClick={handleSort}>
                  {T.translate(`${PREFIX}.gitSyncStatus`)}
                </TableSortLabel>
              </StyledFixedWidthCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {displayedPipelines.map((pipeline: IRepositoryPipeline) => {
            if (showFailedOnly && !pipeline.error) {
              // only render pipelines that failed to pull
              return;
            }
            const isPipelineSelected = isSelected(pipeline.name);
            return (
              <StyledTableRow
                hover
                aria-checked={isPipelineSelected}
                key={pipeline.name}
                selected={isPipelineSelected}
                onClick={(e) => handleClick(e, pipeline.name)}
                data-testid={`remote-${pipeline.name}`}
                disabled={disabled}
              >
                <TableCell padding="checkbox">
                  <Checkbox color="primary" checked={isPipelineSelected} disabled={disabled} />
                </TableCell>
                <TableCell
                  style={{ width: '40px' }}
                  data-testid={
                    pipeline.status === SUPPORT.yes ? 'pull-success-status' : 'pull-failure-status'
                  }
                >
                  {pipeline.status !== null && (
                    <StatusButton
                      status={pipeline.status}
                      message={pipeline.status === SUPPORT.yes ? null : pipeline.error}
                      title={
                        pipeline.status === SUPPORT.yes
                          ? T.translate(`${PREFIX}.pullSuccess`, {
                              pipelineName: pipeline.name,
                            }).toLocaleString()
                          : T.translate(`${PREFIX}.pullFail`).toLocaleString()
                      }
                    />
                  )}
                </TableCell>
                <StyledTableCell>{pipeline.name}</StyledTableCell>
                {multiPullEnabled && (
                  <StyledFixedWidthCell>
                    {pipeline.syncStatus === undefined ||
                    pipeline.syncStatus === 'not_available' ? (
                      <SyncStatusWrapper>
                        <LoadingSVG height="18px" />
                        {T.translate(`${PREFIX}.gitSyncStatusFetching`)}
                      </SyncStatusWrapper>
                    ) : pipeline.syncStatus === 'not_connected' ||
                      pipeline.syncStatus === 'out_of_sync' ? (
                      <SyncStatusWrapper>
                        <ErrorIcon style={{ color: red[500] }} />{' '}
                        {T.translate(`${PREFIX}.gitSyncStatusUnsynced`)}
                      </SyncStatusWrapper>
                    ) : (
                      <SyncStatusWrapper>
                        <CheckCircleIcon style={{ color: green[500] }} />
                        {T.translate(`${PREFIX}.gitSyncStatusSynced`)}
                      </SyncStatusWrapper>
                    )}
                  </StyledFixedWidthCell>
                )}
              </StyledTableRow>
            );
          })}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="span"
        count={filteredPipelines.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableBox>
  );
};
