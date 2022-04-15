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
import { connect } from 'react-redux';
import EnabledTriggerRow from 'components/PipelineTriggers/EnabledTriggersTab/EnabledTriggerRow';
import GroupTriggerRow from 'components/PipelineTriggers/EnabledTriggersTab/EnabledGroupTriggerRow';
import T from 'i18n-react';
import { useFeatureFlagDefaultFalse } from 'services/react/customHooks/useFeatureFlag';
import PipelineTriggersTypes from 'components/PipelineTriggers/store/PipelineTriggersTypes';
import Button from '@material-ui/core/Button';
import { ISchedule } from 'components/PipelineTriggers/store/ScheduleTypes';
import {
  PipelineListHeader,
  PipelineName,
  PipelineTriggerHeader,
  StyledNameSpace,
} from 'components/PipelineTriggers/shared.styles';
import styled from 'styled-components';

const TRIGGER_PREFIX = 'features.PipelineTriggers';
const PREFIX = `${TRIGGER_PREFIX}.EnabledTriggers`;

const AddNewTriggerButton = styled(Button)`
  background-color: #5a84e4;
  text-transform: none;
  margin: 20px;
`;

const CaretContainer = styled.div`
  width: 25px;
  vertical-align: middle;
`;

const ExistingTriggersTab = styled.div`
  padding: 15px;
`;

const PipelineCount = styled.div`
  margin-bottom: 10px;
`;

const StyledPipelineName = styled(PipelineName)`
  width: calc(100% - 125px);
`;

interface IEnabledTriggersViewProps {
  enabledTriggers: ISchedule[];
  pipelineName: string;
  setTab: (tab: number) => void;
}

const EnabledTriggersView = ({
  enabledTriggers,
  pipelineName,
  setTab,
}: IEnabledTriggersViewProps) => {
  const pipelineCompositeTriggersEnabled = useFeatureFlagDefaultFalse(
    'pipeline.composite.triggers.enabled'
  );
  const enabledSingleTriggers = enabledTriggers.filter(
    (schedule) => schedule.trigger.type === PipelineTriggersTypes.programStatus
  );
  const enabledGroupTriggers = enabledTriggers.filter(
    (schedule) =>
      schedule.trigger.type === PipelineTriggersTypes.andType ||
      schedule.trigger.type === PipelineTriggersTypes.orType
  );

  return (
    <ExistingTriggersTab>
      <PipelineTriggerHeader>
        {pipelineCompositeTriggersEnabled
          ? T.translate(`${PREFIX}.compositeTriggersTitle`, { pipelineName })
          : T.translate(`${PREFIX}.title`, { pipelineName })}
      </PipelineTriggerHeader>

      <PipelineCount>
        {pipelineCompositeTriggersEnabled
          ? T.translate(`${PREFIX}.compositeTriggersPipelineCount`, {
              context: enabledTriggers.length,
            })
          : T.translate(`${PREFIX}.pipelineCount`, {
              context: enabledTriggers.length,
            })}
      </PipelineCount>

      {enabledSingleTriggers.length === 0 ? null : (
        <div>
          <PipelineListHeader>
            <StyledPipelineName>{T.translate(`${TRIGGER_PREFIX}.pipelineName`)}</StyledPipelineName>
            <StyledNameSpace>{T.translate(`${TRIGGER_PREFIX}.namespace`)}</StyledNameSpace>
          </PipelineListHeader>
          {enabledSingleTriggers.map((schedule) => (
            <EnabledTriggerRow schedule={schedule} />
          ))}
        </div>
      )}

      {enabledGroupTriggers.length === 0 ? null : (
        <div>
          <PipelineListHeader>
            <div>{T.translate(`${TRIGGER_PREFIX}.groupTriggers`)}</div>
          </PipelineListHeader>
          {enabledGroupTriggers.map((triggerGroup) => (
            <GroupTriggerRow triggerGroup={triggerGroup} />
          ))}
        </div>
      )}

      {pipelineCompositeTriggersEnabled && (
        <AddNewTriggerButton
          color="primary"
          variant="contained"
          onClick={() => setTab(1)}
          data-cy="add-new-group-trigger-btn"
        >
          {T.translate(`${PREFIX}.addNewTrigger`)}
        </AddNewTriggerButton>
      )}
    </ExistingTriggersTab>
  );
};

const mapStateToProps = (state) => {
  return {
    enabledTriggers: state.triggers.enabledTriggers,
    pipelineName: state.triggers.pipelineName,
  };
};

const EnabledTriggersTab = connect(mapStateToProps)(EnabledTriggersView);

export default EnabledTriggersTab;
