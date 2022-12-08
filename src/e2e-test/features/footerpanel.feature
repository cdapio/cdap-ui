#
# Copyright © 2022 Cask Data, Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License"); you may not
# use this file except in compliance with the License. You may obtain a copy of
# the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
# WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
# License for the specific language governing permissions and limitations under
# the License.
#

@Integration_Tests
Feature: Wrangler BigQuery Connection Tests

  @WRANGLER_BIGQUERY_CONNECTION_TEST
  Scenario: Should successfully test BIGQUERY connection
    When Open Connections page for BigQuery connection test
    Then Test BigQuery connection with name "bigquery_randomtest2"
    Then Verify for successful BigQuery test connection and message

  @WRANGLER_BIGQUERY_CONNECTION_TEST
  Scenario: Should show appropriate message when BigQuery connection fails
    When Open Connections page
    Then Test BigQuery connection with "unknown_bigquery_connection_name", "unknown_project", "unknown_path"
    Then Verify BigQuery test connection failure and message

  @WRANGLER_BIGQUERY_CONNECTION_TEST
  Scenario: Should create BIGQUERY connection
    When Open Connections page
    Then Create BigQuery connection with name "bigquery_randomtest2"
    Then Verify navigation to created BigQuery connection "bigquery_randomtest2"

  @WRANGLER_BIGQUERY_CONNECTION_TEST
  Scenario: Should show proper error message when trying to create existing BigQuery connection
    When Open Connections page
    Then Create BigQuery connection with name "bigquery_randomtest2"
    Then Check for the BigQuery connection already exists error for "bigquery_randomtest2"

  @WRANGLER_BIGQUERY_CONNECTION_TEST
   Scenario: Should show appropriate error when navigating to incorrect BIGQUERY connection
     When Open BigQuery connection 'bigquery_unknown_connection' page
     Then Check for BigQuery connection 'bigquery_unknown_connection' not found message

  @WRANGLER_BIGQUERY_CONNECTION_TEST
  Scenario: Should be able navigate inside BIGQUERY connection & create workspace
    When Open Connections page
    Then Select BigQuery connection "bigquery_randomtest2"
    Then Check BigQuery connection "bigquery_randomtest2" details: Instance, Database, Table
    Then Verify URL navigation for BigQuery connection

  @FooterPanel
    Scenario: Checking the footer panel is on the grid table
    When Navigate to Home Page
    Then Click on the Data Explorations card
    Then Verify if the Footer Panel is displayed
    Then Verify if the elements on the Footer Panel are displayed
