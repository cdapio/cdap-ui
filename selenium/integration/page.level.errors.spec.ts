/*
 * Copyright © 2022 Cask Data, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License'); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

import { BASE_URL, CDAP_URL, METADATA_URL, PIPELINES_URL } from '../support/constants';
import { buildChromeDriver, loginIfRequired, makeElementHelpers } from '../support/utils';

describe('Page level error because of ', () => {
  let driver;
  let se;
  const FAKE_NAMESPACE = 'fakeNamespace';
  const SELECTOR_404_MSG = 'page-404-error-msg';
  const SELECTOR_404_DEFAULT_MSG = 'page-404-default-msg';

  beforeAll(async () => {
    driver = buildChromeDriver();
    se = makeElementHelpers(driver);
    await loginIfRequired(driver);
  });

  it('no namespace in home page should show 404', async () => {
    // Go to home page
    await driver.get(`${CDAP_URL}/${FAKE_NAMESPACE}`);
    await se.waitByTestId(SELECTOR_404_MSG);
  });

  it('no namespace in pipeline studio page should show 404', async () => {
    // Go to Pipelines studio
    await driver.get(`${PIPELINES_URL}/${FAKE_NAMESPACE}/studio`);
    await se.waitByTestId(SELECTOR_404_MSG);
  });

  it('no namespace in pipeline list page should show 404', async () => {
    // Go to Pipelines list
    await driver.get(`${CDAP_URL}/${FAKE_NAMESPACE}/pipelines`);
    await se.waitByTestId(SELECTOR_404_MSG);
  });

  it('no namespace in pipeline detail page should show 404', async() => {
    // Go to Pipeline details page
    await driver.get(`${CDAP_URL}/${FAKE_NAMESPACE}/view/pipelineName`);
    await se.waitByTestId(SELECTOR_404_MSG);
  });

  it('no namespace in pipeline drafts page should show 404', async() => {
    // Go to Pipelines drafts
    await driver.get(`${CDAP_URL}/${FAKE_NAMESPACE}/pipelines/drafts`);
    await se.waitByTestId(SELECTOR_404_MSG);
  });

  it('no namespace in wrangler should show 404', async() => {
    // Go to wrangler
    await driver.get(`${CDAP_URL}/${FAKE_NAMESPACE}/wrangler`);
    await se.waitByTestId(SELECTOR_404_MSG);
  });

  it('no workspace in wrangler should show 404', async() => {
    // Go to wrangler workspace
    await driver.get(`${CDAP_URL}/default/wrangler/invalid-workspace-id`);
    await se.waitByTestId(SELECTOR_404_MSG);
  });

  it('no namespace in metadata page should show 404',async () => {
    // Go to metadata page
    await driver.get(`${METADATA_URL}/${FAKE_NAMESPACE}`);
    await se.waitByTestId(SELECTOR_404_MSG);
  });

  it('no namespace in metadata search results page should show 404',async () => {
    // Go to metadata search results page
    await driver.get(`${METADATA_URL}/${FAKE_NAMESPACE}/search/search_term/result`);
    await se.waitByTestId(SELECTOR_404_MSG);
  });

  it('no valid path should show 404 in pipeline studio', async() => {
    // Go to pipeline studio page
    await driver.get(`${PIPELINES_URL}/default/studioInvalidPath`);
    await se.waitByTestId(SELECTOR_404_DEFAULT_MSG);
  });

  it('no valid path should show 404 in pipeline details', async() => {
    // Go to pipeline details page
    await driver.get(`${PIPELINES_URL}/default/viewInvalidPipelineDetails/pipelineName`);
    await se.waitByTestId(SELECTOR_404_DEFAULT_MSG);
  });

  it('no valid pipeline should show 404 in pipeline details',async () => {
    // Go to pipeline details page of invalid pipeline
    await driver.get(`${PIPELINES_URL}/default/view/invalidPipelineName`);
    await se.waitByTestId(SELECTOR_404_MSG);
  });

  it('no valid path should show 404 in metadata page', async() => {
    // Go to metadata search results page
    await driver.get(`${METADATA_URL}/default/search/search_term/resultinvalidPath`);
    await se.waitByTestId(SELECTOR_404_DEFAULT_MSG);
  });

  it('no valid path should show 404 in wrangler', async() => {
    // Go to wrangler
    await driver.get(`${CDAP_URL}/default/wranglerInvalidPath/invalid-workspace-id`);
    await se.waitByTestId(SELECTOR_404_DEFAULT_MSG);
  });

  it('no valid path from node server should show 404',async () => {
    // Go to any random invalid path
    await driver.get(`${BASE_URL}/randomInvalidPath`);
    await se.waitByTestId(SELECTOR_404_DEFAULT_MSG);
  });

  afterAll(async () => {
    await driver.quit();
  });
});
