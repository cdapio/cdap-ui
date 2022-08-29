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

import com.google.rpc.Help;
import io.cdap.cdap.ui.types.NodeInfo;
import io.cdap.e2e.pages.locators.CdfStudioLocators;
import io.cdap.e2e.utils.CdfHelper;
import io.cdap.e2e.utils.ElementHelper;
import io.cdap.e2e.utils.SeleniumDriver;
import io.cdap.e2e.utils.WaitHelper;
import io.cucumber.java8.He;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.Wait;

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

  public static void testConnection(String connectionType, String connectionId,
                                       String projectId, String serviceAccountPath) {
    fillConnectionCreateForm(connectionType, connectionId, projectId, serviceAccountPath);
    ElementHelper.clickOnElement(
            Helper.locateElementByCssSelector(
                    Helper.getCssSelectorByDataTestId("connection-test-button")), 5);

  }

  public static void createConnection(String connectionType, String connectionId) {
    fillConnectionCreateForm(connectionType, connectionId, null, null);
    ElementHelper.clickOnElement(
            Helper.locateElementByCssSelector(
                    Helper.getCssSelectorByDataTestId("connection-submit-button")), 5);
    WaitHelper.waitForPageToLoad();

  }

  public static void deleteConnection(String connectionType, String connectionId) {
    ElementHelper.clickOnElement(
            Helper.locateElementByCssSelector(
                    Helper.getCssSelectorByDataTestId("categorized-connection-type-" + connectionType)));

    String connectionItemName = "connection-container-" + connectionType + "-" + connectionId;
    WebElement connectionItem = Helper.locateElementByCssSelector(
            Helper.getCssSelectorByDataTestId(connectionItemName));

    connectionItem.findElement(By.cssSelector("div[class*='actions-popover']")).click();
    String popperId = connectionItem.findElement(
            By.cssSelector("div[class='popper']")).getAttribute("id");
    Helper.locateElementByXPath("//div[@id='" + popperId + "']//li[text()='Delete']").click();

    String confirmationText = "\"Are you sure you want to delete\"";
    String xpathExpression = "//*[contains(text(), " + confirmationText + ")]";
    boolean isDeleteConfirmShown = ElementHelper.isElementDisplayed(By.xpath(xpathExpression), 1);
    if (isDeleteConfirmShown) {
      String deleteButtonSelector = "div[class*='confirmation-button-options'] > "
              + Helper.getCssSelectorByDataTestId("Delete");
      WebElement deleteButton = Helper.locateElementByCssSelector(deleteButtonSelector);
      ElementHelper.clickOnElement(deleteButton);
      WaitHelper.waitForElementToBeHidden(deleteButton, 1);
    } else {
      throw new RuntimeException("Connection's Delete confirmation is not shown properly.");
    }
  }

  public static void selectConnection(String connectionType, String connectionId) {
    ElementHelper.clickOnElement(
            Helper.locateElementByCssSelector(
                    Helper.getCssSelectorByDataTestId("categorized-connection-type-" + connectionType)));

    String connectionCSSLocator = "connection-" + connectionType + "-" + connectionId;
    ElementHelper.clickOnElement(Helper.locateElementByCssSelector(
            Helper.getCssSelectorByDataTestId(connectionCSSLocator)));
  }

  public static void openConnectionPage(String connectionType, String connectionId) {
    SeleniumDriver.openPage(Constants.BASE_STUDIO_URL + "connections/" + connectionId);
    WaitHelper.waitForPageToLoad();
  }

  public static void testConnectionNavigation(String connectionId, String  path) {
    if (!SeleniumDriver.getDriver().getCurrentUrl().contains("/connections/" + connectionId + "?path=" + path)) {
      throw new RuntimeException("Navigation for new connection is failed.");
    }
  }

  public static void fillConnectionCreateForm(String connectionType, String connectionId,
                                                 String projectId, String serviceAccountPath) {
    if (projectId == null || projectId.length() == 0) {
      projectId = Constants.DEFAULT_GCP_PROJECTID;
    }
    if (serviceAccountPath == null || serviceAccountPath.length() == 0) {
      serviceAccountPath = Constants.DEFAULT_GCP_SERVICEACCOUNT_PATH;
    }

    ElementHelper.clickOnElement(
            Helper.locateElementByCssSelector(
                    Helper.getCssSelectorByDataTestId("add-connection-button")), 30);
    ElementHelper.clickOnElement(
            Helper.locateElementByCssSelector(
                    Helper.getCssSelectorByDataTestId("connector-" + connectionType)));
    ElementHelper.sendKeys(
            Helper.locateElementByCssSelector(
                    Helper.getCssSelectorByDataTestId("name")), connectionId);
    ElementHelper.replaceElementValue(
              Helper.locateElementByCssSelector(
                      Helper.getCssSelectorByDataTestId("project")), projectId);

    //Using service account file path
    ElementHelper.replaceElementValue(
              Helper.locateElementByCssSelector(
                      Helper.getCssSelectorByDataTestId("serviceFilePath")), serviceAccountPath);
  }

  public static void dismissStudioLeaveConfirmationModal() {
    SeleniumDriver.getDriver().switchTo().alert().accept();
  }
}
