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
Feature: Navbar - Validate navbar functionalities

  @NAVBAR_TEST
  Scenario: Verify instance navbar in default theme
    When Open CDAP main page
    Then Check navbar should have "default" bgcolor
    Then Check drawer invisible
    Then Check right features are enabled in "default" theme

  @NAVBAR_TEST
  Scenario: Verify instance navbar in light theme
    Given Set "light" theme
    When Open CDAP main page
    Then Check navbar should have "light" bgcolor
    Then Check drawer invisible
    Then Check right features are enabled in "light" theme
    Given Set "default" theme

  @NAVBAR_TEST
  Scenario: Verify menu closes when hub is opened
    When Open CDAP main page
    Then Click on hamburger menu
    Then Click on Hub
    Then Check drawer invisible

  @NAVBAR_TEST
  Scenario: Verify menu drawer has correct feature highlight
    When Open CDAP main page
    Then Click and check "Control Center" font and highlight color
    Then Click and check "Pipeline List" font and highlight color
    Then Click and check "Pipeline Studio" font and highlight color
    Then Click and check "Metadata" font and highlight color
    Then Click and check "Admin" font and highlight color
