/*
 * Copyright © 2021 Cask Data, Inc.
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

// namespaces/default/artifacts/cdap-data-pipeline/versions/6.5.0-SNAPSHOT/extensions/batchConnector?scope=SYSTEM
// The assumption is UI will get all its connection types from a single plugin.
const connectionsTypePath =
  '/namespaces/:namespace/artifacts/cdap-data-pipeline/versions/:datapipelineArtifactVersion/extensions/connector?scope=SYSTEM';

// The assumption is UI will get all its connection types from a single plugin.
const connectionsTypePropertiesPath =
  '/namespaces/:namespace/artifacts/cdap-data-pipeline/versions/:datapipelineArtifactVersion/extensions/connector';

const connectionWidgetJSONPath =
  '/namespaces/:namespace/artifacts/:artifactname/versions/:artifactversion/properties';

const allConnectorWidgetJSONAndDocPath = '/namespaces/:namespace/artifactproperties';

const pipelineV1AppBasePath =
  '/namespaces/system/apps/pipeline/services/studio/methods/v1/contexts/:context';

export const ConnectionsApi = {
  listConnectors: apiCreator(dataSrc, 'GET', 'REQUEST', connectionsTypePath),
  fetchAllConnectorWidgetJSONAndDoc: apiCreator(
    dataSrc,
    'POST',
    'REQUEST',
    allConnectorWidgetJSONAndDocPath
  ),
  fetchConnectorPluginProperties: apiCreator(
    dataSrc,
    'GET',
    'REQUEST',
    `${connectionsTypePropertiesPath}/plugins/:connectionTypeName?scope=SYSTEM&limit=1&order=DESC`
  ),
  fetchConnectorArtifactProperty: apiCreator(dataSrc, 'GET', 'REQUEST', connectionWidgetJSONPath),
  createConnection: apiCreator(
    dataSrc,
    'PUT',
    'REQUEST',
    `${pipelineV1AppBasePath}/connections/:connectionid`
  ),
  listConnections: apiCreator(dataSrc, 'GET', 'REQUEST', `${pipelineV1AppBasePath}/connections`),
  getConnection: apiCreator(
    dataSrc,
    'GET',
    'REQUEST',
    `${pipelineV1AppBasePath}/connections/:connectionId`
  ),
  exploreConnection: apiCreator(
    dataSrc,
    'POST',
    'REQUEST',
    `${pipelineV1AppBasePath}/connections/:connectionid/browse`
  ),
  deleteConnection: apiCreator(
    dataSrc,
    'DELETE',
    'REQUEST',
    `${pipelineV1AppBasePath}/connections/:connectionId`
  ),
  getSpecification: apiCreator(
    dataSrc,
    'POST',
    'REQUEST',
    `${pipelineV1AppBasePath}/connections/:connectionId/specification`
  ),
  testConnection: apiCreator(
    dataSrc,
    'POST',
    'REQUEST',
    `${pipelineV1AppBasePath}/connections/test`
  ),
  getSystemApp: apiCreator(dataSrc, 'GET', 'REQUEST', '/namespaces/system/apps/pipeline'),
};
