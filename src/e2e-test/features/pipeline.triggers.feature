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
    Then Visit pipeline "trigger_test_pipeline_2"
    Then Cleanup complex trigger
    Then Cleanup pipeline "trigger_test_pipeline_1"
    Then Cleanup pipeline "trigger_test_pipeline_2"
