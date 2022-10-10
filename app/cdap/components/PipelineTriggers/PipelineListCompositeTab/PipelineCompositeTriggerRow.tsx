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
  addToTriggerGroup,
  removePipelineFromGroup,
  validateTriggerMappping,
} from 'components/PipelineTriggers/store/PipelineTriggersActionCreator';
import PayloadConfigModal from 'components/PipelineTriggers/PayloadConfigModal';
import ConfigTabs from 'components/PipelineTriggers/ScheduleRuntimeArgs/Tabs/TabConfig';
import T from 'i18n-react';
import Checkbox from '@material-ui/core/Checkbox';
import {
  CheckboxContainer,
  CheckboxItemContainer,
  ErrorText,
  HelperText,
  PipelineName,
  StyledAccordion,
  StyledAccordionDetails,
  StyledAccordionSummary,
  TriggerCardButton,
} from 'components/PipelineTriggers/shared.styles';
import {
  ICompositeTriggerRunArgsWithTargets,
  IProgramStatusTrigger,
  ITriggeringPipelineInfo,
  ITriggerPropertyMapping,
} from 'components/PipelineTriggers/store/ScheduleTypes';
import {
  initialInlineTriggerState,
  triggerConditionReducer,
} from 'components/PipelineTriggers/reducer';
import { openLinkInNewTab } from 'services/helpers';
import { Card, CardActions, CardContent } from '@material-ui/core';

const TRIGGER_PREFIX = 'features.PipelineTriggers';
const PAYLOAD_PREFIX = 'features.PipelineTriggers.ScheduleRuntimeArgs.PayloadConfigModal';

const AccordionCheckBox = styled(Checkbox)`
  right: 10px;
  padding: 0;
  position: absolute;
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
  triggersGroupToAdd: IProgramStatusTrigger[];
  triggersGroupRunArgsToAdd: ICompositeTriggerRunArgsWithTargets;
}

const PipelineCompositeTriggerRow = ({
  isExpanded,
  onToggle,
  pipelineRow,
  triggeringPipelineInfo,
  triggeredPipelineInfo,
  selectedNamespace,
  configureError,
  pipelineName,
  triggersGroupToAdd,
  triggersGroupRunArgsToAdd,
}: IPipelineTriggersRowViewProps) => {
  const currentPipelineSelected = () => {
    return triggersGroupToAdd.filter(
      (trigger) =>
        trigger.programId.application === triggeringPipelineInfo.id &&
        trigger.programId.namespace === triggeringPipelineInfo.namespace
    );
  };

  const [state, dispatch] = useReducer(triggerConditionReducer, {
    ...initialInlineTriggerState,
    selected: currentPipelineSelected().length > 0,
  });

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

  const handlePipelineCheckClick = (e) => {
    e.stopPropagation();
    if (state.selected) {
      const selectedPipelineToRemove = currentPipelineSelected()[0];
      removePipelineFromGroup(selectedPipelineToRemove);
      dispatch({ type: 'PIPELINE_UNSELECT' });
    } else {
      addToTriggerGroupClick(null);
    }
  };

  const addToTriggerGroupClick = (mapping: ITriggerPropertyMapping[]) => {
    const config = getConfig();
    addToTriggerGroup(
      mapping,
      triggersGroupRunArgsToAdd,
      triggersGroupToAdd,
      selectedNamespace,
      triggeringPipelineInfo,
      config
    );
    dispatch({ type: 'PIPELINE_SELECT' });
  };

  const configureGroupTriggers = (mapping: ITriggerPropertyMapping[], propertiesConfig = {}) => {
    const validateResult = validateTriggerMappping(mapping, triggersGroupRunArgsToAdd);
    if (!!validateResult) {
      dispatch({ type: 'INVALID_MAPPING', error: validateResult });
    } else {
      addToTriggerGroupClick(mapping);
      dispatch({ type: 'TOGGLE_PAYLOAD' });
    }
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
        <AccordionCheckBox
          checked={state.selected}
          color="primary"
          disabled={enabledButtonDisabled}
          onClick={(e) => handlePipelineCheckClick(e)}
          data-cy={`${pipelineRow}-enable-trigger-btn`}
          data-testid={`${pipelineRow}-enable-trigger-btn`}
        />
      </StyledAccordionSummary>
      <StyledAccordionDetails>
        <Card>
          <CardContent>
            <div>
              <strong>{T.translate(`${TRIGGER_PREFIX}.description`)}: </strong>
              <span>{triggeringPipelineInfo && triggeringPipelineInfo.description}</span>
            </div>
            <HelperText>{T.translate(`${TRIGGER_PREFIX}.helperText`, { pipelineName })}</HelperText>
            <CheckboxContainer>
              <CheckboxItemContainer
                onClick={() => !state.selected && dispatch({ type: 'COMPLETED' })}
              >
                <Checkbox
                  disabled={state.selected}
                  checked={state.completed}
                  color="primary"
                  size="small"
                />
                <span>{T.translate(`${TRIGGER_PREFIX}.Events.COMPLETED`)}</span>
              </CheckboxItemContainer>
              <CheckboxItemContainer
                onClick={() => !state.selected && dispatch({ type: 'KILLED' })}
              >
                <Checkbox
                  disabled={state.selected}
                  checked={state.killed}
                  color="primary"
                  size="small"
                />
                <span>{T.translate(`${TRIGGER_PREFIX}.Events.KILLED`)}</span>
              </CheckboxItemContainer>

              <CheckboxItemContainer
                onClick={() => !state.selected && dispatch({ type: 'FAILED' })}
              >
                <Checkbox
                  disabled={state.selected}
                  checked={state.failed}
                  color="primary"
                  size="small"
                />
                <span>{T.translate(`${TRIGGER_PREFIX}.Events.FAILED`)}</span>
              </CheckboxItemContainer>
            </CheckboxContainer>
            {configureError && !state.payloadModalOpen && <ErrorText>{configureError}</ErrorText>}
            <PayloadConfigModal
              triggeringPipelineInfo={triggeringPipelineInfo}
              triggeredPipelineInfo={triggeredPipelineInfo}
              onConfigureSchedule={configureGroupTriggers}
              configureError={state.mappingError || configureError}
              isOpen={state.payloadModalOpen}
              onToggle={handlePayloadToggleClick}
              pipelineCompositeTriggersEnabled={true}
              modalConfigTab={ConfigTabs.PayLoadConfigTabConfig}
            />
          </CardContent>
          <CardActions>
            <TriggerCardButton
              disabled={state.selected}
              onClick={handlePayloadToggleClick}
              data-cy={`${triggeringPipelineInfo.id}-trigger-config-btn`}
              data-testid={`${triggeringPipelineInfo.id}-trigger-config-btn`}
            >
              {T.translate(`${PAYLOAD_PREFIX}.configPayloadBtnCaptalized`)}
            </TriggerCardButton>
            <TriggerCardButton
              onClick={() =>
                openLinkInNewTab(`/pipelines/ns/${selectedNamespace}/view/${pipelineRow}`)
              }
            >
              {T.translate(`${TRIGGER_PREFIX}.viewPipelineCapitalized`)}
            </TriggerCardButton>
          </CardActions>
        </Card>
      </StyledAccordionDetails>
    </StyledAccordion>
  );
};

export default PipelineCompositeTriggerRow;
