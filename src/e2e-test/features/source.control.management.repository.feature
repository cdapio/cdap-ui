#
# Copyright © 2023 Cask Data, Inc.
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
Feature: Source Control Management - Repository Configuration CRUD operations

  @SOURCE_CONTROL_MANAGEMENT_TEST
  Scenario: Should show error message when validating invalid repository config
    When Open Source Control Management Page
    Then Click on "Link Repository" button
    Then Add fake repository configuration
    Then Click on "Validate" button
    Then Verify "Failed to list remotes in remote repository." message in validation

  @SOURCE_CONTROL_MANAGEMENT_TEST
  Scenario: Should show success message when validating valid repository config
    When Open Source Control Management Page
    Then Click on "Link Repository" button
    Then Add test repository configuration
    Then Add created test branch
    Then Click on "Validate" button
    Then Verify "Successfully connected." message in validation

  @SOURCE_CONTROL_MANAGEMENT_TEST
  Scenario: Should show error message when validating non-existing branch
    When Open Source Control Management Page
    Then Click on "Link Repository" button
    Then Add test repository configuration
    Then Add non-existing branch
    Then Click on "Validate" button
    Then Verify "Default branch not found in remote repository." message in validation

  @SOURCE_CONTROL_MANAGEMENT_TEST
  Scenario: Should save repository config
    When Open Source Control Management Page
    Then Click on "Link Repository" button
    Then Add fake repository configuration
    Then Click on "Save and Close" button
    Then Verify saved fake repo config
    Then Delete the repo config
    Then Verify UI directed to initial page
