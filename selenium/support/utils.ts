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

import { Builder } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';
import fetch from 'node-fetch';
import { BASE_URL, BASE_SERVER_URL } from './constants';

const username = 'admin';
const password = 'admin';
let isAuthEnabled = false;
let authToken = null;

export const buildChromeDriver = () => {
  const options = new chrome.Options();
  
  options.addArguments('--disable-dev-shm-usage');
  options.addArguments('--no-sandbox');
  options.addArguments('--headless');

  return new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();
}

export const loginIfRequired = async (driver) => {
  if (isAuthEnabled && authToken !== null) {
    driver.manage().addCookie({'name': 'CDAP_Auth_Token', 'value': authToken});
    driver.manage().addCookie({'name': 'CDAP_Auth_User', 'value': username});
    return;
  }
  return fetch(`${BASE_SERVER_URL}/v3/namespaces`)
    .then((response) => {
      // only login when ping request returns 401
      if (response.status === 401) {
        isAuthEnabled = true;
        try {
          fetch(`${BASE_URL}/login`, {
            method: "POST",
            body: JSON.stringify({
              username,
              password
            }),
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            }
          }).then((res) => res.json()).then((data) => {
            const respBody = JSON.parse(data.body);
            authToken = respBody.access_token;
            driver.manage().addCookie({'name': 'CDAP_Auth_Token', 'value': authToken});
            driver.manage().addCookie({'name': 'CDAP_Auth_User', 'value': username});
          });
        } catch (e) {
          throw Error(e.message);
        }
      }
    });
}

export const dataTestId = (property) => {
  return `[data-testid="${property}"]`;
}

export const getNodeSelectorFromNodeIndentifier = (node) => {
  const { nodeName, nodeType, nodeId } = node;
  return `[data-testid="plugin-node-${nodeName}-${nodeType}-${nodeId}"]`;
}

export const getArtifactsPoll = (headers, retries = 0) => {
  if (retries === 3) {
    return;
  }

  fetch(`${BASE_SERVER_URL}/v3/namespaces/default/artifacts?scope=SYSTEM`, headers).then((response) => {
    if (response.status >= 400) {
      return getArtifactsPoll(headers, retries + 1);
    }
    return;
  });
}

export const getGenericEndpoint = (options, id) => {
  return `.plugin-endpoint_${id}-right`;
}
