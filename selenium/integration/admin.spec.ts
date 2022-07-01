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

import { By, until } from 'selenium-webdriver';
import { dataTestId, buildChromeDriver, loginIfRequired } from '../support/utils';
import { CONFIGURATION_URL, TEST_TIMEOUT_TIME, RETRY_INTERVAL, TEST_TIMEOUT_MESSAGE } from '../support/constants';

let driver;
const TEST_KEY = 'name';
const TEST_VALUE = 'hello';

describe('Setting and saving preferences', () => {
  beforeAll(async () => {
    driver = buildChromeDriver();
    await loginIfRequired(driver);
  });

  it('Should show error message if user tries to set profile at the instance level', async () => {
    await driver.get(CONFIGURATION_URL);
    await driver.sleep(1000);
    await driver.findElement(By.css(dataTestId('system-prefs-accordion'))).click();
    await driver.findElement(By.css(dataTestId('edit-system-prefs-btn'))).click();
    const keyInput = await driver.findElement(By.css("div[class='key-value-pair-preference'] > input[class='form-control key-input']"));
    await keyInput.clear();
    await keyInput.sendKeys('system.profile.name');
    const valueInput = await driver.findElement(By.css("div[class='key-value-pair-preference'] > input[class='form-control value-input']"));
    await valueInput.clear();
    await valueInput.sendKeys(TEST_VALUE);
    await driver.findElement(By.css(dataTestId('save-prefs-btn'))).click();
    await driver.findElement(By.css('div[class="preferences-error"]'));
  });

  it('Should allow user to save valid preference at instance level after fixing error', async () => {
    await driver.get(CONFIGURATION_URL);
    await driver.sleep(1000);
    await driver.findElement(By.css(dataTestId('system-prefs-accordion'))).click();
    await driver.findElement(By.css(dataTestId('edit-system-prefs-btn'))).click();
    const keyInput = await driver.findElement(By.css("div[class='key-value-pair-preference'] > input[class='form-control key-input']"));
    await keyInput.clear();
    await keyInput.sendKeys(TEST_KEY);
    const valueInput = await driver.findElement(By.css("div[class='key-value-pair-preference'] > input[class='form-control value-input']"));
    await valueInput.clear();
    await valueInput.sendKeys(TEST_VALUE);
    await driver.findElement(By.css(dataTestId('save-prefs-btn'))).click();
    const addedKeyCssLocator = 'div[class*="grid-row"] > div';
    const keyEl = await driver.wait(until.elementLocated(By.css(addedKeyCssLocator)), TEST_TIMEOUT_TIME, TEST_TIMEOUT_MESSAGE, RETRY_INTERVAL); 
    const key = await keyEl.getText();
    const valueEl = await driver.wait(until.elementLocated(By.css(`${addedKeyCssLocator} + div`)), TEST_TIMEOUT_TIME, TEST_TIMEOUT_MESSAGE, RETRY_INTERVAL);
    const value = await valueEl.getText();
    expect(key).toBe(TEST_KEY);
    expect(value).toBe(TEST_VALUE);
  });

  afterAll(async () => {
    await driver.quit()
  });
});
