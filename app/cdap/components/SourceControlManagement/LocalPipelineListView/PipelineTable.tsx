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
import { Checkbox, Table, TableBody, TableCell, TableRow, TableHead } from '@material-ui/core';
import { setSelectedPipelines } from '../store/ActionCreator';
import { IRepositoryPipeline } from '../types';
import T from 'i18n-react';
import StatusButton from 'components/StatusButton';
import { SUPPORT } from 'components/StatusButton/constants';
import { StyledTableCell, StyledTableRow, TableBox, StatusCell } from '../styles';

const PREFIX = 'features.SourceControlManagement.table';

interface IRepositoryPipelineTableProps {
  localPipelines: IRepositoryPipeline[];
  selectedPipelines: string[];
  showFailedOnly: boolean;
  enableMultipleSelection?: boolean;
}

export const LocalPipelineTable = ({
  localPipelines,
  selectedPipelines,
  showFailedOnly,
  enableMultipleSelection = false,
}: IRepositoryPipelineTableProps) => {
  const isSelected = (name: string) => selectedPipelines.indexOf(name) !== -1;

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const allSelected = localPipelines.map((pipeline) => pipeline.name);
      setSelectedPipelines(allSelected);
      return;
    }
    setSelectedPipelines([]);
  };

  const handleClick = (event: React.MouseEvent, name: string) => {
    if (enableMultipleSelection) {
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

  return (
    <TableBox>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              {enableMultipleSelection && (
                <Checkbox
                  color="primary"
                  indeterminate={
                    selectedPipelines.length > 0 && selectedPipelines.length < localPipelines.length
                  }
                  checked={selectedPipelines.length === localPipelines.length}
                  onChange={handleSelectAllClick}
                />
              )}
            </TableCell>
            <TableCell></TableCell>
            <StyledTableCell>{T.translate(`${PREFIX}.pipelineName`)}</StyledTableCell>
            <StyledTableCell>{T.translate(`${PREFIX}.gitStatus`)}</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {localPipelines.map((pipeline: IRepositoryPipeline) => {
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
              >
                <TableCell padding="checkbox">
                  <Checkbox color="primary" checked={isPipelineSelected} />
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
                <StyledTableCell>
                  {pipeline.fileHash ? T.translate(`${PREFIX}.connected`) : '--'}
                </StyledTableCell>
              </StyledTableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableBox>
  );
};
