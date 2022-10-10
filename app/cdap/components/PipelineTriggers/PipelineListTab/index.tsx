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
import { changeNamespace } from 'components/PipelineTriggers/store/PipelineTriggersActionCreator';
import { connect } from 'react-redux';
import PipelineTriggersActions from 'components/PipelineTriggers/store/PipelineTriggersActions';
import PipelineTriggersRow from 'components/PipelineTriggers/PipelineListTab/PipelineTriggersRow';
import T from 'i18n-react';
import { GLOBALS } from 'services/global-constants';
import {
  IPipelineInfo,
  ITriggeringPipelineInfo,
} from 'components/PipelineTriggers/store/ScheduleTypes';
import {
  PipelineCount,
  PipelineListContainer,
  PipelineListHeader,
  PipelineName,
  PipelineTriggerHeader,
} from 'components/PipelineTriggers/shared.styles';
import {
  initialAvailablePipelineListState,
  triggerNameReducer,
} from 'components/PipelineTriggers/reducer';

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
  pipelineList: IPipelineInfo[];
  selectedNamespace: string;
  pipelineName: string;
  expandedPipeline: string;
  toggleExpandPipeline: (pipeline: string) => void;
  workflowName: string;
  configureError: string;
}

const PipelineListTabView = ({
  pipelineList,
  pipelineName,
  selectedNamespace,
  expandedPipeline,
  toggleExpandPipeline,
  workflowName,
  configureError,
}: IPipelineListTabViewProps) => {
  const [state, dispatch] = useReducer(triggerNameReducer, initialAvailablePipelineListState);

  useEffect(() => {
    dispatch({ type: 'SET_NAMESPACE' });
  }, []);

  const triggeredPipelineInfo = {
    id: pipelineName,
    namespace: state.namespace,
  };

  const changeNamespaceEvent = (e) => {
    changeNamespace(e.target.value);
  };

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
      <PipelineCount>
        {T.translate(`${PREFIX}.pipelineCount`, { count: pipelineList.length })}
      </PipelineCount>
      {pipelineList.length === 0 ? null : (
        <PipelineListContainer>
          <PipelineListHeader>
            <PipelineName>{T.translate(`${TRIGGER_PREFIX}.pipelineName`)}</PipelineName>
          </PipelineListHeader>
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
    pipelineList: state.triggers.pipelineList,
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
