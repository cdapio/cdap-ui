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
import CollapsibleSidebar from 'components/shared/CollapsibleSidebar';
import NamespaceStore from 'services/NamespaceStore';
import TriggeredPipelineRow from 'components/TriggeredPipelines/TriggeredPipelineRow';
import {
  setTriggeredPipelines,
  togglePipeline,
} from 'components/TriggeredPipelines/store/TriggeredPipelineActionCreator';
import { Provider, connect } from 'react-redux';
import TriggeredPipelineStore from 'components/TriggeredPipelines/store/TriggeredPipelineStore';
import T from 'i18n-react';
import {
  PipelineCount,
  PipelineListHeader,
  PipelineTriggerHeader,
  StyledNameSpaceHeader,
  StyledPipelineNameHeader,
  TriggersTab,
} from 'components/PipelineTriggers/shared.styles';
import { IPipelineInfo, ISchedule } from 'components/PipelineTriggers/store/ScheduleTypes';

const PREFIX = `features.TriggeredPipelines`;

const mapStateToProps = (state) => {
  return {
    triggeredPipelines: state.triggered.triggeredPipelines,
    expanded: state.triggered.expandedPipeline,
    pipelineInfo: state.triggered.expandedPipelineInfo,
  };
};

interface ITriggeredPipelinesViewProps {
  pipelineCompositeTriggersEnabled: boolean;
  pipelineName: string;
  triggeredPipelines: ISchedule[];
  expanded: string;
  pipelineInfo: IPipelineInfo;
}

const TriggeredPipelinesView = ({
  pipelineCompositeTriggersEnabled,
  pipelineName,
  triggeredPipelines,
  expanded,
  pipelineInfo,
}: ITriggeredPipelinesViewProps) => {
  const [tabText, setTabText] = useState(`${PREFIX}.collapsedTabLabel`);
  useEffect(() => {
    const namespace = NamespaceStore.getState().selectedNamespace;
    setTriggeredPipelines(namespace, pipelineName);
  }, []);

  const onToggleSidebar = (isExpanded) => {
    setTabText(isExpanded ? `${PREFIX}.expandedTabLabel` : `${PREFIX}.collapsedTabLabel`);
  };

  const onToggle = (pipeline) => {
    togglePipeline(pipeline);
  };

  const count = triggeredPipelines.length;

  return (
    <CollapsibleSidebar
      data-cy="outbound-triggers-toggle"
      position="right"
      toggleTabLabel={T.translate(`${tabText}`, { count })}
      backdrop={false}
      onToggle={onToggleSidebar}
    >
      <TriggersTab>
        <PipelineTriggerHeader>
          {T.translate(`${PREFIX}.title`, { pipelineName })}
        </PipelineTriggerHeader>
        <PipelineCount>
          {T.translate(`${PREFIX}.pipelineCount`, {
            context: {
              count,
            },
          })}
        </PipelineCount>
        {triggeredPipelines.length > 0 && (
          <div>
            <PipelineListHeader>
              <StyledPipelineNameHeader>
                {T.translate(`${PREFIX}.pipelineName`)}
              </StyledPipelineNameHeader>
              <StyledNameSpaceHeader>{T.translate(`${PREFIX}.namespace`)}</StyledNameSpaceHeader>
            </PipelineListHeader>
            {triggeredPipelines.map((pipeline) => {
              return (
                <TriggeredPipelineRow
                  isExpanded={`${pipeline.namespace}_${pipeline.application}` === expanded}
                  schedule={pipeline}
                  onToggle={onToggle}
                  pipelineInfo={pipelineInfo}
                  sourcePipeline={pipelineName}
                  pipelineCompositeTriggersEnabled={pipelineCompositeTriggersEnabled}
                />
              );
            })}
          </div>
        )}
      </TriggersTab>
    </CollapsibleSidebar>
  );
};

const TriggeredPipelinesConnect = connect(mapStateToProps)(TriggeredPipelinesView);

export default function TriggeredPipelines({ pipelineName, pipelineCompositeTriggersEnabled }) {
  return (
    <Provider store={TriggeredPipelineStore}>
      <TriggeredPipelinesConnect
        pipelineName={pipelineName}
        pipelineCompositeTriggersEnabled={pipelineCompositeTriggersEnabled}
      />
    </Provider>
  );
}
