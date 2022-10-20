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

package io.cdap.cdap.ui.utils;

public class Constants {
  private static double getRandomArbitrary(int min, int max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  public static final int TEST_TIMEOUT_TIME = 10000;
  public static final int RETRY_INTERVAL = 2000;
  public static final String TEST_TIMEOUT_MESSAGE = "Timed out after" +
    String.valueOf(TEST_TIMEOUT_TIME / 1000) +
    "seconds";

  public static final String BASE_URL = "http://localhost:11011";
  public static final String BASE_SERVER_URL = "http://localhost:11015";
  public static final String BASE_PIPELINES_URL = BASE_URL + "/pipelines/ns/default";
  public static final String CDAP_URL = BASE_URL + "/cdap";
  public static final String CONFIGURATION_URL = "http://localhost:11011/cdap/administration/configuration";
  public static final String NAMESPACE_URL = BASE_URL + "/cdap/ns";
  public static final String BASE_STUDIO_URL = "http://localhost:11011/cdap/ns/default/";
  public static final String SYSTEM_PROFILES_CREATE_URL = "http://localhost:11011/cdap/ns/system/profiles/create";
  public static final String PIPELINE_STUDIO_URL = "http://localhost:11011/pipelines/ns/default/studio";
  public static final String FIXTURES_DIR = "src/e2e-test/fixtures/";
  public static final String PIPELINE_FILES_DIR = "/tmp/cdap-ui-integration-fixtures/";

  public static final String DEFAULT_GCS_CONNECTION_NAME = "gcs_" + String.valueOf(getRandomArbitrary(1, 10000));

  // 000 to keep this bucket in the first 1000 entries
  // TODO Change back when we support > 1000 entries
  public static final String DEFAULT_GCS_FOLDER = "000cdap-gcp-ui-test";
  public static final String DEFAULT_GCS_FILE = "purchase_bad.csv";

  public static final String DEFAULT_BIGQUERY_CONNECTION_NAME = "bigquery_" +
    String.valueOf(getRandomArbitrary(1, 10000));
  public static final String DEFAULT_BIGQUERY_DATASET = "cdap_gcp_ui_test";
  public static final String DEFAULT_BIGQUERY_TABLE = "users";

  public static final String DEFAULT_SPANNER_INSTANCE = "cdap-gcp-ui-test";
  public static final String DEFAULT_SPANNER_DATABASE = "test";
  public static final String DEFAULT_SPANNER_TABLE = "users";
  public static final String DEFAULT_SPANNER_CONNECTION_NAME = "spanner_" +
    String.valueOf(getRandomArbitrary(1, 10000));

  public static final String RUNTIME_ARGS_DEPLOYED_SELECTOR = "runtimeargs-deployed";
  public static final String RUNTIME_ARGS_KEY_SELECTOR = "runtimeargs-key";
  public static final String RUNTIME_ARGS_VALUE_SELECTOR = "runtimeargs-value";

  // cdap themes
  public static final String DEFAULT_THEME_PATH = "config/themes/default.json";
  public static final String LIGHT_THEME_PATH = "config/themes/light.json";

  public static final String DEFAULT_GCP_PROJECTID = System.getenv("GCP_PROJECTID");
  public static final String DEFAULT_GCP_SERVICEACCOUNT_PATH = System.getenv("GCP_SERVICE_ACCOUNT_PATH");
  public static final String WRANGLE_HOME_URL = "http://localhost:11011/cdap/ns/default/home";
}
