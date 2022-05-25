/*
 * Copyright © 2022 Cask Data, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

import { By, Key } from 'selenium-webdriver';
import { loginIfRequired, buildChromeDriver, dataTestId, getGenericEndpoint } from '../support/utils';
import { PIPELINE_STUDIO_URL } from '../support/constants';
import SeleniumCommands from '../support/commands';

let driver;
let selenium_cmds;

describe.skip('Hierarchy Widgets', () => {
  const property = 'fieldMapping';
  const createRecord = { nodeName: 'CreateRecord', nodeType: 'transform' };
  const createRecordId = { ...createRecord, nodeId: '1' };
  const fileSource = { nodeName: 'File', nodeType: 'batchsource' };
  const fileSourceId = { ...fileSource, nodeId: '0' };
  const propertySelector = dataTestId(property);
  const row1Selector = `${propertySelector}`;

  const addField = async (row, name, type = null) => {
    await driver.findElement(By.css(`div${dataTestId(`schema-row-${row}`)} input[placeholder="Field name"]`))
      .sendKeys(name, Key.ENTER);
    const dropdownCssLocator = `div${dataTestId(`schema-row-${row}`)} div${dataTestId(`select-undefined`)}`;
    if (type) {
      await driver.findElement(By.css(dropdownCssLocator)).click();
      await driver.findElement(By.css(`${dropdownCssLocator} > select > option[value=${type}]`));
    }
  };

  const removeField = async (row) => {
    return driver.findElement(By.css(`div${dataTestId(`schema-row-${row}`)} button${dataTestId("schema-field-remove-button")}`)).click();
  };

  beforeAll(async () => {
    driver = buildChromeDriver();
    selenium_cmds = new SeleniumCommands(driver);
    await loginIfRequired(driver);
  });

  it('Should render File and Create Record', async () => {
    await driver.get(PIPELINE_STUDIO_URL);
    await driver.sleep(1000);
    await selenium_cmds.addNodeToCanvas(fileSource);
    await driver.sleep(1000);
    await selenium_cmds.openTransformPanel();
    await selenium_cmds.addNodeToCanvas(createRecord);
    await selenium_cmds.pipelineCleanUpGraphControl();
    await selenium_cmds.fitPipelineToScreen();
    await selenium_cmds.connectTwoNodes(fileSourceId, createRecordId, getGenericEndpoint);
    await selenium_cmds.openNodeProperty(fileSourceId);
    await selenium_cmds.closeNodeProperty();
  })

  it('Should add schema with simple files', async () => {
    await driver.sleep(1000);
    await selenium_cmds.openNodeProperty(fileSourceId);
    await removeField(0);
    await removeField(0);
    await addField(0, 'column1');
    await addField(1, 'column2');
    await addField(2, 'column3');
    await addField(3, 'column4');
    await addField(4, 'column5');
    await addField(5, 'column6');
    await addField(6, 'column7');
    await addField(7, 'column8');
    await addField(8, 'column9');
    await addField(9, 'column10');
    await selenium_cmds.closeNodeProperty();
  });

  it('Should render Create Record', async () => {
    await selenium_cmds.openNodeProperty(createRecordId);
    const fieldMappingEl = await driver.findElements(By.css(propertySelector));
    expect(fieldMappingEl.length).toBeGreaterThan(0);
  });

  it('Should add a new row', async () => {
    await driver.findElement(By.css(`div${row1Selector} div${dataTestId('add')}`)).click();
    const newRow = await driver.findElements(By.css(propertySelector));
    expect(newRow.length).toBeGreaterThan(0);
  });

  it('Should input some properties', async () => {
    await driver.findElement(By.css(`div${row1Selector} input${dataTestId('input')}`)).sendKeys('test1');
    await driver.findElement(By.css(`div${row1Selector} div${dataTestId('add-popup')}`)).click();
    await driver.findElement(By.css(`${dataTestId('add-child')}`)).click();
    const autoCompleteInput = await driver.findElement(By.css(`div${row1Selector} input${dataTestId('autocomplete-input')}`));
    await autoCompleteInput.click();
    await autoCompleteInput.sendKeys('column2');
    await driver.findElement(By.css(`${dataTestId('option-column2')}`)).click();
    await driver.findElement(By.css(`${dataTestId('option-column4')}`)).click();
    await driver.findElement(By.css(`${dataTestId('option-column8')}`)).click();
  });

  it('Should get the schema', async () => {
    await driver.findElement(By.css(`div${dataTestId('plugin-undefined')} div${dataTestId('widget-wrapper-container')} .WidgetWrapperView-widgetContainer-607 .abstract-widget-wrapper > div`)).click()
    await driver.findElement(By.css(`${dataTestId('get-schema-btn')}`)).click();
  });

  afterAll(async () => {
    await driver.quit()
  });
});
