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
Feature: Widget KeyValue Tests

  @WIDGET_KEY_VALUE_TEST
  Scenario: Should render KeyValue row
    When Open Pipeline Studio Page
    Then Toggle Transform Panel
    Then Add Projection node to canvas
    Then Open Projection node properties
    Then Verify the default structure of KeyValue Widget
    Then Exit Studio Page

  @WIDGET_KEY_VALUE_TEST
  Scenario: Should add a new row in KeyValue Widget
    When Open Pipeline Studio Page
    Then Toggle Transform Panel
    Then Add Projection node to canvas
    Then Open Projection node properties
    Then Add keyValue row and verify
    Then Exit Studio Page

  @WIDGET_KEY_VALUE_TEST
  Scenario: Should input properly in KeyValue Widget
    When Open Pipeline Studio Page
    Then Toggle Transform Panel
    Then Add Projection node to canvas
    Then Open Projection node properties
    Then Add key value pairs as "key1", "value1" and "key2", "value2" respectively
    Then Close Projection node properties
    Then Verify key value pairs "key1:value1,key2:value2" in Pipeline Stage JSON
    Then Exit Studio Page

  @WIDGET_KEY_VALUE_TEST
  Scenario: Should re-render existing fields in KeyValue Widget
    When Open Pipeline Studio Page
    Then Toggle Transform Panel
    Then Add Projection node to canvas
    Then Open Projection node properties
    Then Add key value pairs as "key1", "value1" and "key2", "value2" respectively
    Then Close Projection node properties
    Then Verify key value pairs "key1:value1,key2:value2" in Pipeline Stage JSON
    Then Open Projection node properties
    Then Verify key value pairs "key1", "value1" and "key2", "value2" in the Widget
    Then Close Projection node properties
    Then Exit Studio Page

  @WIDGET_KEY_VALUE_TEST
  Scenario: Should delete property in KeyValue Widget
    When Open Pipeline Studio Page
    Then Toggle Transform Panel
    Then Add Projection node to canvas
    Then Open Projection node properties
    Then Add key value pairs as "key1", "value1" and "key2", "value2" respectively
    Then Delete keyValue row 2 and verify
    Then Close Projection node properties
    Then Verify key value pairs "key1:value1" in Pipeline Stage JSON
    Then Exit Studio Page
