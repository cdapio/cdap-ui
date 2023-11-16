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
Feature: Source Control Management - Pulling and pushing applications
  Background:
    When Open Source Control Management Page
    Then Delete the repo config
    Then Initialize the repository config

  @SOURCE_CONTROL_MANAGEMENT_TEST
  Scenario: Should successfully push a pipeline to git from pipeline list page
    When Deploy and test pipeline "test_pipeline2_fll_airport" with pipeline JSON file "fll_airport_pipeline2.json"
    Then Click push button in Actions dropdown
    Then Commit changes with message "upload pipeline to Git"
    Then Banner is shown with message "Successfully pushed pipeline test_pipeline2_fll_airport"
    Then Clean up pipeline "test_pipeline2_fll_airport" which is created for testing

  @SOURCE_CONTROL_MANAGEMENT_TEST
  Scenario: Remote pipeline tab loads pipelines from git
    # Setup
    When Deploy and test pipeline "test_pipeline2_fll_airport" with pipeline JSON file "fll_airport_pipeline2.json"
    # Test push from SCM sync page
    When Open Source Control Sync Page
    When Select "test_pipeline2_fll_airport" pipeline and push
    Then Commit changes with message "upload pipeline to Git"
    Then Push success indicator is shown for pipeline "test_pipeline2_fll_airport"
    When Select remote pipelines tab
    Then Verify pipeline list size 1
    Then Verify "test_pipeline2_fll_airport" pipeline exist in list
    # Test pull from SCM sync page
    Then Clean up pipeline "test_pipeline2_fll_airport" which is created for testing
    When Open Source Control Sync Page
    When Select remote pipelines tab
    Then Select "test_pipeline2_fll_airport" pipeline and pull
    Then Pull success indicator is shown for pipeline "test_pipeline2_fll_airport"
    # Clean up
    Then Clean up pipeline "test_pipeline2_fll_airport" which is created for testing

  @PIPELINE_EDIT_TEST
  @SOURCE_CONTROL_MANAGEMENT_TEST
  Scenario: Edit a simple pipeline and restore a version from git
    When Deploy and test pipeline "pipeline_edit_test" with pipeline JSON file "logs_generator.json"
    # Push version 1 of the pipeline to git.
    Then Click push button in Actions dropdown
    Then Commit changes with message "upload pipeline to Git"
    Then Banner is shown with message "Successfully pushed pipeline pipeline_edit_test"
    # Edit the pipeline to create a new LCM version.
    Then Edit pipeline and verify changes
    # Pull version 1 back from git.
    Then Click pull button in Actions dropdown
    Then Pipeline source node "referenceName" property should be "logs_data_source"
    Then History should show 3 entries
    # Pulling again should show a warning.
    Then Click pull button in Actions dropdown
    Then Banner is shown with message "Pipeline is already up to date"
    Then History should show 3 entries
    # Clean up.
    Then Clean up pipeline "pipeline_edit_test" which is created for testing
