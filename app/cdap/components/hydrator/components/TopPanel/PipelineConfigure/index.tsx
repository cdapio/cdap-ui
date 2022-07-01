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

import PipelineConfigurations from 'components/PipelineConfigurations';
import React from 'react';
import classnames from 'classnames';

export interface IPipelineConfigureProps {
  viewConfig: boolean;
  toggleConfig: () => void;
  applyRuntimeArguments: (runtimeArgs) => void;
  state: any;
  runPipeline: () => void;
  applyBatchConfig: (...args) => void;
  applyRealtimeConfig: (...args) => void;
  actionCreator: any;
  isDeployed: boolean;
  showPreviewConfig: boolean;
  getPostActions: () => any[];
  anchorEl: any;
  validatePluginProperties: (action: any, errorCb: any) => void;
  getRuntimeArgs: () => any;
}

export const PipelineConfigure = (props: IPipelineConfigureProps) => {
  const pipelineName = props.state.metadata.name;
  const pipelineType = props.state.artifact.name;

  return (
    <div
      className={classnames('pipeline-action-container pipeline-configure-container', {
        active: props.viewConfig,
      })}
    >
      <PipelineConfigurations
        open={props.viewConfig}
        onClose={props.toggleConfig}
        isDetailView={false}
        pipelineName={pipelineName}
        pipelineType={pipelineType}
        isPreview={props.showPreviewConfig}
        isDeployed={props.isDeployed}
        artifact={props.state.artifact}
        actionCreator={props.actionCreator}
        applyRuntimeArguments={props.applyRuntimeArguments}
        studioRunPipeline={props.runPipeline}
        getPostActions={props.getPostActions}
        applyBatchConfig={props.applyBatchConfig}
        applyRealtimeConfig={props.applyRealtimeConfig}
        anchorEl={props.anchorEl}
        validatePluginProperties={props.validatePluginProperties}
        getRuntimeArgs={props.getRuntimeArgs}
      />
    </div>
  );
};
