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
Feature: Find and Replace

  @FindAndReplace
  Scenario: Go through the find and replace functionality
    Given Navigate to Home Page of Wrangle
    Then Click on the Data Explorations card
    Then Verify if the Transformation Toolbar is displayed on the Grid Page
    Then Click on the Structure icon
    Then Click on the Find and Replace
    Then Verify if the user is on the Add transformation step panel
    Then Click on the Select Column button
    Then Click on the radio button of any column
    Then Click on the Done button
    Then Click on the Find field and enter text
    Then Click on the Replace field and enter text
    Then Click on the Checkbox Ignore Case
    Then Click on the Checkbox Extract Match
    Then Click on the Apply Step button
