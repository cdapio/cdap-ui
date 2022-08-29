/*
 * Copyright © 2017-2018 Cask Data, Inc.
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

let dataSrc = DataSourceConfigurer.getInstance();

const appPath = '/namespaces/system/apps/dataprep';
const baseServicePath = `${appPath}/services/service`;
const contextPath = `${baseServicePath}/methods/contexts/:context`;
const contextPathV2 = `${baseServicePath}/methods/v2/contexts/:context`;
const basepath = `${contextPath}/workspaces/:workspaceId`;
const basepathV2 = `${contextPathV2}/workspaces/:workspaceId`;
const connectionsPath = `${contextPath}/connections`;
const connectionTypesPath = `${baseServicePath}/methods/connectionTypes`;
const datamodelsPath = `${contextPath}/datamodels/schemas`;

const MyDataPrepApi = {
  createWorkspace: apiCreator(dataSrc, 'POST', 'REQUEST', `${contextPathV2}/workspaces`),

  delete: apiCreator(dataSrc, 'DELETE', 'REQUEST', basepathV2),
  execute: apiCreator(dataSrc, 'POST', 'REQUEST', `${basepathV2}/execute`),
  summary: apiCreator(dataSrc, 'POST', 'REQUEST', `${basepath}/summary`),
  getSchema: apiCreator(dataSrc, 'POST', 'REQUEST', `${basepath}/schema`),
  getSpecification: apiCreator(dataSrc, 'GET', 'REQUEST', `${basepathV2}/specification`),
  getUsage: apiCreator(dataSrc, 'GET', 'REQUEST', `${contextPath}/usage`),
  getInfo: apiCreator(dataSrc, 'GET', 'REQUEST', `${baseServicePath}/methods/info`),
  setWorkspace: apiCreator(dataSrc, 'POST', 'REQUEST', `${basepathV2}`),
  getWorkspace: apiCreator(dataSrc, 'GET', 'REQUEST', `${basepathV2}`),
  getWorkspaceList: apiCreator(dataSrc, 'GET', 'REQUEST', `${contextPathV2}/workspaces`),
  resampleWorkspace: apiCreator(
    dataSrc,
    'POST',
    'REQUEST',
    `${contextPathV2}/workspaces/:workspaceId/resample `
  ),

  // Wrangler Data Model
  attachDataModel: apiCreator(dataSrc, 'POST', 'REQUEST', `${basepath}/datamodels`),
  detachDataModel: apiCreator(dataSrc, 'DELETE', 'REQUEST', `${basepath}/datamodels`),
  attachModel: apiCreator(dataSrc, 'POST', 'REQUEST', `${basepath}/models`),
  detachModel: apiCreator(dataSrc, 'DELETE', 'REQUEST', `${basepath}/models/:modelId`),
  addDataModels: apiCreator(dataSrc, 'POST', 'REQUEST', `${datamodelsPath}`),
  getDataModels: apiCreator(dataSrc, 'GET', 'REQUEST', `${datamodelsPath}`),
  getDataModel: apiCreator(
    dataSrc,
    'GET',
    'REQUEST',
    `${datamodelsPath}/:dataModelId/revisions/:dataModelRevision`
  ),

  // WRANGLER SERVICE MANAGEMENT
  getApp: apiCreator(dataSrc, 'GET', 'REQUEST', appPath),
  startService: apiCreator(dataSrc, 'POST', 'REQUEST', `${baseServicePath}/start`),
  stopService: apiCreator(dataSrc, 'POST', 'REQUEST', `${baseServicePath}/stop`),
  getServiceStatus: apiCreator(dataSrc, 'GET', 'REQUEST', `${baseServicePath}/status`),
  pollServiceStatus: apiCreator(dataSrc, 'GET', 'POLL', `${baseServicePath}/status`),
  createApp: apiCreator(dataSrc, 'PUT', 'REQUEST', `${appPath}`),
  ping: apiCreator(dataSrc, 'GET', 'REQUEST', `${baseServicePath}/methods/health`),

  // File System Browser
  explorer: apiCreator(dataSrc, 'GET', 'REQUEST', `${contextPath}/explorer/fs`),
  readFile: apiCreator(dataSrc, 'GET', 'REQUEST', `${contextPath}/explorer/fs/read`),

  // Database Browser
  listTables: apiCreator(dataSrc, 'GET', 'REQUEST', `${connectionsPath}/:connectionId/tables`),
  readTable: apiCreator(
    dataSrc,
    'GET',
    'REQUEST',
    `${connectionsPath}/:connectionId/tables/:tableId/read`
  ),
  getDatabaseSpecification: apiCreator(
    dataSrc,
    'GET',
    'REQUEST',
    `${connectionsPath}/:connectionId/tables/:tableId/specification`
  ),

  // JDBC
  jdbcDrivers: apiCreator(dataSrc, 'GET', 'REQUEST', `${contextPath}/jdbc/drivers`),
  jdbcAllowed: apiCreator(dataSrc, 'GET', 'REQUEST', `${contextPath}/jdbc/allowed`),
  jdbcTestConnection: apiCreator(
    dataSrc,
    'POST',
    'REQUEST',
    `${contextPath}/connections/jdbc/test`
  ),
  getDatabaseList: apiCreator(dataSrc, 'POST', 'REQUEST', `${contextPath}/connections/databases`),

  // Kafka
  kafkaTestConnection: apiCreator(dataSrc, 'POST', 'REQUEST', `${connectionsPath}/kafka/test`),
  listTopics: apiCreator(dataSrc, 'POST', 'REQUEST', `${connectionsPath}/kafka`),
  readTopic: apiCreator(
    dataSrc,
    'GET',
    'REQUEST',
    `${connectionsPath}/:connectionId/kafka/:topic/read`
  ),
  getKafkaSpecification: apiCreator(
    dataSrc,
    'GET',
    'REQUEST',
    `${connectionsPath}/:connectionId/kafka/:topic/specification`
  ),

  // S3
  s3TestConnection: apiCreator(dataSrc, 'POST', 'REQUEST', `${connectionsPath}/s3/test`),
  getS3Buckets: apiCreator(
    dataSrc,
    'POST',
    'REQUEST',
    `${connectionsPath}/:connectionId/s3/buckets`
  ),
  exploreBucketDetails: apiCreator(
    dataSrc,
    'GET',
    'REQUEST',
    `${connectionsPath}/:connectionId/s3/explore`
  ),
  readS3File: apiCreator(
    dataSrc,
    'POST',
    'REQUEST',
    `${connectionsPath}/:connectionId/s3/buckets/:activeBucket/read`
  ),
  getS3Specification: apiCreator(
    dataSrc,
    'GET',
    'REQUEST',
    `${connectionsPath}/:connectionId/s3/buckets/:activeBucket/specification`
  ),

  // GCS
  gcsTestConnection: apiCreator(dataSrc, 'POST', 'REQUEST', `${connectionsPath}/gcs/test`),
  exploreGCSBucketDetails: apiCreator(
    dataSrc,
    'GET',
    'REQUEST',
    `${connectionsPath}/:connectionId/gcs/explore`
  ),
  readGCSFile: apiCreator(
    dataSrc,
    'GET',
    'REQUEST',
    `${connectionsPath}/:connectionId/gcs/buckets/:activeBucket/read`
  ),
  getGCSSpecification: apiCreator(
    dataSrc,
    'GET',
    'REQUEST',
    `${connectionsPath}/:connectionId/gcs/specification`
  ),

  // BigQuery
  bigQueryTestConnection: apiCreator(
    dataSrc,
    'POST',
    'REQUEST',
    `${connectionsPath}/bigquery/test`
  ),
  bigQueryGetDatasets: apiCreator(
    dataSrc,
    'GET',
    'REQUEST',
    `${connectionsPath}/:connectionId/bigquery`
  ),
  bigQueryGetTables: apiCreator(
    dataSrc,
    'GET',
    'REQUEST',
    `${connectionsPath}/:connectionId/bigquery/:datasetId/tables`
  ),
  readBigQueryTable: apiCreator(
    dataSrc,
    'GET',
    'REQUEST',
    `${connectionsPath}/:connectionId/bigquery/:datasetId/tables/:tableId/read`
  ),
  getBigQuerySpecification: apiCreator(
    dataSrc,
    'GET',
    'REQUEST',
    `${connectionsPath}/:connectionId/bigquery/specification`
  ),

  // Spanner
  spannerTestConnection: apiCreator(dataSrc, 'POST', 'REQUEST', `${connectionsPath}/spanner/test`),
  spannerGetInstances: apiCreator(
    dataSrc,
    'GET',
    'REQUEST',
    `${connectionsPath}/:connectionId/spanner/instances`
  ),
  spannerGetDatabases: apiCreator(
    dataSrc,
    'GET',
    'REQUEST',
    `${connectionsPath}/:connectionId/spanner/instances/:instanceId/databases`
  ),
  spannerGetTables: apiCreator(
    dataSrc,
    'GET',
    'REQUEST',
    `${connectionsPath}/:connectionId/spanner/instances/:instanceId/databases/:databaseId/tables`
  ),
  readSpannerTable: apiCreator(
    dataSrc,
    'GET',
    'REQUEST',
    `${connectionsPath}/:connectionId/spanner/instances/:instanceId/databases/:databaseId/tables/:tableId/read`
  ),
  getSpannerSpecification: apiCreator(
    dataSrc,
    'GET',
    'REQUEST',
    `${contextPath}/spanner/workspaces/:workspaceId/specification`
  ),

  // ADLS
  adlsTestConnection: apiCreator(dataSrc, 'POST', 'REQUEST', `${connectionsPath}/adls/test`),
  adlsFileExplorer: apiCreator(
    dataSrc,
    'GET',
    'REQUEST',
    `${connectionsPath}/:connectionId/adls/explore`
  ),
  adlsReadFile: apiCreator(
    dataSrc,
    'POST',
    'REQUEST',
    `${connectionsPath}/:connectionId/adls/read`
  ),
  getAdlsSpecification: apiCreator(
    dataSrc,
    'GET',
    'REQUEST',
    `${connectionsPath}/:connectionId/adls/specification`
  ),

  // Connections
  listConnections: apiCreator(dataSrc, 'GET', 'REQUEST', `${connectionsPath}`),
  createConnection: apiCreator(dataSrc, 'POST', 'REQUEST', `${connectionsPath}/create`),
  updateConnection: apiCreator(
    dataSrc,
    'POST',
    'REQUEST',
    `${connectionsPath}/:connectionId/update`
  ),
  deleteConnection: apiCreator(dataSrc, 'DELETE', 'REQUEST', `${connectionsPath}/:connectionId`),
  getConnection: apiCreator(dataSrc, 'GET', 'REQUEST', `${connectionsPath}/:connectionId`),

  // Connection types
  listConnectionTypes: apiCreator(dataSrc, 'GET', 'REQUEST', connectionTypesPath),
};

export default MyDataPrepApi;
