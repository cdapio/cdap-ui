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
Feature: Column View Panel

  @ColumnViewPanel
  Scenario: Shows column view panel functionality
    Given Navigate to Home Page
    Then Click on the Data Explorations card
    Then Verify if the column view button is displayed on the Grid Page
    Then Click on columnview button
    Then Verify column names of that file displayed in panel
    Then Enter any existing name of the columns in the search field "body"
    Then Verify if the search result is displayed as "body"
    Then Click on cross icon
    Then Click on columnview button
    Then Again click on columnview button and verify if the panel is closed