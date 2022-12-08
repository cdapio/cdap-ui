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

import { MMDS_SORT_METHODS } from 'components/Experiments/store';
import experimentDetailsStore, {
  ACTIONS as EXPERIMENTDETAILACTIONS,
} from 'components/Experiments/store/experimentDetailStore';
import { setAlgorithmsList } from 'components/Experiments/store/SharedActionCreator';
import { myExperimentsApi } from 'api/experiments';
import { getCurrentNamespace } from 'services/NamespaceStore';

function setExperimentDetailError(error = null) {
  experimentDetailsStore.dispatch({
    type: EXPERIMENTDETAILACTIONS.SET_ERROR,
    payload: {
      error,
    },
  });
}

function getExperimentDetails(experimentId) {
  myExperimentsApi
    .getExperiment({
      namespace: getCurrentNamespace(),
      experimentId,
    })
    .subscribe(
      (res) => {
        experimentDetailsStore.dispatch({
          type: EXPERIMENTDETAILACTIONS.SET_EXPERIMENT_DETAILS,
          payload: {
            experimentDetails: {
              ...res,
            },
          },
        });
      },
      (err) => {
        setExperimentDetailError(
          `Failed to get details for the experiment '${experimentId}' - ${err.response ||
            err}`
        );
      }
    );
}

function getModelsInExperiment(experimentId) {
  experimentDetailsStore.dispatch({
    type: EXPERIMENTDETAILACTIONS.SET_LOADING,
  });
  const {
    modelsOffset: offset,
    modelsLimit: limit,
    modelsSortMethod,
    modelsSortColumn,
  } = experimentDetailsStore.getState();
  const ModelsObservable$ = myExperimentsApi.getModelsInExperiment({
    namespace: getCurrentNamespace(),
    experimentId,
    offset,
    limit,
    sort: `${modelsSortColumn} ${modelsSortMethod}`,
  });

  ModelsObservable$.subscribe(
    (res) => {
      const models = res.models;
      experimentDetailsStore.dispatch({
        type: EXPERIMENTDETAILACTIONS.SET_MODELS,
        payload: {
          models,
          totalCount: res.totalRowCount,
        },
      });
      getSplitsInExperiment(experimentId);
    },
    (err) => {
      setExperimentDetailError(
        `Failed to get models in the experiment '${experimentId}' - ${err.response ||
          err}`
      );
    }
  );
  return ModelsObservable$;
}

function handleModelsPageChange({ selected }) {
  const { modelsLimit, name: experimentId } = experimentDetailsStore.getState();
  experimentDetailsStore.dispatch({
    type: EXPERIMENTDETAILACTIONS.SET_MODEL_PAGINATION,
    payload: {
      modelsOffset: selected * modelsLimit,
    },
  });
  updateQueryForModelsListView();
  getModelsInExperiment(experimentId);
}

function handleModelsSorting(field) {
  const {
    modelsSortMethod,
    modelsSortColumn,
    name: experimentId,
  } = experimentDetailsStore.getState();
  const newSortField = field !== modelsSortColumn ? field : modelsSortColumn;
  const newSortMethod =
    MMDS_SORT_METHODS.ASC === modelsSortMethod
      ? MMDS_SORT_METHODS.DESC
      : MMDS_SORT_METHODS.ASC;
  experimentDetailsStore.dispatch({
    type: EXPERIMENTDETAILACTIONS.SET_MODELS_SORT,
    payload: {
      modelsSortMethod: newSortMethod,
      modelsSortColumn: newSortField,
    },
  });
  updateQueryForModelsListView();
  getModelsInExperiment(experimentId);
}

function updateQueryParametersForModels({
  modelsLimit,
  modelsOffset,
  modelsSortMethod,
  modelsSortColumn,
}) {
  experimentDetailsStore.dispatch({
    type: EXPERIMENTDETAILACTIONS.SET_MODELS_QUERY_PARAMS,
    payload: {
      modelsOffset,
      modelsLimit,
      modelsSortMethod,
      modelsSortColumn,
    },
  });
}

function updateQueryForModelsListView() {
  const {
    modelsOffset: offset,
    modelsLimit: limit,
    modelsSortMethod,
    modelsSortColumn,
  } = experimentDetailsStore.getState();
  const newQuery = `offset=${offset}&limit=${limit}&sort=${modelsSortColumn} ${modelsSortMethod}`;
  const obj = {
    title: document.title,
    url: `${location.pathname}?${newQuery}`,
  };
  history.pushState(obj, obj.title, obj.url);
}

function getSplitsInExperiment(experimentId) {
  myExperimentsApi
    .getSplitsInExperiment({
      namespace: getCurrentNamespace(),
      experimentId,
    })
    .subscribe(
      (splits) => {
        experimentDetailsStore.dispatch({
          type: EXPERIMENTDETAILACTIONS.SET_SPLITS,
          payload: {
            splits,
          },
        });
      },
      (err) => {
        setExperimentDetailError(
          `Failed to get splits in the experiment '${experimentId}' - ${err.response ||
            err}`
        );
      }
    );
}

function pollModelStatus(experimentId, modelId) {
  return myExperimentsApi
    .pollModelStatus({
      namespace: getCurrentNamespace(),
      experimentId,
      modelId,
    })
    .subscribe(
      (modelStatus) => {
        experimentDetailsStore.dispatch({
          type: EXPERIMENTDETAILACTIONS.SET_MODEL_STATUS,
          payload: {
            modelId,
            modelStatus,
          },
        });
      },
      () => {
        addModelsWithError(modelId);
      }
    );
}

function getModelStatus(experimentId, modelId) {
  addModelsLoading(modelId);

  myExperimentsApi
    .getModelStatus({
      namespace: getCurrentNamespace(),
      experimentId,
      modelId,
    })
    .subscribe(
      (modelStatus) => {
        experimentDetailsStore.dispatch({
          type: EXPERIMENTDETAILACTIONS.SET_MODEL_STATUS,
          payload: {
            modelId,
            modelStatus,
          },
        });
      },
      () => {
        addModelsWithError(modelId);
      },
      () => {
        removeModelsLoading(modelId);
      }
    );
}

function addModelsLoading(modelId) {
  const modelsLoading = [...experimentDetailsStore.getState().modelsLoading];
  if (modelsLoading.indexOf(modelId) === -1) {
    modelsLoading.push(modelId);
  }
  experimentDetailsStore.dispatch({
    type: EXPERIMENTDETAILACTIONS.SET_MODELS_LOADING,
    payload: {
      modelsLoading,
    },
  });
}

function removeModelsLoading(modelId) {
  const modelsLoading = [...experimentDetailsStore.getState().modelsLoading];
  const modelIndex = modelsLoading.indexOf(modelId);
  if (modelIndex !== -1) {
    modelsLoading.splice(modelIndex, 1);
  }
  experimentDetailsStore.dispatch({
    type: EXPERIMENTDETAILACTIONS.SET_MODELS_LOADING,
    payload: {
      modelsLoading,
    },
  });
}

function addModelsWithError(modelId) {
  const modelsWithError = [
    ...experimentDetailsStore.getState().modelsWithError,
  ];
  if (modelsWithError.indexOf(modelId) === -1) {
    modelsWithError.push(modelId);
  }
  experimentDetailsStore.dispatch({
    type: EXPERIMENTDETAILACTIONS.SET_MODELS_WITH_ERROR,
    payload: {
      modelsWithError,
    },
  });
}

function setActiveModel(activeModelId) {
  const state = experimentDetailsStore.getState();
  const { splitDetails } =
    state.models.find((model) => model.id === activeModelId) || {};
  if (!splitDetails) {
    getSplitsInExperiment(state.name);
  }
  experimentDetailsStore.dispatch({
    type: EXPERIMENTDETAILACTIONS.SET_ACTIVE_MODEL,
    payload: {
      activeModelId,
    },
  });
}

const setAlgorithmsListForDetailedView = () => {
  setAlgorithmsList().subscribe(
    () => {},
    (err) => {
      setExperimentDetailError(
        `Failed to get list of algorithms: ${err.response || err}`
      );
    }
  );
};

function resetExperimentDetailStore() {
  experimentDetailsStore.dispatch({
    type: EXPERIMENTDETAILACTIONS.RESET,
  });
}

function resetNewlyTrainingModel() {
  experimentDetailsStore.dispatch({
    type: EXPERIMENTDETAILACTIONS.RESET_NEWLY_TRAINING_MODEL,
  });
}

export {
  setExperimentDetailError,
  getExperimentDetails,
  getModelsInExperiment,
  handleModelsPageChange,
  handleModelsSorting,
  updateQueryParametersForModels,
  getSplitsInExperiment,
  getModelStatus,
  pollModelStatus,
  setActiveModel,
  setAlgorithmsListForDetailedView,
  resetExperimentDetailStore,
  resetNewlyTrainingModel,
};
