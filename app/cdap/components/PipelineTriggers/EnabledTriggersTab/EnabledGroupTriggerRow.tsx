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

import React, { useState } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import EnabledInlineTriggerRow from 'components/PipelineTriggers/EnabledTriggersTab/EnabledInlineTriggerRow';
import {
  disableSchedule,
  getGroupPipelineInfo,
} from 'components/PipelineTriggers/store/PipelineTriggersActionCreator';
import T from 'i18n-react';
import { ISchedule, IGroupTrigger } from 'components/PipelineTriggers/store/ScheduleTypes';
import ConfirmationModal from 'components/shared/ConfirmationModal';
import {
  PipelineName,
  PipelineTriggerButton,
  StyledAccordion,
  StyledAccordionDetails,
  StyledAccordionSummary,
} from 'components/PipelineTriggers/shared.styles';

const TRIGGER_PREFIX = 'features.PipelineTriggers';

const DisableGroupTriggerBtn = styled(PipelineTriggerButton)`
  height: fit-content;
  margin-top: 5px;
  right: 10px;
  width: 100px;
`;

const TriggerType = styled(PipelineName)`
  margin: 10px;
`;

const GroupTriggerHeaderWrap = styled.div`
  display: flex;
  justify-content: space-between;
`;

interface IEnabledGroupTriggerRowProps {
  expandedSchedule: string;
  triggerGroup: ISchedule;
  loading: boolean;
  pipelineName: string;
  disableError: string;
  workflowName: string;
}

const EnabledGroupTriggerRowView = ({
  expandedSchedule,
  triggerGroup,
  loading,
  pipelineName,
  disableError,
  workflowName,
}: IEnabledGroupTriggerRowProps) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const isExpanded = expandedSchedule === triggerGroup.name;
  const scheduleName = triggerGroup.isTransformed
    ? (triggerGroup.trigger as IGroupTrigger).triggers[0].programId.application
    : triggerGroup.name;

  function handleConfirmModalOpen() {
    setShowDeleteModal(true);
  }

  function handleConfirmModalClose() {
    setShowDeleteModal(false);
  }

  function handleConfirmModal() {
    disableSchedule(triggerGroup, pipelineName, workflowName);
    setShowDeleteModal(false);
  }

  function handleAccordionClick() {
    if (isExpanded) {
      getGroupPipelineInfo(null);
    } else {
      getGroupPipelineInfo(triggerGroup);
    }
  }

  return (
    <StyledAccordion
      elevation={0}
      square
      expanded={isExpanded}
      onChange={() => handleAccordionClick()}
      data-cy={isExpanded ? `${triggerGroup.name}-expanded` : `${triggerGroup.name}-collapsed`}
    >
      <StyledAccordionSummary>
        <PipelineName>{scheduleName}</PipelineName>
      </StyledAccordionSummary>
      <StyledAccordionDetails>
        <GroupTriggerHeaderWrap>
          <TriggerType>
            {T.translate(`${TRIGGER_PREFIX}.pipelineTriggerType`, {
              type: triggerGroup.trigger.type,
            })}
          </TriggerType>
          <DisableGroupTriggerBtn
            onClick={handleConfirmModalOpen}
            data-cy="disable-group-trigger-btn"
          >
            {T.translate(`${TRIGGER_PREFIX}.EnabledTriggers.deleteTriggerButton`)}
          </DisableGroupTriggerBtn>
        </GroupTriggerHeaderWrap>
        <ConfirmationModal
          headerTitle={T.translate(`${TRIGGER_PREFIX}.EnabledTriggers.deleteTrigger`)}
          confirmationText={T.translate(
            `${TRIGGER_PREFIX}.EnabledTriggers.deleteConfirmationText`,
            {
              type: triggerGroup.trigger.type,
            }
          )}
          confirmButtonText={T.translate(`${TRIGGER_PREFIX}.EnabledTriggers.deleteConfirm`)}
          confirmFn={handleConfirmModal}
          cancelFn={handleConfirmModalClose}
          isOpen={showDeleteModal}
          errorMessage={disableError}
          isLoading={loading}
        />
        {(triggerGroup.trigger as IGroupTrigger).triggers.map((trigger) => {
          return (
            <EnabledInlineTriggerRow
              trigger={trigger}
              groupSchedule={triggerGroup}
              pipelineName={pipelineName}
              disableError={disableError}
            />
          );
        })}
      </StyledAccordionDetails>
    </StyledAccordion>
  );
};

const mapGroupTriggerRowStateToProps = (state) => {
  return {
    expandedSchedule: state.triggers.expandedSchedule,
    loading: state.enabledTriggers.loading,
    disableError: state.enabledTriggers.disableError,
    pipelineName: state.triggers.pipelineName,
    workflowName: state.triggers.workflowName,
  };
};
const GroupTriggerRow = connect(mapGroupTriggerRowStateToProps)(EnabledGroupTriggerRowView);

export default GroupTriggerRow;
