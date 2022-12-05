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

import MyDataPrepApi from 'api/dataprep';
import { directiveRequestBodyCreator } from 'components/DataPrep/helper';
import DataPrepStore from 'components/DataPrep/store';
import { IRecords, IGridParams, IRequestBody, IApiPayload } from 'components/GridTable/types';
import { objectQuery } from 'services/helpers';
import { getCurrentNamespace } from 'services/NamespaceStore';

/**
 * 
 * @param params it is an object containing namespace and wid
 * @param newDirective it is either a single directive or an Array of directive / recipe steps
 * @returns constructed payload (object containing payload,requestBody,gridParams ) for the API call 
 */

export const getAPIRequestPayload = (
  params: IRecords,
  newDirective: string | string[],
) => {
  const { dataprep } = DataPrepStore.getState();
  const { workspaceId, workspaceUri, directives, insights } = dataprep;
  let gridParams = {} as IGridParams;
  const updatedDirectives: string[] = directives.concat(newDirective);
  const requestBody: IRequestBody = directiveRequestBodyCreator(updatedDirectives);
  requestBody.insights = insights;
  const workspaceInfo: IRecords = {
    properties: insights,
  };
  gridParams = {
    directives: updatedDirectives,
    workspaceId,
    workspaceUri,
    workspaceInfo,
    insights,
  };
  const payload: IRecords = {
    context: params.namespace,
    workspaceId: params.wid,
  };
  const returnData: IApiPayload = {
    payload,
    requestBody,
    gridParams,
  };
  return returnData;
};

/**
 * 
 * @param workspaceId here we get workspace ID of any data-set which is going to be loaded in GridPage.
 * @param directives it is an array of directives / recipe steps that gets applied on given workspace.
 * @returns data of a workspace after applying directives on it.
 */

export const applyDirectives = (workspaceId, directives) => {
  return MyDataPrepApi.getWorkspace({
    context: getCurrentNamespace(),
    workspaceId,
  }).mergeMap((res) => {
    const params = {
      workspaceId,
      context: getCurrentNamespace(),
    };
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
    return MyDataPrepApi.execute(params, requestBody);
  });
};
