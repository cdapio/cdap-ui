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

function getRandomArbitrary(min = 1, max = 10000) {
  return Math.floor(Math.random() * (max - min) + min);
}

export const TEST_TIMEOUT_TIME = 10000;
export const RETRY_INTERVAL = 2000;
export const TEST_TIMEOUT_MESSAGE = `Timed out after ${(TEST_TIMEOUT_TIME / 1000)} seconds`;

export const BASE_URL = 'http://localhost:11011'
export const BASE_SERVER_URL = 'http://localhost:11015'
export const TETHERING_URL = `${BASE_URL}/cdap/administration/tethering/`
export const CONFIGURATION_URL = `${BASE_URL}/cdap/administration/configuration`
export const PIPELINE_STUDIO_URL = `${BASE_URL}/pipelines/ns/default/studio`

export const DEFAULT_GCP_SERVICEACCOUNT_PATH = process.env.GCP_SERVICE_ACCOUNT_PATH;
export const DEFAULT_GCP_PROJECTID = process.env.GCP_PROJECTID;

export const DEFAULT_GCS_CONNECTION_NAME = `gcs_${getRandomArbitrary()}`;
// 000 to keep this bucket in the first 1000 entries
// TODO Change back when we support > 1000 entries
export const DEFAULT_GCS_FOLDER = '000cdap-gcp-ui-test';
export const DEFAULT_GCS_FILE = 'purchase_bad.csv';

export const DEFAULT_BIGQUERY_CONNECTION_NAME = `bigquery_${getRandomArbitrary()}`;
export const DEFAULT_BIGQUERY_DATASET = 'cdap_gcp_ui_test';
export const DEFAULT_BIGQUERY_TABLE = 'users';

export const DEFAULT_SPANNER_INSTANCE = 'cdap-gcp-ui-test';
export const DEFAULT_SPANNER_DATABASE = 'test';
export const DEFAULT_SPANNER_TABLE = 'users';
export const DEFAULT_SPANNER_CONNECTION_NAME = `spanner_${getRandomArbitrary()}`;

export const RUNTIME_ARGS_DEPLOYED_SELECTOR = 'runtimeargs-deployed';
export const RUNTIME_ARGS_KEY_SELECTOR = 'runtimeargs-key';
export const RUNTIME_ARGS_VALUE_SELECTOR = 'runtimeargs-value';
