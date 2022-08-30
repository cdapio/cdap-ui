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
import { PipelineHistoryTable } from './PipelineHistoryTable';

const PREFIX = 'features.PipelineHistory';

interface IPipelineHistoryProps {
  isOpen: boolean;
  toggle: () => void;
  anchorEl: any;
  pipelineName: string;
}

export const PipelineHistory = ({
  isOpen,
  toggle,
  anchorEl,
  pipelineName,
}: IPipelineHistoryProps) => {
  const [appVersions, setAppVersions] = useState([]);

  useEffect(() => {
    MyPipelineApi.getAppVersions({
      namespace: getCurrentNamespace(),
      appId: pipelineName,
    }).subscribe({
      next(res) {
        setAppVersions(res);
      },
      error(err) {
        console.log(err);
      },
    });
  }, []);
  return (
    <PipelineModeless
      open={isOpen}
      onClose={toggle}
      anchorEl={anchorEl}
      title={T.translate(`${PREFIX}.header`) + ` "${pipelineName}"`}
    >
      <PipelineHistoryTable appVersions={appVersions} />
    </PipelineModeless>
  );
};
