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
Feature: Add Transformations

  @Add_Transformations
  Scenario: Go through the Add Transformations functionality
    Given Navigate to the home page
    Then Click on the Data Exploration card
    Then Click on the Structure icon
    Then Click on the Change data type
    Then Select the data type
    Then Verify if the user is on the Add transformation panel
    Then Click on the Cross icon
    Then Click on the Structure icon
    Then Click on the Change data type
    Then Select the data type
    Then Click on the Select column button
    Then Click on the Search icon
    Then Enter column name "Body_1" in the field
    Then Click on the cross icon of select column
    Then Click on the Select column button
    Then Click on the radio button
    Then Click on the Done button
    Then Click on the Apply Step button