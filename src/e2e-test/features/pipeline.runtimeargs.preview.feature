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
Feature: Pipeline - Runtime Args - It must be possible to preview a pipeline with macros

  # Rule: It must be possible to preview a pipeline with macros

  @PIPELINE_RUNTIME_ARGS_TEST
  Scenario: Macros in the pipeline are shown in the runtime arguments dialog
    When Open Pipeline Studio Page
    And Upload pipeline from file "pipeline_with_macros.json"
    And Enter preview mode
    And Start preview run
    Then Preview runtime arguments dialog is shown
    And Preview runtime argument row "0" key is disabled
    And Preview runtime argument row "0" key field is "source_path"
    And Preview runtime argument row "0" value field is ""
    And Preview runtime argument row "1" key is disabled
    And Preview runtime argument row "1" key field is "sink_path"
    And Preview runtime argument row "1" value field is ""
    And Preview runtime argument row "2" does not exist

  @PIPELINE_RUNTIME_ARGS_TEST
  Scenario: It should be possible to add and remove an extra runtime argument
    When Open Pipeline Studio Page
    And Upload pipeline from file "pipeline_with_macros.json"
    And Enter preview mode
    And Start preview run
    And Add a preview runtime argument from row "1"
    And Enter preview runtime argument key "test key 2" in row "2"
    And Delete preview runtime argument row "2"
    Then Preview runtime argument row "2" does not exist

  @PIPELINE_RUNTIME_ARGS_TEST
  Scenario: Providing an incorrect runtime argument should fail the preview
    When Open Pipeline Studio Page
    And Upload pipeline from file "pipeline_with_macros.json"
    And Enter preview mode
    And Start preview run
    And Enter preview runtime argument value "random value1" in row "0"
    And Enter preview runtime argument value "random value2" in row "1"
    And Click run button from preview runtime arguments
    Then Pipeline banner is shown with message "The preview of the pipeline \"Airport_test_macros\" has failed. Please check the logs for more information."

  @PIPELINE_RUNTIME_ARGS_TEST
  Scenario: Providing correct runtime arguments should allow the preview to pass
    When Open Pipeline Studio Page
    And Upload pipeline from file "pipeline_with_macros.json"
    And Enter preview mode
    And Start preview run
    And Enter preview runtime argument value "file:/tmp/cdap-ui-integration-fixtures/airports.csv" in row "0"
    And Enter preview runtime argument value "/tmp/cdap-ui-integration-fixtures" in row "1"
    And Click run button from preview runtime arguments
    Then Pipeline banner is shown with message "The preview of the pipeline \"Airport_test_macros\" has completed successfully."
