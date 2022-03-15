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
  position: absolute;
  right: 10px;
  width: 100px;
`;

const TriggerType = styled(PipelineName)`
  margin: 10px;
`;

interface IEnabledGroupTriggerRowProps {
  expandedTrigger: string;
  triggerGroup: ISchedule;
  loading: boolean;
  pipelineName: string;
  disableError: string;
  workflowName: string;
}

const EnabledGroupTriggerRowView = ({
  expandedTrigger,
  triggerGroup,
  loading,
  pipelineName,
  disableError,
  workflowName,
}: IEnabledGroupTriggerRowProps) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  function handleConfirmModalOpen() {
    setShowDeleteModal(true);
  }

  function handleConfirmModalClose() {
    setShowDeleteModal(false);
  }

  function handleConfirmModal() {
    setShowDeleteModal(false);
    disableSchedule(triggerGroup, pipelineName, workflowName);
  }

  function handleAccordionClick() {
    if (expandedTrigger === triggerGroup.name) {
      getGroupPipelineInfo(null);
    } else {
      getGroupPipelineInfo(triggerGroup);
    }
  }

  return (
    <StyledAccordion
      elevation={0}
      square
      expanded={expandedTrigger === triggerGroup.name}
      onChange={() => handleAccordionClick()}
      data-cy={
        expandedTrigger === triggerGroup.name
          ? `${triggerGroup.name}-expanded`
          : `${triggerGroup.name}-collapsed`
      }
    >
      <StyledAccordionSummary>
        <PipelineName>{triggerGroup.name}</PipelineName>
      </StyledAccordionSummary>
      <StyledAccordionDetails>
        <DisableGroupTriggerBtn
          onClick={handleConfirmModalOpen}
          data-cy="disable-group-trigger-btn"
        >
          {T.translate(`${TRIGGER_PREFIX}.EnabledTriggers.deleteTriggerButton`)}
        </DisableGroupTriggerBtn>
        <TriggerType>
          {T.translate(`${TRIGGER_PREFIX}.pipelineTriggerType`, {
            type: triggerGroup.trigger.type,
          })}
        </TriggerType>
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
    expandedTrigger: state.triggers.expandedTrigger,
    loading: state.enabledTriggers.loading,
    disableError: state.enabledTriggers.disableError,
    pipelineName: state.triggers.pipelineName,
    workflowName: state.triggers.workflowName,
  };
};
const GroupTriggerRow = connect(mapGroupTriggerRowStateToProps)(EnabledGroupTriggerRowView);

export default GroupTriggerRow;
