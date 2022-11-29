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
Feature: ParsingPanel

  @ParsingPanel
  Scenario Outline: Go through the parsing panel functionality
    Given Navigate to the Home Page
    Then Click on the Connector type card "<type>"
    Then Click on the Wrangle button "<finalTab>" and "<finalFile>"
    Then Verify if parsing panel is displayed
#    Then Click on the Format field and Select the value
#    Then Click on the Encoding field and Select the value
    Then Click on the Checkboxes
    Then Click on the close button
#    Then Click on the Apply button
    Examples:
      | type | finalTab | finalFile |
      | File | 2 | 30 |
