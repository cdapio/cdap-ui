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
Feature: Pipeline Hierarchy - Hierarchy Widgets

  @PIPELINE_HIERARCHY_TEST
  Scenario: Render file and duplicate record
    When Open Pipeline Studio Page
    Then Add "File" node to canvas
    Then Open transform panel
    Then Add "CloneRecord" node to canvas
    Then Cleanup pipeline graph control
    Then Fit pipeline to screen
    Then Connect the two added nodes
    Then Open "File" node property
    Then Close node property

  @PIPELINE_HIERARCHY_TEST
  Scenario: Add schema with simple files
    Then Open "File" node property
    Then Remove field "0"
    Then Remove field "0"
    Then Add field at row "0" and name "column1"
    Then Add field at row "1" and name "column2"
    Then Add field at row "2" and name "column3"
    Then Add field at row "3" and name "column4"
    Then Add field at row "4" and name "column5"
    Then Add field at row "5" and name "column6"
    Then Add field at row "6" and name "column7"
    Then Add field at row "7" and name "column8"
    Then Add field at row "8" and name "column9"
    Then Add field at row "9" and name "column10"
    Then Close node property

  @PIPELINE_HIERARCHY_TEST
  Scenario: Get The Schema
    Then Open "File" node property
    Then Click on "Get Schema" button
    Then Close node property
    Then Exit Studio Page

  @ignore
  Scenario: Render "Duplicate Record" node
    Then Open "Record Duplicator" node property
    Then Verify field mapping exists

  @ignore
  Scenario: Add a new row
    Then Add a new field mapping row
    Then Verify field mapping exists
