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

import { connect } from 'react-redux';
import styled from 'styled-components';
import React, { useEffect, useState } from 'react';
import {
  disableSchedule,
  getPipelineInfo,
} from 'components/PipelineTriggers/store/PipelineTriggersActionCreator';
import LoadingSVG from 'components/shared/LoadingSVG';
import PayloadConfigModal from 'components/PipelineTriggers/PayloadConfigModal';
import T from 'i18n-react';
import NamespaceStore from 'services/NamespaceStore';
import Checkbox from '@material-ui/core/Checkbox';
import {
  IPipelineInfo,
  IProgramStatusTrigger,
  ISchedule,
} from 'components/PipelineTriggers/store/ScheduleTypes';
import {
  ActionButtonsContainer,
  CheckboxItemContainer,
  ErrorText,
  EventsList,
  HelperText,
  LoadingIconStyle,
  PipelineDescription,
  PipelineLink,
  PipelineName,
  PipelineTriggerButton,
  StyledAccordion,
  StyledAccordionDetails,
  StyledAccordionSummary,
  StyledNameSpace,
} from 'components/PipelineTriggers/shared.styles';
import ConfirmationModal from 'components/shared/ConfirmationModal';
import { openLinkInNewTab } from 'services/helpers';

const TRIGGER_PREFIX = 'features.PipelineTriggers';
const PAYLOAD_PREFIX = `${TRIGGER_PREFIX}.ScheduleRuntimeArgs.PayloadConfigModal`;
const PREFIX = `${TRIGGER_PREFIX}.EnabledTriggers`;

const StyledPipelineName = styled(PipelineName)`
  width: calc(100% - 125px);
`;

interface IEnabledTriggerRowViewProps {
  expandedSchedule: string;
  schedule: ISchedule;
  loading: boolean;
  info: IPipelineInfo;
  pipelineName: string;
  disableError: string;
  workflowName: string;
}

const EnabledTriggerRowView = ({
  expandedSchedule,
  schedule,
  loading,
  info,
  pipelineName,
  disableError,
  workflowName,
}: IEnabledTriggerRowViewProps) => {
  const currentTrigger = schedule.trigger as IProgramStatusTrigger;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedNamespace, setSelectedNamesapce] = useState(null);
  const [payloadModalOpen, setPayloadModalOpen] = useState(false);
  const isExpanded = expandedSchedule === schedule.name;
  useEffect(() => {
    const ns = NamespaceStore.getState().selectedNamespace;
    setSelectedNamesapce(ns);
  }, []);

  function handleConfirmModalOpen() {
    setShowDeleteModal(true);
  }

  function handleConfirmModalClose() {
    setShowDeleteModal(false);
  }

  function handleConfirmModal() {
    setShowDeleteModal(false);
    disableSchedule(schedule, pipelineName, workflowName);
  }

  function handleAccordionClick() {
    if (isExpanded) {
      getPipelineInfo(null);
    } else {
      getPipelineInfo(schedule);
    }
  }

  const renderLoading = () => {
    return (
      <LoadingIconStyle>
        <LoadingSVG height="15px" />
      </LoadingIconStyle>
    );
  };

  const handlePayloadToggleClick = () => {
    setPayloadModalOpen(!payloadModalOpen);
  };

  const renderContent = () => {
    const triggeredPipelineInfo = {
      id: pipelineName,
      namespace: selectedNamespace,
    };

    const triggeringPipelineInfo = {
      id: currentTrigger.programId.application,
      namespace: currentTrigger.programId.namespace,
    };

    const events = currentTrigger.programStatuses;
    const completed = events.indexOf('COMPLETED') > -1;
    const killed = events.indexOf('KILLED') > -1;
    const failed = events.indexOf('FAILED') > -1;

    return (
      <div>
        <PipelineDescription>
          <strong>{T.translate(`${TRIGGER_PREFIX}.description`)}: </strong>
          {info ? <span>{info && info.description}</span> : renderLoading()}
          <PipelineLink
            href={`/pipelines/ns/${triggeringPipelineInfo.namespace}/view/${triggeringPipelineInfo.id}`}
            target="_blank"
            // The Anchor tab is not working, using this hacky way to fix it for now
            onClick={() =>
              openLinkInNewTab(
                `/pipelines/ns/${triggeringPipelineInfo.namespace}/view/${triggeringPipelineInfo.id}`
              )
            }
          >
            {T.translate(`${TRIGGER_PREFIX}.viewPipeline`)}
          </PipelineLink>
        </PipelineDescription>
        <HelperText>{T.translate(`${TRIGGER_PREFIX}.helperText`, { pipelineName })}</HelperText>
        <EventsList>
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
        </EventsList>

        {disableError && <ErrorText>{disableError}</ErrorText>}

        <ActionButtonsContainer>
          <PipelineTriggerButton
            onClick={() => handleConfirmModalOpen()}
            data-cy="disable-trigger-btn"
            data-testid="disable-trigger-btn"
          >
            {T.translate(`${PREFIX}.deleteTriggerButton`)}
          </PipelineTriggerButton>
          <PipelineTriggerButton
            onClick={handlePayloadToggleClick}
            data-cy={`${triggeringPipelineInfo.id}-view-payload-btn`}
            data-testid={`${triggeringPipelineInfo.id}-view-payload-btn`}
          >
            {T.translate(`${PAYLOAD_PREFIX}.configPayloadBtnDisabled`)}
          </PipelineTriggerButton>
        </ActionButtonsContainer>
        <ConfirmationModal
          headerTitle={T.translate(`${PREFIX}.deleteTrigger`)}
          confirmationText={T.translate(`${PREFIX}.deleteConfirmationText`, {
            name: pipelineName,
          })}
          confirmButtonText={T.translate(`${PREFIX}.deleteConfirm`)}
          confirmFn={handleConfirmModal}
          cancelFn={handleConfirmModalClose}
          isOpen={showDeleteModal}
          errorMessage={disableError}
          isLoading={loading}
        />
        <PayloadConfigModal
          isOpen={payloadModalOpen}
          onToggle={handlePayloadToggleClick}
          triggeringPipelineInfo={triggeringPipelineInfo}
          triggeredPipelineInfo={triggeredPipelineInfo}
          scheduleInfo={schedule}
          disabled={true}
        />
      </div>
    );
  };

  return (
    <StyledAccordion
      elevation={0}
      square
      expanded={isExpanded}
      onChange={() => handleAccordionClick()}
      data-cy={
        isExpanded
          ? `${currentTrigger.programId.application}-expanded`
          : `${currentTrigger.programId.application}-collapsed`
      }
      data-testid={
        isExpanded
          ? `${currentTrigger.programId.application}-expanded`
          : `${currentTrigger.programId.application}-collapsed`
      }
    >
      <StyledAccordionSummary>
        <StyledPipelineName>{currentTrigger.programId.application}</StyledPipelineName>
        <StyledNameSpace>{currentTrigger.programId.namespace}</StyledNameSpace>
      </StyledAccordionSummary>
      <StyledAccordionDetails>{renderContent()}</StyledAccordionDetails>
    </StyledAccordion>
  );
};

const mapTriggerRowStateToProps = (state) => {
  return {
    expandedSchedule: state.triggers.expandedSchedule,
    loading: state.enabledTriggers.loading,
    info: state.enabledTriggers.pipelineInfo,
    disableError: state.enabledTriggers.disableError,
    pipelineName: state.triggers.pipelineName,
    workflowName: state.triggers.workflowName,
  };
};

const EnabledTriggerRow = connect(mapTriggerRowStateToProps)(EnabledTriggerRowView);

export default EnabledTriggerRow;
