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
Feature: Namespaces - Validate Namespace functionalities

  @NAMESPACE_TEST
  Scenario: List namespace should contain only single namespace with the name default, and clicking on the row should open the namespace details page
    When Open Configuration Page
    Then Click on "Namespaces" accordion
    Then Verify that the count of namespaces is 1
    Then Verify that the namespace with the name "default" is present
    Then Click on the namespace "default" in the namespace list
    Then Verify that the description in the details page matches with "This is the default namespace, which is automatically created, and is always available."

  @NAMESPACE_TEST
  Scenario: Details page for default namespace should open and description should match
    When Open details page of Namespace with name "default"
    Then Verify that the description in the details page matches with "This is the default namespace, which is automatically created, and is always available."

  @NAMESPACE_TEST
  Scenario: Create namespace should fail for the name default and should succeed otherwise, and clicking on the new namespace row should open the namespace details page
    When Open Configuration Page
    Then Click on "Namespaces" accordion
    Then Click on "Create New Namespace" button
    Then Enter "default" as Namespace name
    Then Click on "Finish" button
    Then Verify that the namespace creation failed
    Then Enter "NewNamespace1" as Namespace name
    Then Enter "New Namespace1 created for testing" as Namespace description
    Then Click on "Finish" button
    Then Verify that the Namespace creation is successful for namespace "NewNamespace1"
    Then Close the Create Namespace wizard
    Then Verify that the count of namespaces is 2
    Then Verify that the namespace with the name "default" is present
    Then Verify that the namespace with the name "NewNamespace1" is present
    Then Click on the namespace "NewNamespace1" in the namespace list
    Then Verify that the description in the details page matches with "New Namespace1 created for testing"

  @NAMESPACE_TEST
  Scenario: Details page for new namespace should open and description should match
    When Open details page of Namespace with name "NewNamespace1"
    Then Verify that the description in the details page matches with "New Namespace1 created for testing"

  @NAMESPACE_TEST
  Scenario: Details page for non existing namespace should result into failure
    When Open details page of Namespace with name "InvalidNamespace"
    Then Verify Namespace not found error for Namespace "InvalidNamespace"
