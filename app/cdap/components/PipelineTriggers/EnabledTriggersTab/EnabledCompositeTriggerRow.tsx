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
  getCompositePipelineInfo,
} from 'components/PipelineTriggers/store/PipelineTriggersActionCreator';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import T from 'i18n-react';
import { ISchedule, ICompositeTrigger } from 'components/PipelineTriggers/store/ScheduleTypes';
import ConfirmationModal from 'components/shared/ConfirmationModal';
import {
  PipelineName,
  StyledAccordion,
  StyledAccordionDetails,
  StyledAccordionSummary,
} from 'components/PipelineTriggers/shared.styles';
import { Button } from '@material-ui/core';

const TRIGGER_PREFIX = 'features.PipelineTriggers';

const DisableCompositeTriggerBtn = styled(Button)`
  right: 10px;
  padding: 0;
  position: absolute;
`;

const PipelineNameSummary = styled(PipelineName)`
  width: calc(100% - 125px);
`;

const StyledEnabledInlineTriggerRow = styled.div`
  &:not(:last-child) {
    padding-bottom: 5px;
  }
`;

interface IEnabledGroupTriggerRowProps {
  expandedSchedule: string;
  compositeTrigger: ISchedule;
  loading: boolean;
  pipelineName: string;
  disableError: string;
  workflowName: string;
}

const EnabledCompositeTriggerRowView = ({
  expandedSchedule,
  compositeTrigger,
  loading,
  pipelineName,
  disableError,
  workflowName,
}: IEnabledGroupTriggerRowProps) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const isExpanded = expandedSchedule === compositeTrigger.name;
  const scheduleName = compositeTrigger.isTransformed
    ? (compositeTrigger.trigger as ICompositeTrigger).triggers[0].programId.application
    : compositeTrigger.name;

  const handleConfirmModalOpen = (e) => {
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  function handleConfirmModalClose() {
    setShowDeleteModal(false);
  }

  function handleConfirmModal() {
    disableSchedule(compositeTrigger, pipelineName, workflowName);
    setShowDeleteModal(false);
  }

  function handleAccordionClick() {
    if (isExpanded) {
      getCompositePipelineInfo(null);
    } else {
      getCompositePipelineInfo(compositeTrigger);
    }
  }

  return (
    <StyledAccordion
      elevation={0}
      square
      expanded={isExpanded}
      onChange={() => handleAccordionClick()}
      data-cy={
        isExpanded ? `${compositeTrigger.name}-expanded` : `${compositeTrigger.name}-collapsed`
      }
      data-testid={
        isExpanded ? `${compositeTrigger.name}-expanded` : `${compositeTrigger.name}-collapsed`
      }
    >
      <StyledAccordionSummary>
        <PipelineNameSummary>{scheduleName}</PipelineNameSummary>
        <PipelineName>{compositeTrigger.trigger.type}</PipelineName>
        <DisableCompositeTriggerBtn
          onClick={handleConfirmModalOpen}
          data-cy="disable-group-trigger-btn"
          data-testid="disable-group-trigger-btn"
        >
          <DeleteOutlineIcon />
        </DisableCompositeTriggerBtn>
      </StyledAccordionSummary>
      <StyledAccordionDetails>
        <ConfirmationModal
          headerTitle={T.translate(`${TRIGGER_PREFIX}.EnabledTriggers.deleteTrigger`)}
          confirmationText={T.translate(
            `${TRIGGER_PREFIX}.EnabledTriggers.deleteConfirmationText`,
            {
              name: scheduleName,
            }
          )}
          confirmButtonText={T.translate(`${TRIGGER_PREFIX}.EnabledTriggers.deleteConfirm`)}
          confirmFn={handleConfirmModal}
          cancelFn={handleConfirmModalClose}
          toggleModal={handleConfirmModalClose}
          isOpen={showDeleteModal}
          errorMessage={disableError}
          isLoading={loading}
          closeable={true}
        />
        {(compositeTrigger.trigger as ICompositeTrigger).triggers.map((trigger) => {
          return (
            <StyledEnabledInlineTriggerRow>
              <EnabledInlineTriggerRow
                trigger={trigger}
                compositeTriggerSchedule={compositeTrigger}
                pipelineName={pipelineName}
                disableError={disableError}
              />
            </StyledEnabledInlineTriggerRow>
          );
        })}
      </StyledAccordionDetails>
    </StyledAccordion>
  );
};

const mapCompositeTriggerRowStateToProps = (state) => {
  return {
    expandedSchedule: state.triggers.expandedSchedule,
    loading: state.enabledTriggers.loading,
    disableError: state.enabledTriggers.disableError,
    pipelineName: state.triggers.pipelineName,
    workflowName: state.triggers.workflowName,
  };
};
const CompositeTriggerRow = connect(mapCompositeTriggerRowStateToProps)(
  EnabledCompositeTriggerRowView
);

export default CompositeTriggerRow;
