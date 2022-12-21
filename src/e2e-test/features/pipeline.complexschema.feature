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
Feature: Pipeline Complex Schema

  @PIPELINE_COMPLEX_SCHEMA_TEST
  Scenario: Should initialize with 1 empty row
    When Open Pipeline Studio Page
    Then Open "Transform" panel
    Then Add Projection Node
    Then Open "Projection" node property
    Then Verify there is one empty row

  @PIPELINE_COMPLEX_SCHEMA_TEST
  Scenario: Should be able to add a new row
    Then Type in schema field "field1"
    Then Add a new field row under row one
    Then Verify the added row and type in "another_field"

  @PIPELINE_COMPLEX_SCHEMA_TEST
  Scenario: Should be able to add a new row directly underneath the current row
    Then Add a new field row under row one
    Then Verify the added row and type in "middle_field"
    Then Verify the previously typed in field

  @PIPELINE_COMPLEX_SCHEMA_TEST
  Scenario: Should be able to remove row
    Then Remove row two
    Then Verify row three does not exist
    Then Verify row one and two stay the same

  @PIPELINE_COMPLEX_SCHEMA_TEST
  Scenario: Should retain value when node config is reopened
    Then Close node property
    Then Open "Projection" node property
    Then Verify row one and two stay the same
    Then Close node property
    Then Exit Studio Page

  @PIPELINE_COMPLEX_SCHEMA_TEST
  Scenario: Should work if the output schema is a macro
    When Open Pipeline Studio Page
    Then Create a simple pipeline
    Then Open "BigQuery" node property
    Then Configure source node property
    Then Close node property
    Then Open "Wrangler" node property
    Then Verify transform node macro
    Then Type in schema field "name"
    Then Add a new field row under row one
    Then Verify the added row and type in "email"
    Then Add a new field row under row one
    Then Close node property
    Then Open "BigQuery Multi Table" node property
    Then Verify sink node fields
    Then Configure sink node property
    Then Close node property
    Then Type in pipeline name and description
    Then Click on Deploy the pipeline
    Then Open "BigQuery" node property
    Then Verify input schema
    Then Close node property
    Then Open "Wrangler" node property
    Then Verify transform node schema
    Then Close node property
