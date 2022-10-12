/*
 * Copyright © 2022 Cask Data, Inc.
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
import { PipelineHistoryTableRow } from './PipelineHistoryTableRow';
import ErrorBanner from 'components/shared/ErrorBanner';
import { IPipelineVersion } from './types';

interface IPipelineHistoryTableProps {
  pipelineName: string;
  pipelineVersions: IPipelineVersion[];
  setRestoreLoading: (val: boolean) => void;
  latestVersion: string;
}

const PREFIX = 'features.PipelineHistory.table';

export const PipelineHistoryTable = ({
  pipelineName,
  pipelineVersions,
  setRestoreLoading,
  latestVersion,
}: IPipelineHistoryTableProps) => {
  const [errorMessage, setErrorMessage] = useState(null);

  const renderTableBody = () => {
    return (
      <div className="grid-body">
        {pipelineVersions.map((pipelineVersion) => {
          return (
            <PipelineHistoryTableRow
              key={pipelineVersion.version}
              pipelineName={pipelineName}
              appVersion={pipelineVersion.version}
              description={pipelineVersion.description}
              date={pipelineVersion.date}
              setRestoreLoading={setRestoreLoading}
              setErrorMessage={setErrorMessage}
              latestVersion={latestVersion}
            />
          );
        })}
      </div>
    );
  };

  return (
    <>
      {errorMessage && (
        <ErrorBanner
          error={errorMessage}
          onClose={() => {
            setErrorMessage(null);
          }}
        />
      )}
      <div className="grid grid-container">
        {pipelineVersions && (
          <div className="grid-header">
            <div className="grid-row">
              <strong>{T.translate(`${PREFIX}.date`)}</strong>
              <strong>{T.translate(`${PREFIX}.summary`)}</strong>
              <strong />
              <strong />
            </div>
          </div>
        )}
        {renderTableBody()}
      </div>
    </>
  );
};
