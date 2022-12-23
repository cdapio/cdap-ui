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
Feature: Logviewer - Validate log viewer functionalities

  @LOGVIEWER_TEST
  Scenario: Deploy and run pipeline till complete
    When Deploy and test pipeline "logs_generator" with timestamp with pipeline JSON file "logs_generator.json"
    Then Run the pipeline
    Then Check pipeline is running

  @LOGVIEWER_TEST
  Scenario: Log viewer should show
    Then Click on log viewer button
    Then Log viewer container should exist
    Then Scroll to latest should exist
    Then Scroll to latest should be disabled
    Then Advanced logs should exist
    Then Download should exist
    Then Log viewer close should exist

  @LOGVIEWER_TEST
  Scenario: Log level popover should work
    Then Click on log level toggle
    Then Log level "ERROR" should exist
    Then Log level "WARN" should exist
    Then Log level "INFO" should exist
    Then Log level "DEBUG" should exist
    Then Log level "TRACE" should exist
    Then Log level "ERROR" checkmark should exist
    Then Log level "WARN" checkmark should exist
    Then Log level "INFO" checkmark should exist
    Then Log level "DEBUG" checkmark should not exist
    Then Log level "TRACE" checkmark should not exist
    Then Click on log level toggle

  @LOGVIEWER_TEST
  Scenario: Log viewer content should contain correct information
    Then Log viewer content should contain message "is started by user"
    Then Log viewer content should not contain message "This is a WARN"
    Then Click on advanced logs
    Then Log viewer content should contain message "This is a WARN"
    Then Click on log level toggle
    Then Click on log level "TRACE"
    Then Log level popover should not show
    Then Log viewer content should contain message "DEBUG"

  @LOGVIEWER_TEST
  Scenario: Log viewer should fetch next logs when scroll to bottom
    Then Scroll up to center
    Then Scroll to latest should be enabled
    Then Debug message should update

  @LOGVIEWER_TEST
  Scenario: Log viewer should fetch previous logs when scroll to top
    Then Scroll up to center
    Then Click on scroll to latest button
    Then Previous logs should show
