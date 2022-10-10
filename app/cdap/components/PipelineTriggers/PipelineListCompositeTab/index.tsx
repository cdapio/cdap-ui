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

import React, { useEffect, useReducer } from 'react';
import styled from 'styled-components';
import {
  changeNamespace,
  changeTriggersType,
  enableGroupTrigger,
} from 'components/PipelineTriggers/store/PipelineTriggersActionCreator';
import { connect } from 'react-redux';
import PipelineTriggersActions from 'components/PipelineTriggers/store/PipelineTriggersActions';
import PipelineTriggersTypes from 'components/PipelineTriggers/store/PipelineTriggersTypes';
import T from 'i18n-react';
import { GLOBALS } from 'services/global-constants';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import {
  IPipelineInfo,
  IProgramStatusTrigger,
  ISchedule,
  ITriggeringPipelineInfo,
  ICompositeTriggerRunArgsWithTargets,
} from 'components/PipelineTriggers/store/ScheduleTypes';
import ConfigTabs from 'components/PipelineTriggers/ScheduleRuntimeArgs/Tabs/TabConfig';
import {
  PipelineCount,
  PipelineListContainer,
  PipelineListHeader,
  PipelineName,
  PipelineTriggerButton,
  PipelineTriggerHeader,
  SearchTriggerTextField,
} from 'components/PipelineTriggers/shared.styles';
import { InputAdornment, TextField } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import {
  initialAvailablePipelineListState,
  triggerNameReducer,
} from 'components/PipelineTriggers/reducer';
import PayloadConfigModal from 'components/PipelineTriggers/PayloadConfigModal';
import PipelineCompositeTriggerRow from './PipelineCompositeTriggerRow';

const TRIGGER_PREFIX = 'features.PipelineTriggers';
const PREFIX = `${TRIGGER_PREFIX}.SetTriggers`;

const CloseTabIconButton = styled(IconButton)`
  float: right;
`;

const EnableGroupTriggerButton = styled(Button)`
  background-color: #5a84e4;
`;

const SelectorDropdown = styled.div`
  display: inline-block;
  width: 100%;
  border-bottom: 2px solid #333333;
  margin-bottom: 10px;

  select.form-control:not([size]):not([multiple]) {
    border: 0;
    height: initial;
    box-shadow: none;
    cursor: pointer;
  }
`;

const PipelineListTabDiv = styled.div`
  padding: 15px;
`;

const SelectedGroupPipelinesContainer = styled.div`
  margin: 20px 0;
  font-weight: bold;
`;

const TriggerNameTextField = styled(TextField)`
  width: 100%;
  && {
    margin: 5px 0 10px 0;
    vertical-align: inherit;
    .MuiInput-underline:after {
      border-bottom: 2px solid black;
    }
    .MuiInputBase-input {
      margin-left: 15px;
    }
    .MuiFormHelperText-root.Mui-error {
      margin-left: 15px;
    }
  }
`;

const ButtonsWrap = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 20px;
`;

const PipelineTriggerComputeProfileButton = styled(PipelineTriggerButton)`
  background: #dddddd;
`;

const TriggerConfigHeader = styled.div`
  color: #888888;
  font-size: 11px;
`;

interface IPipelineListCompositeTabViewProps {
  existingTriggers: ISchedule[];
  pipelineList: IPipelineInfo[];
  triggersGroupToAdd: IProgramStatusTrigger[];
  triggersGroupRunArgsToAdd: ICompositeTriggerRunArgsWithTargets;
  selectedNamespace: string;
  selectedTriggersType: string;
  pipelineName: string;
  expandedPipeline: string;
  toggleExpandPipeline: (pipeline: string) => void;
  configureError: string;
  onPayloadToggle: (isOpen: boolean) => void;
  setTab: (tab: number) => void;
}

const PipelineListCompositeTabView = ({
  existingTriggers,
  pipelineList,
  triggersGroupToAdd,
  triggersGroupRunArgsToAdd,
  pipelineName,
  selectedNamespace,
  selectedTriggersType,
  expandedPipeline,
  toggleExpandPipeline,
  configureError,
  setTab,
}: IPipelineListCompositeTabViewProps) => {
  const [state, dispatch] = useReducer(triggerNameReducer, initialAvailablePipelineListState);

  useEffect(() => {
    dispatch({ type: 'SET_NAMESPACE' });
  }, []);

  const triggeredPipelineInfo = {
    id: pipelineName,
    namespace: state.namespace,
  };

  const onTriggerNameChange = (e) => {
    const newTriggerName = e.target.value;

    if (!newTriggerName) {
      dispatch({ type: 'NO_TRIGGER_NAME_ERROR' });
      return;
    }

    if (newTriggerName && newTriggerName.length > 50) {
      dispatch({ type: 'TRIGGER_NAME_TOO_LONG', triggerName: newTriggerName.slice(0, 50) });
      return;
    }

    if (existingTriggers.find((schedule) => schedule.name === newTriggerName)) {
      dispatch({ type: 'TRIGGER_NAME_EXISTS_ERROR', triggerName: newTriggerName });
      return;
    }

    dispatch({ type: 'SET_VALID_TRIGGER_NAME', triggerName: newTriggerName });
  };

  const onSearchPipelineChange = (e) => {
    const searchInput = e.target.value;
    dispatch({ type: 'SET_SEARCH_INPUT', searchInput });
  };

  const getFilteredPipelines = () => {
    if (!state.searchInput) {
      return pipelineList;
    }
    const newFilteredPipelines = pipelineList.filter(
      (pipeline) =>
        pipeline.name.toLowerCase().includes(state.searchInput) ||
        (pipeline.description && pipeline.description.toLowerCase().includes(state.searchInput))
    );
    return newFilteredPipelines;
  };

  const changeNamespaceEvent = (e) => {
    changeNamespace(e.target.value);
  };

  const changeTriggerTypeEvent = (e) => {
    changeTriggersType(e.target.value);
  };

  const addGroupTriggerClick = () => {
    enableGroupTrigger(state.triggerName, setTab, state.computeProfile);
  };

  const handlePayloadToggleClick = () => {
    dispatch({ type: 'TOGGLE_PAYLOAD' });
  };

  const configureComputeProfile = (mapping, propertiesConfig = {}) => {
    dispatch({ type: 'COMPUTE_PROFILE', computeProfile: propertiesConfig });
  };

  return (
    <PipelineListTabDiv>
      <CloseTabIconButton onClick={() => setTab(0)}>
        <CloseIcon />
      </CloseTabIconButton>
      <PipelineTriggerHeader>
        {T.translate(`${PREFIX}.compositeTriggersTitle`, { pipelineName })}
      </PipelineTriggerHeader>
      <div>
        <TriggerConfigHeader>{T.translate(`${PREFIX}.viewNamespace`)}</TriggerConfigHeader>
        <SelectorDropdown>
          <select
            className="form-control"
            value={selectedNamespace}
            onChange={changeNamespaceEvent}
          >
            {state.namespaceList &&
              state.namespaceList.map((ns) => {
                return (
                  <option value={ns.name} key={ns.name}>
                    {ns.name}
                  </option>
                );
              })}
          </select>
        </SelectorDropdown>
      </div>
      <div>
        <div>
          <TriggerConfigHeader>{T.translate(`${PREFIX}.triggerType`)}</TriggerConfigHeader>
          <SelectorDropdown>
            <select
              className="form-control"
              value={selectedTriggersType}
              onChange={changeTriggerTypeEvent}
            >
              <option value={PipelineTriggersTypes.orType} key="orTrigger">
                {T.translate(`${PREFIX}.triggerOrType`)}
              </option>
              <option value={PipelineTriggersTypes.andType} key="andTrigger">
                {T.translate(`${PREFIX}.triggerAndType`)}
              </option>
            </select>
          </SelectorDropdown>
        </div>
        <div>
          <TriggerConfigHeader>{T.translate(`${PREFIX}.triggerName`)}</TriggerConfigHeader>
          <TriggerNameTextField
            required
            focused
            id="standard-required"
            onChange={onTriggerNameChange}
            placeholder="Enter the Trigger Name..."
            error={state.isNameInvalid}
            helperText={state.triggerNameError}
          />
        </div>

        <SelectedGroupPipelinesContainer>
          <span>{T.translate(`${PREFIX}.selectPipelineInstruction`)}</span>
        </SelectedGroupPipelinesContainer>
      </div>
      <PipelineCount>
        {T.translate(`${PREFIX}.pipelineCount`, { count: pipelineList.length })}
      </PipelineCount>

      <SearchTriggerTextField
        onChange={onSearchPipelineChange}
        placeholder="Search available pipelines"
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

      {pipelineList.length === 0 ? null : (
        <PipelineListContainer>
          <PipelineListHeader>
            <PipelineName>{T.translate(`${TRIGGER_PREFIX}.pipelineName`)}</PipelineName>
          </PipelineListHeader>
          {getFilteredPipelines().map((pipeline) => {
            const triggeringPipelineInfo: ITriggeringPipelineInfo = {
              id: pipeline.name,
              namespace: selectedNamespace,
              description: pipeline.description,
              workflowName: GLOBALS.programId[pipeline.artifact.name],
            };
            return (
              <PipelineCompositeTriggerRow
                key={pipeline.name}
                pipelineRow={pipeline.name}
                isExpanded={expandedPipeline === pipeline.name}
                onToggle={toggleExpandPipeline}
                triggeringPipelineInfo={triggeringPipelineInfo}
                triggeredPipelineInfo={triggeredPipelineInfo}
                selectedNamespace={selectedNamespace}
                configureError={configureError}
                pipelineName={pipelineName}
                triggersGroupToAdd={triggersGroupToAdd}
                triggersGroupRunArgsToAdd={triggersGroupRunArgsToAdd}
              />
            );
          })}
        </PipelineListContainer>
      )}
      <SelectedGroupPipelinesContainer>
        <ButtonsWrap>
          <PipelineTriggerComputeProfileButton
            onClick={handlePayloadToggleClick}
            data-cy={`${state.triggerName}-view-payload-btn`}
            data-testid={`${state.triggerName}-view-payload-btn`}
          >
            {T.translate(`${PREFIX}.configComputeProfie`)}
          </PipelineTriggerComputeProfileButton>
          <EnableGroupTriggerButton
            color="primary"
            disabled={state.isNameInvalid || triggersGroupToAdd.length === 0}
            variant="contained"
            onClick={() => addGroupTriggerClick()}
            data-cy="enable-group-trigger-btn"
            data-testid="enable-group-trigger-btn"
          >
            {T.translate(`${PREFIX}.addNewTrigger`)}
          </EnableGroupTriggerButton>
        </ButtonsWrap>
        <PayloadConfigModal
          triggeringPipelineInfo={{
            id: '',
            namespace: selectedNamespace,
          }}
          isOpen={state.computeModalOpen}
          triggeredPipelineInfo={triggeredPipelineInfo}
          onConfigureSchedule={configureComputeProfile}
          configureError={configureError}
          onToggle={handlePayloadToggleClick}
          pipelineCompositeTriggersEnabled={true}
          modalConfigTab={ConfigTabs.ComputeProfileTabConfig}
        />
      </SelectedGroupPipelinesContainer>
    </PipelineListTabDiv>
  );
};

const mapStateToProps = (state) => {
  return {
    existingTriggers: state.triggers.enabledTriggers,
    pipelineList: state.triggers.pipelineList,
    triggersGroupToAdd: state.triggers.triggersGroupToAdd,
    triggersGroupRunArgsToAdd: state.triggers.triggersGroupRunArgsToAdd,
    selectedNamespace: state.triggers.selectedNamespace,
    selectedTriggersType: state.triggers.selectedTriggersType,
    pipelineName: state.triggers.pipelineName,
    expandedPipeline: state.triggers.expandedPipeline,
    configureError: state.triggers.configureError,
  };
};

const mapDispatch = (dispatch) => {
  return {
    toggleExpandPipeline: (pipeline) => {
      dispatch({
        type: PipelineTriggersActions.setExpandedPipeline,
        payload: { expandedPipeline: pipeline },
      });
    },
  };
};

const PipelineListCompositeTab = connect(
  mapStateToProps,
  mapDispatch
)(PipelineListCompositeTabView);

export default PipelineListCompositeTab;
