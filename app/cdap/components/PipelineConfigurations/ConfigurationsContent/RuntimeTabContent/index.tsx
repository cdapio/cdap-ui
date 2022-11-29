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

import RuntimeArgsTabContent from 'components/PipelineDetails/PipelineRuntimeArgsDropdownBtn/RuntimeArgsKeyValuePairWrapper';
import React, { useEffect, useState } from 'react';
import PipelineConfigurationsStore from 'components/PipelineConfigurations/Store';
import { updateRunTimeArgs } from 'components/PipelineConfigurations/Store/ActionCreator';

interface IRuntimeTabContentProps {
  getRuntimeArgs?: () => any;
}

export const RuntimeTabContent = (props: IRuntimeTabContentProps) => {
  const [initFinish, setInitFinish] = useState(false);

  useEffect(() => {
    // hack: copy runtimeArgs from angular store to react store
    if (typeof props.getRuntimeArgs === 'function') {
      props.getRuntimeArgs().then((res) => {
        updateRunTimeArgs(res);
        setInitFinish(true);
      });
    }
  }, []);

  return (
    <div
      className="configuration-step-content configuration-content-container batch-content"
      id="runtime-config-tab-content"
    >
      <div className="step-content-heading">
        Specify runtime arguments or update the ones derived from preferences
      </div>
      <div className="step-content-subtitle">
        By default, values for all runtime arguments must be provided before running the pipeline.
        If a stage in your pipeline provides the value of an argument, you can skip that argument by
        marking it as provided.
      </div>
      {initFinish && <RuntimeArgsTabContent dataCy="runtimeargs-preview" />}
    </div>
  );
};
