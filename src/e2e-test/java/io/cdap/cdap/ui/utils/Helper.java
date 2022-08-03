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

package io.cdap.cdap.ui.utils;

import io.cdap.cdap.ui.types.NodeInfo;
import io.cdap.e2e.utils.CdfHelper;
import io.cdap.e2e.utils.SeleniumDriver;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

public class Helper implements CdfHelper {

  public static WebElement locateElementByCssSelector(String cssSelector) {
    return SeleniumDriver.getDriver()
      .findElement(By.cssSelector(cssSelector));
  }

  public static String getCssSelectorByDataTestId (String dataTestId) {
    return "[data-testid=" + dataTestId + "]";
  }

  public static String getNodeSelectorFromNodeIndentifier (NodeInfo node) {
    return "[data-testid=\"plugin-node-" +
      node.getNodeName() + "-" +
      node.getNodeType() + "-" +
      node.getNodeId() + "\"]";
  }
}
