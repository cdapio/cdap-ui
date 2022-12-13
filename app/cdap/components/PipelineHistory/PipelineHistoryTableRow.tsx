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

import React, { ReactNode, useState } from 'react';
import { MyPipelineApi } from 'api/pipeline';
import { getCurrentNamespace } from 'services/NamespaceStore';
import T from 'i18n-react';
import { getHydratorUrl } from 'services/UiUtils/UrlGenerator';
import { PrimaryTextLowercaseButton } from 'components/shared/Buttons/PrimaryTextLowercaseButton';
import { SNAPSHOT_VERSION } from 'services/global-constants';
import styled from 'styled-components';
import JsonDiff from 'components/shared/JsonDiff';
import { Observable } from 'rxjs/Observable';

interface IPipelineHistoryTableRowProps {
  pipelineName: string;
  appVersion: string;
  setRestoreLoading: (val: boolean) => void;
  setErrorMessage: (val: string | ReactNode) => void;
  latestVersion: string;
  description?: string;
  date: string;
  anchorEl: any;
}

const PREFIX = 'features.PipelineHistory.table';

const StyledGreenUl = styled.ul`
  color: #389e0d;
`;

const StyledOrangeUl = styled.ul`
  color: #f29900;
`;

export const PipelineHistoryTableRow = ({
  pipelineName,
  appVersion,
  setRestoreLoading,
  setErrorMessage,
  latestVersion,
  description,
  date,
  anchorEl,
}: IPipelineHistoryTableRowProps) => {
  const namespace = getCurrentNamespace();
  const pipelineLink = getHydratorUrl({
    stateName: 'hydrator.detail',
    stateParams: {
      namespace,
      pipelineId: pipelineName,
    },
  });

  const [diffOpen, setDiffOpen] = useState(false);
  const [viewDiffLoading, setViewDiffLoading] = useState(false);
  const [viewDiffError, setViewDiffError] = useState(null);
  const [latestConfig, setLatestConfig] = useState(null);
  const [selectedConfig, setSelectedConfig] = useState(null);
  const closeDiffView = () => {
    setDiffOpen(false);
  };

  const fetchConfigAndDisplayDiff = () => {
    setViewDiffLoading(true);
    setDiffOpen(true);
    setViewDiffError(null);
    Observable.forkJoin(
      MyPipelineApi.getAppVersion({
        namespace,
        appId: pipelineName,
        version: latestVersion,
      }),
      MyPipelineApi.getAppVersion({
        namespace,
        appId: pipelineName,
        version: appVersion,
      })
    ).subscribe(
      (res: any) => {
        setLatestConfig(JSON.parse(res[0].configuration));
        setSelectedConfig(JSON.parse(res[1].configuration));
      },
      (err) => {
        setViewDiffError(err);
      },
      () => {
        setViewDiffLoading(false);
      }
    );
  };

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
            change: { description: T.translate(`${PREFIX}.restoreChangeSummary`, { date }) },
            // restore should not create new schedule
            'app.deploy.update.schedules': false,
            parentVersion: latestVersion,
          }
        ).subscribe(
          () => {
            setRestoreLoading(false);
            window.location.href = pipelineLink;
          },
          (err) => {
            setErrorMessage(T.translate(`${PREFIX}.restoreFailError`));
          }
        );
      },
      (err) => {
        setErrorMessage(T.translate(`${PREFIX}.fetchVersionFailError`));
      }
    );
  };

  return (
    <>
      <div className="grid-row">
        <div>
          {date}
          {appVersion === latestVersion ? (
            <StyledGreenUl>
              <li>{T.translate(`${PREFIX}.latest`)}</li>
            </StyledGreenUl>
          ) : (
            <StyledOrangeUl>
              <li>{T.translate(`${PREFIX}.older`)}</li>
            </StyledOrangeUl>
          )}
        </div>
        <div>{description}</div>
        {appVersion !== SNAPSHOT_VERSION && (
          <>
            <PrimaryTextLowercaseButton
              textColor="#0000EE"
              onClick={() => {
                viewVersion();
              }}
            >
              {T.translate(`${PREFIX}.view`)}
            </PrimaryTextLowercaseButton>
            {appVersion !== latestVersion && (
              <>
                <PrimaryTextLowercaseButton
                  textColor="#0000EE"
                  onClick={() => {
                    fetchConfigAndDisplayDiff();
                  }}
                >
                  {T.translate(`${PREFIX}.viewDiff`)}
                </PrimaryTextLowercaseButton>
                <PrimaryTextLowercaseButton
                  textColor="#0000EE"
                  onClick={() => {
                    restoreVersion();
                  }}
                >
                  {T.translate(`${PREFIX}.restore`)}
                </PrimaryTextLowercaseButton>
              </>
            )}
          </>
        )}
      </div>
      <JsonDiff
        anchorEl={anchorEl}
        isOpen={diffOpen}
        onClose={closeDiffView}
        loading={viewDiffLoading}
        error={viewDiffError}
        latestConfig={latestConfig}
        selectedConfig={selectedConfig}
      />
    </>
  );
};
