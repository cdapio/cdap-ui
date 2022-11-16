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
Feature: Widget Code editor Tests

  @WIDGET_CODE_EDITOR_TEST
  Scenario: Should render default value the first time
    When Open Pipeline Studio Page
    Then Toggle Transform panel
    Then Add JS node to canvas
    Then Open JS node properties
    Then Get JS editor value and compare with default JS editor value
    Then Exit Studio Page

  @WIDGET_CODE_EDITOR_TEST
  Scenario: Should not jump the cursor position on selecting text and replacing them
    When Open Pipeline Studio Page
    Then Toggle Transform panel
    Then Add JS node to canvas
    Then Open JS node properties
    Then Replace and verify JS editor value and cursor position
    Then Exit Studio Page
