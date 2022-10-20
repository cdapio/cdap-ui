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
Feature: TransformationToolbar

  @ADMIN_TEST
  Scenario: Go through the Transformation Toolbar
    Given Navigate to Home Page
    Then Click on the Data Explorations card
    Then Verify if the Transformation Toolbar is displayed on the Grid Page
    Then Verify if all icons are displayed on Toolbar
    Then Hover on the Icons and verify if the tool tip is displayed
    Then Click on the function names toggle
    Then Verify if the label name is displayed for appropriate icon
    Then Verify by Clicking on the Up and Down arrow icon
#    Then Click on the Structure icon and verify the menu is displayed