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
Feature: ConnectionList

  @ConnectionList
  Scenario Outline: Go through the Connection List functionality
    Given Navigate to Home Page
    Then Click on the Connector type card with "<testId>"
    Then Click on the Add connection button
    Then Click on the Cross icon
    Then Click on Search icon
    Then Enter file name "Dhanu" and verify the result
    Then Click on clear icon
    Then Verify if the Wrangle button is visible

    Examples:
      | testId |
      | file |
