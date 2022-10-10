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
Feature: Wrangler Spanner Tests

  @WRANGLER_SPANNER_TEST
  Scenario: Should successfully test SPANNER connection
    When Open Connections page
    Then Test Spanner Connection with name "spanner_randomtest1234"
    Then Verify for successful test connection and message

  @WRANGLER_SPANNER_TEST
  Scenario: Should show appropriate message when test connection fails
    When Open Connections page
    Then Test Spanner Connection with "unknown_spanner_connection_name", "unknown_project", "unknown_path"
    Then Verify test connection failure and message

  @WRANGLER_SPANNER_TEST
  Scenario: Should create SPANNER connection
    When Open Connections page
    Then Create Spanner Connection with name "spanner_randomtest1234"
    Then Verify navigation to created connection "spanner_randomtest1234"

  @WRANGLER_SPANNER_TEST
  Scenario: Should show proper error message when trying to create existing connection
    When Open Connections page
    Then Create Spanner Connection with name "spanner_randomtest1234"
    Then Check for the connection already exists error for "spanner_randomtest1234"

  @WRANGLER_SPANNER_TEST
   Scenario: Should show appropriate error when navigating to incorrect SPANNER connection
     When Open connection 'spanner_unknown_connection' page
     Then Check for connection 'spanner_unknown_connection' not found message

  @WRANGLER_SPANNER_TEST
  Scenario: Should be able navigate inside SPANNER connection & create workspace
    When Open Connections page
    Then Select Spanner connection "spanner_randomtest1234"
    Then Check Connection "spanner_randomtest1234" details: Instance, Database, Table
    Then Verify URL navigation

  @WRANGLER_SPANNER_TEST
  Scenario: Should delete an existing connection
    When Open Connections page
    Then Delete Connection "spanner_randomtest1234"
    Then Confirm that the connection "spanner_randomtest1234" is deleted

