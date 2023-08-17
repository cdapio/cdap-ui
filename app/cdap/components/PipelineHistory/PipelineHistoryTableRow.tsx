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

import React, { ReactNode } from 'react';
import styled from 'styled-components';
import T from 'i18n-react';
import { MyPipelineApi } from 'api/pipeline';
import { getCurrentNamespace } from 'services/NamespaceStore';
import { getHydratorUrl } from 'services/UiUtils/UrlGenerator';
import { PrimaryTextLowercaseButton } from 'components/shared/Buttons/PrimaryTextLowercaseButton';
import { SNAPSHOT_VERSION } from 'services/global-constants';

interface IPipelineHistoryTableRowProps {
  pipelineName: string;
  appVersion: string;
  setRestoreLoading: (val: boolean) => void;
  setErrorMessage: (val: string | ReactNode) => void;
  latestVersion: string;
  description?: string;
  date: string;
}

const PREFIX = 'features.PipelineHistory.table';

const VersionDateLabel = styled.ul`
  ${({ isLatest }: { isLatest: boolean }) =>
    isLatest ? 'color: #389e0d;' : 'color: #f29900;'}
`;

export const PipelineHistoryTableRow = ({
  pipelineName,
  appVersion,
  setRestoreLoading,
  setErrorMessage,
  latestVersion,
  description,
  date,
}: IPipelineHistoryTableRowProps) => {
  const namespace = getCurrentNamespace();
  const pipelineLink = getHydratorUrl({
    stateName: 'hydrator.detail',
    stateParams: {
      namespace,
      pipelineId: pipelineName,
    },
  });

  const viewVersion = () => {
    window.localStorage.setItem('pipelineHistoryVersion', appVersion);
    window.location.href = pipelineLink;
  };

  const restoreVersion = () => {
    setRestoreLoading(true);
    MyPipelineApi.getAppVersion({
      namespace,
      appId: pipelineName,
      version: appVersion,
    }).subscribe(
      (res) => {
        const config = JSON.parse(res.configuration);
        MyPipelineApi.publish(
          {
            namespace,
            appId: pipelineName,
          },
          {
            name: res.name,
            description: res.description,
            artifact: res.artifact,
            config,
            change: {
              description: T.translate(`${PREFIX}.restoreChangeSummary`, {
                date,
              }),
            },
            // restore should not create new schedule
            'app.deploy.update.schedules': false,
            parentVersion: latestVersion,
          }
        ).subscribe(
          () => {
            setRestoreLoading(false);
            window.location.href = pipelineLink;
          },
          () => {
            setErrorMessage(T.translate(`${PREFIX}.restoreFailError`));
          }
        );
      },
      () => {
        setErrorMessage(T.translate(`${PREFIX}.fetchVersionFailError`));
      }
    );
  };

  const isLatest = appVersion === latestVersion;
  const dateLabel = isLatest
    ? T.translate(`${PREFIX}.latest`)
    : T.translate(`${PREFIX}.older`);
  const displayedDesc =
    description?.length > 190 ? description.slice(0, 190) + '...' : description;

  return (
    <>
      <div className="grid-row" data-testid={'pipeline-history-row'}>
        <div data-testid="pipeline-history-date">
          {date}
          <VersionDateLabel isLatest={appVersion === latestVersion}>
            <li data-testid="pipeline-history-date-label">{dateLabel}</li>
          </VersionDateLabel>
        </div>
        <div data-testid="pipeline-history-description">{displayedDesc}</div>
        {appVersion !== SNAPSHOT_VERSION && (
          <>
            <PrimaryTextLowercaseButton
              textColor="#0000EE"
              onClick={() => {
                viewVersion();
              }}
              data-testid="pipeline-history-view"
            >
              {T.translate(`${PREFIX}.view`)}
            </PrimaryTextLowercaseButton>
            {appVersion !== latestVersion && (
              <PrimaryTextLowercaseButton
                textColor="#0000EE"
                onClick={() => {
                  restoreVersion();
                }}
                data-testid="pipeline-history-restore"
              >
                {T.translate(`${PREFIX}.restore`)}
              </PrimaryTextLowercaseButton>
            )}
          </>
        )}
      </div>
    </>
  );
};
