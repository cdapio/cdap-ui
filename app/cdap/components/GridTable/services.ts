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
import {
  IRecords,
  IGridParams,
  IRequestBody,
  IApiPayload,
  IType,
  IParams,
} from 'components/GridTable/types';
import { objectQuery } from 'services/helpers';
import { getCurrentNamespace } from 'services/NamespaceStore';

/**
 * @param  {IRecords} params
 * @param  {string|string[]} newDirective directive value
 * @param  {string} action?
 * @returns payload which is used for api calls
 */
export const getAPIRequestPayload = (
  params: IParams,
  newDirective: string | string[],
  action?: string
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
 * @param  {IRecords} workspaceId
 * @param  {string[]} directives
 * @return api response
 */
export const applyDirectives = (
  workspaceId: string | boolean | Record<string, IType>,
  directives: string[]
) => {
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
