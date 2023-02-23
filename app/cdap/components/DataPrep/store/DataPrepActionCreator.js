/*
 * Copyright © 2017 Cask Data, Inc.
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

import DataPrepStore from 'components/DataPrep/store';
import DataPrepActions from 'components/DataPrep/store/DataPrepActions';
import MyDataPrepApi from 'api/dataprep';
import NamespaceStore from 'services/NamespaceStore';
import { Observable } from 'rxjs/Observable';
import { directiveRequestBodyCreator } from 'components/DataPrep/helper';
import { objectQuery } from 'services/helpers';
import ee from 'event-emitter';
import uuidV4 from 'uuid/v4';
import { orderBy, find } from 'lodash';
import { Theme } from 'services/ThemeHelper';

let workspaceRetries;

export function execute(addDirective, shouldReset, hideLoading = false) {
  const eventEmitter = ee(ee);
  eventEmitter.emit('CLOSE_POPOVER');
  if (!hideLoading) {
    DataPrepStore.dispatch({
      type: DataPrepActions.enableLoading,
    });
  }

  const store = DataPrepStore.getState().dataprep;
  let updatedDirectives = store.directives.concat(addDirective);

  if (shouldReset) {
    updatedDirectives = addDirective;
  }

  const workspaceId = store.workspaceId;
  const insights = store.insights;
  /*
      This is because everytime we change the data there is a possibility that we
      change the schema and with schema change the visualization is not guaranteed
      to be correct. For now we just clear it. We should become smart enough to say if the
      visualization is still good enough (with just data change)
  */
  insights.visualization = {};
  const namespace = NamespaceStore.getState().selectedNamespace;

  const params = {
    context: namespace,
    workspaceId,
  };

  const requestBody = directiveRequestBodyCreator(updatedDirectives);
  requestBody.insights = insights;

  return Observable.create((observer) => {
    MyDataPrepApi.execute(params, requestBody).subscribe(
      (res) => {
        observer.next(res);

        DataPrepStore.dispatch({
          type: DataPrepActions.setDirectives,
          payload: {
            data: res.values,
            headers: res.headers,
            directives: updatedDirectives,
            types: res.types,
          },
        });

        fetchColumnsInformation(res);
      },
      (err) => {
        observer.error(err);
        DataPrepStore.dispatch({
          type: DataPrepActions.disableLoading,
        });
      }
    );
  });
}

function setWorkspaceRetry(params, observer, workspaceId) {
  MyDataPrepApi.getWorkspace(params).subscribe(
    (res) => {
      const { dataprep } = DataPrepStore.getState();
      /*
        1. Open a tab with huge data (like 400 columns and 100 rows)
        2. Change of mind, open another tab
        3. 2nd tab's data comes in quick and you are happy browsing it
        4. Baam 1st tab's data comes and royally overwrites the one you are seeing.

        This is to prevent that. We can't cancel the request we made but we should show only that is relevant
      */
      if (dataprep.workspaceId !== workspaceId) {
        return;
      }
      const directives = objectQuery(res, 'directives') || [];
      const requestBody = directiveRequestBodyCreator(directives);
      const sampleSpec = objectQuery(res, 'sampleSpec') || {};
      const visualization = objectQuery(res, 'insights', 'visualization') || {};

      const insights = {
        name: sampleSpec.connectionName,
        workspaceName: res.workspaceName,
        path: sampleSpec.path,
        visualization,
      };
      requestBody.insights = insights;

      const workspaceUri = objectQuery(res, 'sampleSpec', 'path');
      const workspaceInfo = {
        properties: insights,
      };

      MyDataPrepApi.execute(params, requestBody).subscribe(
        (response) => {
          DataPrepStore.dispatch({
            type: DataPrepActions.setWorkspace,
            payload: {
              data: response.values,
              headers: response.headers,
              types: response.types,
              directives,
              workspaceId,
              workspaceUri,
              workspaceInfo,
              insights,
            },
          });

          observer.next(response);
          fetchColumnsInformation(response);
        },
        (err) => {
          // Backend returned an exception. Show default error message for now able to show data.
          if (workspaceRetries < 3) {
            workspaceRetries += 1;
            setWorkspaceRetry(params, observer, workspaceId);
          } else {
            observer.next(err);
            DataPrepStore.dispatch({
              type: DataPrepActions.disableLoading,
            });
            DataPrepStore.dispatch({
              type: DataPrepActions.setDataError,
              payload: {
                errorMessage: true,
              },
            });
          }
        }
      );
    },
    (err) => {
      if (workspaceRetries < 3) {
        workspaceRetries += 1;
        setWorkspaceRetry(params, observer, workspaceId);
      } else {
        DataPrepStore.dispatch({
          type: DataPrepActions.setWorkspaceError,
          payload: {
            workspaceError: {
              message: err.response.message,
              statusCode: err.statusCode,
            },
          },
        });
        observer.error(err);
      }
    }
  );
}

export function updateWorkspaceProperties() {
  const {
    directives,
    workspaceId,
    insights,
  } = DataPrepStore.getState().dataprep;
  const namespace = NamespaceStore.getState().selectedNamespace;
  const params = {
    context: namespace,
    workspaceId,
  };
  const requestBody = directiveRequestBodyCreator(directives);
  requestBody.insights = insights;
  MyDataPrepApi.setWorkspace(params, requestBody).subscribe(
    () => {},
    (err) => console.log('Error updating workspace visualization: ', err)
  );
}
function checkAndUpdateExistingWorkspaceProperties() {
  const { workspaceId, workspaceInfo } = DataPrepStore.getState().dataprep;
  if (!workspaceId || !workspaceInfo) {
    return;
  }
  updateWorkspaceProperties();
}
export function setWorkspace(workspaceId) {
  checkAndUpdateExistingWorkspaceProperties();
  const namespace = NamespaceStore.getState().selectedNamespace;

  const params = {
    context: namespace,
    workspaceId,
  };

  DataPrepStore.dispatch({
    type: DataPrepActions.setWorkspaceId,
    payload: {
      workspaceId,
      loading: true,
    },
  });

  workspaceRetries = 0;

  return Observable.create((observer) => {
    setWorkspaceRetry(params, observer, workspaceId);
  });
}

function fetchColumnsInformation(response) {
  const { headers, summary: summaryRes } = response;
  const columns = {};

  headers.forEach((head) => {
    columns[head] = {
      general: objectQuery(summaryRes, 'statistics', head, 'general'),
      types: objectQuery(summaryRes, 'statistics', head, 'types'),
      isValid: objectQuery(summaryRes, 'validation', head, 'valid'),
    };
  });

  DataPrepStore.dispatch({
    type: DataPrepActions.setColumnsInformation,
    payload: {
      columns,
    },
  });
}

export function getWorkspaceList(workspaceId) {
  const namespace = NamespaceStore.getState().selectedNamespace;
  const params = {
    context: namespace,
  };

  MyDataPrepApi.getWorkspaceList(params).subscribe((res) => {
    if (res.values.length === 0) {
      DataPrepStore.dispatch({
        type: DataPrepActions.setWorkspaceList,
        payload: {
          list: [],
        },
      });

      return;
    }

    const workspaceList = orderBy(
      res.values,
      [(workspace) => (workspace.workspaceName || '').toLowerCase()],
      ['asc']
    );

    DataPrepStore.dispatch({
      type: DataPrepActions.setWorkspaceList,
      payload: {
        list: workspaceList,
      },
    });

    if (workspaceId) {
      // Set active workspace
      // Check for existance of the workspaceId
      const workspaceObj = find(workspaceList, { id: workspaceId });

      let workspaceObservable$;
      if (workspaceObj) {
        workspaceObservable$ = setWorkspace(workspaceId);
      } else {
        workspaceObservable$ = setWorkspace(workspaceList[0].workspaceId);
      }

      workspaceObservable$.subscribe();
    }
  });
}

export function setVisualizationState(state) {
  DataPrepStore.dispatch({
    type: DataPrepActions.setInsights,
    payload: {
      insights: {
        visualization: state,
      },
    },
  });
}

export function setError(error, prefix) {
  const status = error.statusCode;
  let detail = 'Unknown error';
  if (typeof error.message === 'string') {
    detail = error.message;
  } else if (error.response) {
    if (typeof error.response === 'string') {
      detail = error.response;
    } else if (typeof error.response.message === 'string') {
      detail = error.response.message;
    }
  }
  const message = `${prefix || 'Error'}: ${
    status ? `${status}: ${detail}` : detail
  }`;

  DataPrepStore.dispatch({
    type: DataPrepActions.setError,
    payload: {
      message,
    },
  });
}

export async function loadTargetDataModelStates() {
  // These properties were populated by MyDataPrepApi.getWorkspace API
  const {
    dataModel,
    dataModelRevision,
    dataModelModel,
  } = DataPrepStore.getState().dataprep.insights;

  let { dataModelList } = DataPrepStore.getState().dataprep;
  if (!Array.isArray(dataModelList)) {
    dataModelList = await fetchDataModelList(Theme.wranglerDataModelUrl);
  }

  const rev = Number(dataModelRevision);
  const targetDataModel = dataModelList.find(
    (dm) => dm.id === dataModel && dm.revision === rev
  );
  await setTargetDataModel(targetDataModel);
  if (targetDataModel) {
    await setTargetModel(
      targetDataModel.models.find((m) => m.id === dataModelModel)
    );
  } else {
    await setTargetModel(null);
  }
}

export async function saveTargetDataModelStates() {
  const params = {
    context: NamespaceStore.getState().selectedNamespace,
    workspaceId: DataPrepStore.getState().dataprep.workspaceId,
  };

  const { targetDataModel, targetModel } = DataPrepStore.getState().dataprep;
  const newDataModelId = targetDataModel ? targetDataModel.id : null;
  const newDataModelRevision = targetDataModel
    ? targetDataModel.revision
    : null;
  const newModelId = targetModel ? targetModel.id : null;

  // These properties were populated by MyDataPrepApi.getWorkspace API
  const {
    dataModel,
    dataModelRevision,
    dataModelModel,
  } = DataPrepStore.getState().dataprep.insights;
  const oldDataModelId = dataModel || null;
  const oldDataModelRevision = isFinite(dataModelRevision)
    ? Number(dataModelRevision)
    : null;
  const oldModelId = dataModelModel || null;

  if (
    oldDataModelId !== newDataModelId ||
    oldDataModelRevision !== newDataModelRevision
  ) {
    if (oldDataModelId !== null) {
      await MyDataPrepApi.detachDataModel(params).toPromise();
    }
    if (newDataModelId !== null) {
      await MyDataPrepApi.attachDataModel(params, {
        id: newDataModelId,
        revision: newDataModelRevision,
      }).toPromise();
    }
  }

  if (oldModelId !== newModelId) {
    if (oldModelId !== null) {
      await MyDataPrepApi.detachModel(
        Object.assign(
          {
            modelId: oldModelId,
          },
          params
        )
      ).toPromise();
    }
    if (newModelId !== null) {
      await MyDataPrepApi.attachModel(params, {
        id: newModelId,
      }).toPromise();
    }
  }

  DataPrepStore.dispatch({
    type: DataPrepActions.setInsights,
    payload: {
      insights: {
        dataModel: newDataModelId,
        dataModelRevision: newDataModelRevision,
        dataModelModel: newModelId,
      },
    },
  });
}

export async function fetchDataModelList(url) {
  const namespace = NamespaceStore.getState().selectedNamespace;
  const params = {
    context: namespace,
  };

  await MyDataPrepApi.addDataModels(params, { url }).toPromise();
  const response = await MyDataPrepApi.getDataModels(params).toPromise();
  const dataModelList = response.values.map((dataModel) => ({
    uuid: uuidV4(),
    id: dataModel['namespacedId'].id,
    revision: dataModel.revision,
    name: dataModel.displayName,
    description: dataModel.description,
    url,
  }));
  dataModelList.sort((a, b) => a.name.localeCompare(b.name));

  DataPrepStore.dispatch({
    type: DataPrepActions.setDataModelList,
    payload: {
      dataModelList,
    },
  });

  return dataModelList;
}

export async function fetchModelList(dataModel) {
  const params = {
    context: NamespaceStore.getState().selectedNamespace,
    dataModelId: dataModel.id,
    dataModelRevision: dataModel.revision,
  };

  /**
   * Response message example:
   * {
   *   "type": "record",
   *   "name": "OMOP_6_0_0",
   *   "namespace": "google.com.datamodels.omop",
   *   "doc": "See https://github.com/OHDSI/CommonDataModel/blob/v6.0.0/OMOP_CDM_v6_0.pdf for information about the OMOP Schemas",
   *   "fields": [
   *     {
   *       "name": "CARE_SITE",
   *       "type": [
   *         "null",
   *         {
   *           "type": "record",
   *           "name": "CARE_SITE",
   *           "namespace": "google.com.datamodels.omop.Models",
   *           "doc": "The CARE_SITE table contains a list of uniquely identified institutional units...",
   *           "fields": [
   *             {
   *               "name": "care_site_id",
   *               "type": ["int"],
   *               "doc": "A unique identifier for each Care Site."
   *             },
   *             {
   *               "name": "care_site_name",
   *               "type": ["null", "string"],
   *               "doc": "The verbatim description or name of the Care Site as in data source"
   *             },
   *             ...
   *           ]
   *         }
   *       ]
   *     },
   *     {
   *       "name": "CDM_SOURCE",
   *       "type": [
   *         "null",
   *         {
   *           "type": "record",
   *           "name": "CDM_SOURCE",
   *           "namespace": "google.com.datamodels.omop.Models",
   *           "doc": "The CDM_SOURCE table contains detail about the source database and the process...",
   *           "fields": [
   *             ...
   *           ]
   *         }
   *       }
   *     },
   *     ...
   *   ]
   * }
   */

  const response = await MyDataPrepApi.getDataModel(params).toPromise();

  try {
    const data = JSON.parse(response.message || null);
    if (data && Array.isArray(data.fields)) {
      dataModel.models = [];
      data.fields.forEach((entry) => {
        if (!Array.isArray(entry.type)) {
          return;
        }
        const model = entry.type.find((record) => typeof record === 'object');
        if (!model || typeof model.name !== 'string') {
          return;
        }
        if ((model.name = model.name.trim()).length === 0) {
          return;
        }
        const fields = [];
        if (Array.isArray(model.fields)) {
          model.fields.forEach((field) => {
            if (!field || typeof field.name !== 'string') {
              return;
            }
            if ((field.name = field.name.trim()).length === 0) {
              return;
            }
            fields.push({
              uuid: uuidV4(),
              id: field.name,
              name: field.name,
              description: field.doc,
            });
          });
          fields.sort((a, b) => a.name.localeCompare(b.name));
        }
        dataModel.models.push({
          uuid: uuidV4(),
          id: model.name,
          name: model.name,
          description: model.doc,
          fields,
        });
      });
      dataModel.models.sort((a, b) => a.name.localeCompare(b.name));
    }
  } catch (error) {
    throw new Error(
      `Malformed definition received for "${dataModel.id}" data model of ${dataModel.revision} revision: ${error}`
    );
  }
}

export async function setTargetDataModel(dataModel) {
  // Clear current target data model first to hide it on UI
  // This is necessary in case when loading bar is appeared but current data model is still visible to user
  DataPrepStore.dispatch({
    type: DataPrepActions.setTargetDataModel,
    payload: {
      targetDataModel: null,
    },
  });

  if (dataModel) {
    if (!Array.isArray(dataModel.models)) {
      await fetchModelList(dataModel);
    }

    DataPrepStore.dispatch({
      type: DataPrepActions.setTargetDataModel,
      payload: {
        targetDataModel: dataModel,
      },
    });
  }
}

export function setTargetModel(model) {
  DataPrepStore.dispatch({
    type: DataPrepActions.setTargetModel,
    payload: {
      targetModel: model || null,
    },
  });
}
