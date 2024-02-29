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
import styled from 'styled-components';
import T from 'i18n-react';
import { TSyncStatusFilter } from './types';
import { Button, ButtonGroup } from '@material-ui/core';

const PREFIX = 'features.SourceControlManagement.table';

const StyledDiv = styled.div`
  margin: 4px 0px;
  display: flex;
  justify-content: flex-end;
  flex-grow: 1;
  align-items: center;
  gap: 12px;
`;

interface ISyncStatusFiltersProps {
  syncStatusFilter: TSyncStatusFilter;
  setSyncStatusFilter: (syncStatusFilter: TSyncStatusFilter) => void;
}

export const SyncStatusFilters = ({
  syncStatusFilter,
  setSyncStatusFilter,
}: ISyncStatusFiltersProps) => {
  const setFilter = (filterVal: TSyncStatusFilter) => () => setSyncStatusFilter(filterVal);

  return (
    <StyledDiv>
      <strong>{T.translate(`${PREFIX}.filtersLabel`)}: </strong>
      <ButtonGroup>
        <Button
          variant={syncStatusFilter === 'all' ? 'contained' : 'outlined'}
          color="primary"
          disableElevation
          onClick={setFilter('all')}
        >
          {T.translate(`${PREFIX}.gitSyncStatusAll`)}
        </Button>
        <Button
          variant={syncStatusFilter === 'in_sync' ? 'contained' : 'outlined'}
          color="primary"
          disableElevation
          onClick={setFilter('in_sync')}
        >
          {T.translate(`${PREFIX}.gitSyncStatusSynced`)}
        </Button>
        <Button
          variant={syncStatusFilter === 'out_of_sync' ? 'contained' : 'outlined'}
          color="primary"
          disableElevation
          onClick={setFilter('out_of_sync')}
        >
          {T.translate(`${PREFIX}.gitSyncStatusUnsynced`)}
        </Button>
      </ButtonGroup>
    </StyledDiv>
  );
};
