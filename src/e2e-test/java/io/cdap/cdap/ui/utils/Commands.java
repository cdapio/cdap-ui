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
import io.cdap.e2e.utils.SeleniumDriver;
import io.cdap.e2e.utils.WaitHelper;
import org.apache.commons.io.FileUtils;
import org.openqa.selenium.By;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebElement;

import java.io.File;
import java.io.IOException;
import java.util.Date;
import java.util.List;

public class Commands implements CdfHelper {

  public static void addNodeToCanvas(NodeInfo node) {
    ElementHelper.clickOnElement(
      Helper.locateElementByCssSelector(
        Helper.getCssSelectorByDataTestId("plugin-" + node.getNodeName() + "-" + node.getNodeType()))
    );
  }

  public static WebElement getNode(NodeInfo element) {
    return Helper.locateElementByCssSelector(Helper.getNodeSelectorFromNodeIndentifier(element));
  }

  public static void moveNode(String node, int toX, int toY) {
    WebElement element = Helper.locateElementByCssSelector(node);
    ElementHelper.dragAndDropByOffset(element, toX, toY);
  }

  public static void moveNode(NodeInfo node, int toX, int toY) {
    moveNode(Helper.getNodeSelectorFromNodeIndentifier(node), toX, toY);
  }

  public static void connectTwoNodes(NodeInfo source, NodeInfo target) {
    WebElement sourceNode = getNode(source);
    ElementHelper.dragAndDrop(
      CdfStudioLocators.locateSourceEndpointInCanvas(sourceNode.getAttribute("id")),
      getNode(target));
  }

  public static void pipelineCleanUpGraphControl() {
    ElementHelper.clickOnElement(
      Helper.locateElementByCssSelector(
        Helper.getCssSelectorByDataTestId("pipeline-clean-up-graph-control"))
    );
  }

  public static void fitPipelineToScreen() {
    ElementHelper.clickOnElement(
      Helper.locateElementByCssSelector(
        Helper.getCssSelectorByDataTestId("pipeline-fit-to-screen-control"))
    );
  }

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

  public static void testConnectionNavigation(String connectionId, String path) {
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

  public static void toggleTransformPanel() {
    ElementHelper.clickOnElement(
      Helper.locateElementByCssSelector(
        Helper.getCssSelectorByDataTestId("plugin-Transform-group-summary"))
    );
  }

  public static void toggleAnalyticsPanel() {
    ElementHelper.clickOnElement(
      Helper.locateElementByCssSelector(
        Helper.getCssSelectorByDataTestId("plugin-Analytics-group-summary"))
    );
  }

  public static void toggleConditionsAndActionsPanel() {
    ElementHelper.clickOnElement(
      Helper.locateElementByCssSelector(
        Helper.getCssSelectorByDataTestId("\"plugin-Conditions and Actions-group-summary\""))
    );
  }

  public static void toggleSinkPanel() {
    ElementHelper.clickOnElement(
      Helper.locateElementByCssSelector(
        Helper.getCssSelectorByDataTestId("plugin-Sink-group-summary"))
    );
  }

  public static void clickUndoButton() {
    ElementHelper.clickOnElement(
      Helper.locateElementByCssSelector(
        Helper.getCssSelectorByDataTestId("pipeline-undo-action-btn"))
    );
  }

  public static void clickRedoButton() {
    ElementHelper.clickOnElement(
      Helper.locateElementByCssSelector(
        Helper.getCssSelectorByDataTestId("pipeline-redo-action-btn"))
    );
  }

  public static void clickZoomInButton() {
    ElementHelper.clickOnElement(
      Helper.locateElementByCssSelector(
        Helper.getCssSelectorByDataTestId("pipeline-zoom-in-control"))
    );
  }

  public static void closeConfigPopover() {
    ElementHelper.clickOnElement(
      Helper.locateElementByCssSelector(
        Helper.getCssSelectorByDataTestId("close-config-popover"))
    );
  }

  public static List<WebElement> findElementsByCssSelector(String cssSelector) {
    return SeleniumDriver.getDriver()
      .findElements(By.cssSelector(cssSelector));
  }

  public static void createSimplePipeline() {
    NodeInfo sourceNode = new NodeInfo("Spanner", "batchsource", "0");
    NodeInfo transformNode = new NodeInfo("Wrangler", "transform", "1");
    NodeInfo sinkNode = new NodeInfo("BigQueryMultiTable", "batchsink", "2");

    addNodeToCanvas(sourceNode);

    toggleTransformPanel();
    addNodeToCanvas(transformNode);
    toggleTransformPanel();

    toggleSinkPanel();
    addNodeToCanvas(sinkNode);
    toggleSinkPanel();

    connectTwoNodes(sourceNode, transformNode);
    connectTwoNodes(transformNode, sinkNode);
  }

  public static void createComplexPipeline() {
    // Two BigQuery sources
    NodeInfo sourceNode1 = new NodeInfo("Spanner", "batchsource", "0");
    NodeInfo sourceNode2 = new NodeInfo("Spanner", "batchsource", "1");

    // Two javascript transforms
    NodeInfo transformNode1 = new NodeInfo("JavaScript", "transform", "2");
    NodeInfo transformNode2 = new NodeInfo("JavaScript", "transform", "3");

    // One joiner
    NodeInfo joinerNode = new NodeInfo("Joiner", "batchjoiner", "4");

    // One condition node
    NodeInfo conditionNode = new NodeInfo("Conditional", "condition", "5");

    // Two BigQuery sinks
    NodeInfo sinkNode1 = new NodeInfo("BigQueryMultiTable", "batchsink", "6");
    NodeInfo sinkNode2 = new NodeInfo("BigQueryMultiTable", "batchsink", "7");

    addNodeToCanvas(sourceNode1);
    addNodeToCanvas(sourceNode2);

    toggleTransformPanel();
    addNodeToCanvas(transformNode1);
    addNodeToCanvas(transformNode2);
    toggleTransformPanel();

    toggleAnalyticsPanel();
    addNodeToCanvas(joinerNode);
    toggleAnalyticsPanel();

    toggleConditionsAndActionsPanel();
    addNodeToCanvas(conditionNode);
    toggleConditionsAndActionsPanel();

    toggleSinkPanel();
    addNodeToCanvas(sinkNode1);
    addNodeToCanvas(sinkNode2);
    toggleSinkPanel();

    pipelineCleanUpGraphControl();
    fitPipelineToScreen();

    connectTwoNodes(sourceNode1, transformNode1);
    connectTwoNodes(sourceNode2, transformNode2);

    connectTwoNodes(transformNode1, joinerNode);
    connectTwoNodes(transformNode2, joinerNode);

    connectTwoNodes(joinerNode, conditionNode);

    connectTwoNodes(conditionNode, sinkNode1);
    connectTwoNodes(conditionNode, sinkNode2);

    pipelineCleanUpGraphControl();
    fitPipelineToScreen();
  }

  public static void takeScreenshot() {
    takeScreenshot(String.format("%s", new Date()), "");
  }

  public static void takeScreenshot(String scenarioName, String failedLine) {
    try {
      TakesScreenshot scrShot = (TakesScreenshot) SeleniumDriver.getDriver();
      File srcFile = scrShot.getScreenshotAs(OutputType.FILE);
      File destFile = new File(String.format(
        "/tmp/cdap-ui-integration-fixtures/cucumber/snapshots/%s_%s.png",
        scenarioName,
        "failed_at_line" + failedLine));
      FileUtils.copyFile(srcFile, destFile);
    } catch (IOException e) {
      e.printStackTrace();
    }
  }
}
