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
Feature: Pipeline Context Menu

  @PIPELINE_CONTEXT_MENU_TEST
  Scenario: Show plugin level context menu
    When Open Pipeline Studio Page
    When Create a simple pipeline
    Then Open source node context menu
    Then Validate Copy Plugin and Delete Plugin options are visible

  @PIPELINE_CONTEXT_MENU_TEST
  Scenario: Ensure functionality by clicking on plugin context menu options
    When Open Pipeline Studio Page
    When Create a simple pipeline
    Then Delete source node through context menu
    Then Delete transform node through context menu
    Then Delete sink node through context menu
    Then Verify export button is disabled
    Then Undo the deletions
    Then Export and verify the pipeline has 2 connections and 3 stages

  @PIPELINE_CONTEXT_MENU_TEST
  Scenario: Show pipeline level icon
    When Open Pipeline Studio Page
    When Create a simple pipeline
    Then Right click on canvas
    Then Ensure canvas context menu option "Wrangle" is displayed
    Then Ensure canvas context menu option "Zoom In" is displayed
    Then Ensure canvas context menu option "Zoom Out" is displayed
    Then Ensure canvas context menu option "Fit To Screen" is displayed
    Then Ensure canvas context menu option "Align" is displayed
    Then Ensure canvas context menu option "Paste" is displayed

  @PIPELINE_CONTEXT_MENU_TEST
  Scenario: Ensure clicking zoom in and zoom out works properly
    When Open Pipeline Studio Page
    When Create a simple pipeline
    Then Verify "default" zoom level
    Then Right click on canvas
    Then Click on "Zoom In" from canvas context menu option
    Then Verify "first" zoom level
    Then Right click on canvas
    Then Click on "Zoom In" from canvas context menu option
    Then Verify "second" zoom level
    Then Right click on canvas
    Then Click on "Zoom Out" from canvas context menu option
    Then Verify "first" zoom level
    Then Right click on canvas
    Then Click on "Zoom Out" from canvas context menu option
    Then Verify "default" zoom level

  @PIPELINE_CONTEXT_MENU_TEST
  Scenario: Ensure clicking fit to screen works properly
    When Open Pipeline Studio Page
    When Create a complex pipeline
    Then Verify complex pipeline nodes are visible
    Then Zoom in ten times on pipeline canvas
    Then Verify complex pipeline nodes are not visible
    Then Right click on canvas
    Then Click on "Fit To Screen" from canvas context menu option
    Then Verify complex pipeline nodes are visible

  @PIPELINE_CONTEXT_MENU_TEST @ignore
  Scenario: Ensure paste option is enabled or disabled when clipboard has valid pipeline object
    When Open Pipeline Studio Page
    When Create a simple pipeline
    Then Right click on canvas
    Then Verify "Paste" option from canvas context menu is disabled
    Then Click on "Align" from canvas context menu option
    Then Copy the source node to clipboard
    Then Right click on canvas
    Then Verify "Paste" option from canvas context menu is enabled

  @PIPELINE_CONTEXT_MENU_TEST @ignore
  Scenario: Verify paste of valid pipeline or plugin
    When Open Pipeline Studio Page
    When Create a simple pipeline
    Then Copy the source node to clipboard
    Then Right click on canvas
    Then Click on "Paste" from canvas context menu option
    Then Export and verify the pipeline has 2 connections and 4 stages

  @PIPELINE_CONTEXT_MENU_TEST @ignore
  Scenario: Verify existing hamburger menu works
    When Open Pipeline Studio Page
    When Create a simple pipeline
    Then Copy the source node to clipboard using hamburger menu
    Then Right click on canvas
    Then Click on "Paste" from canvas context menu option
    Then Export and verify the pipeline has 2 connections and 4 stages
    Then Delete the newly added source node using hamburger menu
    Then Export and verify the pipeline has 2 connections and 3 stages

