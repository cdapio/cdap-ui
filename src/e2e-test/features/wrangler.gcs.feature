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
Feature: Wrangler GCS Connection Tests

  @WRANGLER_GCS_CONNECTION_TEST
  Scenario: Should successfully test GCS connection
    When Open Connections Page
    Then Test GCS connection with name "gcs_randomtest1234"
    Then Verify for successful GCS test connection and message

  @WRANGLER_GCS_CONNECTION_TEST
  Scenario: Should show appropriate message when GCS connection fails
    When Open Connections Page
    Then Test GCS connection with "unknown_gcs_connection_name", "unknown_project", "unknown_path"
    Then Verify GCS test connection failure and message

  @WRANGLER_GCS_CONNECTION_TEST
  Scenario: Should create GCS connection
    When Open Connections Page
    Then Create GCS connection with name "gcs_randomtest1234"
    Then Verify navigation to created GCS connection "gcs_randomtest1234"

  @WRANGLER_GCS_CONNECTION_TEST
  Scenario: Should show proper error message when trying to create existing GCS connection
    When Open Connections Page
    Then Create GCS connection with name "gcs_randomtest1234"
    Then Check for the GCS connection already exists error for "gcs_randomtest1234"

  @WRANGLER_GCS_CONNECTION_TEST
   Scenario: Should show appropriate error when navigating to incorrect GCS connection
     When Open GCS connection 'gcs_unknown_connection' page
     Then Check for GCS connection 'gcs_unknown_connection' not found message

  @WRANGLER_GCS_CONNECTION_TEST
  Scenario: Should be able navigate inside GCS connection & create workspace
    When Open Connections Page
    Then Select GCS connection "gcs_randomtest1234"
    Then Check GCS connection "gcs_randomtest1234" details: Folder, file
    Then Verify URL navigation for GCS connection

  @WRANGLER_GCS_CONNECTION_TEST
  Scenario: Should delete an existing connection
    When Open Connections Page
    Then Delete GCS connection "gcs_randomtest1234"
    Then Confirm that the GCS connection "gcs_randomtest1234" is deleted

