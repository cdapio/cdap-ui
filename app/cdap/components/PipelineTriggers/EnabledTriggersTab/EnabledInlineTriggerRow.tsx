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
import { getGroupInlinePipelineInfo } from 'components/PipelineTriggers/store/PipelineTriggersActionCreator';
import LoadingSVG from 'components/shared/LoadingSVG';
import PayloadConfigModal from 'components/PipelineTriggers/PayloadConfigModal';
import T from 'i18n-react';
import NamespaceStore from 'services/NamespaceStore';
import { IProgramStatusTrigger, ISchedule } from 'components/PipelineTriggers/store/ScheduleTypes';
import Checkbox from '@material-ui/core/Checkbox';
import {
  CheckboxContainer,
  CheckboxItemContainer,
  ErrorText,
  HelperText,
  PipelineName,
  StyledNameSpace,
  TextCenter,
  TriggerCardButton,
} from 'components/PipelineTriggers/shared.styles';
import styled from 'styled-components';
import { openLinkInNewTab } from 'services/helpers';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { CardActions } from '@material-ui/core';

const TRIGGER_PREFIX = 'features.PipelineTriggers';
const PAYLOAD_PREFIX = 'features.PipelineTriggers.ScheduleRuntimeArgs.PayloadConfigModal';

const PipelineNameInDescription = styled.div`
  font-size: 14px;
`;

interface IEnabledInlineTriggerRowProps {
  trigger: IProgramStatusTrigger;
  compositeTriggerSchedule: ISchedule;
  pipelineName: string;
  disableError: string;
}

const EnabledInlineTriggerRow = ({
  trigger,
  compositeTriggerSchedule,
  pipelineName,
  disableError,
}: IEnabledInlineTriggerRowProps) => {
  const [isLoading, setLoading] = useState(true);
  const [expandedTriggerInfo, setExpandedTriggerInfo] = useState(null);
  const [namespace, setNameSpace] = useState(null);
  const [payloadModalOpen, setPayloadModalOpen] = useState(false);

  useEffect(() => {
    getGroupInlinePipelineInfo(trigger).subscribe((res) => {
      setExpandedTriggerInfo(res);
      setLoading(false);
    });
    const ns = NamespaceStore.getState().selectedNamespace;
    setNameSpace(ns);
  }, []);

  const handlePayloadToggleClick = () => {
    setPayloadModalOpen(!payloadModalOpen);
  };

  const renderLoading = () => {
    return (
      <TextCenter>
        <LoadingSVG />
      </TextCenter>
    );
  };

  const renderContent = () => {
    const triggeredPipelineInfo = {
      id: pipelineName,
      namespace,
    };

    const triggeringPipelineInfo = {
      id: trigger.programId.application,
      namespace: trigger.programId.namespace,
    };

    const events = trigger.programStatuses;
    const completed = events.indexOf('COMPLETED') > -1;
    const killed = events.indexOf('KILLED') > -1;
    const failed = events.indexOf('FAILED') > -1;

    return (
      <Card>
        <CardContent>
          <PipelineNameInDescription>
            <strong>{T.translate(`${TRIGGER_PREFIX}.pipelineName`)}: </strong>
            <PipelineName>{trigger.programId.application}</PipelineName>
          </PipelineNameInDescription>
          <div>
            <strong>{T.translate(`${TRIGGER_PREFIX}.namespace`)}: </strong>
            <StyledNameSpace>{trigger.programId.namespace}</StyledNameSpace>
          </div>
          <div>
            <strong>{T.translate(`${TRIGGER_PREFIX}.description`)}: </strong>
            <span>{expandedTriggerInfo && expandedTriggerInfo.description}</span>
          </div>
          <HelperText>{T.translate(`${TRIGGER_PREFIX}.helperText`, { pipelineName })}</HelperText>
          <CheckboxContainer>
            <CheckboxItemContainer>
              <Checkbox disabled checked={completed} color="primary" size="small" />
              <span>{T.translate(`${TRIGGER_PREFIX}.Events.COMPLETED`)}</span>
            </CheckboxItemContainer>
            <CheckboxItemContainer>
              <Checkbox disabled checked={killed} color="primary" size="small" />
              <span>{T.translate(`${TRIGGER_PREFIX}.Events.KILLED`)}</span>
            </CheckboxItemContainer>
            <CheckboxItemContainer>
              <Checkbox disabled checked={failed} color="primary" size="small" />
              <span>{T.translate(`${TRIGGER_PREFIX}.Events.FAILED`)}</span>
            </CheckboxItemContainer>
          </CheckboxContainer>
          {disableError && <ErrorText>{disableError}</ErrorText>}
          <PayloadConfigModal
            isOpen={payloadModalOpen}
            triggeringPipelineInfo={triggeringPipelineInfo}
            triggeredPipelineInfo={triggeredPipelineInfo}
            onToggle={handlePayloadToggleClick}
            scheduleInfo={compositeTriggerSchedule}
            disabled={true}
            pipelineCompositeTriggersEnabled={true}
          />
        </CardContent>
        <CardActions>
          <TriggerCardButton
            // The Anchor tab is not working, using this hacky way to fix it for now
            onClick={() =>
              openLinkInNewTab(
                `/pipelines/ns/${triggeringPipelineInfo.namespace}/view/${triggeringPipelineInfo.id}`
              )
            }
          >
            {T.translate(`${TRIGGER_PREFIX}.viewPipelineCapitalized`)}
          </TriggerCardButton>
          <TriggerCardButton
            onClick={handlePayloadToggleClick}
            data-cy={`${triggeringPipelineInfo.id}-view-payload-btn`}
            data-testid={`${triggeringPipelineInfo.id}-view-payload-btn`}
          >
            {T.translate(`${PAYLOAD_PREFIX}.configPayloadBtnDisabledCapitalized`)}
          </TriggerCardButton>
        </CardActions>
      </Card>
    );
  };

  return (
    <div
      data-cy={`${trigger.programId.application}-expanded`}
      data-testid={`${trigger.programId.application}-expanded`}
    >
      {isLoading ? renderLoading() : renderContent()}
    </div>
  );
};

export default EnabledInlineTriggerRow;
