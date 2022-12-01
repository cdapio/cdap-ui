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
Feature: ImportSchema

  @ImportSchema
  Scenario Outline: Go through the parsing panel functionality
    Given Navigate to the Home Page
    Then Click on the Connector type card "<type>"
    Then Click on the Wrangle button "<finalTab>" and "<finalFile>"
    Then Verify if grid page is displayed
    Then Click on the importschema button and select file "/Users/divami/Downloads/f2b01a87-fd9a-4af2-bcb1-c02a35f07d08-schema.json"
    Then Verify if snackbar is displayed
    Then Click on the Apply button
    Examples:
      | type | finalTab | finalFile |
      | File | 2 | 30 |
