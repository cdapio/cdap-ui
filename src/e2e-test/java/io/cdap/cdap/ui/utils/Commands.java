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
import io.cdap.e2e.pages.locators.CdfStudioLocators;
import io.cdap.e2e.utils.CdfHelper;
import io.cdap.e2e.utils.ElementHelper;
import org.openqa.selenium.WebElement;

public class Commands implements CdfHelper {
  public static void addNodeToCanvas(NodeInfo node) {
    ElementHelper.clickOnElement(
      Helper.locateElementByCssSelector(
        "[data-testid=\"plugin-" + node.getNodeName() + "-" + node.getNodeType() + "\"]"
      )
    );
  }

  private static WebElement getNode (NodeInfo element) {
    return Helper.locateElementByCssSelector(Helper.getNodeSelectorFromNodeIndentifier(element));
  };

  public static void moveNode (String node, int toX, int toY) {
    WebElement element = Helper.locateElementByCssSelector(node);
    ElementHelper.dragAndDropByOffset(element, toX, toY);
  };

  public static void moveNode (NodeInfo node, int toX, int toY) {
    moveNode(Helper.getNodeSelectorFromNodeIndentifier(node), toX, toY);
  };

  public static void connectTwoNodes (NodeInfo source, NodeInfo target) {
    ElementHelper.dragAndDrop(
      CdfStudioLocators.locateSourceEndpointInCanvas(source.getNodeName()),
      getNode(target));
  }

  public static void pipelineCleanUpGraphControl() {
    ElementHelper.clickOnElement(
      Helper.locateElementByCssSelector("[data-testid=\"pipeline-clean-up-graph-control\"]")
    );
  };

  public static void fitPipelineToScreen() {
    ElementHelper.clickOnElement(
      Helper.locateElementByCssSelector("[data-testid=\"pipeline-fit-to-screen-control\"]")
    );
  };

}
