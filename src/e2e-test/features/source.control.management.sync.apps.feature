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

  @SOURCE_CONTROL_MANAGEMENT_TEST
  Scenario: Should successfully push a pipeline to git from pipeline list page
    When Open Source Control Management Page
    When Initialize the repository config
    When Deploy and test pipeline "test_pipeline2_fll_airport" with pipeline JSON file "fll_airport_pipeline2.json"
    Then Click push button in Actions dropdown
    Then Commit changes with message "upload pipeline to Git"
    Then Banner is shown with message "Successfully pushed pipeline test_pipeline2_fll_airport"
    Then Clean up pipeline "test_pipeline2_fll_airport" which is created for testing
    When Open Source Control Management Page
    Then Delete the repo config
