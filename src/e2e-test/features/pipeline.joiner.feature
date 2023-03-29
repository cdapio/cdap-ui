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
Feature: Pipeline Joiner

  @PIPELINE_JOINER_TEST
  Scenario: Should create joiner pipeline
    When Open Pipeline Studio Page
    Then Create the joiner pipeline
    Then Configure source node 1 property and validate
    Then Configure source node 2 property and validate
    Then Check joiner node schemas propagated correctly
    Then Clear default schema selection and change alias of field 1
    Then Output schema should have the new field aliases
    Then Configure sink property and validate
    Then Joiner should still render Get Schema button when numPartitions is a macro

  @PIPELINE_JOINER_TEST
  Scenario: Should show appropriate message for preview
    Then Should show appropriate message when preview has not been run yet
    Then Should show appropriate message when preview has been stopped before data is generated
    Then Should show preview data with record view by default for sink
    Then Should show preview data for all inputs for joiner
    