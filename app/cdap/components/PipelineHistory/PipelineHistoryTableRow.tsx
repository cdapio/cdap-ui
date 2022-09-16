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

import React, { useEffect, useState } from 'react';
import { MyPipelineApi } from 'api/pipeline';
import PipelineModeless from 'components/PipelineDetails/PipelineModeless';
import { getCurrentNamespace } from 'services/NamespaceStore';
import styled from 'styled-components';
import T from 'i18n-react';
import PipelineDetailStore from 'components/PipelineDetails/store';
import { map } from 'rxjs/operators';

interface IPipelineHistoryTableRowProps {
  pipelineName: string;
  appVersion: string;
}

const PREFIX = 'features.PipelineHistory.table';

export const PipelineHistoryTableRow = ({
  pipelineName,
  appVersion,
}: IPipelineHistoryTableRowProps) => {
  const namespace = getCurrentNamespace();
  const pipelineLink = window.getHydratorUrl({
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
        window.location.href = pipelineLink;
      });
    });
  };

  return (
    <div className=" grid-row">
      <div>{appVersion}</div>
      <div>{T.translate(`${PREFIX}.unfinish`)}</div>
      <div>{T.translate(`${PREFIX}.unfinish`)}</div>
      <div>{T.translate(`${PREFIX}.unfinish`)}</div>
      <div>{T.translate(`${PREFIX}.unfinish`)}</div>
      <a
        href="#"
        onClick={() => {
          viewVersion();
        }}
      >
        {T.translate(`${PREFIX}.view`)}
      </a>
      <a
        href="#"
        onClick={() => {
          restoreVersion();
        }}
      >
        {T.translate(`${PREFIX}.restore`)}
      </a>
    </div>
  );
};
