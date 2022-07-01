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

describe('Manage tethering requests from the on-prem instance', () => {
  let driver;
  
  beforeAll(() => {
    driver = buildChromeDriver();
  });

  const navigateToTetheringPage = async () => {
    await driver.get(TETHERING_URL);
    await driver.sleep(1000);
  }

  beforeEach(async () => {
    await navigateToTetheringPage();
  });

  it('Should successfully dismiss the delete request modal when clicking on Cancel', async() => {
    const initialCount = await driver.findElements(By.css(dataTestId('pending-request')));
    await driver.findElement(By.css(dataTestId('pending-request'))).click();
    await driver.findElement(By.css(dataTestId('delete-pending-request'))).click();
    await driver.sleep(500);
    await driver.findElement(By.css(dataTestId('Cancel'))).click();
    const updatedCount = await driver.findElements(By.css(dataTestId('pending-request')));
    expect(initialCount.length).toEqual(updatedCount.length);
  })

  it('Should successfully delete a pending request', async() => {
    const initialCount = await driver.findElements(By.css(dataTestId('pending-request')));
    await driver.findElement(By.css(dataTestId('pending-request'))).click();
    await driver.findElement(By.css(dataTestId('delete-pending-request'))).click();
    await driver.sleep(500);
    await driver.findElement(By.css(dataTestId('Delete'))).click();
    const updatedCount = await driver.findElements(By.css(dataTestId('pending-request')));
    expect(initialCount.length - 1).toEqual(updatedCount.length);
  })

  it('Should successfully dismiss the delete connection modal when clicking on Cancel', async() => {
    const initialCount = await driver.findElements(By.css(dataTestId('established-connection')));
    await driver.findElement(By.css(dataTestId('established-connection'))).click();
    await driver.findElement(By.css(dataTestId('delete-connection'))).click();
    await driver.sleep(500);
    await driver.findElement(By.css(dataTestId('Cancel'))).click();
    const updatedCount = await driver.findElements(By.css(dataTestId('established-connection')));
    expect(initialCount.length).toEqual(updatedCount.length);
  })

  it('Should successfully delete an established connection', async() => {
    const initialCount = await driver.findElements(By.css(dataTestId('established-connection')));
    await driver.findElement(By.css(dataTestId('established-connection'))).click();
    await driver.findElement(By.css(dataTestId('delete-connection'))).click();
    await driver.sleep(500);
    await driver.findElement(By.css(dataTestId('Delete'))).click();
    const updatedCount = await driver.findElements(By.css(dataTestId('established-connection')));
    expect(initialCount.length - 1).toEqual(updatedCount.length);
  })

  afterAll(async () => {
    await driver.quit()
  });
});
