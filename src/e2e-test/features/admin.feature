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
Feature: Admin - Validate profile setting

  @ADMIN_TEST
  Scenario: Show error message if user tries to set profile at the instance level
    When Open Configuration Page
    Then Click on "System Preferences" accordion
    Then Click on "Edit System Preferences" button
    Then Add "system.profile.name" as key
    Then Add "hello" as value
    Then Click on "Save Preferences" button
    Then Verify failure in saving changes


  @ADMIN_TEST
  Scenario: Allow user to save valid preference at instance level after fixing error
    When Open Configuration Page
    Then Click on "System Preferences" accordion
    Then Click on "Edit System Preferences" button
    Then Add "name" as key
    Then Add "hello" as value
    Then Click on "Save Preferences" button
    Then Verify successful saving of preferences with "name" as key and "hello" as value
