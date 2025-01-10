/*
 * Copyright © 2025 Cask Data, Inc.
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
import { Provider, useSelector } from 'react-redux';
import PipelineMetricsStore from 'services/PipelineMetricsStore';
import T from 'i18n-react';
import { Chip } from '@material-ui/core';

const PREFIX = 'features.PipelineDetails.RunLevel';

interface IRunLogsStatsProps {
  currentRun: {
    starting?: boolean;
  };
}

const ChipsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

function RunLogsStatsChipsComp({ currentRun }: IRunLogsStatsProps) {
  const logsMetrics = useSelector((state) => state?.logsMetrics || {});
  const numErrors = currentRun?.starting ? logsMetrics['system.app.log.error'] || 0 : null;
  const numWarnings = currentRun?.starting ? logsMetrics['system.app.log.warn'] || 0 : null;

  return (
    <ChipsContainer>
      {!!numWarnings && (
        <Chip
          variant="outlined"
          size="small"
          label={T.translate(`${PREFIX}.warningsCountChip`, { numWarnings })}
          color="primary"
        />
      )}
      {!!numErrors && (
        <Chip
          variant="outlined"
          size="small"
          label={T.translate(`${PREFIX}.errorsCountChip`, { numErrors })}
          color="secondary"
        />
      )}
    </ChipsContainer>
  );
}

export default function RunLogsStatsChips() {
  const currentRun = useSelector((state) => state.currentRun);
  if (!currentRun) {
    return <div />;
  }

  return (
    <Provider store={PipelineMetricsStore}>
      <RunLogsStatsChipsComp currentRun={currentRun} />
    </Provider>
  );
}
