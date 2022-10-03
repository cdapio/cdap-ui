/*
 * Copyright © 2018 Cask Data, Inc.
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

import * as React from 'react';
import { PipelineTableRow } from './PipelineTableRow';
import { connect } from 'react-redux';
import T from 'i18n-react';
import { IPipeline } from 'components/PipelineList/DeployedPipelineView/types';
import { Actions } from 'components/PipelineList/DeployedPipelineView/store';
import EmptyMessageContainer from 'components/EmptyMessageContainer';
import SortableHeader from 'components/PipelineList/DeployedPipelineView/PipelineTable/SortableHeader';
import If from 'components/shared/If';
import './PipelineTable.scss';
import { useFeatureFlagDefaultFalse } from 'services/react/customHooks/useFeatureFlag';

interface IProps {
  pipelines: IPipeline[];
  search: string;
  onClear: () => void;
  refetch: () => void;
}

const PREFIX = 'features.PipelineList';

const PipelineTableView: React.SFC<IProps> = ({ pipelines, search, onClear, refetch }) => {
  const lifecycleManagementEditEnabled = useFeatureFlagDefaultFalse(
    'lifecycle.management.edit.enabled'
  );

  function renderBody() {
    if (!pipelines || (Array.isArray(pipelines) && pipelines.length === 0)) {
      return (
        <EmptyMessageContainer
          title={T.translate(`${PREFIX}.EmptyList.EmptySearch.heading`, { search }).toString()}
        >
          <ul>
            <li>
              <span className="link-text" onClick={onClear}>
                {T.translate(`${PREFIX}.EmptyList.EmptySearch.clear`)}
              </span>
              <span>{T.translate(`${PREFIX}.EmptyList.EmptySearch.search`)}</span>
            </li>
          </ul>
        </EmptyMessageContainer>
      );
    }

    return (
      <div className="grid-body">
        {pipelines.map((pipeline) => {
          return (
            <PipelineTableRow
              key={pipeline.name}
              pipeline={pipeline}
              refetch={refetch}
              lifecycleManagementEditEnabled={lifecycleManagementEditEnabled}
            />
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid-wrapper pipeline-list-table">
      <div className="grid grid-container">
        <If condition={pipelines && pipelines.length > 0}>
          <div className="grid-header">
            <div className="grid-row">
              <SortableHeader columnName="name" />
              <strong>{T.translate(`${PREFIX}.type`)}</strong>
              <strong>{T.translate(`${PREFIX}.status`)}</strong>
              <strong>{T.translate(`${PREFIX}.lastStartTime`)}</strong>
              <strong>{T.translate(`${PREFIX}.nextRun`)}</strong>
              <strong>{T.translate(`${PREFIX}.runs`)}</strong>
              <strong>{T.translate(`${PREFIX}.tags`)}</strong>
              <strong />
            </div>
          </div>
        </If>
        {renderBody()}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    search: state.deployed.search,
    pageLimit: state.deployed.pageLimit,
    currentPage: state.deployed.currentPage,
    sortOrder: state.deployed.sortOrder,
    sortColumn: state.deployed.sortColumn,
    pipelines: state.deployed.pipelines,
  };
};

const mapDispatch = (dispatch) => {
  return {
    onClear: () => {
      dispatch({
        type: Actions.setSearchInput,
        payload: {
          search: '',
        },
      });
    },
  };
};

const PipelineTable = connect(mapStateToProps, mapDispatch)(PipelineTableView);

export default PipelineTable;
