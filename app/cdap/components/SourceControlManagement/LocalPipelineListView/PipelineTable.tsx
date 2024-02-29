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
import InfoIcon from '@material-ui/icons/Info';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import { setSelectedPipelines } from '../store/ActionCreator';
import { IRepositoryPipeline, TSyncStatusFilter } from '../types';
import T from 'i18n-react';
import StatusButton from 'components/StatusButton';
import { SUPPORT } from 'components/StatusButton/constants';
import {
  StyledTableCell,
  StyledTableRow,
  TableBox,
  StatusCell,
  StyledFixedWidthCell,
  StyledPopover,
  SyncStatusWrapper,
} from '../styles';
import { timeInstantToString } from 'services/DataFormatter';
import { compareSyncStatus, filterOnSyncStatus, stableSort } from '../helpers';
import LoadingSVG from 'components/shared/LoadingSVG';
import { green, red } from '@material-ui/core/colors';

const PREFIX = 'features.SourceControlManagement.table';

interface IRepositoryPipelineTableProps {
  localPipelines: IRepositoryPipeline[];
  selectedPipelines: string[];
  showFailedOnly: boolean;
  multiPushEnabled?: boolean;
  disabled?: boolean;
  syncStatusFilter?: TSyncStatusFilter;
  lastOperationInfoShown?: boolean;
}

export const LocalPipelineTable = ({
  localPipelines,
  selectedPipelines,
  showFailedOnly,
  multiPushEnabled = false,
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

  const filteredPipelines = filterOnSyncStatus(localPipelines, syncStatusFilter);
  const displayedPipelines = stableSort(filteredPipelines, syncStatusComparator).slice(
    page * rowsPerPage,
    (page + 1) * rowsPerPage
  );
  const displayedPipelineNames = displayedPipelines.map((pipeline) => pipeline.name);

  const selectedPipelinesSet = new Set(selectedPipelines);
  const isAllDisplayedPipelinesSelected = displayedPipelineNames.reduce((acc, pipelineName) => {
    return acc && selectedPipelinesSet.has(pipelineName);
  }, true);

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) {
      return;
    }

    if (event.target.checked) {
      setSelectedPipelines(displayedPipelineNames);
      return;
    }
    setSelectedPipelines([]);
  };

  const handleClick = (event: React.MouseEvent, name: string) => {
    if (disabled) {
      return;
    }

    if (multiPushEnabled) {
      handleMultipleSelection(name);
      return;
    }
    handleSingleSelection(name);
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
    setSelectedPipelines(newSelected);
  };

  const handleSingleSelection = (name: string) => {
    const selectedIndex = selectedPipelines.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = [name];
    }
    setSelectedPipelines(newSelected);
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
      <Table stickyHeader data-testid="local-pipelines-table" size="small">
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              {multiPushEnabled && (
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
            <StyledTableCell>{T.translate(`${PREFIX}.lastSyncDate`)}</StyledTableCell>
            {multiPushEnabled && (
              <StyledFixedWidthCell>
                <TableSortLabel active={true} direction={sortOrder} onClick={handleSort}>
                  {T.translate(`${PREFIX}.gitSyncStatus`)}
                </TableSortLabel>
              </StyledFixedWidthCell>
            )}
            {!multiPushEnabled && (
              <StyledFixedWidthCell>
                <div>
                  {T.translate(`${PREFIX}.gitStatus`)}
                  <StyledPopover target={() => <InfoIcon />} showOn="Hover">
                    {T.translate(`${PREFIX}.gitStatusHelperText`)}
                  </StyledPopover>
                </div>
              </StyledFixedWidthCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {displayedPipelines.map((pipeline: IRepositoryPipeline) => {
            if (showFailedOnly && !pipeline.error) {
              // only render pipelines that failed to push
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
                data-testid={`local-${pipeline.name}`}
                disabled={disabled}
              >
                <TableCell padding="checkbox">
                  <Checkbox color="primary" checked={isPipelineSelected} disabled={disabled} />
                </TableCell>
                <StatusCell
                  data-testid={
                    pipeline.status === SUPPORT.yes ? 'push-success-status' : 'push-failure-status'
                  }
                >
                  {pipeline.status !== null && (
                    <StatusButton
                      status={pipeline.status}
                      message={pipeline.status === SUPPORT.yes ? null : pipeline.error}
                      title={
                        pipeline.status === SUPPORT.yes
                          ? T.translate(`${PREFIX}.pushSuccess`, {
                              pipelineName: pipeline.name,
                            }).toLocaleString()
                          : T.translate(`${PREFIX}.pushFail`).toLocaleString()
                      }
                    />
                  )}
                </StatusCell>
                <StyledTableCell>{pipeline.name}</StyledTableCell>
                <StyledTableCell>{timeInstantToString(pipeline.lastSyncDate)}</StyledTableCell>
                {multiPushEnabled && (
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
                {!multiPushEnabled && (
                  <StyledFixedWidthCell>
                    {pipeline.fileHash ? T.translate(`${PREFIX}.connected`) : '--'}
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
