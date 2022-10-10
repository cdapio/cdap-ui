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

import { getCurrentNamespace } from 'services/NamespaceStore';
import { MyPipelineApi } from 'api/pipeline';
import Store, { Actions, SORT_ORDER } from 'components/PipelineList/DeployedPipelineView/store';
import { IPipeline } from 'components/PipelineList/DeployedPipelineView/types';
import { GLOBALS } from 'services/global-constants';
import debounce from 'lodash/debounce';
import { IDraft } from 'components/PipelineList/DraftPipelineView/types';

export function deletePipeline(pipeline: IPipeline, refetch: () => void) {
  const namespace = getCurrentNamespace();

  const params = {
    namespace,
    appId: pipeline.name,
  };

  MyPipelineApi.delete(params).subscribe(
    () => {
      refetch();
      reset();
    },
    (err) => {
      Store.dispatch({
        type: Actions.setDeleteError,
        payload: {
          deleteError: err,
        },
      });
    }
  );
}

export function reset() {
  Store.dispatch({
    type: Actions.reset,
  });
}

function getRunsForPipelines() {
  const { pipelines } = Store.getState().deployed;
  if (!pipelines) {
    return;
  }
  const pipelinesWithoutRuns = pipelines.filter(
    (pipeline) => pipeline.runs === null || pipeline.totalRuns === null
  );
  if (!pipelinesWithoutRuns.length) {
    return;
  }
  const getProgram = (pipelineType) => {
    const programId = GLOBALS.programId[pipelineType];
    const programType = GLOBALS.programTypeName[pipelineType];
    return {
      programId,
      programType,
    };
  };
  const postBody = pipelinesWithoutRuns.map((pipeline) => ({
    appId: pipeline.name,
    ...getProgram(pipeline.artifact.name),
  }));
  const nextRuntimePostBody = pipelinesWithoutRuns
    .filter((pipeline) => pipeline.artifact.name === GLOBALS.etlDataPipeline)
    .map((pipeline) => ({
      appId: pipeline.name,
      ...getProgram(pipeline.artifact.name),
    }));
  const namespace = getCurrentNamespace();
  MyPipelineApi.getBatchRuns({ namespace }, postBody)
    .combineLatest(
      MyPipelineApi.getRunsCount({ namespace }, postBody),
      MyPipelineApi.batchGetNextRunTime({ namespace }, nextRuntimePostBody)
    )
    .subscribe(([runs, runsCount, nextRuntime]) => {
      const runsMap = Object.assign({}, ...runs.map((app) => ({ [app.appId]: app.runs })));
      const nextRuntimeMap = Object.assign(
        {},
        ...nextRuntime.map((app) => ({ [app.appId]: app.schedules }))
      );
      const runsCountMap = Object.assign(
        {},
        ...runsCount.map((app) => ({ [app.appId]: app.runCount }))
      );
      const getNextrunTime = (nrMap, pipeline) => {
        if (pipeline.artifact.name === GLOBALS.etlDataStreams) {
          return [];
        }
        return nrMap[pipeline.name] || pipeline.nextRuntime;
      };
      const pipelinesWithRuns = pipelines.map((pipeline) => {
        return {
          ...pipeline,
          runs: runsMap[pipeline.name] || pipeline.runs,
          totalRuns: runsCountMap[pipeline.name] || pipeline.totalRuns,
          nextRuntime: getNextrunTime(nextRuntimeMap, pipeline),
        };
      });
      Store.dispatch({
        type: Actions.updatePipelines,
        payload: {
          pipelines: pipelinesWithRuns,
        },
      });
    });
}

export function setPipelines({ pipelines, nextPageToken }) {
  Store.dispatch({
    type: Actions.setPipelines,
    payload: {
      pipelines,
      nextPageToken,
    },
  });
  getRunsForPipelines();
}

export function prevPage() {
  const { previousTokens } = Store.getState().deployed;
  if (!previousTokens.length) {
    return;
  }
  Store.dispatch({
    type: Actions.prevPage,
  });
  getRunsForPipelines();
}

export function nextPage() {
  const { nextPageToken } = Store.getState().deployed;
  if (!nextPageToken) {
    return;
  }
  Store.dispatch({
    type: Actions.nextPage,
  });
  getRunsForPipelines();
}

export function applySearch() {
  Store.dispatch({
    type: Actions.applySearch,
  });
}
const debouncedApplySearch = debounce(applySearch, 1000);
export function setSearchInput(searchText: string) {
  Store.dispatch({
    type: Actions.setSearchInput,
    payload: {
      search: searchText,
    },
  });
  debouncedApplySearch();
}

export function setSort(columnName: string) {
  const state = Store.getState().deployed;
  const currentColumn = state.sortColumn;
  const currentSortOrder = state.sortOrder;

  let sortOrder = SORT_ORDER.asc;
  if (currentColumn === columnName && currentSortOrder === SORT_ORDER.asc) {
    sortOrder = SORT_ORDER.desc;
  }

  Store.dispatch({
    type: Actions.setSort,
    payload: {
      sortColumn: columnName,
      sortOrder,
    },
  });
  getRunsForPipelines();
}

export function setDrafts(drafts: IDraft[]) {
  Store.dispatch({
    type: Actions.setDrafts,
    payload: {
      drafts,
    },
  });
}

export function deleteEditDraft(draftId: string, callbackFn: () => void) {
  MyPipelineApi.deleteDraft({
    context: getCurrentNamespace(),
    draftId,
  }).subscribe((res) => {
    callbackFn();
  });
}
