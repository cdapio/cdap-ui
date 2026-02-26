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
Feature: Pipeline Triggers

  Background:
    Given No pipelines are deployed

  @PIPELINE_TRIGGERS_TEST
  Scenario: Enabled triggers count in the inbound triggers panel should be correct
    When Deploy pipeline "trigger_test_pipeline_1" with pipeline JSON file "pipeline_with_macros.json"
    When Deploy pipeline "trigger_test_pipeline_2" with pipeline JSON file "pipeline_with_macros.json"
    Then Verify inbound triggers count to be 0
    Then Open inbound triggers and add a simple trigger with name "test_trigger_1" when pipeline "trigger_test_pipeline_1" succeeds
    Then Verify inbound triggers count to be 1
    Then Reload the page
    Then Verify inbound triggers count to be 1
    Then Open inbound triggers and delete trigger "test_trigger_1"
    Then Verify inbound triggers count to be 0
    Then Reload the page
    Then Verify inbound triggers count to be 0
    Then Cleanup pipeline "trigger_test_pipeline_1"
    Then Cleanup pipeline "trigger_test_pipeline_2"

  @PIPELINE_TRIGGERS_TEST
  Scenario: Deploy two pipelines and enable trigger for pipeline2 when pipeline1 succeeds with a simple trigger and disabling it
    When Deploy pipeline "trigger_test_pipeline_1" with pipeline JSON file "pipeline_with_macros.json"
    When Deploy pipeline "trigger_test_pipeline_2" with pipeline JSON file "pipeline_with_macros.json"
    Then Open inbound trigger and set and delete a simple trigger when "trigger_test_pipeline_1" succeeds
    Then Cleanup pipeline "trigger_test_pipeline_1"
    Then Cleanup pipeline "trigger_test_pipeline_2"

  @PIPELINE_TRIGGERS_TEST
  Scenario: Deploy two pipelines and enable trigger for pipeline2 when pipeline1 succeeds with a complex trigger and disabling it
    When Deploy pipeline "trigger_test_pipeline_1" with pipeline JSON file "pipeline_with_macros.json"
    When Deploy pipeline "trigger_test_pipeline_2" with pipeline JSON file "pipeline_with_macros.json"
    Then Open inbound trigger and set a complex trigger when "trigger_test_pipeline_1" succeeds
    Then Visit pipeline "trigger_test_pipeline_1"
    Then Ensure outbound trigger to "trigger_test_pipeline_2" exists
    Then Run down arrow is clicked
    And Enter deployed runtime argument value "file:/tmp/cdap-ui-integration-fixtures/airports.csv" in row "0"
    And Enter deployed runtime argument value "/tmp/cdap-ui-integration-fixtures" in row "1"
    And Save deployed arguments button is clicked
    And Wait for runtime arguments dialog to close
    Then Run the pipeline
    Then Deployed pipeline status is "Succeeded"
    Then Visit pipeline "trigger_test_pipeline_2"
    Then Deployed pipeline status is "Succeeded"
    Then Cleanup complex trigger
    Then Cleanup pipeline "trigger_test_pipeline_1"
    Then Cleanup pipeline "trigger_test_pipeline_2"

  @PIPELINE_TRIGGERS_TEST
  Scenario: Deploy three pipelines and enable trigger for pipeline3 when pipeline1 succeeds and pipeline2 succeeds
  with a complex trigger of cross runtime arguments mapping and disabling it
    When Deploy pipeline "trigger_test_pipeline_1" with pipeline JSON file "pipeline_with_macros.json"
    When Deploy pipeline "trigger_test_pipeline_2" with pipeline JSON file "pipeline_with_macros.json"
    When Deploy pipeline "trigger_test_pipeline_3" with pipeline JSON file "pipeline_with_macros.json"
    Then Open inbound trigger and set a complex trigger when "trigger_test_pipeline_1" and "trigger_test_pipeline_2" succeeds
    Then Visit pipeline "trigger_test_pipeline_1"
    Then Ensure outbound trigger to "trigger_test_pipeline_3" exists
    Then Run down arrow is clicked
    And Enter deployed runtime argument value "file:/tmp/cdap-ui-integration-fixtures/airports.csv" in row "0"
    And Enter deployed runtime argument value "/tmp/cdap-ui-integration-fixtures" in row "1"
    And Save deployed arguments button is clicked
    And Wait for runtime arguments dialog to close
    Then Run the pipeline
    Then Deployed pipeline status is "Succeeded"
    Then Visit pipeline "trigger_test_pipeline_2"
    Then Ensure outbound trigger to "trigger_test_pipeline_3" exists
    Then Run down arrow is clicked
    And Enter deployed runtime argument value "file:/tmp/cdap-ui-integration-fixtures/airports.csv" in row "0"
    And Enter deployed runtime argument value "/tmp/cdap-ui-integration-fixtures" in row "1"
    And Save deployed arguments button is clicked
    And Wait for runtime arguments dialog to close
    Then Run the pipeline
    Then Deployed pipeline status is "Succeeded"
    Then Visit pipeline "trigger_test_pipeline_3"
    Then Deployed pipeline status is "Succeeded"
    Then Cleanup complex trigger with cross argument mappings
    Then Cleanup pipeline "trigger_test_pipeline_1"
    Then Cleanup pipeline "trigger_test_pipeline_2"
    Then Cleanup pipeline "trigger_test_pipeline_3"

    @PIPELINE_TRIGGERS_TEST
    Scenario: Deploy seven pipelines and check pagination on inbound triggers tab
      When Deploy pipelines list with pipeline JSON file "pipeline_with_macros.json":
        |trigger_test_pipeline_1|
        |trigger_test_pipeline_2|
        |trigger_test_pipeline_3|
        |trigger_test_pipeline_4|
        |trigger_test_pipeline_5|
        |trigger_test_pipeline_6|
        |trigger_test_pipeline_7|
      Then Open inbound triggers and check pagination with pipelines:
        |trigger_test_pipeline_1|
        |trigger_test_pipeline_2|
        |trigger_test_pipeline_3|
        |trigger_test_pipeline_4|
        |trigger_test_pipeline_5|
        |trigger_test_pipeline_6|
        |trigger_test_pipeline_7|
      Then Cleanup pipelines list:
        |trigger_test_pipeline_1|
        |trigger_test_pipeline_2|
        |trigger_test_pipeline_3|
        |trigger_test_pipeline_4|
        |trigger_test_pipeline_5|
        |trigger_test_pipeline_6|
        |trigger_test_pipeline_7|
