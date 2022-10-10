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
Feature: Page Level - Errors

  @PAGE_LEVEL_ERRORS_TEST
  Scenario: No namespace in home page should show not found error
    When Open fake namespace home page
    Then Verify Page NotFound Error Message

  @PAGE_LEVEL_ERRORS_TEST
  Scenario: No namespace in pipeline studio page should show not found error
    When Open fake namespace studio home page
    Then Verify Page NotFound Error Message

  @PAGE_LEVEL_ERRORS_TEST
  Scenario: No namespace in pipeline list page should show not found error
    When Open fake namespace pipeline list page
    Then Verify Page NotFound Error Message

  @PAGE_LEVEL_ERRORS_TEST
  Scenario: No namespace in pipeline detail page should show not found error
    When Open fake namespace pipeline detail page
    Then Verify Page NotFound Error Message

  @PAGE_LEVEL_ERRORS_TEST
  Scenario: No namespace in pipeline drafts page should show not found error
    When Open fake namespace pipeline drafts page
    Then Verify Page NotFound Error Message

  @PAGE_LEVEL_ERRORS_TEST
  Scenario: No namespace in wrangler should show not found error
    When Open fake namespace Wrangler page
    Then Verify Page NotFound Error Message

  @PAGE_LEVEL_ERRORS_TEST
  Scenario: No workspace in wrangler should show not found error
    When Open invalid Wrangler workspace page
    Then Verify Page NotFound Error Message

  @PAGE_LEVEL_ERRORS_TEST
  Scenario: No namespace in metadata page should show not found error
    When Open fake namespace metadata page
    Then Verify Page NotFound Error Message

  @PAGE_LEVEL_ERRORS_TEST
  Scenario: No namespace in metadata search results page should show not found error
    When Open fake namespace search results page
    Then Verify Page NotFound Error Message

  @PAGE_LEVEL_ERRORS_TEST
  Scenario: No valid path should show not found error in pipeline studio
    When Open invalid path studio page
    Then Verify Page NotFound Default Error Message

  @PAGE_LEVEL_ERRORS_TEST
  Scenario: No valid path should show not found error in pipeline details
    When Open invalid path details page
    Then Verify Page NotFound Default Error Message

  @PAGE_LEVEL_ERRORS_TEST
  Scenario: No valid pipeline should show not found error in pipeline details
    When Open invalid pipeline path details page
    Then Verify Page NotFound Error Message

  @PAGE_LEVEL_ERRORS_TEST
  Scenario: No valid path should show not found error in wrangler
    When Open invalid path wrangler page
    Then Verify Page NotFound Default Error Message

  @PAGE_LEVEL_ERRORS_TEST
  Scenario: No valid path from node server should show not found error
    When Open invalid random path page
    Then Verify Page NotFound Default Error Message
