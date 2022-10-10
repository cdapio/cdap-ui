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
Feature: Control Center - filter and find

  @CONTROL_CENTER_FILTER_FIND
  Scenario: Using control center to see and filter things
    When Deploy and test pipeline "test_pipeline2_fll_airport" with pipeline JSON file "fll_airport_pipeline2.json"
    When Open control center page
    Then Find the pipeline "test_pipeline2_fll_airport" in the results
    Then Find filter dropdown and unselect "applications"
    Then Verify that pipeline "test_pipeline2_fll_airport" should not present
    Then Clean up pipeline "test_pipeline2_fll_airport" which is created for testing
