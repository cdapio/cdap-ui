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
Feature: Custom Transform Feature

  @CustomTransform_TEST
  Scenario Outline: Custom Transform functionality
    Given Navigate to the Home page
    Then Click on ongoing data exploration card
    Then Click on the other icon
    Then Click on the custom transform
    Then Verify if the Add transformation panel is displayed
    Then Click on select column and select integer type column
    Then Enter custom function "<transform>" in field with a selected column name
    Then Click on ApplyStep button
    Then verify the transform result of applied column
    Examples:
    | transform |
    | math:sin(body_0) |
