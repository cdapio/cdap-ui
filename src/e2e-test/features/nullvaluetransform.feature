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

  @Null_MissingValue

  Scenario: Go through the missing value functionality
    Given Navigate to Home Page of Wrangle
    Then Click on the Data Explorations card
    Then Verify if the Transformation Toolbar is displayed on the Grid Page
    Then Click on the null icon
    Then Click on the option with "remove-missing"
    Then Verify if the user is on the Add transformation step panel
    Then Click on the Select Column button
    Then Click on the radio button of any column "0"
    Then Click on the Done button
    Then Click on the Apply Step button

  Scenario: Go through the missing and null functionality
    Given Navigate to Home Page of Wrangle
    Then Click on the Data Explorations card
    Then Verify if the Transformation Toolbar is displayed on the Grid Page
    Then Click on the null icon
    Then Click on the option with "remove-null-missing"
    Then Verify if the user is on the Add transformation step panel
    Then Click on the Select Column button
    Then Click on the radio button of any column "3"
    Then Click on the Done button
    Then Click on the Apply Step button

  Scenario: Go through the null functionality
    Given Navigate to Home Page of Wrangle
    Then Click on the Data Explorations card
    Then Verify if the Transformation Toolbar is displayed on the Grid Page
    Then Click on the null icon
    Then Click on the option with "remove-null"
    Then Verify if the user is on the Add transformation step panel
    Then Click on the Select Column button
    Then Click on the radio button of any column "1"
    Then Click on the Done button
    Then Click on the Apply Step button

  Scenario: Go through the replace null functionality
    Given Navigate to Home Page of Wrangle
    Then Click on the Data Explorations card
    Then Verify if the Transformation Toolbar is displayed on the Grid Page
    Then Click on the null icon
    Then Click on the option with "replace-null-missing"
    Then Verify if the user is on the Add transformation step panel
    Then Click on the Select Column button
    Then Click on the radio button of any column "2"
    Then Click on the Done button
    Then Click on the field and enter text
    Then Click on the Apply Step button
