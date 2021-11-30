/*
 * Copyright © 2016 Cask Data, Inc.
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

import DataSourceConfigurer from 'services/datasource/DataSourceConfigurer';
import { apiCreator } from 'services/resource-helper';

const dataSrc = DataSourceConfigurer.getInstance();
const searchpath = '/namespaces/:namespace/metadata/search';
const systemSearchPath = '/metadata/search';
const basePath = '/namespaces/:namespace/:entityType/:entityId';
const tagsPath = `${basePath}/metadata/tags`;
const propertyPath = `${basePath}/metadata/properties`;
const programPath = '/namespaces/:namespace/apps/:appId/:programType/:programId/runs/:runId';

export const MySearchApi = {
  search: apiCreator(dataSrc, 'GET', 'REQUEST', searchpath),
  searchSystem: apiCreator(dataSrc, 'GET', 'REQUEST', systemSearchPath),
  properties: apiCreator(dataSrc, 'GET', 'REQUEST', `${basePath}/metadata?responseFormat=v6`),
  getDatasetDetail: apiCreator(
    dataSrc,
    'GET',
    'REQUEST',
    '/namespaces/:namespace/data/datasets/:entityId'
  ),
  getUserTags: apiCreator(dataSrc, 'GET', 'REQUEST', `${tagsPath}?scope=USER&responseFormat=v6`),
  deleteTag: apiCreator(dataSrc, 'DELETE', 'REQUEST', `${tagsPath}/:tag`),
  addTag: apiCreator(dataSrc, 'POST', 'REQUEST', tagsPath),
  getDatasetProperties: apiCreator(dataSrc, 'GET', 'REQUEST', `${propertyPath}?&responseFormat=v6`),
  deleteEntityProperty: apiCreator(dataSrc, 'DELETE', 'REQUEST', `${propertyPath}/:key`),
  addEntityProperty: apiCreator(dataSrc, 'POST', 'REQUEST', propertyPath),
  getLineage: apiCreator(
    dataSrc,
    'GET',
    'REQUEST',
    `${basePath}/lineage?collapse=access&collapse=run&collapse=component`
  ),
  getProgramRunStatus: apiCreator(dataSrc, 'GET', 'REQUEST', programPath),
};
