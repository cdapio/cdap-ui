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
Feature: Pipeline - Runtime Args - It must be possible to deploy a pipeline and use saved runtime arguments
  # Rule: It must be possible to deploy a pipeline and use temporary runtime arguments

  Background:
    Given No pipelines are deployed

  @PIPELINE_RUNTIME_ARGS_TEST
  Scenario: Deployed pipeline should successfully run with saved arguments
    When Deploy and test pipeline "runtime_args_pipeline" with timestamp with pipeline JSON file "pipeline_with_macros.json"
    And Run down arrow is clicked
    And Enter deployed runtime argument value "file:/tmp/cdap-ui-integration-fixtures/airports.csv" in row "0"
    And Enter deployed runtime argument value "/tmp/cdap-ui-integration-fixtures" in row "1"
    And Save deployed arguments button is clicked
    And Wait for runtime arguments dialog to close
    Then Run the pipeline
    Then Deployed pipeline status is "Succeeded"

  @PIPELINE_RUNTIME_ARGS_TEST
  Scenario: Saving invalid arguments should fail
    When Deploy and test pipeline "runtime_args_pipeline" with timestamp with pipeline JSON file "pipeline_with_macros.json"
    And Run down arrow is clicked
    And Enter deployed runtime argument value "file:/tmp/cdap-ui-integration-fixtures/airports.csv" in row "0"
    And Enter deployed runtime argument value "/tmp/cdap-ui-integration-fixtures" in row "1"
    And Add a deployed runtime argument from row "1"
    And Enter deployed runtime argument key "system.profile.name" in row "2"
    And Enter deployed runtime argument value "unknown" in row "2"
    And Save deployed arguments button is clicked
    Then Deployed runtime arguments dialog is shown
    And Deployed runtime arguments dialog shows message "'profile:default.unknown' was not found"

  @PIPELINE_RUNTIME_ARGS_TEST
  Scenario: Additional runtime arguments should be saved
    When Deploy and test pipeline "runtime_args_pipeline" with timestamp with pipeline JSON file "pipeline_with_macros.json"
    And Run down arrow is clicked
    And Add a deployed runtime argument from row "1"
    And Enter deployed runtime argument key "runtime_args_key2" in row "2"
    And Enter deployed runtime argument value "runtime_args_value2" in row "2"
    And Add a deployed runtime argument from row "2"
    And Enter deployed runtime argument key "runtime_args_key3" in row "3"
    And Enter deployed runtime argument value "runtime_args_value3" in row "3"
    And Add a deployed runtime argument from row "3"
    And Enter deployed runtime argument key "runtime_args_key4" in row "4"
    And Enter deployed runtime argument value "runtime_args_value4" in row "4"
    And Save deployed arguments button is clicked
    And Wait for runtime arguments dialog to close
    And Run down arrow is clicked
    Then Deployed runtime arguments dialog is shown
    And Deployed runtime argument row "2" key field is "runtime_args_key2"
    And Deployed runtime argument row "2" value field is "runtime_args_value2"
    And Deployed runtime argument row "3" key field is "runtime_args_key3"
    And Deployed runtime argument row "3" value field is "runtime_args_value3"
    And Deployed runtime argument row "4" key field is "runtime_args_key4"
    And Deployed runtime argument row "4" value field is "runtime_args_value4"

  @PIPELINE_RUNTIME_ARGS_TEST
  Scenario: Removing a runtime argument should shift the others
    When Deploy and test pipeline "runtime_args_pipeline" with timestamp with pipeline JSON file "pipeline_with_macros.json"
    And Run down arrow is clicked
    And Add a deployed runtime argument from row "1"
    And Enter deployed runtime argument key "runtime_args_key2" in row "2"
    And Enter deployed runtime argument value "runtime_args_value2" in row "2"
    And Add a deployed runtime argument from row "2"
    And Enter deployed runtime argument key "runtime_args_key3" in row "3"
    And Enter deployed runtime argument value "runtime_args_value3" in row "3"
    And Add a deployed runtime argument from row "3"
    And Enter deployed runtime argument key "runtime_args_key4" in row "4"
    And Enter deployed runtime argument value "runtime_args_value4" in row "4"
    And Save deployed arguments button is clicked
    And Wait for runtime arguments dialog to close
    And Run down arrow is clicked
    And Delete deployed runtime argument row "2"
    Then Deployed runtime arguments dialog is shown
    And Deployed runtime argument row "2" key field is "runtime_args_key3"
    And Deployed runtime argument row "2" value field is "runtime_args_value3"
    And Deployed runtime argument row "3" key field is "runtime_args_key4"
    And Deployed runtime argument row "3" value field is "runtime_args_value4"

  @PIPELINE_RUNTIME_ARGS_TEST
  Scenario: Removing all additional runtime arguments should preserve the originals
    When Deploy and test pipeline "runtime_args_pipeline" with timestamp with pipeline JSON file "pipeline_with_macros.json"
    And Run down arrow is clicked
    And Add a deployed runtime argument from row "1"
    And Enter deployed runtime argument key "runtime_args_key2" in row "2"
    And Enter deployed runtime argument value "runtime_args_value2" in row "2"
    And Add a deployed runtime argument from row "2"
    And Enter deployed runtime argument key "runtime_args_key3" in row "3"
    And Enter deployed runtime argument value "runtime_args_value3" in row "3"
    And Add a deployed runtime argument from row "3"
    And Enter deployed runtime argument key "runtime_args_key4" in row "4"
    And Enter deployed runtime argument value "runtime_args_value4" in row "4"
    And Save deployed arguments button is clicked
    And Wait for runtime arguments dialog to close
    And Run down arrow is clicked
    And Delete deployed runtime argument row "4"
    And Delete deployed runtime argument row "3"
    And Delete deployed runtime argument row "2"
    And Save deployed arguments button is clicked
    And Wait for runtime arguments dialog to close
    And Run down arrow is clicked
    Then Deployed runtime arguments dialog is shown
    And Deployed runtime argument row "0" key is disabled
    And Deployed runtime argument row "0" key field is "source_path"
    And Deployed runtime argument row "0" value field is ""
    And Deployed runtime argument row "1" key is disabled
    And Deployed runtime argument row "1" key field is "sink_path"
    And Deployed runtime argument row "1" value field is ""
    And Deployed runtime argument row "2" does not exist
