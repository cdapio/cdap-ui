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

@Integration_Tests @ignore
Feature: Nuxtour - Validate Nuxtour functionalities

  @NUXTOUR_TEST
  Scenario: Verify the 5 step tour at cdap homepage
    When Open CDAP welcome page
    Then Welcome nux tour should exist
    Then Click Start Tour button
    Then "Pipeline Studio" title should exist
    Then Click Nuxtour Next button
    Then "Wrangler" title should exist
    Then Click Nuxtour Next button
    Then "Metadata" title should exist
    Then Click Nuxtour Next button
    Then "Control Center" title should exist
    Then Click Nuxtour Next button
    Then "Hub" title should exist
    Then Click Nuxtour Complete button
    Then Welcome tour should close

  @NUXTOUR_TEST
  Scenario: Verify Previour and Cancel button for the tour
    When Open CDAP welcome page
    Then Welcome nux tour should exist
    Then Click Start Tour button
    Then Click Nuxtour Next button
    Then Click Nuxtour Previous button
    Then "Pipeline Studio" title should exist
    Then Click Nuxtour Cancel button
    Then Welcome tour should close

  @NUXTOUR_TEST
  Scenario: Verify No thanks button
    When Open CDAP welcome page
    Then Welcome nux tour should exist
    Then Click No thanks button
    Then Welcome tour should close

  @NUXTOUR_TEST
  Scenario: Verify checkbox opt out future tours
    When Open CDAP welcome page
    Then Welcome nux tour should exist
    Then Check Don't show again checkbox
    Then Click No thanks button
    Then Welcome tour should close
    When Open CDAP welcome page
    Then Welcome tour should close

