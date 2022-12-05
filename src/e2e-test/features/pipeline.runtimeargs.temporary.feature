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
Feature: Pipeline - Runtime Args - It must be possible to deploy a pipeline and use temporary runtime arguments

  # Rule: It must be possible to deploy a pipeline and use temporary runtime arguments

  Background:
    Given No pipelines are deployed

  @PIPELINE_RUNTIME_ARGS_TEST
  Scenario: Macros in the pipeline are shown in the runtime arguments dialog
    When Deploy and test pipeline "runtime_args_pipeline" with timestamp with pipeline JSON file "pipeline_with_macros.json"
    And Run down arrow is clicked
    Then Deployed runtime arguments dialog is shown
    And Deployed runtime argument row "0" key is disabled
    And Deployed runtime argument row "0" key field is "source_path"
    And Deployed runtime argument row "0" value field is ""
    And Deployed runtime argument row "1" key is disabled
    And Deployed runtime argument row "1" key field is "sink_path"
    And Deployed runtime argument row "1" value field is ""
    And Deployed runtime argument row "2" does not exist

  @PIPELINE_RUNTIME_ARGS_TEST
  Scenario: It should be possible to add and remove an extra runtime argument
    When Deploy and test pipeline "runtime_args_pipeline" with timestamp with pipeline JSON file "pipeline_with_macros.json"
    And Run down arrow is clicked
    And Add a deployed runtime argument from row "1"
    And Enter deployed runtime argument key "test key 2" in row "2"
    And Delete deployed runtime argument row "2"
    Then Deployed runtime argument row "2" does not exist

  @PIPELINE_RUNTIME_ARGS_TEST
  Scenario: Providing incorrect runtime arguments should cause the preview to fail
    When Deploy and test pipeline "runtime_args_pipeline" with timestamp with pipeline JSON file "pipeline_with_macros.json"
    And Run down arrow is clicked
    And Enter deployed runtime argument value "random value1" in row "0"
    And Enter deployed runtime argument value "random value2" in row "1"
    And Deployed run button is clicked
    Then Deployed pipeline status is "Failed"

  @PIPELINE_RUNTIME_ARGS_TEST
  Scenario: Providing correct runtime arguments should allow the preview to pass
    When Deploy and test pipeline "runtime_args_pipeline" with timestamp with pipeline JSON file "pipeline_with_macros.json"
    And Run down arrow is clicked
    And Enter deployed runtime argument value "file:/tmp/cdap-ui-integration-fixtures/airports.csv" in row "0"
    And Enter deployed runtime argument value "/tmp/cdap-ui-integration-fixtures" in row "1"
    And Deployed run button is clicked
    Then Deployed pipeline status is "Succeeded"

  @PIPELINE_RUNTIME_ARGS_TEST
  Scenario: Unsaved arguments should not be kept
    When Deploy and test pipeline "runtime_args_pipeline" with timestamp with pipeline JSON file "pipeline_with_macros.json"
    And Run down arrow is clicked
    And Add a deployed runtime argument from row "1"
    And Enter deployed runtime argument key "test key 2" in row "2"
    And Enter deployed runtime argument value "test value 2" in row "2"
    And Add a deployed runtime argument from row "2"
    And Enter deployed runtime argument key "test key 3" in row "3"
    And Enter deployed runtime argument value "test value 3" in row "3"
    And Close the runtime argument dialog
    And Run down arrow is clicked
    Then Deployed runtime argument row "2" does not exist
