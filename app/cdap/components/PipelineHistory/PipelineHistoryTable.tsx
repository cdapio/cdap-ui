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

import { MyPipelineApi } from 'api/pipeline';
import PipelineModeless from 'components/PipelineDetails/PipelineModeless';
import React, { useEffect, useState } from 'react';
import { getCurrentNamespace } from 'services/NamespaceStore';
import styled from 'styled-components';
import T from 'i18n-react';
import { PipelineHistoryTableRow } from './PipelineHistoryTableRow';
import './PipelineHistoryTable.scss';

interface IPipelineHistoryTableProps {
  pipelineName: string;
  appVersions: string[];
  setRestoreLoading: (val: boolean) => void;
}

const PREFIX = 'features.PipelineHistory.table';

export const PipelineHistoryTable = ({
  pipelineName,
  appVersions,
  setRestoreLoading,
}: IPipelineHistoryTableProps) => {
  const renderTableBody = () => {
    return (
      <div className="grid-body">
        {appVersions.map((appVersion) => {
          return (
            <PipelineHistoryTableRow
              key={appVersion}
              pipelineName={pipelineName}
              appVersion={appVersion}
              setRestoreLoading={setRestoreLoading}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="grid grid-container">
      {appVersions && (
        <div className="grid-header">
          <div className="grid-row">
            <strong>{`Version (For develop)`}</strong>
            <strong>{T.translate(`${PREFIX}.date`)}</strong>
            <strong>{T.translate(`${PREFIX}.time`)}</strong>
            <strong>{T.translate(`${PREFIX}.author`)}</strong>
            <strong>{T.translate(`${PREFIX}.summary`)}</strong>
            <strong />
            <strong />
          </div>
        </div>
      )}
      {renderTableBody()}
    </div>
  );
};
