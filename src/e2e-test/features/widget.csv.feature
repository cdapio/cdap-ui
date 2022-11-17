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
Feature: Widget CSV Tests

  @WIDGET_CSV_TEST
  Scenario: Should render csv row
    When Open Pipeline Studio Page
    Then Toggle Transform Panel
    Then Add Projection node to canvas
    Then Open Projection node properties
    Then Verify that the CSV Widget contains only one row by default
    Then Exit Studio Page

  @WIDGET_CSV_TEST
  Scenario: Should add a new row
    When Open Pipeline Studio Page
    Then Toggle Transform Panel
    Then Add Projection node to canvas
    Then Open Projection node properties
    Then Click add row and verify that the row 2 is present
    Then Exit Studio Page

  @WIDGET_CSV_TEST
  Scenario: Should input properly
      When Open Pipeline Studio Page
      Then Toggle Transform Panel
      Then Add Projection node to canvas
      Then Open Projection node properties
      Then Click add row and enter "value1", "value2" for row 1 and row 2 respectively
      Then Close Projection node properties
      Then Verify Pipeline Stage JSON for values "value1,value2"
      Then Exit Studio Page

  @WIDGET_CSV_TEST
  Scenario: Should re-render existing fields
      When Open Pipeline Studio Page
      Then Toggle Transform Panel
      Then Add Projection node to canvas
      Then Open Projection node properties
      Then Click add row and enter "value1", "value2" for row 1 and row 2 respectively
      Then Close Projection node properties
      Then Verify Pipeline Stage JSON for values "value1,value2"
      Then Open Projection node properties
      Then Check whether the properties "value1", "value2" exists in row 1 and row 2 respectively
      Then Close Projection node properties
      Then Exit Studio Page

  @WIDGET_CSV_TEST
  Scenario: Should delete property
      When Open Pipeline Studio Page
      Then Toggle Transform Panel
      Then Add Projection node to canvas
      Then Open Projection node properties
      Then Click add row and enter "value1", "value2" for row 1 and row 2 respectively
      Then Delete row 2
      Then Close Projection node properties
      Then Verify Pipeline Stage JSON for values "value1"
      Then Open Projection node properties
      Then Exit Studio Page
