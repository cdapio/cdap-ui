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
  removePipelineFromGroup,
  enableGroupTrigger,
} from 'components/PipelineTriggers/store/PipelineTriggersActionCreator';
import { connect } from 'react-redux';
import PipelineTriggersActions from 'components/PipelineTriggers/store/PipelineTriggersActions';
import PipelineTriggersTypes from 'components/PipelineTriggers/store/PipelineTriggersTypes';
import PipelineTriggersRow from 'components/PipelineTriggers/PipelineListTab/PipelineTriggersRow';
import T from 'i18n-react';
import { GLOBALS } from 'services/global-constants';
import { useFeatureFlagDefaultFalse } from 'services/react/customHooks/useFeatureFlag';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import CloseIcon from '@material-ui/icons/Close';
import {
  IPipelineInfo,
  IProgramStatusTrigger,
  ISchedule,
  ITriggeringPipelineInfo,
  ICompositeTriggerRunArgsWithTargets,
  ITriggeringPipelineId,
} from 'components/PipelineTriggers/store/ScheduleTypes';
import ConfigTabs from 'components/PipelineTriggers/ScheduleRuntimeArgs/Tabs/TabConfig';
import {
  PipelineListContainer,
  PipelineListHeader,
  PipelineName,
  PipelineTriggerButton,
  PipelineTriggerHeader,
  StyledNameSpace,
} from 'components/PipelineTriggers/shared.styles';
import { TextField } from '@material-ui/core';
import { initialNameState, triggerNameReducer } from 'components/PipelineTriggers/reducer';
import PayloadConfigModal from 'components/PipelineTriggers/PayloadConfigModal';

const TRIGGER_PREFIX = 'features.PipelineTriggers';
const PREFIX = `${TRIGGER_PREFIX}.SetTriggers`;

const CloseTabIconButton = styled(IconButton)`
  float: right;
`;

const EnableGroupTriggerButton = styled(Button)`
  background-color: #5a84e4;
  text-transform: none;
`;

const NamespaceSelectorDropdown = styled.div`
  display: inline-block;
  width: 150px;
  margin-left: 10px;
  border-bottom: 2px solid #333333;
  margin-bottom: 10px;

  select.form-control:not([size]):not([multiple]) {
    border: 0;
    height: initial;
    box-shadow: none;
    cursor: pointer;
  }
`;

const PipelineCount = styled.div`
  margin-bottom: 10px;
`;

const PipelineListTabDiv = styled.div`
  padding: 15px;
`;

const SelectedGroupPipelinesContainer = styled.div`
  margin-bottom: 20px;
  font-weight: bold;
`;

const StyledDeleteIconButton = styled(IconButton)`
  && {
    padding: 7px;
  }
`;

const TypeSelectorDropdown = styled(NamespaceSelectorDropdown)`
  width: 255px;
`;

const TriggerNameTextField = styled(TextField)`
  width: 255px;
  && {
    margin: 5px 0 10px 5px;
    vertical-align: inherit;
    .MuiInput-underline:after {
      border-bottom: 2px solid black;
    }
    .MuiInputBase-input {
      text-align: center;
    }
    .MuiFormHelperText-root.Mui-error {
      text-align: center;
    }
  }
`;

const ButtonsWrap = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 10px;
`;

const PipelineTriggerComputeProfileButton = styled(PipelineTriggerButton)`
  background: #dddddd;
`;

const StyledPipelineName = styled(PipelineName)`
  width: calc(100% - 105px);
`;

const StyledSelectedPipelineName = styled(PipelineName)`
  width: calc(100% - 135px);
`;

interface IPipelineListTabViewProps {
  existingTriggers: ISchedule[];
  pipelineList: IPipelineInfo[];
  triggersGroupToAdd: IProgramStatusTrigger[];
  triggersGroupRunArgsToAdd: ICompositeTriggerRunArgsWithTargets;
  selectedNamespace: string;
  selectedTriggersType: string;
  pipelineName: string;
  expandedPipeline: string;
  toggleExpandPipeline: (pipeline: string) => void;
  workflowName: string;
  configureError: string;
  onPayloadToggle: (isOpen: boolean) => void;
  setTab: (tab: number) => void;
}

const PipelineListTabView = ({
  existingTriggers,
  pipelineList,
  triggersGroupToAdd,
  triggersGroupRunArgsToAdd,
  pipelineName,
  selectedNamespace,
  selectedTriggersType,
  expandedPipeline,
  toggleExpandPipeline,
  workflowName,
  configureError,
  setTab,
}: IPipelineListTabViewProps) => {
  const [state, dispatch] = useReducer(triggerNameReducer, initialNameState);

  useEffect(() => {
    dispatch({ type: 'SET_NAMESPACE' });
  }, []);

  const triggeredPipelineInfo = {
    id: pipelineName,
    namespace: state.namespace,
  };
  const selectedPipelines: ITriggeringPipelineId[] = triggersGroupToAdd.map((pipeline) => ({
    namespace: pipeline.programId.namespace,
    pipelineName: pipeline.programId.application,
  }));
  const availablePipelines = pipelineList.filter(
    (pipeline) =>
      !selectedPipelines.find(
        (selected) =>
          selected.namespace === selectedNamespace && selected.pipelineName === pipeline.name
      )
  );
  const pipelineCompositeTriggersEnabled = useFeatureFlagDefaultFalse(
    'pipeline.composite.triggers.enabled'
  );

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

  const changeNamespaceEvent = (e) => {
    changeNamespace(e.target.value);
  };

  const changeTriggerTypeEvent = (e) => {
    changeTriggersType(e.target.value);
  };

  const removePipelineFromGroupEvent = (pipeline) => {
    removePipelineFromGroup(pipeline);
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
      {pipelineCompositeTriggersEnabled && (
        <CloseTabIconButton onClick={() => setTab(0)}>
          <CloseIcon />
        </CloseTabIconButton>
      )}
      <PipelineTriggerHeader>
        {pipelineCompositeTriggersEnabled
          ? T.translate(`${PREFIX}.compositeTriggersTitle`, { pipelineName })
          : T.translate(`${PREFIX}.title`, { pipelineName })}
      </PipelineTriggerHeader>

      <div>
        <span>{T.translate(`${PREFIX}.viewNamespace`)}</span>
        <NamespaceSelectorDropdown>
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
        </NamespaceSelectorDropdown>
      </div>

      {pipelineCompositeTriggersEnabled && (
        <div>
          <div>
            <span>{T.translate(`${PREFIX}.triggerType`)}</span>
            <TypeSelectorDropdown>
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
            </TypeSelectorDropdown>
          </div>
          <div>
            <span>{T.translate(`${PREFIX}.triggerName`)}</span>
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
          {triggersGroupToAdd.length > 0 && (
            <SelectedGroupPipelinesContainer>
              <div>
                <PipelineListHeader>
                  <StyledPipelineName>
                    {T.translate(`${PREFIX}.selectedPipelines`)}
                  </StyledPipelineName>
                  <StyledNameSpace>{T.translate(`${TRIGGER_PREFIX}.namespace`)}</StyledNameSpace>
                </PipelineListHeader>
                {triggersGroupToAdd.map((pipeline) => {
                  return (
                    <div>
                      <StyledDeleteIconButton
                        onClick={() => removePipelineFromGroupEvent(pipeline)}
                      >
                        <DeleteIcon fontSize="small" />
                      </StyledDeleteIconButton>
                      <StyledSelectedPipelineName>
                        {pipeline.programId.application}
                      </StyledSelectedPipelineName>
                      <StyledNameSpace>{pipeline.programId.namespace}</StyledNameSpace>
                    </div>
                  );
                })}
              </div>
              <ButtonsWrap>
                <EnableGroupTriggerButton
                  color="primary"
                  disabled={state.isNameInvalid || triggersGroupToAdd.length === 0}
                  variant="contained"
                  onClick={() => addGroupTriggerClick()}
                  data-cy="enable-group-trigger-btn"
                >
                  {T.translate(`${PREFIX}.addNewTrigger`)}
                </EnableGroupTriggerButton>
                <PipelineTriggerComputeProfileButton
                  onClick={handlePayloadToggleClick}
                  data-cy={`${state.triggerName}-view-payload-btn`}
                >
                  {T.translate(`${PREFIX}.configComputeProfie`)}
                </PipelineTriggerComputeProfileButton>
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
          )}
          <SelectedGroupPipelinesContainer>
            <span>{T.translate(`${PREFIX}.selectPipelineInstruction`)}</span>
          </SelectedGroupPipelinesContainer>
        </div>
      )}
      <PipelineCount>
        {T.translate(`${PREFIX}.pipelineCount`, { count: availablePipelines.length })}
      </PipelineCount>
      {availablePipelines.length === 0 ? null : (
        <PipelineListContainer>
          <PipelineListHeader>
            <PipelineName>{T.translate(`${TRIGGER_PREFIX}.pipelineName`)}</PipelineName>
          </PipelineListHeader>
          {availablePipelines.map((pipeline) => {
            const triggeringPipelineInfo: ITriggeringPipelineInfo = {
              id: pipeline.name,
              namespace: selectedNamespace,
              description: pipeline.description,
              workflowName: GLOBALS.programId[pipeline.artifact.name],
            };
            return (
              <PipelineTriggersRow
                key={pipeline.name}
                pipelineRow={pipeline.name}
                isExpanded={expandedPipeline === pipeline.name}
                onToggle={toggleExpandPipeline}
                triggeringPipelineInfo={triggeringPipelineInfo}
                triggeredPipelineInfo={triggeredPipelineInfo}
                selectedNamespace={selectedNamespace}
                configureError={configureError}
                pipelineCompositeTriggersEnabled={pipelineCompositeTriggersEnabled}
                pipelineName={pipelineName}
                workflowName={workflowName}
                triggersGroupToAdd={triggersGroupToAdd}
                triggersGroupRunArgsToAdd={triggersGroupRunArgsToAdd}
              />
            );
          })}
        </PipelineListContainer>
      )}
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
    workflowName: state.triggers.workflowName,
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

const PipelineListTab = connect(mapStateToProps, mapDispatch)(PipelineListTabView);

export default PipelineListTab;
