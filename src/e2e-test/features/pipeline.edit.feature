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
Feature: Pipeline Edit

  @PIPELINE_EDIT_TEST
  Scenario: Edit a simple pipeline
    When Deploy and test pipeline "pipeline_edit_test" with pipeline JSON file "logs_generator.json"
    Then Check Pipeline History Button exists
    Then Click edit button in Actions dropdown
    Then Edit should redirect to studio page
    Then Click deploy without any changes should fail
    Then Click on file source node property button
    Then Modify reference name
    Then Click deploy should succeed
    Then Pipeline should show latest details
    Then History should show correct number of entries and info
    Then View older version should show different details
    Then Restore an older version should work

  @PIPELINE_EDIT_TEST
  Scenario: Pipeline configuration should save to runtime arguments
    When Open pipeline list page
    Then Go to pipeline "pipeline_edit_test" details
    When Run down arrow is clicked
    Then Generated runtime arguments should be empty
    Then Open pipeline configure
    Then Click on "Pipeline config" tab in pipeline configure
    Then Toggle instrumentation settings in pipeline config
    Then Save pipeline configure
    When Run down arrow is clicked
    Then Generated runtime arguments should not be empty

  @PIPELINE_EDIT_TEST
  Scenario: Discarding a draft should delete it from draft list
    When Open pipeline list page
    Then Go to pipeline "pipeline_edit_test" details
    Then Click edit button in Actions dropdown
    Then Edit should redirect to studio page
    Then Save draft and navigate to draft list
    Then Draft "pipeline_edit_test" status should be "In-Progress"
    When Open pipeline list page
    Then Go to pipeline "pipeline_edit_test" details
    Then Click edit button in Actions dropdown
    Then Edit should open a discard modal
    Then Click Discard draft
    When Open pipeline draft list page
    Then Draft "pipeline_edit_test" should not exist

  @PIPELINE_EDIT_TEST
  Scenario: Continuing a draft should resume at last saved point
    When Open pipeline list page
    Then Go to pipeline "pipeline_edit_test" details
    Then Click edit button in Actions dropdown
    Then Edit should redirect to studio page
    Then Click on file source node property button
    Then Modify reference name
    Then Save draft and navigate to draft list
    Then Draft "pipeline_edit_test" status should be "In-Progress"
    When Open pipeline list page
    Then Go to pipeline "pipeline_edit_test" details
    Then Click edit button in Actions dropdown
    Then Edit should open a discard modal
    Then Click Continue draft
    Then Verify changes were saved

    

