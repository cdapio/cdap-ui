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
Feature: SelectColumnPanel

  @SelectColumnPanel
  Scenario: Go through the SelectColumn Panel functionality
    Given Navigate to the Wrangle home page
    Then Click on the Data Explorations card
    Then Verify if the Transformation Toolbar is displayed on the Grid Page
    Then Click on the Snackbar close icon
    Then Click on the ChangeDataType
    Then Verify if the user is on the select column panel
    Then Click on the Back icon
    Then Click on the ChangeDataType
    Then Click on the Cross icon
    Then Click on the ChangeDataType
    Then Click on the Search icon
    Then Enter name of any column from the List
    Then Click on close icon of search
    Then Click on the radio button of any column
    Then Click on the Done button
    Then Verify if the select column panel is closed
