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
Feature: NestedColumnInsightPanel

  @NestedColumnInsightPanel
  Scenario: Go through the Nested column insight panel functionality
    Given Navigate to the Home Page
    Then Click on the Ongoing Data Explorations card
    Then Verify if the column view button is displayed or not
    Then Click on the Column View button
    Then Verify column names of that file
    Then Click on the any column name from the column view popup
    Then Verify if the column insights popup is displayed
