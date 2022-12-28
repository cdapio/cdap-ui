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
Feature: Pipeline Draft

  @PIPELINE_DRAFT_TEST
  Scenario: Save or edit a pipeline draft successfully
    When Open Pipeline Studio Page
    Then Create a simple pipeline
    Then Open source node property in simple pipeline
    Then Add DummyProject as dataset project
    Then Add DummyDataset as dataset
    Then Close node property
    Then Fill in pipeline name
    Then Check url for draftId string
    Then Reload the page
    Then Export the pipeline
    Then Verify the exported pipeline

  @PIPELINE_DRAFT_TEST
  Scenario: Delete draft upon deploying
    When Open Pipeline Studio Page
    Then import pipeline from json "fll_wrangler-test-pipeline.json"
    Then Check url for draftId string
    Then Navigate to pipeline drafts page and sort by latest
    Then Deploy the last saved pipeline
    Then Check url for draft pipeline name
    Then Verify the deployed pipeline no longer exists in the drafts page

  @PIPELINE_DRAFT_TEST
  Scenario: Edit the draft uploaded using old api
    When Open Pipeline Studio Page
    Then Upload draft pipeline from json "old_userstore_draft.json"
    Then Navigate to pipeline drafts page and sort by latest
    Then Open the uploaded draft pipeline
    Then Check url for draftId string
    Then Extract draftId value from the url
    Then Rename draft pipeline name
    Then Navigate to pipeline drafts page and sort by latest
    Then Ensure draft pipeline name is updated and exists with the same id in the backend

  @PIPELINE_DRAFT_TEST
  Scenario: Delete drafts using either old or the new API
    When Open Pipeline Studio Page
    Then Create a simple pipeline
    Then Fill in pipeline name
    Then Check url for draftId string
    Then Navigate to pipeline drafts page and sort by latest
    Then Delete the latest draft pipeline and verify the deletion
    When Open Pipeline Studio Page
    Then Upload draft pipeline from json "old_userstore_draft.json"
    Then Navigate to pipeline drafts page and sort by latest
    Then Ensure the uploaded draft exists
    Then Delete the latest uploaded draft pipeline and verify the deletion
