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
Feature: Breadcrumb - Navigate to the application

  @Breadcrumb
  Scenario Outline: Navigate to the Data Source
    Given Navigate to the home page
    Then  Click on the Connector type with "<connectionLabel>" and "<connectionTestId>"
    Then Click on the Home link button
    Then Click on the Exploration card with "<testId>"
    Then Click on the Home link of wrangle page
    Examples:
         | connectionLabel | connectionTestId |testId|
         | PostgreSQL | postgresql | 0 |
