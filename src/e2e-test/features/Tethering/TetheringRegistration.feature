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

@Tethering_Registration
Feature: Tethering - Validate creating a new tethering request

  @TETHERING_REGISTRATION_TEST
  Scenario: Validate successful creation of new tethering connection requests
    Given Open Datafusion Project to configure pipeline
    When Navigate to tethering page
    Then Open create new request page
    Then Click to select the default namespace
    Then Enter project name "test-project"
    Then Enter region "us-west-1b"
    Then Enter instance name "test"
    Then Enter instance url "google.com"
    Then Enter description "test description"
    Then Finish creating new tethering request
    Then Verify the request was created successfully
    When Navigate to tethering page
    Then Open create new request page
    Then Click to select the default namespace
    Then Enter project name "test-project-2"
    Then Enter region "us-west-1b"
    Then Enter instance name "test-2"
    Then Enter instance url "google.com"
    Then Enter description "test description"
    Then Finish creating new tethering request
    Then Verify the request was created successfully

  @TETHERING_REGISTRATION_TEST
  Scenario: Validate unsuccessful creation of a new request with the same instance name
    Given Open Datafusion Project to configure pipeline
    When Navigate to tethering page
    Then Open create new request page
    Then Click to select the default namespace
    Then Enter project name "test-project"
    Then Enter region "us-west-1b"
    Then Enter instance name "test"
    Then Enter instance url "google.com"
    Then Enter description "test description"
    Then Finish creating new tethering request
    Then Verify the request failed to be created

  @TETHERING_REGISTRATION_TEST
  Scenario: Validate unsuccessful creation of a new request with no namespaces
    Given Open Datafusion Project to configure pipeline
    When Navigate to tethering page
    Then Open create new request page
    Then Enter project name "test-project"
    Then Enter region "us-west-1b"
    Then Enter instance name "test"
    Then Enter instance url "google.com"
    Then Enter description "test description"
    Then Finish creating new tethering request
    Then Verify the request failed to be created with no selected namespaces

  @TETHERING_REGISTRATION_TEST
  Scenario: Validate unsuccessful creation of a new request with a missing required field
    Given Open Datafusion Project to configure pipeline
    When Navigate to tethering page
    Then Open create new request page
    Then Click to select the default namespace
    Then Enter region "us-west-1b"
    Then Enter instance name "test"
    Then Enter instance url "google.com"
    Then Enter description "test description"
    Then Finish creating new tethering request
    Then Verify the request failed to be created with a missing required field