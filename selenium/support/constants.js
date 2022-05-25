"use strict";
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
exports.__esModule = true;
exports.RUNTIME_ARGS_VALUE_SELECTOR = exports.RUNTIME_ARGS_KEY_SELECTOR = exports.RUNTIME_ARGS_DEPLOYED_SELECTOR = exports.DEFAULT_SPANNER_CONNECTION_NAME = exports.DEFAULT_SPANNER_TABLE = exports.DEFAULT_SPANNER_DATABASE = exports.DEFAULT_SPANNER_INSTANCE = exports.DEFAULT_BIGQUERY_TABLE = exports.DEFAULT_BIGQUERY_DATASET = exports.DEFAULT_BIGQUERY_CONNECTION_NAME = exports.DEFAULT_GCS_FILE = exports.DEFAULT_GCS_FOLDER = exports.DEFAULT_GCS_CONNECTION_NAME = exports.DEFAULT_GCP_PROJECTID3 = exports.DEFAULT_GCP_PROJECTID2 = exports.DEFAULT_GCP_PROJECTID1 = exports.DEFAULT_GCP_PROJECTID = exports.DEFAULT_GCP_SERVICEACCOUNT_PATH = exports.CONFIGURATION_URL = exports.TETHERING_URL = exports.BASE_SERVER_URL = exports.BASE_URL = void 0;
var core = require("@actions/core");
var secret = core.getInput("GCLOUD");
var secret2 = core.getInput("GCLOUD_ID");
var secret3 = core.getInput("GCLOUD_PATH");
function getRandomArbitrary(min, max) {
    if (min === void 0) { min = 1; }
    if (max === void 0) { max = 10000; }
    return Math.floor(Math.random() * (max - min) + min);
}
exports.BASE_URL = 'http://localhost:11011';
exports.BASE_SERVER_URL = 'http://localhost:11015';
exports.TETHERING_URL = exports.BASE_URL + "/cdap/administration/tethering/";
exports.CONFIGURATION_URL = exports.BASE_URL + "/cdap/administration/configuration";
exports.DEFAULT_GCP_SERVICEACCOUNT_PATH = process.env.GCP_SERVICE_ACCOUNT_PATH;
exports.DEFAULT_GCP_PROJECTID = process.env.GCP_PROJECTID;
exports.DEFAULT_GCP_PROJECTID1 = process.env.GCLOUD;
exports.DEFAULT_GCP_PROJECTID2 = process.env.GCLOUD_ID;
exports.DEFAULT_GCP_PROJECTID3 = process.env.GCLOUD_PATH;
exports.DEFAULT_GCS_CONNECTION_NAME = "gcs_" + getRandomArbitrary();
// 000 to keep this bucket in the first 1000 entries
// TODO Change back when we support > 1000 entries
exports.DEFAULT_GCS_FOLDER = '000cdap-gcp-ui-test';
exports.DEFAULT_GCS_FILE = 'purchase_bad.csv';
exports.DEFAULT_BIGQUERY_CONNECTION_NAME = "bigquery_" + getRandomArbitrary();
exports.DEFAULT_BIGQUERY_DATASET = 'cdap_gcp_ui_test';
exports.DEFAULT_BIGQUERY_TABLE = 'users';
exports.DEFAULT_SPANNER_INSTANCE = 'cdap-gcp-ui-test';
exports.DEFAULT_SPANNER_DATABASE = 'test';
exports.DEFAULT_SPANNER_TABLE = 'users';
exports.DEFAULT_SPANNER_CONNECTION_NAME = "spanner_" + getRandomArbitrary();
exports.RUNTIME_ARGS_DEPLOYED_SELECTOR = 'runtimeargs-deployed';
exports.RUNTIME_ARGS_KEY_SELECTOR = 'runtimeargs-key';
exports.RUNTIME_ARGS_VALUE_SELECTOR = 'runtimeargs-value';
var readEnvVariables = function () {
    console.log(exports.DEFAULT_GCP_SERVICEACCOUNT_PATH);
    console.log(exports.DEFAULT_GCP_PROJECTID);
    console.log(exports.DEFAULT_GCP_PROJECTID1);
    console.log(exports.DEFAULT_GCP_PROJECTID2);
    console.log(exports.DEFAULT_GCP_PROJECTID3);
    console.log('here', secret);
    console.log('here2', secret2);
    console.log('here3', secret3);
};
readEnvVariables();
