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

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import io.cdap.cdap.ui.types.NodeInfo;
import io.cdap.common.http.HttpMethod;
import io.cdap.common.http.HttpResponse;
import io.cdap.e2e.pages.locators.CdfStudioLocators;
import io.cdap.e2e.utils.CdfHelper;
import io.cdap.e2e.utils.ElementHelper;
import io.cdap.e2e.utils.SeleniumDriver;
import io.cdap.e2e.utils.WaitHelper;
import org.apache.commons.io.FileUtils;
import org.junit.Assert;
import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.StaleElementReferenceException;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebElement;

import java.io.File;
import java.io.IOException;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

public class Commands implements CdfHelper {

  // Simple Pipeline Nodes
  public static NodeInfo simpleSourceNode = new NodeInfo("BigQueryTable", "batchsource", "0");
  public static NodeInfo simpleTransformNode = new NodeInfo("Wrangler", "transform", "1");
  public static NodeInfo simpleSinkNode = new NodeInfo("BigQueryMultiTable", "batchsink", "2");

  // Complex Pipeline Nodes
  public static NodeInfo complexSourceNode1 = new NodeInfo("Spanner", "batchsource", "0");
  public static NodeInfo complexSourceNode2 = new NodeInfo("Spanner", "batchsource", "1");
  public static NodeInfo complexTransformNode1 = new NodeInfo("JavaScript", "transform", "2");
  public static NodeInfo complexTransformNode2 = new NodeInfo("JavaScript", "transform", "3");
  public static NodeInfo complexJoinerNode = new NodeInfo("Joiner", "batchjoiner", "4");
  public static NodeInfo complexConditionNode = new NodeInfo("Conditional", "condition", "5");
  public static NodeInfo complexSinkNode1 = new NodeInfo("BigQueryMultiTable", "batchsink", "6");
  public static NodeInfo complexSinkNode2 = new NodeInfo("BigQueryMultiTable", "batchsink", "7");

  public static void addNodeToCanvas(NodeInfo node) {
    WaitHelper.waitForElementToBeDisplayed(
      Helper.locateElementByTestId("plugin-" + node.getNodeName() + "-" + node.getNodeType()));
    ElementHelper.clickOnElement(
      Helper.locateElementByTestId("plugin-" + node.getNodeName() + "-" + node.getNodeType())
    );
  }

  public static WebElement getNode(NodeInfo node) {
    return Helper.locateElementByCssSelector(Helper.getNodeSelectorFromNodeIdentifier(node));
  }

  public static void moveNode(String node, int toX, int toY) {
    WebElement element = Helper.locateElementByCssSelector(node);
    ElementHelper.dragAndDropByOffset(element, toX, toY);
  }

  public static void moveNode(NodeInfo node, int toX, int toY) {
    moveNode(Helper.getNodeSelectorFromNodeIdentifier(node), toX, toY);
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
      Helper.locateElementByTestId("connection-test-button"), 5);
  }

  public static void createConnection(String connectionType, String connectionId) {
    fillConnectionCreateForm(connectionType, connectionId, null, null);
    ElementHelper.clickOnElement(
      Helper.locateElementByTestId("connection-submit-button"), 5);
    WaitHelper.waitForPageToLoad();
  }

  public static void deleteConnection(String connectionType, String connectionId) {
    ElementHelper.clickOnElement(
      Helper.locateElementByTestId("categorized-connection-type-" + connectionType));

    String connectionItemName = "connection-container-" + connectionType + "-" + connectionId;
    WebElement connectionItem = Helper.locateElementByTestId(connectionItemName);

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
      Helper.locateElementByTestId("add-connection-button"), 30);
    ElementHelper.clickOnElement(
      Helper.locateElementByTestId("connector-" + connectionType));
    sendKeysToInputElementByTestId("name", connectionId);
    clearInputAndSendKeysToElementByTestId("project", projectId);

    //Using service account file path
    clearInputAndSendKeysToElementByTestId("serviceFilePath", serviceAccountPath);
  }

  public static void dismissStudioLeaveConfirmationModal() {
    SeleniumDriver.getDriver().switchTo().alert().accept();
  }

  public static void openPluginGroupPanel(String pluginGroup) {
    try {
      ElementHelper.clickOnElement(
        Helper.locateElementByXPath(
          "//div[@data-testid='plugin-" + pluginGroup + "-group-summary' and @aria-expanded='false']"));
      WaitHelper.waitForElementToBeDisplayed(Helper.locateElementByTestId("plugin-" + pluginGroup + "-group-details"));
    } catch (StaleElementReferenceException | NoSuchElementException e) {
      Assert.assertTrue(Helper.isElementExists(
        By.xpath("//div[@data-testid='plugin-" + pluginGroup + "-group-summary' and @aria-expanded='true']")));
    }
  }

  public static void closePluginGroupPanel(String pluginGroup) {
    try {
      ElementHelper.clickOnElement(
        Helper.locateElementByXPath(
          "//div[@data-testid='plugin-" + pluginGroup + "-group-summary' and @aria-expanded='true']"));
      WaitHelper.waitForElementToBeDisplayed(Helper.locateElementByXPath(
        "//div[@data-testid='plugin-" + pluginGroup + "-group-summary' and @aria-expanded='false']")
      );
    } catch (StaleElementReferenceException | NoSuchElementException e) {
      Assert.assertTrue(Helper.isElementExists(
        By.xpath("//div[@data-testid='plugin-" + pluginGroup + "-group-summary' and @aria-expanded='false']")));
    }
  }

  public static void clickUndoButton() {
    ElementHelper.clickOnElement(
      Helper.locateElementByTestId("pipeline-undo-action-btn")
    );
  }

  public static void clickRedoButton() {
    ElementHelper.clickOnElement(
      Helper.locateElementByTestId("pipeline-redo-action-btn")
    );
  }

  public static void clickZoomInButton() {
    ElementHelper.clickOnElement(
      Helper.locateElementByTestId("pipeline-zoom-in-control")
    );
  }

  public static void closeConfigPopover() {
    ElementHelper.clickOnElement(
      Helper.locateElementByTestId("close-config-popover")
    );
  }

  public static List<WebElement> findElementsByCssSelector(String cssSelector) {
    return SeleniumDriver.getDriver()
      .findElements(By.cssSelector(cssSelector));
  }

  public static void createSimplePipeline() {
    addNodeToCanvas(simpleSourceNode);

    openPluginGroupPanel(Constants.TRANSFORM_PLUGINS_GROUP_LOCATOR_TEXT);
    addNodeToCanvas(simpleTransformNode);
    closePluginGroupPanel(Constants.TRANSFORM_PLUGINS_GROUP_LOCATOR_TEXT);

    openPluginGroupPanel(Constants.SINK_PLUGINS_GROUP_LOCATOR_TEXT);
    addNodeToCanvas(simpleSinkNode);
    closePluginGroupPanel(Constants.SINK_PLUGINS_GROUP_LOCATOR_TEXT);

    connectTwoNodes(simpleSourceNode, simpleTransformNode);
    connectTwoNodes(simpleTransformNode, simpleSinkNode);
  }

  public static void createComplexPipeline() {
    addNodeToCanvas(complexSourceNode1);
    addNodeToCanvas(complexSourceNode2);

    openPluginGroupPanel(Constants.TRANSFORM_PLUGINS_GROUP_LOCATOR_TEXT);
    addNodeToCanvas(complexTransformNode1);
    addNodeToCanvas(complexTransformNode2);
    closePluginGroupPanel(Constants.TRANSFORM_PLUGINS_GROUP_LOCATOR_TEXT);

    openPluginGroupPanel(Constants.ANALYTICS_PLUGINS_GROUP_LOCATOR_TEXT);
    addNodeToCanvas(complexJoinerNode);
    closePluginGroupPanel(Constants.ANALYTICS_PLUGINS_GROUP_LOCATOR_TEXT);

    openPluginGroupPanel(Constants.CONDITIONS_AND_ACTIONS_PLUGINS_GROUP_LOCATOR_TEXT);
    addNodeToCanvas(complexConditionNode);
    closePluginGroupPanel(Constants.CONDITIONS_AND_ACTIONS_PLUGINS_GROUP_LOCATOR_TEXT);

    openPluginGroupPanel(Constants.SINK_PLUGINS_GROUP_LOCATOR_TEXT);
    addNodeToCanvas(complexSinkNode1);
    addNodeToCanvas(complexSinkNode2);
    closePluginGroupPanel(Constants.SINK_PLUGINS_GROUP_LOCATOR_TEXT);

    pipelineCleanUpGraphControl();
    fitPipelineToScreen();

    connectTwoNodes(complexSourceNode1, complexTransformNode1);
    connectTwoNodes(complexSourceNode2, complexTransformNode2);

    connectTwoNodes(complexTransformNode1, complexJoinerNode);
    connectTwoNodes(complexTransformNode2, complexJoinerNode);

    connectTwoNodes(complexJoinerNode, complexConditionNode);

    connectTwoNodes(complexConditionNode, complexSinkNode1);
    connectTwoNodes(complexConditionNode, complexSinkNode2);

    pipelineCleanUpGraphControl();
    fitPipelineToScreen();
  }

  public static void takeScreenshot() {
    takeScreenshot(String.format("%s", new Date()), "", "");
  }

  public static void takeScreenshot(String featureName, String scenarioName, String failedLine) {
    try {
      TakesScreenshot scrShot = (TakesScreenshot) SeleniumDriver.getDriver();
      File srcFile = scrShot.getScreenshotAs(OutputType.FILE);
      File destFile = new File(String.format(
        "/tmp/cdap-ui-integration-fixtures/cucumber/snapshots/%s_%s_%s.png",
        featureName,
        scenarioName,
        "failed-at-L" + failedLine));
      FileUtils.copyFile(srcFile, destFile);
    } catch (IOException e) {
      e.printStackTrace();
    }
  }

  public static void sendKeysToInputElementByTestId(String testId, String keys) {
    ElementHelper.sendKeys(Helper.locateElementByCssSelector(
      "input" + Helper.getCssSelectorByDataTestId(testId)), keys);
  }

  public static void clearInputAndSendKeysToElementByTestId(String testId, String keys) {
    WebElement element = Helper.locateElementByCssSelector(
      "input" + Helper.getCssSelectorByDataTestId(testId));
    ElementHelper.clearElementValue(element);
    ElementHelper.sendKeys(element, keys);
  }

  public static int uploadPipelineDraftViaApi(String pipelineDraftJson) throws IOException {
    HttpResponse response = HttpRequestHandler.makeHttpRequest(
      HttpMethod.PUT, Constants.BASE_SERVER_URL + "/v3/configuration/user", null, pipelineDraftJson, null
    );
    return response.getResponseCode();
  }

  public static int checkDraftPipelineExistsViaApi(String draftId) throws IOException {
    HttpResponse response = HttpRequestHandler.makeHttpRequest(
      HttpMethod.GET,
      Constants.BASE_SERVER_URL +
        "/v3/namespaces/system/apps/pipeline/services/studio/methods/v1/contexts/default/drafts/"
        + draftId, null, null, null
    );
    return response.getResponseCode();
  }

  public static void fillInPipelineName(String pipelineName) {
    ElementHelper.clickOnElement(Helper.locateElementByTestId("pipeline-metadata"));
    ElementHelper.clearElementValue(Helper.locateElementByCssSelector("#pipeline-name-input"));
    ElementHelper.sendKeys(Helper.locateElementByCssSelector("#pipeline-name-input"), pipelineName);
    ElementHelper.clickOnElement(
      Helper.locateElementByTestId("pipeline-metadata-ok-btn"));
  }

  public static void dismissTopBanner() {
    try {
      ElementHelper.clickOnElement(Helper.locateElementByXPath(
          "//div[@data-testid='valium-banner-hydrator']//button[@class='close ng-scope']"));
    } catch (NoSuchElementException e) {
      // pass
    }
    WaitHelper.waitForElementToBeHidden(Helper.locateElementByTestId("valium-banner-hydrator"));
  }

  public static JsonObject getPipelineJson() {
    JsonObject pipelineConfigJSON = null;
    Helper.setCypressObjectOnWindow();
    ElementHelper.clickOnElement(Helper.locateElementByTestId("pipeline-export-btn"));
    String pipelineConfig = Helper.locateElementByCssSelector(
      Helper.getCssSelectorByDataTestId("pipeline-export-json-container") + " textarea").getAttribute("value");
    Helper.removeCypressObjectOnWindow();
    Assert.assertNotNull(pipelineConfig);
    ElementHelper.clickOnElement(Helper.locateElementByTestId("export-pipeline-close-modal-btn"));

    pipelineConfigJSON = Helper.getJSONObject(pipelineConfig);
    return pipelineConfigJSON;
  }

  public static JsonObject getPipelineStageJson(String stageName) {
    JsonArray stagesArray = getPipelineJson().get("config").getAsJsonObject().get("stages").getAsJsonArray();
    Iterator iterator = stagesArray.iterator();
    JsonObject stageJSON = new JsonObject();
    while (iterator.hasNext()) {
      JsonElement jsonElement = (JsonElement) iterator.next();
      if (jsonElement.getAsJsonObject().get("name").getAsString().equalsIgnoreCase(stageName)) {
        stageJSON =  jsonElement.getAsJsonObject();
      }
    }
    return stageJSON;
  }

  public static void waitForLoading() {
    if (Helper.isElementExists(Helper.getCssSelectorByDataTestId("loading-indicator"))) {
      WaitHelper.waitForElementToBeHidden(
        Helper.locateElementByCssSelector(Helper.getCssSelectorByDataTestId("loading-indicator"))
      );
    }
  }
}
