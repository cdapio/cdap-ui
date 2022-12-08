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

package io.cdap.cdap.ui.stepsdesign;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import io.cdap.cdap.ui.utils.Commands;
import io.cdap.cdap.ui.utils.Constants;
import io.cdap.cdap.ui.utils.Helper;
import io.cdap.e2e.pages.locators.CdfStudioLocators;
import io.cdap.e2e.utils.ElementHelper;
import io.cdap.e2e.utils.WaitHelper;
import io.cucumber.java.en.Then;
import org.junit.Assert;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;

import java.io.IOException;
import java.io.Reader;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

public class PipelineContextMenu {

  public static final Gson GSON = new Gson();
  public static String pipelineName = "";

  Map<String, String> canvasContextMenuHelperMap = new HashMap<String, String>() {
    {
      put("Wrangle", "menu-item-add-wrangler-source");
      put("Zoom In", "menu-item-zoom-in");
      put("Zoom Out", "menu-item-zoom-out");
      put("Fit To Screen", "menu-item-fit-to-screen");
      put("Align", "menu-item-align-nodes");
      put("Paste", "menu-item-pipeline-node-paste");
      put("defaultZoomLevel", "matrix(1, 0, 0, 1, 0, 0)");
      put("firstZoomLevel", "matrix(1.1, 0, 0, 1.1, 0, 0)");
      put("secondZoomLevel", "matrix(1.2, 0, 0, 1.2, 0, 0)");
    }
  };

  @Then("Open source node context menu")
  public void openSourceNodeContextMenu() {
    Helper.rightClickOnElement(Commands.getNode(Commands.simpleSourceNode));
  }

  @Then("Validate Copy Plugin and Delete Plugin options are visible")
  public void validatePluginOptionsVisibility() throws InterruptedException {
    WebElement copyOption = Helper.locateElementByTestId("menu-item-plugin copy");
    WebElement deleteOption = Helper.locateElementByTestId("menu-item-plugin delete");
    Assert.assertTrue(copyOption.isDisplayed());
    Assert.assertTrue(deleteOption.isDisplayed());
    deleteOption.sendKeys(Keys.ESCAPE);
  }

  @Then("Delete source node through context menu")
  public void deleteSourceNodeThroughContextMenu() {
    Helper.rightClickOnElement(Commands.getNode(Commands.simpleSourceNode));
    ElementHelper.clickOnElement(Helper.locateElementByTestId("menu-item-plugin delete"));

  }

  @Then("Delete transform node through context menu")
  public void deleteTransformNodeThroughContextMenu() {
    Helper.rightClickOnElement(CdfStudioLocators.locatePluginNodeInCanvas("Wrangler"));
    ElementHelper.clickOnElement(Helper.locateElementByTestId("menu-item-plugin delete"));

  }

  @Then("Delete sink node through context menu")
  public void deleteSinkNodeThroughContextMenu() {
    Helper.rightClickOnElement(CdfStudioLocators.locatePluginNodeInCanvas("BigQuery Multi Table"));
    ElementHelper.clickOnElement(Helper.locateElementByTestId("menu-item-plugin delete"));
  }

  @Then("Verify export button is disabled")
  public void verifyExportButtonIsDisabled() {
    WebElement disabledExportBtn = Helper.locateElementByTestId("pipeline-export-btn");
    Assert.assertFalse(disabledExportBtn.isEnabled());
  }

  @Then("Undo the deletions")
  public void undoDeletions() {
    Commands.clickUndoButton();
    Commands.clickUndoButton();
    Commands.clickUndoButton();
  }

  @Then("Export and verify the pipeline has {int} connections and {int} stages")
  public void exportAndVerifyPipeline(int expectedConnections, int expectedStages) throws IOException {
    // Export
    pipelineName = "Test_Pipeline_" + UUID.randomUUID();
    Commands.fillInPipelineName(pipelineName);
    Commands.dismissTopBanner();
    ElementHelper.clickOnElement(Helper.locateElementByTestId("pipeline-export-btn"));
    // Wait for the download to finish
    Helper.waitSeconds(3);
    // Verify
    Reader reader = Files.newBufferedReader(Paths.get(
      Constants.DOWNLOADS_DIR + pipelineName + "-" + Constants.PIPELINE_TYPE + ".json"));
    JsonObject jsonObject = GSON.fromJson(reader, JsonObject.class);
    JsonArray stages = jsonObject.getAsJsonObject("config").getAsJsonArray("stages");
    JsonArray connections = jsonObject.getAsJsonObject("config").getAsJsonArray("connections");
    Assert.assertEquals(expectedStages, stages.size());
    Assert.assertEquals(expectedConnections, connections.size());
  }

  @Then("Right click on canvas")
  public void rightClickOnCanvas() {
    Helper.rightClickOnElement(Helper.locateElementByCssSelector("#dag-container"), 0, 200);
  }

  @Then("Ensure canvas context menu option {string} is displayed")
  public void checkMenuOptionsAreAvailable(String option) {
    Helper.isElementExists(Helper.getCssSelectorByDataTestId(canvasContextMenuHelperMap.get(option)));
  }

  @Then("Click on {string} from canvas context menu option")
  public void clickOnCanvasContextMenuOption(String option) {
    ElementHelper.clickOnElement(Helper.locateElementByTestId(canvasContextMenuHelperMap.get(option)));
    WaitHelper.waitForElementToBeHidden(Helper.locateElementByCssSelector(
      Helper.getCssSelectorByDataTestId(canvasContextMenuHelperMap.get(option))));
  }

  @Then("Verify {string} zoom level")
  public void verifyZoomLevel(String zoomLevel) {
    Assert.assertEquals(canvasContextMenuHelperMap.get(zoomLevel + "ZoomLevel"),
                        Helper.locateElementByCssSelector("#dag-container").getCssValue("transform"));
  }

  @Then("Verify complex pipeline nodes are visible")
  public void verifyComplexPipelineNodesAreVisible() {
    Assert.assertTrue(Commands.getNode(Commands.complexSourceNode1).isDisplayed());
    Assert.assertTrue(Commands.getNode(Commands.complexSourceNode2).isDisplayed());
    Assert.assertTrue(Commands.getNode(Commands.complexSinkNode1).isDisplayed());
    Assert.assertTrue(Commands.getNode(Commands.complexSinkNode2).isDisplayed());
  }

  @Then("Verify complex pipeline nodes are not visible")
  public void verifyComplexPipelineNodesAreNotVisible() {
    Assert.assertFalse(Commands.getNode(Commands.complexSourceNode1).isDisplayed());
    Assert.assertFalse(Commands.getNode(Commands.complexSourceNode2).isDisplayed());
    Assert.assertFalse(Commands.getNode(Commands.complexSinkNode1).isDisplayed());
    Assert.assertFalse(Commands.getNode(Commands.complexSinkNode2).isDisplayed());
  }

  @Then("Verify {string} option from canvas context menu is disabled")
  public void verifyCanvasContextMenuOptionIsDisabled(String option) {
    Assert.assertEquals("true",
                        Helper.locateElementByTestId(canvasContextMenuHelperMap.get(option))
                          .getAttribute("aria-disabled"));
  }

  @Then("Copy the source node to clipboard")
  public void copySourceNodeToClipboard() {
    Helper.rightClickOnElement(Commands.getNode(Commands.simpleSourceNode));
    ElementHelper.clickOnElement(Helper.locateElementByTestId("menu-item-plugin copy"));
    WaitHelper.waitForElementToBeHidden(Helper.locateElementByTestId("menu-item-plugin copy"));
  }

  @Then("Verify {string} option from canvas context menu is enabled")
  public void verifyCanvasContextMenuOptionIsEnabled(String option) {
    Assert.assertEquals("false",
                        Helper.locateElementByTestId(canvasContextMenuHelperMap.get(option))
                          .getAttribute("aria-disabled"));
  }

  @Then("Copy the source node to clipboard using hamburger menu")
  public void copySourceNodeToClipboardUsingHamburgerMenu() {
    String hamburgerSelector = "hamburgermenu-" + Commands.simpleSourceNode.getNodeName()
      + "-" + Commands.simpleSourceNode.getNodeType() + "-" + Commands.simpleSourceNode.getNodeId();
    ElementHelper.clickOnElement(Helper.locateElementByTestId(hamburgerSelector + "-toggle"));
    ElementHelper.clickOnElement(Helper.locateElementByTestId(hamburgerSelector + "-copy"));
  }

  @Then("Delete the newly added source node using hamburger menu")
  public void deleteNewSourceNodeUsingHamburgerMenu() {
    String newAddedSourceName = "BigQueryTable-batchsource-3";
    ElementHelper.clickOnElement(Helper.locateElementByTestId("hamburgermenu-" + newAddedSourceName + "-toggle"));
    ElementHelper.clickOnElement(Helper.locateElementByTestId("hamburgermenu-" + newAddedSourceName + "-delete"));
  }
}
