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

import { BASE_URL } from '../support/constants';
import {buildChromeDriver, loginIfRequired, makeBackendRequest, makeElementHelpers} from '../support/utils';

async function deleteProfile(path) {
  await makeBackendRequest({
    path: `${path}/disable`,
    method: 'POST',
  });

  await makeBackendRequest({
    path,
    method: 'DELETE'
  });
}

describe('Compute Profile', () => {
  let driver;
  let se;

  beforeAll(async () => {
    driver = buildChromeDriver();
    se = makeElementHelpers(driver);
    await loginIfRequired(driver);
  });

  afterAll(async () => {
    await driver.quit()
  });

  // Due to special handling of system namespace, we need to explicitly test navigating into system namespace
  // profile pages
  it('should be able to create system compute profile', async () => {
    await driver.get(`${BASE_URL}/cdap/ns/system/profiles/create`);
    await se.waitByTestId('provisioner-gcp-dataproc');

    await se.findByTestId('provisioner-gcp-dataproc').click();
    await se.waitByTestId('profile-create-btn');

    const createButton = await se.findByTestId('profile-create-btn');
    expect(await createButton.isEnabled()).toBe(false);

    const PROFILE_NAME = 'test-system-compute';
    await se.findByTestId('profileLabel').sendKeys(PROFILE_NAME);

    const profileNameEl = await se.findByTestId('profileName');
    expect(await profileNameEl.getAttribute('value')).toBe(PROFILE_NAME);

    await se.findByTestId('profileDescription').sendKeys('system profile for integration test');

    await se.findByTestId('projectId').sendKeys('test');
    await se.findByTestId('accountKey').sendKeys('test');
    await se.findByTestId('profile-create-btn').click();
    await se.waitByTestId(`profile-list-${PROFILE_NAME}`);

    const newProfileEl = await se.findByTestId(`profile-list-${PROFILE_NAME}`);
    expect(await newProfileEl.isDisplayed()).toBe(true);
    
    await deleteProfile(`/v3/profiles/${PROFILE_NAME}`);
  });

  it('should be able to navigate to namespace compute profile create', async () => {
    await driver.get(`${BASE_URL}/cdap/ns/default/profiles/create`);
    await se.waitByTestId('provisioner-gcp-dataproc');

    await se.findByTestId('provisioner-gcp-dataproc').click();

    await se.waitByTestId('profile-create-btn');

    const createButton = await se.findByTestId('profile-create-btn');
    expect(await createButton.isEnabled()).toBe(false);

    const PROFILE_NAME = 'test-namespace-compute';
    await se.findByTestId('profileLabel').sendKeys(PROFILE_NAME);

    const profileNameEl = await se.findByTestId('profileName');
    expect(await profileNameEl.getAttribute('value')).toBe(PROFILE_NAME);

    await se.findByTestId('profileDescription').sendKeys('namespace profile for integration test');

    await se.findByTestId('projectId').sendKeys('test');
    await se.findByTestId('accountKey').sendKeys('test');
    await se.findByTestId('profile-create-btn').click();
    await se.waitByTestId(`profile-list-${PROFILE_NAME}`);

    const newProfileEl = await se.findByTestId(`profile-list-${PROFILE_NAME}`);
    expect(await newProfileEl.isDisplayed()).toBe(true);

    // cleanup
    await deleteProfile(`/v3/namespaces/default/profiles/${PROFILE_NAME}`);
  });
});
