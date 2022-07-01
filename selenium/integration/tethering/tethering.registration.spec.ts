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
import { By } from 'selenium-webdriver';
import { TETHERING_URL } from '../../support/constants';
import { buildChromeDriver, dataTestId } from '../../support/utils';

describe('Create a new tethering request from the on-prem instance', () => {
  let driver;
  
  beforeAll(() => {
    driver = buildChromeDriver();
  });

  const navigateToTetheringNewReqPage = async () => {
    await driver.get(TETHERING_URL);
    await driver.sleep(1000);
    driver.findElement(By.css(dataTestId('create-tethering-req-btn'))).click();
    await driver.sleep(500);
  }

  beforeEach(async () => {
    await navigateToTetheringNewReqPage();
  });

  const fillOutNewTetheringRequestFields = async (testValue, skipRequiredField = false) => {
    if (!skipRequiredField) {
      driver.findElement(By.css(dataTestId('projectName'))).sendKeys(testValue);
    }
    driver.findElement(By.css(dataTestId('region'))).sendKeys(testValue);
    driver.findElement(By.css(dataTestId('instanceName'))).sendKeys(testValue);
    driver.findElement(By.css(dataTestId('instanceUrl'))).sendKeys(testValue);
    driver.findElement(By.css(dataTestId('description'))).sendKeys(testValue);
    await driver.findElement(By.css(dataTestId('tethering-req-accept-btn'))).click();
  }

  it('Should successfully create new tethering connection requests', async() => {
    driver.findElement(By.css(dataTestId('tethering-ns-chk-box'))).click();
    await fillOutNewTetheringRequestFields('test');
    driver.findElement(By.css(dataTestId('success')));
    await fillOutNewTetheringRequestFields('test1');
    driver.findElement(By.css(dataTestId('success')));
  })

  it('Should fail to create a new request with the same instance name', async () => {
    driver.findElement(By.css(dataTestId('tethering-ns-chk-box'))).click();
    await fillOutNewTetheringRequestFields('test');
    driver.findElement(By.css(dataTestId('error')));
  })

  it('Should fail to create a new request with no namespaces', async () => {
    await fillOutNewTetheringRequestFields('test2');
    driver.findElement(By.css(dataTestId('no-ns-selected')));
  })

  it('Should fail to create a new request with a missing required field', async () => {
    driver.findElement(By.css(dataTestId('tethering-ns-chk-box'))).click();
    await fillOutNewTetheringRequestFields('test2', true);
    driver.findElement(By.css(dataTestId('missing-required-field')));
  })

  afterAll(async () => {
    await driver.quit()
  });
});
