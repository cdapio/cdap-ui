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
Feature: TransformationExplode

  @TransformationExplode
  Scenario: Go through the Transformation Explode functionality
    Given Navigate to Home Page
    Then Click on the Data Explorations card
    Then Verify if the Transformation Toolbar is displayed on the Grid Page
    Then Click on the Fragment icon
    Then Click on the Explode
    Then Click on the Delimited text
    Then Verify if the user is on the Add transformation step panel
    Then Click on the Select Column button
    Then Click on the radio button of any column
    Then Click on the Done button
    Then Select any radio button from the delimiter list
    Then Click on the Apply step button
