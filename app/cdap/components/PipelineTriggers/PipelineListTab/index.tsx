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
  changeNamespace,
  fetchTriggersAndApps,
  isLastPipelinesPage,
  fetchPipelinesList,
  updateCurrentPage,
  updatePageSize,
} from 'components/PipelineTriggers/store/PipelineTriggersActionCreator';
import { connect, useSelector } from 'react-redux';
import PipelineTriggersActions from 'components/PipelineTriggers/store/PipelineTriggersActions';
import PipelineTriggersRow from 'components/PipelineTriggers/PipelineListTab/PipelineTriggersRow';
import T from 'i18n-react';
import { GLOBALS } from 'services/global-constants';
import {
  IPipelineInfo,
  ITriggeringPipelineInfo,
} from 'components/PipelineTriggers/store/ScheduleTypes';
import {
  PipelineListContainer,
  PipelineListHeader,
  PipelineNameHeading,
  PipelineTriggerHeader,
  RefreshTimeLabel,
  StyledRefreshIcon,
} from 'components/PipelineTriggers/shared.styles';
import {
  initialAvailablePipelineListState,
  triggerNameReducer,
} from 'components/PipelineTriggers/reducer';
import { TablePagination } from '@material-ui/core';

const TRIGGER_PREFIX = 'features.PipelineTriggers';
const PREFIX = `${TRIGGER_PREFIX}.SetTriggers`;

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

const PipelineListTabDiv = styled.div`
  padding: 15px;
`;

interface IPipelineListTabViewProps {
  paginatedPipelineList: IPipelineInfo[][];
  selectedNamespace: string;
  pipelineName: string;
  pipelineType: string;
  expandedPipeline: string;
  toggleExpandPipeline: (pipeline: string) => void;
  workflowName: string;
  configureError: string;
}

const PipelineListTabView = ({
  paginatedPipelineList,
  pipelineName,
  pipelineType,
  selectedNamespace,
  expandedPipeline,
  toggleExpandPipeline,
  workflowName,
  configureError,
}: IPipelineListTabViewProps) => {
  const [state, dispatch] = useReducer(triggerNameReducer, initialAvailablePipelineListState);
  const [isReloading, setIsReloading] = useState(false);
  const { ready, pageSize, currentPage, lastRefreshTime } = useSelector(({ triggers }) => triggers);

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

  const changeNamespaceEvent = (e) => {
    changeNamespace(e.target.value);
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
      <PipelineTriggerHeader>
        {T.translate(`${PREFIX}.title`, { pipelineName })}
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
          <div>
            {pipelineList.map((pipeline) => {
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
                  pipelineName={pipelineName}
                  workflowName={workflowName}
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
                  from,
                  to: Math.min(to, currentPage * pageSize + pipelineList.length),
                })
              }
              nextIconButtonProps={{ disabled: isLastPipelinesPage() }}
            />
          </div>
        )}
      </PipelineListContainer>
    </PipelineListTabDiv>
  );
};

const mapStateToProps = (state) => {
  return {
    paginatedPipelineList: state.triggers.paginatedPipelineList,
    selectedNamespace: state.triggers.selectedNamespace,
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
