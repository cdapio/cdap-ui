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

import { buildChromeDriver, loginIfRequired, makeElementHelpers } from '../support/utils';
import { CONFIGURATION_URL } from '../support/constants';

describe('Setting and saving preferences', () => {
  let driver;
  let se;
  const TEST_KEY = 'name';
  const TEST_VALUE = 'hello';

  beforeAll(async () => {
    driver = buildChromeDriver();
    se = makeElementHelpers(driver);
    await loginIfRequired(driver);
  });

  it('Should show error message if user tries to set profile at the instance level', async () => {
    await driver.get(CONFIGURATION_URL);
    await se.waitByTestId('system-prefs-accordion').click();
    await se.findByTestId('edit-system-prefs-btn').click();
    const keyInput = await se.findByCssSelector("div[class='key-value-pair-preference'] > input[class='form-control key-input']");
    await keyInput.clear();
    await keyInput.sendKeys('system.profile.name');
    const valueInput = await se.findByCssSelector("div[class='key-value-pair-preference'] > input[class='form-control value-input']");
    await valueInput.clear();
    await valueInput.sendKeys(TEST_VALUE);
    await se.findByTestId('save-prefs-btn').click();
    await se.findByCssSelector('div[class="preferences-error"]');
  });

  it('Should allow user to save valid preference at instance level after fixing error', async () => {
    await driver.get(CONFIGURATION_URL);
    await se.waitByTestId('system-prefs-accordion').click();
    await se.findByTestId('edit-system-prefs-btn').click();
    const keyInput = await se.findByCssSelector("div[class='key-value-pair-preference'] > input[class='form-control key-input']");
    await keyInput.clear();
    await keyInput.sendKeys(TEST_KEY);
    const valueInput = await se.findByCssSelector("div[class='key-value-pair-preference'] > input[class='form-control value-input']");
    await valueInput.clear();
    await valueInput.sendKeys(TEST_VALUE);
    await se.findByTestId('save-prefs-btn').click();
    const addedKeyCssLocator = 'div[class*="grid-row"] > div';
    const keyEl = await se.waitByCssSelector(addedKeyCssLocator);
    const key = await keyEl.getText();
    const valueEl = await se.findByCssSelector(`${addedKeyCssLocator} + div`);
    const value = await valueEl.getText();
    expect(key).toBe(TEST_KEY);
    expect(value).toBe(TEST_VALUE);
  });

  afterAll(async () => {
    await driver.quit();
  });
});
