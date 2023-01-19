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

  @TransformationToolbar
  Scenario Outline: Go through the Transformation Toolbar
    Given Navigate to the Wrangle home page
    Then Click on the Data Explorations card
    Then Verify if the Transformation Toolbar is displayed on the Grid Page
    Then Click on the Snackbar close icon
    Then Verify if all icons are displayed on Toolbar with "<testId>"
    Then Verify by Clicking on the Up and Down arrow icon
    Then Click on the function names toggle with testId as "<testId>" and "<iconLabelName>"

    Examples:
      | testId | iconLabelName |
      | undo |  Undo |
      | redo |  Redo |
      | null |  Null |
      | column | Column |
      | structure | Structure |
      | fragment | Fragment |
      | math     | Math     |
      | security | Security |
      | other | Other |
