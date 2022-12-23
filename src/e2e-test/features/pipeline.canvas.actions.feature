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
Feature: Pipeline Canvas - Actions

  @PIPELINE_CANVAS_ACTIONS_TEST
  Scenario: Correctly undo redo actions done by the user
    When Open Pipeline Studio Page
    Then Verify redo undo buttons are disabled
    Then Create a simple pipeline
    Then Verify redo button disabled but undo button enabled
    Then Undo the connections
    Then Verify there's no pipeline connection
    Then Redo one connection
    Then Verify there's one connection
    Then Undo everything
    Then Verify export button disabled
    Then Redo everything
    Then Verify simple pipeline recovered
    Then Exit Studio Page

  @PIPELINE_CANVAS_ACTIONS_TEST
  Scenario: Fit pipeline to screen and let user select multiple nodes
    When Open Pipeline Studio Page
    Then Create a complex pipeline
    Then Verify sink nodes are visible
    Then Zoom in ten times on pipeline canvas
    Then Verify sink nodes are invisible
    Then Fit pipeline to screen
    Then Verify sink nodes are visible
    Then Move minimap
    Then Verify source nodes are invisible
    Then Fit pipeline to screen
    Then Verify source nodes are visible
    Then Use shift click to delete two transform nodes
    Then Verify transform nodes do not exist
    Then Undo delete nodes
    Then Exit Studio Page

