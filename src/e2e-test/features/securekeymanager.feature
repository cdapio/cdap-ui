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
Feature: Secure Key Manager

  @SECURE_KEY_MANAGER_TEST
  Scenario: Secure key manager features should work
    When Visit Secure keys page
    Then Create key 1
    Then Create key 2
    Then Create key 3
    Then Creating a duplicated key 1 should fail
    Then Editing key 1 should work
    Then Search key "secure" should show corresponding results
    Then Delete key 1
    Then Delete key 2
    Then Delete key 3
