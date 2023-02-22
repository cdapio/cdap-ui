#
# Copyright © 2023 Cask Data, Inc.
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
Feature: Widget KeyValue Dropdown Tests

  @WIDGET_KEY_VALUE_DROPDOWN_TEST
  Scenario: Should render row in KeyValue Dropdown Widget
    When Open Pipeline Studio Page
    Then Toggle Transform Panel
    Then Add Projection node to canvas
    Then Open Projection node properties
    Then Verify default structure of KeyValue Dropdown Widget
    Then Exit Studio Page

  @WIDGET_KEY_VALUE_DROPDOWN_TEST
  Scenario: Should add a new row in KeyValue Dropdown Widget
    When Open Pipeline Studio Page
    Then Toggle Transform Panel
    Then Add Projection node to canvas
    Then Open Projection node properties
    Then Click add row in KeyValue Dropdown Widget and verify
    Then Exit Studio Page

  @WIDGET_KEY_VALUE_DROPDOWN_TEST
  Scenario: Should input properly in KeyValue Dropdown Widget
    When Open Pipeline Studio Page
    Then Toggle Transform Panel
    Then Add Projection node to canvas
    Then Open Projection node properties
    Then Click add row in KeyValue Dropdown Widget and verify
    Then Enter key "key1" with "boolean" type in row "0"
    Then Enter key "key2" with "int" type in row "1"
    Then Close Projection node properties
    Then Verify key value types "key1:boolean,key2:int" in Pipeline Stage JSON
    Then Exit Studio Page

  @WIDGET_KEY_VALUE_DROPDOWN_TEST
  Scenario: Should re-render existing fields in KeyValue Dropdown Widget
    When Open Pipeline Studio Page
    Then Toggle Transform Panel
    Then Add Projection node to canvas
    Then Open Projection node properties
    Then Click add row in KeyValue Dropdown Widget and verify
    Then Enter key "key1" with "boolean" type in row "0"
    Then Enter key "key2" with "int" type in row "1"
    Then Close Projection node properties
    Then Verify key value types "key1:boolean,key2:int" in Pipeline Stage JSON
    Then Open Projection node properties
    Then Verify key "key1" with "boolean" type for row "0" in the Widget
    Then Verify key "key2" with "int" type for row "1" in the Widget
    Then Close Projection node properties
    Then Exit Studio Page

  @WIDGET_KEY_VALUE_DROPDOWN_TEST
  Scenario: Should delete property in KeyValue Dropdown Widget
    When Open Pipeline Studio Page
    Then Toggle Transform Panel
    Then Add Projection node to canvas
    Then Open Projection node properties
    Then Click add row in KeyValue Dropdown Widget and verify
    Then Enter key "key1" with "boolean" type in row "0"
    Then Enter key "key2" with "int" type in row "1"
    Then Delete row 2 in KeyValue Dropdown Widget and verify
    Then Close Projection node properties
    Then Verify key value types "key1:boolean" in Pipeline Stage JSON
    Then Open Projection node properties
    Then Exit Studio Page
