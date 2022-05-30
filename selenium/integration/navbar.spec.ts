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
import { Theme } from '../../app/cdap/services/ThemeHelper';
import { By, until } from 'selenium-webdriver';
import {Request} from 'selenium-webdriver/http'
import { dataTestId, buildChromeDriver, loginIfRequired, getSessionToken } from '../support/utils';
import { BASE_URL, CDAP_URL, UPDATE_THEME_URL } from '../support/constants';
import fetch from 'node-fetch';

let driver
const NAVBAR_MENU_HIGHLIGHT_COLOR = 'rgba(220, 224, 234, 1)';
const NAVBAR_MENU_FONT_COLOR = 'rgba(0, 118, 220, 1)';
const NAVBAR_BG_COLOR = 'rgba(51, 51, 51, 1)';
const NAVBAR_BG_COLOR_LIGHT = 'rgba(59, 120, 231, 1)';
let headers = {};

describe('Navbar tests', () => {
  beforeAll(async () => {
      driver = buildChromeDriver();
      await loginIfRequired(driver)
      //getCookie will throw exception if key never set, hence a try block
      try {
        await driver.manage().getCookie('CDAP_Auth_Token').then((cookie) => {
          if (!cookie) {
            return getSessionToken({})
          }
          headers = {
            Authorization: 'Bearer ' + cookie.value,
          };
          return getSessionToken(headers)
        })
        .then(
          (sessionToken) => (headers = Object.assign(headers, { 'Session-Token': sessionToken, 'Content-Type': 'application/json' }))
        )
      } catch (e) {
        const sessionToken = await getSessionToken({})
        headers = Object.assign(headers, { 'Session-Token': sessionToken, 'Content-Type': 'application/json' })
      }
      
  });
  afterAll(async () => {
    await fetch(`${BASE_URL}/updateTheme`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        uiThemePath: 'config/themes/default.json',
      })
    }).then(res => res.text()).then(data => console.log(data))
  })

  it('Should have right bgcolor for default theme', async () => {
    await driver.get(CDAP_URL)
    await driver.sleep(1000)
    const bgcolor = await driver.findElement(By.css(dataTestId('app-navbar'))).getCssValue('background-color')
    expect(bgcolor).toBe(NAVBAR_BG_COLOR);
  });
  it('Should have the drawer invisible by default', async () => {
    const visibility = await driver.findElement(By.css(dataTestId('navbar-drawer'))).getCssValue('visibility')
    expect(visibility).toBe('hidden');
  });
  it('Should have right features enabled', async () => {
    await driver.findElement(By.xpath(`//*[contains(text(), ${Theme.featureNames.dashboard})]`))
    await driver.findElement(By.xpath(`//*[contains(text(), ${Theme.featureNames.hub})]`))
    await driver.findElement(By.css(dataTestId('navbar-hamburger-icon'))).click();
    await driver.findElement(By.xpath(`//*[contains(text(), ${Theme.featureNames.pipelines})]`))
    await driver.findElement(By.xpath(`//*[contains(text(), ${Theme.featureNames.dataPrep})]`))
    await driver.findElement(By.xpath(`//*[contains(text(), ${Theme.featureNames.metadata})]`))
    await driver.findElement(By.css(dataTestId('navbar-hamburger-icon'))).click();
  });
  it('Should have right bgcolor for light theme', async () => {
    await fetch(`${BASE_URL}/updateTheme`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        uiThemePath: 'config/themes/light.json',
      })
    }).then(res => res.text()).then(data => console.log(data))
    await driver.get(CDAP_URL)
    await driver.sleep(1000)
    const bgcolor = await driver.findElement(By.css(dataTestId('app-navbar'))).getCssValue('background-color')
    expect(bgcolor).toBe(NAVBAR_BG_COLOR_LIGHT);
    
  });
  it('Should have right features enabled/disabled in light theme', async () => {
    await driver.findElement(By.xpath(`//*[contains(text(), ${Theme.featureNames.dashboard})]`))
    await driver.findElement(By.xpath(`//*[contains(text(), ${Theme.featureNames.hub})]`))
    await driver.findElement(By.css(dataTestId('navbar-hamburger-icon'))).click();
    await driver.findElement(By.xpath(`//*[contains(text(), ${Theme.featureNames.pipelines})]`))
    await driver.findElement(By.xpath(`//*[contains(text(), ${Theme.featureNames.dataPrep})]`))
    await driver.findElement(By.xpath(`//*[contains(text(), ${Theme.featureNames.metadata})]`))
    await driver.findElement(By.xpath(`//*[contains(text(), ${Theme.featureNames.pipelineStudio})]`))
    await driver.findElement(By.css(dataTestId('navbar-hamburger-icon'))).click();
  });
  it('Should close when hub is opened',async () => {
    await driver.get(CDAP_URL)
    await driver.sleep(500)
    await driver.findElement(By.css(dataTestId('navbar-hamburger-icon'))).click();
    await driver.findElement(By.id('navbar-hub')).click();
    await driver.sleep(200)
    const visibility = await driver.findElement(By.css(dataTestId('navbar-drawer'))).getCssValue('visibility')
    expect(visibility).toBe('hidden');
  });
  it('Should have the right features highlighted in the drawer', async () => {
    const assetFeatureHighlight = async (featureSelector) => {
      await driver.findElement(By.css(dataTestId('navbar-hamburger-icon'))).click();
      await driver.sleep(200)
      await driver.findElement(By.css(dataTestId(featureSelector))).click();
      await driver.sleep(200)
      await driver.findElement(By.css(dataTestId('navbar-hamburger-icon'))).click();
      await driver.sleep(200)
      const bgcolor = await driver.findElement(By.css(dataTestId(featureSelector))).getCssValue('background-color')
      const color = await driver.findElement(By.css(dataTestId(featureSelector))).getCssValue('color')
      expect(bgcolor).toBe(NAVBAR_MENU_HIGHLIGHT_COLOR);
      expect(color).toBe(NAVBAR_MENU_FONT_COLOR);
      await driver.findElement(By.css(dataTestId('navbar-hamburger-icon'))).click();
      await driver.sleep(200)
    };

    await driver.get(CDAP_URL)
    await driver.sleep(500)
    await driver.findElement(By.css(dataTestId('navbar-hamburger-icon'))).click();
    await driver.sleep(200)
    await driver.findElement(By.css(dataTestId('navbar-control-center-link'))).click();
    await driver.sleep(200)
    await driver.findElement(By.css(dataTestId('navbar-hamburger-icon'))).click();
    await driver.sleep(200)
    const bgcolor = await driver.findElement(By.css(dataTestId('navbar-control-center-link'))).getCssValue('background-color')
    const color = await driver.findElement(By.css(dataTestId('navbar-control-center-link'))).getCssValue('color')
    expect(bgcolor).toBe(NAVBAR_MENU_HIGHLIGHT_COLOR);
    expect(color).toBe(NAVBAR_MENU_FONT_COLOR);
    await driver.findElement(By.css(dataTestId('navbar-hamburger-icon'))).click();
    await driver.sleep(200)

    assetFeatureHighlight('navbar-pipelines-link');
    assetFeatureHighlight('navbar-pipeline-studio-link');
    assetFeatureHighlight('navbar-metadata-link');
    assetFeatureHighlight('navbar-project-admin-link');
  });
});
