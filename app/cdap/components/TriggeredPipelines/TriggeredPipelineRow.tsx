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
import LoadingSVG from 'components/shared/LoadingSVG';
import T from 'i18n-react';
import {
  HelperText,
  LoadingIconStyle,
  PipelineDescription,
  PipelineLink,
  StyledAccordion,
  StyledAccordionDetails,
  StyledAccordionSummary,
  StyledNameSpace,
  StyledPipelineName,
} from 'components/PipelineTriggers/shared.styles';
import {
  ICompositeTrigger,
  IPipelineInfo,
  ISchedule,
} from 'components/PipelineTriggers/store/ScheduleTypes';
import { openLinkInNewTab } from 'services/helpers';

const PREFIX = `features.TriggeredPipelines`;

interface ITriggeredPipelineRowProps {
  isExpanded: boolean;
  schedule: ISchedule;
  onToggle: (pipeline: ISchedule) => void;
  pipelineInfo: IPipelineInfo;
  sourcePipeline: string;
  pipelineCompositeTriggersEnabled: boolean;
}

export const TriggeredPipelineRow = ({
  isExpanded,
  schedule,
  onToggle,
  pipelineInfo,
  sourcePipeline,
  pipelineCompositeTriggersEnabled,
}: ITriggeredPipelineRowProps) => {
  let programStatuses = [];
  let scheduleName = '';
  if ('triggers' in schedule.trigger) {
    scheduleName = schedule.name;
    (schedule.trigger as ICompositeTrigger).triggers
      .filter((tr) => tr.programId.application === sourcePipeline)
      .map((t) => programStatuses.push(...t.programStatuses));
  } else {
    programStatuses = schedule.trigger.programStatuses;
    scheduleName = schedule.trigger.programId.application;
  }

  const renderLoading = () => {
    return (
      <LoadingIconStyle>
        <LoadingSVG height="15px" />
      </LoadingIconStyle>
    );
  };

  const handleAccordionClick = () => {
    if (isExpanded) {
      onToggle(null);
    } else {
      onToggle(schedule);
    }
  };

  return (
    <StyledAccordion
      elevation={0}
      square
      expanded={isExpanded}
      onChange={() => handleAccordionClick()}
      data-cy={
        isExpanded
          ? `${schedule.application}-triggered-expanded`
          : `${schedule.application}-triggered-collapsed`
      }
    >
      <StyledAccordionSummary>
        <StyledPipelineName>{schedule.application}</StyledPipelineName>
        <StyledNameSpace>{schedule.namespace}</StyledNameSpace>
      </StyledAccordionSummary>
      <StyledAccordionDetails>
        <PipelineDescription>
          <strong>{T.translate(`${PREFIX}.description`)}: </strong>
          {pipelineInfo ? <span>{pipelineInfo.description}</span> : renderLoading()}
          <PipelineLink
            href={`/pipelines/ns/${schedule.namespace}/view/${schedule.application}`}
            // The Anchor tab is not working, using this hacky way to fix it for now
            onClick={() =>
              openLinkInNewTab(`/pipelines/ns/${schedule.namespace}/view/${schedule.application}`)
            }
          >
            {T.translate(`${PREFIX}.viewPipeline`)}
          </PipelineLink>
        </PipelineDescription>
        <HelperText>
          {pipelineCompositeTriggersEnabled
            ? T.translate(`${PREFIX}.compositeTriggerHelperText`, {
                pipelineName: sourcePipeline,
                triggerName: scheduleName,
              })
            : T.translate(`${PREFIX}.helperText`, { pipelineName: sourcePipeline })}
        </HelperText>
        <div>
          {programStatuses.map((status) => {
            return <div>- {T.translate(`${PREFIX}.Events.${status}`)}</div>;
          })}
        </div>
      </StyledAccordionDetails>
    </StyledAccordion>
  );
};

export default TriggeredPipelineRow;
