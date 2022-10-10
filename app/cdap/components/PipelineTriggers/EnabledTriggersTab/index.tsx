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
import { connect } from 'react-redux';
import EnabledTriggerRow from 'components/PipelineTriggers/EnabledTriggersTab/EnabledTriggerRow';
import CompositeTriggerRow from 'components/PipelineTriggers/EnabledTriggersTab/EnabledCompositeTriggerRow';
import T from 'i18n-react';
import { useFeatureFlagDefaultFalse } from 'services/react/customHooks/useFeatureFlag';
import PipelineTriggersTypes from 'components/PipelineTriggers/store/PipelineTriggersTypes';
import Button from '@material-ui/core/Button';
import { ICompositeTrigger, ISchedule } from 'components/PipelineTriggers/store/ScheduleTypes';
import {
  PipelineCount,
  PipelineListContainer,
  PipelineListHeader,
  PipelineTriggerHeader,
  SearchTriggerTextField,
  StyledNameSpaceHeader,
  StyledPipelineNameHeader,
  StyledTypeHeader,
  TriggersTab,
} from 'components/PipelineTriggers/shared.styles';
import styled from 'styled-components';
import { IconButton, InputAdornment } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

const TRIGGER_PREFIX = 'features.PipelineTriggers';
const PREFIX = `${TRIGGER_PREFIX}.EnabledTriggers`;

const AddNewTriggerButton = styled(Button)`
  background-color: #5a84e4;
  margin: 20px;
  position: absolute;
  right: 20px;
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
  const [searchInput, setSearchInput] = useState('');
  const pipelineCompositeTriggersEnabled = useFeatureFlagDefaultFalse(
    'pipeline.composite.triggers.enabled'
  );
  const enabledSingleTriggers = enabledTriggers.filter(
    (schedule) => schedule.trigger.type === PipelineTriggersTypes.programStatus
  );
  const enabledCompositeTriggers = enabledTriggers.filter(
    (schedule) =>
      schedule.trigger.type === PipelineTriggersTypes.andType ||
      schedule.trigger.type === PipelineTriggersTypes.orType
  );

  const onSearchTriggersChange = (e) => {
    setSearchInput(e.target.value);
  };

  const getFilteredCompositeTriggers = () => {
    if (!searchInput) {
      return enabledCompositeTriggers;
    }
    const newFilteredTriggers = enabledCompositeTriggers.filter(
      (compositeTrigger) =>
        compositeTrigger.name.toLowerCase().includes(searchInput) ||
        (compositeTrigger.description &&
          compositeTrigger.description.toLowerCase().includes(searchInput)) ||
        compositeTrigger.namespace.toLowerCase().includes(searchInput) ||
        (compositeTrigger.trigger as ICompositeTrigger).triggers.find((childTrigger) =>
          childTrigger.programId.application.toLowerCase().includes(searchInput)
        )
    );
    return newFilteredTriggers;
  };

  return (
    <TriggersTab>
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
        <PipelineListContainer>
          <PipelineListHeader>
            <StyledPipelineNameHeader>
              {T.translate(`${TRIGGER_PREFIX}.pipelineName`)}
            </StyledPipelineNameHeader>
            <StyledNameSpaceHeader>
              {T.translate(`${TRIGGER_PREFIX}.namespace`)}
            </StyledNameSpaceHeader>
          </PipelineListHeader>
          {enabledSingleTriggers.map((schedule) => (
            <EnabledTriggerRow schedule={schedule} />
          ))}
        </PipelineListContainer>
      )}

      {enabledCompositeTriggers.length === 0 ? null : (
        <PipelineListContainer>
          <SearchTriggerTextField
            onChange={onSearchTriggersChange}
            placeholder="Search triggers by name, namespace..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <PipelineListHeader>
            <StyledPipelineNameHeader>
              <div>{T.translate(`${TRIGGER_PREFIX}.groupTriggers`)}</div>
            </StyledPipelineNameHeader>
            <StyledTypeHeader>
              <div>{T.translate(`${TRIGGER_PREFIX}.pipelineTriggerTypeHeader`)}</div>
            </StyledTypeHeader>
          </PipelineListHeader>
          {getFilteredCompositeTriggers().map((compositeTrigger) => (
            <CompositeTriggerRow compositeTrigger={compositeTrigger} />
          ))}
        </PipelineListContainer>
      )}

      {pipelineCompositeTriggersEnabled && (
        <AddNewTriggerButton
          color="primary"
          variant="contained"
          onClick={() => setTab(1)}
          data-cy="add-new-group-trigger-btn"
          data-testid="add-new-group-trigger-btn"
        >
          {T.translate(`${PREFIX}.addNewTrigger`)}
        </AddNewTriggerButton>
      )}
    </TriggersTab>
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
