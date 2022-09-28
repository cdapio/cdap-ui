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

import React from 'react';
import { MyPipelineApi } from 'api/pipeline';
import { getCurrentNamespace } from 'services/NamespaceStore';
import T from 'i18n-react';
import { getHydratorUrl } from 'services/UiUtils/UrlGenerator';
import { PrimaryTextLowercaseButton } from 'components/shared/Buttons/PrimaryTextLowercaseButton/PrimaryTextLowercaseButton';

interface IPipelineHistoryTableRowProps {
  pipelineName: string;
  appVersion: string;
  setRestoreLoading: (val: boolean) => void;
}

const PREFIX = 'features.PipelineHistory.table';

export const PipelineHistoryTableRow = ({
  pipelineName,
  appVersion,
  setRestoreLoading,
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
    }).subscribe((res) => {
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
        }
      ).subscribe(() => {
        setRestoreLoading(false);
        window.location.href = pipelineLink;
      });
    });
  };

  return (
    <>
      <div className=" grid-row">
        <div>{appVersion}</div>
        <div>{T.translate(`${PREFIX}.unfinish`)}</div>
        <div>{T.translate(`${PREFIX}.unfinish`)}</div>
        <div>{T.translate(`${PREFIX}.unfinish`)}</div>
        <PrimaryTextLowercaseButton
          textColor="#0000EE"
          onClick={() => {
            viewVersion();
          }}
        >
          {T.translate(`${PREFIX}.view`)}
        </PrimaryTextLowercaseButton>
        <PrimaryTextLowercaseButton
          textColor="#0000EE"
          onClick={() => {
            restoreVersion();
          }}
        >
          {T.translate(`${PREFIX}.restore`)}
        </PrimaryTextLowercaseButton>
      </div>
    </>
  );
};
