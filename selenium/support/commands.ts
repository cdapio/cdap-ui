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

import { By, WebDriver } from 'selenium-webdriver';
import { getNodeSelectorFromNodeIndentifier } from './utils';
import { INodeIdentifier, INodeInfo, IgetNodeIDOptions } from '../typings';

class SeleniumCommands {
  driver: WebDriver;
  actions;

  constructor(driver: WebDriver) {
    this.driver = driver;
    this.actions = this.driver.actions({async: true});
  }

  addNodeToCanvas = async (nodeObj: INodeInfo) => {
    const { nodeName, nodeType } = nodeObj;
    const node = await this.driver.findElement(By.css(`[data-testid="plugin-${nodeName}-${nodeType}"]`));
    return node.click();
  }

  openTransformPanel = async () => {
    const transformPanel = await this.driver.findElement(By.css('[data-testid="plugin-Transform-group-summary"]'));
    return transformPanel.click();
  };
  
  openNodeProperty = async (element: INodeIdentifier, options) => {
    const elementId = getNodeSelectorFromNodeIndentifier(element);
    const node = await this.driver.findElement(By.css(elementId));
    await node.click();
    //Ensure node property page is open by locating its close button
    return this.driver.findElement(By.css('[data-testid="close-config-popover"]'))
  };

  closeNodeProperty = async () => {
    const propertiesModal = await this.driver.findElement(By.css('[data-testid="close-config-popover"]'));
    return propertiesModal.click();
  };

  getNode = async (element: INodeIdentifier) => {
    const elementId = getNodeSelectorFromNodeIndentifier(element);
    const el = await this.driver.findElement(By.css(elementId));
    return el;
  };

  moveNode = async (node: INodeIdentifier | string, toX: number, toY: number) => {
    let nodeSelector;
    if (typeof node === 'object') {
      nodeSelector = getNodeSelectorFromNodeIndentifier(node);
    } else {
      nodeSelector = node;
    }
    const element = await this.driver.findElement(By.css(nodeSelector));
    await this.actions.move({origin: element}).press().perform(); 
    await this.actions.move({origin: element, x: toX, y: toY}).release().perform();
    return;
  };

  connectTwoNodes = async (
    sourceNode: INodeIdentifier,
    targetNode: INodeIdentifier,
    sourceEndpoint: (options: IgetNodeIDOptions, s: string) => string,
    options: IgetNodeIDOptions = {}
  ) => {
    const sourceEl = await this.getNode(sourceNode);
    const sourceElId = await sourceEl.getAttribute("id");
    const targetEl = await  this.getNode(targetNode);
    
    const sourceCoOrdinates = await sourceEl.getRect();
    const targetCoOrdinates = await targetEl.getRect();
    
    let pageX = targetCoOrdinates.x - (sourceCoOrdinates.x + sourceCoOrdinates.width) + targetCoOrdinates.width / 2;
    let pageY = targetCoOrdinates.y - (sourceCoOrdinates.y + sourceCoOrdinates.height) + targetCoOrdinates.height / 2;

    // This is not perfect. Since splitter endpoints are on a popover
    // we need to go extra down and left to connect from the endpoint
    // to the target node.
    if (options.portName) {
      pageX -= targetCoOrdinates.width / 2;
      pageY += targetCoOrdinates.height / 2;
    }

    // connect from source endpoint to midway between the target node
    return this.moveNode(sourceEndpoint(options, sourceElId), pageX, pageY);
  };

  pipelineCleanUpGraphControl = async () => {
    const targetEl = await this.driver.findElement(By.css('[data-testid="pipeline-clean-up-graph-control"]'));
    return targetEl.click();
  };

  fitPipelineToScreen = async () => {
    const targetEl = await this.driver.findElement(By.css('[data-testid="pipeline-fit-to-screen-control"]'));
    return targetEl.click();
  };

}

export default SeleniumCommands;
