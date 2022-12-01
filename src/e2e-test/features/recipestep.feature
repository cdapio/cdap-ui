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
Feature: Directives

  @RecipeStep
  Scenario Outline: Go through the recipe functionality
    Given Navigate to the Home page
    Then Click on the Data explorations card
    Then Verify if user is on the wrangle page
    Then Click on Directive button
    Then Verify if the directive panel is displayed
    Then Enter command in the panel with the data "uppercase:body_2"
    Then Click on 'Recipe steps' button
    Then Verify if recipe panel is displayed
    Then Verify if clicking on close icon of panel
    Then Click on 'Recipe steps' button
    Then Verify if user clicks on download icon of recipe panel
    Then Click on delete icon of any step with "<stepId>"
    Then verify if recipe step is Deleted with "<stepId>"
  Examples:
      | stepId |
      | 0 |


  Scenario Outline: Go through the recipe with multiple steps functionality
    Given Navigate to the Home page
    Then Click on the Data explorations card
    Then Verify if user is on the wrangle page
    Then Click on Directive button
    Then Verify if the directive panel is displayed
    Then Enter command in the panel with the data "uppercase:body_2"
    Then Click on Directive button
    Then Enter command in the panel with the data "lowercase:body_3"
    Then Click on Directive button
    Then Enter command in the panel with the data "trim:body_4"
    Then Click on Directive button
    Then Enter command in the panel with the data "trim:body_5"
    Then Click on 'Recipe steps' button
    Then Verify if recipe panel is displayed
    Then Click on delete icon of any step with "<stepId>"
    Examples:
      | stepId |
      | 2 |