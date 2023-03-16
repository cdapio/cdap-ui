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
import T from 'i18n-react';
import { Checkbox, Table, TableBody, TableCell, TableRow, TableHead } from '@material-ui/core';
import { setSelectedRemotePipelines } from '../store/ActionCreator';
import { IRepositoryPipeline } from '../types';
import StatusButton from 'components/StatusButton';
import { SUPPORT } from 'components/StatusButton/constants';
import { StyledTableCell, StyledTableRow, TableBox } from '../styles';

const PREFIX = 'features.SourceControlManagement.table';

interface IRepositoryPipelineTableProps {
  remotePipelines: IRepositoryPipeline[];
  selectedPipelines: string[];
  showFailedOnly: boolean;
}

export const RemotePipelineTable = ({
  remotePipelines,
  selectedPipelines,
  showFailedOnly,
}: IRepositoryPipelineTableProps) => {
  const isSelected = (name: string) => selectedPipelines.indexOf(name) !== -1;

  const handleClick = (event: React.MouseEvent, name: string) => {
    // currently only 1 application pull at a time is allowed, so single selection
    const selectedIndex = selectedPipelines.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = [name];
    }
    setSelectedRemotePipelines(newSelected);
  };

  return (
    <TableBox>
      <Table data-testid="remote-pipelines-table" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox"></TableCell>
            <TableCell></TableCell>
            <StyledTableCell>{T.translate(`${PREFIX}.pipelineName`)}</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {remotePipelines.map((pipeline: IRepositoryPipeline) => {
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
              >
                <TableCell padding="checkbox">
                  <Checkbox color="primary" checked={isPipelineSelected} />
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
              </StyledTableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableBox>
  );
};
