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

import React, { useEffect, useReducer, useState } from 'react';
import styled from 'styled-components';
import {
  changeMaxConcurrentRuns,
  changeNamespace,
  changeTriggersType,
  enableGroupTrigger,
  fetchTriggersAndApps,
  isLastPipelinesPage,
  fetchPipelinesList,
  setNameFilter,
  updateCurrentPage,
  updatePageSize,
} from 'components/PipelineTriggers/store/PipelineTriggersActionCreator';
import { connect, useSelector } from 'react-redux';
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
  PipelineListContainer,
  PipelineListHeader,
  PipelineNameHeading,
  PipelineTriggerButton,
  PipelineTriggerHeader,
  RefreshTimeLabel,
  SearchTriggerTextField,
  StyledRefreshIcon,
} from 'components/PipelineTriggers/shared.styles';
import { InputAdornment, TablePagination, TextField, Tooltip, withStyles } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import {
  initialAvailablePipelineListState,
  triggerNameReducer,
} from 'components/PipelineTriggers/reducer';
import PayloadConfigModal from 'components/PipelineTriggers/PayloadConfigModal';
import PipelineCompositeTriggerRow from './PipelineCompositeTriggerRow';
import { DEFAULT_TRIGGER_MAX_CONCURRENT_RUNS } from '../store/PipelineTriggersStore';
import { getDataTestid } from '@cdap-ui/testids/TestidsProvider';

const TRIGGER_PREFIX = 'features.PipelineTriggers';
const PREFIX = `${TRIGGER_PREFIX}.SetTriggers`;
const TESTID_PREFIX = 'features.pipelineTriggers.setTriggers';

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
  margin: 10px 0;
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

const CustomTooltip = withStyles(() => {
  return {
    arrow: {
      color: '#3c4355',
    },
    tooltip: {
      fontSize: '13px',
      backgroundColor: '#3c4355',
    },
  };
})(Tooltip);

interface IPipelineListCompositeTabViewProps {
  existingTriggers: ISchedule[];
  paginatedPipelineList: IPipelineInfo[][];
  triggersGroupToAdd: IProgramStatusTrigger[];
  triggersGroupRunArgsToAdd: ICompositeTriggerRunArgsWithTargets;
  selectedNamespace: string;
  selectedTriggersType: string;
  pipelineName: string;
  pipelineType: string;
  expandedPipeline: string;
  toggleExpandPipeline: (pipeline: string) => void;
  configureError: string;
  onPayloadToggle: (isOpen: boolean) => void;
  setTab: (tab: number) => void;
  maxConcurrentRuns?: number;
}

const PipelineListCompositeTabView = ({
  existingTriggers,
  paginatedPipelineList,
  triggersGroupToAdd,
  triggersGroupRunArgsToAdd,
  pipelineName,
  pipelineType,
  selectedNamespace,
  selectedTriggersType,
  expandedPipeline,
  toggleExpandPipeline,
  configureError,
  setTab,
  maxConcurrentRuns = DEFAULT_TRIGGER_MAX_CONCURRENT_RUNS,
}: IPipelineListCompositeTabViewProps) => {
  const [state, dispatch] = useReducer(triggerNameReducer, initialAvailablePipelineListState);
  const [isReloading, setIsReloading] = useState(false);
  const { ready, pageSize, currentPage, lastRefreshTime, nameFilter } = useSelector(
    ({ triggers }) => triggers
  );
  const emptyTriggerErrorMsg =
    triggersGroupToAdd.length === 0 ? T.translate(`${PREFIX}.emptyCompositeTriggerError`) : '';

  useEffect(() => {
    dispatch({ type: 'SET_NAMESPACE' });
  }, []);

  useEffect(() => {
    if (!ready && state.namespace) {
      fetchPipelinesList();
    }
  }, [ready]);

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
    setNameFilter(searchInput);
  };

  const changeNamespaceEvent = (e) => {
    changeNamespace(e.target.value);
  };

  const changeTriggerTypeEvent = (e) => {
    changeTriggersType(e.target.value);
  };

  const handleChangeMaxConcurrentRuns = (e) => {
    changeMaxConcurrentRuns(e.target.value);
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

  const handlePageChange = (event: React.MouseEvent | null, page: number) => {
    updateCurrentPage(page);
  };

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    updatePageSize(parseInt(value, 10));
  };

  const handleRefeshTriggersClick = (event: React.MouseEvent | null) => {
    setIsReloading(true);
    setTimeout(() => {
      setIsReloading(false);
    }, 500);
    fetchTriggersAndApps(pipelineName, GLOBALS.programId[pipelineType]);
  };

  const pipelineList = paginatedPipelineList[currentPage] || [];

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
          <SelectorDropdown data-testid="composite-trigger-type">
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
          <TriggerConfigHeader>{T.translate(`${PREFIX}.maxConcurrentRuns`)}</TriggerConfigHeader>
          <SelectorDropdown data-testid="composite-trigger-max-concurrent-runs">
            <select
              className="form-control"
              value={maxConcurrentRuns}
              onChange={handleChangeMaxConcurrentRuns}
            >
              {Array(10)
                .fill(0)
                .map((_, i) => (
                  <option value={i + 1} key={i + 1}>
                    {i + 1}
                  </option>
                ))}
            </select>
          </SelectorDropdown>
        </div>
        <div>
          <TriggerConfigHeader>{T.translate(`${PREFIX}.triggerName`)}</TriggerConfigHeader>
          <TriggerNameTextField
            required
            focused
            autoComplete="off"
            id="standard-required"
            onChange={onTriggerNameChange}
            placeholder="Enter the Trigger Name..."
            error={state.isNameInvalid}
            helperText={state.triggerNameError}
            data-testid="trigger-name-text-field"
          />
        </div>

        <SelectedGroupPipelinesContainer>
          <span>{T.translate(`${PREFIX}.selectPipelineInstruction`)}</span>
        </SelectedGroupPipelinesContainer>
      </div>
      <SearchTriggerTextField
        onChange={onSearchPipelineChange}
        placeholder="Search available pipelines"
        value={nameFilter}
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

      <PipelineListContainer>
        <PipelineListHeader>
          <PipelineNameHeading>{T.translate(`${TRIGGER_PREFIX}.pipelineName`)}</PipelineNameHeading>
          <RefreshTimeLabel>
            {T.translate(`${PREFIX}.lastRefreshedAtLabel`, {
              datetime: lastRefreshTime,
            })}
            <StyledRefreshIcon rotated={isReloading} onClick={handleRefeshTriggersClick} />
          </RefreshTimeLabel>
        </PipelineListHeader>
        {pipelineList.length === 0 ? null : (
          <div data-testid={getDataTestid(`${TESTID_PREFIX}.pipelines-container`)}>
            {pipelineList.map((pipeline) => {
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
                  isEnabledForTriggers={pipeline.isEnabledForTriggers}
                />
              );
            })}
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="span"
              count={-1}
              rowsPerPage={pageSize}
              page={currentPage}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handlePageSizeChange}
              labelDisplayedRows={({ from, to }) =>
                T.translate(`${PREFIX}.pipelinesPaginationLabel`, {
                  from: Math.min(from, currentPage * pageSize + pipelineList.length),
                  to: Math.min(to, currentPage * pageSize + pipelineList.length),
                })
              }
              nextIconButtonProps={
                {
                  disabled: isLastPipelinesPage(),
                  'data-testid': getDataTestid(`${TESTID_PREFIX}.pagination-next-btn`),
                } as any
              }
              backIconButtonProps={
                {
                  'data-testid': getDataTestid(`${TESTID_PREFIX}.pagination-back-btn`),
                } as any
              }
              SelectProps={{
                native: true,
                inputProps: {
                  'data-testid': getDataTestid(`${TESTID_PREFIX}.pagination-select`),
                },
              }}
            />
          </div>
        )}
      </PipelineListContainer>
      <SelectedGroupPipelinesContainer>
        <ButtonsWrap>
          <PipelineTriggerComputeProfileButton
            onClick={handlePayloadToggleClick}
            data-cy={`${state.triggerName}-view-payload-btn`}
            data-testid={`${state.triggerName}-view-payload-btn`}
          >
            {T.translate(`${PREFIX}.configComputeProfie`)}
          </PipelineTriggerComputeProfileButton>
          <CustomTooltip arrow title={state.triggerNameError || emptyTriggerErrorMsg}>
            <span>
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
            </span>
          </CustomTooltip>
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
    paginatedPipelineList: state.triggers.paginatedPipelineList,
    triggersGroupToAdd: state.triggers.triggersGroupToAdd,
    triggersGroupRunArgsToAdd: state.triggers.triggersGroupRunArgsToAdd,
    selectedNamespace: state.triggers.selectedNamespace,
    selectedTriggersType: state.triggers.selectedTriggersType,
    pipelineName: state.triggers.pipelineName,
    expandedPipeline: state.triggers.expandedPipeline,
    configureError: state.triggers.configureError,
    maxConcurrentRuns: state.triggers.maxConcurrentRuns,
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
