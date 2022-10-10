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
Feature: Compute profile - creation

  @COMPUTE_PROFILE_TEST
  Scenario: Create system compute profile
    When Open system profiles create page
    Then Click on "Dataproc" from the listed provisioners
    Then Check that the Create button is disabled
    Then Add "test-system-compute" as label
    Then Verify name to be same as label
    Then Add "system profile for integration test" as Description
    Then Add "test" as Project Id
    Then Add "test" as Account Key
    Then Click on "Create" button
    Then Verify the profile "test-system-compute" should present in the list
    Then Delete system profile "test-system-compute" as cleanup action

  @COMPUTE_PROFILE_TEST
  Scenario: Create namespace compute profile
    When Open default profiles create page
    Then Click on "Dataproc" from the listed provisioners
    Then Check that the Create button is disabled
    Then Add "test-namespace-compute" as label
    Then Verify name to be same as label
    Then Add "namespace profile for integration test" as Description
    Then Add "test" as Project Id
    Then Add "test" as Account Key
    Then Click on "Create" button
    Then Verify the profile "test-namespace-compute" should present in the list
    Then Delete namespace profile "test-namespace-compute" as cleanup action
