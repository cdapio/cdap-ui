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

import React, { useReducer } from 'react';
import styled from 'styled-components';
import {
  enableSchedule,
  generateRuntimeMapping,
} from 'components/PipelineTriggers/store/PipelineTriggersActionCreator';
import PayloadConfigModal from 'components/PipelineTriggers/PayloadConfigModal';
import ConfigTabs from 'components/PipelineTriggers/ScheduleRuntimeArgs/Tabs/TabConfig';
import T from 'i18n-react';
import Checkbox from '@material-ui/core/Checkbox';
import {
  ActionButtonsContainer,
  CheckboxItemContainer,
  ErrorText,
  EventsList,
  HelperText,
  PipelineDescription,
  PipelineName,
  PipelineTriggerButton,
  StyledAccordion,
  StyledAccordionDetails,
  StyledAccordionSummary,
} from 'components/PipelineTriggers/shared.styles';
import {
  ITriggeringPipelineInfo,
  ITriggerPropertyMapping,
} from 'components/PipelineTriggers/store/ScheduleTypes';
import {
  initialInlineTriggerState,
  triggerConditionReducer,
} from 'components/PipelineTriggers/reducer';
import { openLinkInNewTab } from 'services/helpers';

const TRIGGER_PREFIX = 'features.PipelineTriggers';
const PREFIX = `${TRIGGER_PREFIX}.SetTriggers`;
const PAYLOAD_PREFIX = 'features.PipelineTriggers.ScheduleRuntimeArgs.PayloadConfigModal';

const PipelineLink = styled.a`
  margin-left: 10px;
`;

interface IPipelineTriggersRowViewProps {
  isExpanded: boolean;
  onToggle: (pipeline: string) => void;
  pipelineRow: string;
  triggeringPipelineInfo: ITriggeringPipelineInfo;
  triggeredPipelineInfo: any;
  selectedNamespace: string;
  configureError: string;
  pipelineName: string;
  workflowName: string;
}

const PipelineTriggersRow = ({
  isExpanded,
  onToggle,
  pipelineRow,
  triggeringPipelineInfo,
  triggeredPipelineInfo,
  selectedNamespace,
  configureError,
  pipelineName,
  workflowName,
}: IPipelineTriggersRowViewProps) => {
  const [state, dispatch] = useReducer(triggerConditionReducer, initialInlineTriggerState);

  const getConfig = () => {
    const config = {
      eventTriggers: [],
      properties: null,
    };
    if (state.completed) {
      config.eventTriggers.push('COMPLETED');
    }
    if (state.killed) {
      config.eventTriggers.push('KILLED');
    }
    if (state.failed) {
      config.eventTriggers.push('FAILED');
    }
    return config;
  };

  const enableScheduleClick = () => {
    onToggle(null);
    const config = getConfig();
    enableSchedule(triggeringPipelineInfo, workflowName, pipelineName, selectedNamespace, config);
  };

  const configureAndEnable = (mapping: ITriggerPropertyMapping[], propertiesConfig = {}) => {
    const config = getConfig();
    config.properties = {
      'triggering.properties.mapping': generateRuntimeMapping(mapping),
      ...propertiesConfig,
    };
    enableSchedule(triggeringPipelineInfo, workflowName, pipelineName, selectedNamespace, config);
    dispatch({ type: 'TOGGLE_PAYLOAD' });
  };

  const handleAccordionClick = () => {
    if (isExpanded) {
      onToggle(null);
    } else {
      onToggle(pipelineRow);
    }
  };

  const handlePayloadToggleClick = () => {
    dispatch({ type: 'TOGGLE_PAYLOAD' });
  };

  const enabledButtonDisabled = !state.completed && !state.killed && !state.failed;

  return (
    <StyledAccordion
      elevation={0}
      square
      expanded={isExpanded}
      onChange={() => handleAccordionClick()}
      data-cy={isExpanded ? `${pipelineRow}-expanded` : `${pipelineRow}-collapsed`}
      data-testid={isExpanded ? `${pipelineRow}-expanded` : `${pipelineRow}-collapsed`}
    >
      <StyledAccordionSummary>
        <PipelineName>{pipelineRow}</PipelineName>
      </StyledAccordionSummary>
      <StyledAccordionDetails>
        <PipelineDescription>
          <strong>{T.translate(`${TRIGGER_PREFIX}.description`)}: </strong>
          <span>{triggeringPipelineInfo && triggeringPipelineInfo.description}</span>
          <PipelineLink
            href={`/pipelines/ns/${selectedNamespace}/view/${pipelineRow}`}
            target="_blank"
            // The Anchor tab is not working, using this hacky way to fix it for now
            onClick={() =>
              openLinkInNewTab(`/pipelines/ns/${selectedNamespace}/view/${pipelineRow}`)
            }
          >
            {T.translate(`${TRIGGER_PREFIX}.viewPipeline`)}
          </PipelineLink>
        </PipelineDescription>
        <HelperText>{T.translate(`${TRIGGER_PREFIX}.helperText`, { pipelineName })}</HelperText>
        <EventsList>
          <CheckboxItemContainer onClick={() => dispatch({ type: 'COMPLETED' })}>
            <Checkbox checked={state.completed} color="primary" size="small" />
            <span>{T.translate(`${TRIGGER_PREFIX}.Events.COMPLETED`)}</span>
          </CheckboxItemContainer>
          <CheckboxItemContainer onClick={() => dispatch({ type: 'KILLED' })}>
            <Checkbox checked={state.killed} color="primary" size="small" />
            <span>{T.translate(`${TRIGGER_PREFIX}.Events.KILLED`)}</span>
          </CheckboxItemContainer>
          <CheckboxItemContainer onClick={() => dispatch({ type: 'FAILED' })}>
            <Checkbox checked={state.failed} color="primary" size="small" />
            <span>{T.translate(`${TRIGGER_PREFIX}.Events.FAILED`)}</span>
          </CheckboxItemContainer>
        </EventsList>

        {configureError && !state.payloadModalOpen && <ErrorText>{configureError}</ErrorText>}

        <ActionButtonsContainer>
          <PipelineTriggerButton
            disabled={enabledButtonDisabled}
            onClick={() => enableScheduleClick()}
            data-cy={`${pipelineRow}-enable-trigger-btn`}
            data-testid={`${pipelineRow}-enable-trigger-btn`}
          >
            {T.translate(`${PREFIX}.buttonLabel`)}
          </PipelineTriggerButton>
          <PipelineTriggerButton
            onClick={handlePayloadToggleClick}
            data-cy={`${triggeringPipelineInfo.id}-trigger-config-btn`}
            data-testid={`${triggeringPipelineInfo.id}-trigger-config-btn`}
          >
            {T.translate(`${PAYLOAD_PREFIX}.configPayloadBtn`)}
          </PipelineTriggerButton>
        </ActionButtonsContainer>
        <PayloadConfigModal
          triggeringPipelineInfo={triggeringPipelineInfo}
          triggeredPipelineInfo={triggeredPipelineInfo}
          onConfigureSchedule={configureAndEnable}
          configureError={state.mappingError || configureError}
          isOpen={state.payloadModalOpen}
          onToggle={handlePayloadToggleClick}
          pipelineCompositeTriggersEnabled={false}
          modalConfigTab={ConfigTabs.TabConfig}
        />
      </StyledAccordionDetails>
    </StyledAccordion>
  );
};

export default PipelineTriggersRow;
