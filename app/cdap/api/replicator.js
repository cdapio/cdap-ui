/*
 * Copyright © 2020 Cask Data, Inc.
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

const pluginPath = '/namespaces/:namespace/artifacts/:parentArtifact/versions/:version/extensions';
const appPath = '/namespaces/:namespace/apps/:appName';
const programPath = `${appPath}/workers/DeltaWorker`;
const deltaAppPath = '/namespaces/system/apps/delta';
const servicePath = `${deltaAppPath}/services/assessor/methods/v1/contexts/:namespace`;
const draftPath = `${servicePath}/drafts/:draftId`;
const workerPath = `${appPath}/workers/DeltaWorker`;
const artifactBasePath = `/namespaces/:namespace/artifacts/:artifactName/versions/:artifactVersion/properties`;
const validatePipelinePath = `${servicePath}/assessPipeline`;

export const MyReplicatorApi = {
  getDeltaApp: apiCreator(dataSrc, 'GET', 'REQUEST', deltaAppPath),
  getPlugins: apiCreator(dataSrc, 'GET', 'REQUEST', `${pluginPath}/:pluginType`),
  batchGetPluginsWidgets: apiCreator(
    dataSrc,
    'POST',
    'REQUEST',
    '/namespaces/:namespace/artifactproperties'
  ),
  publish: apiCreator(dataSrc, 'PUT', 'REQUEST', appPath),
  action: apiCreator(dataSrc, 'POST', 'REQUEST', `${programPath}/:action`),
  delete: apiCreator(dataSrc, 'DELETE', 'REQUEST', appPath),
  listDrafts: apiCreator(dataSrc, 'GET', 'REQUEST', `${servicePath}/drafts`),
  putDraft: apiCreator(dataSrc, 'PUT', 'REQUEST', draftPath),
  deleteDraft: apiCreator(dataSrc, 'DELETE', 'REQUEST', draftPath),
  getDraft: apiCreator(dataSrc, 'GET', 'REQUEST', draftPath),
  listTables: apiCreator(dataSrc, 'POST', 'REQUEST', `${draftPath}/listTables`),
  getTableInfo: apiCreator(dataSrc, 'POST', 'REQUEST', `${draftPath}/describeTable`),
  getReplicator: apiCreator(dataSrc, 'GET', 'REQUEST', appPath),
  assessPipeline: apiCreator(dataSrc, 'POST', 'REQUEST', `${draftPath}/assessPipeline`),
  validatePipeline: apiCreator(dataSrc, 'POST', 'REQUEST', validatePipelinePath),
  assessTable: apiCreator(dataSrc, 'POST', 'REQUEST', `${draftPath}/assessTable`),
  fetchArtifactProperties: apiCreator(dataSrc, 'GET', 'REQUEST', artifactBasePath),

  // Detail
  pollStatus: apiCreator(dataSrc, 'GET', 'POLL', `${workerPath}/runs?limit=1`),
  pollTableStatus: apiCreator(dataSrc, 'POST', 'POLL', `${servicePath}/getState`),
  pollMetrics: apiCreator(dataSrc, 'POST', 'REQUEST', `/metrics/query?:queryParams`),

  // To be replaced with GraphQL
  list: apiCreator(dataSrc, 'GET', 'REQUEST', '/namespaces/:namespace/apps?artifactName=delta-app'),
  batchStatus: apiCreator(dataSrc, 'POST', 'REQUEST', '/namespaces/:namespace/status'),
  batchAppDetail: apiCreator(dataSrc, 'POST', 'REQUEST', '/namespaces/:namespace/appdetail'),
};
