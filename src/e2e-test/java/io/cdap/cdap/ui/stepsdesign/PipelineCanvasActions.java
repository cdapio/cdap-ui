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

import io.cdap.cdap.ui.utils.Commands;
import io.cdap.cdap.ui.utils.Constants;
import io.cdap.cdap.ui.utils.Helper;
import io.cdap.e2e.utils.ElementHelper;
import io.cdap.e2e.utils.SeleniumDriver;
import io.cdap.e2e.utils.WaitHelper;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.junit.Assert;
import org.openqa.selenium.Alert;
import org.openqa.selenium.Keys;
import org.openqa.selenium.NoAlertPresentException;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.UnhandledAlertException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;

import java.util.List;

public class PipelineCanvasActions {

  @Then("Verify redo undo buttons are disabled")
  public void verifyRedoUndoButtonsAreDisabled() {
    WebElement undoSelector = Helper.locateElementByTestId("pipeline-undo-action-btn");
    WebElement redoSelector = Helper.locateElementByTestId("pipeline-redo-action-btn");

    Assert.assertFalse(undoSelector.isEnabled());
    Assert.assertFalse(redoSelector.isEnabled());
  }

  @Then("Create a simple pipeline")
  public void createASimplePipeline() {
    Commands.createSimplePipeline();
  }

  @Then("Verify redo button disabled but undo button enabled")
  public void verifyRedoUndoButtonsEnabled() {
    WebElement undoSelector = Helper.locateElementByTestId("pipeline-undo-action-btn");
    WebElement redoSelector = Helper.locateElementByTestId("pipeline-redo-action-btn");

    Assert.assertTrue(undoSelector.isEnabled());
    Assert.assertFalse(redoSelector.isEnabled());
  }

  @Then("Undo the connections")
  public void undoTheConnections() {
    for (int i = 0; i < 2; ++i) {
      Commands.clickUndoButton();
    }
  }

  @Then("Verify there's no pipeline connection")
  public void verifyThereSNoPipelineConnection() {
    List<WebElement> elements = Commands.findElementsByCssSelector(".jsplumb-connector");
    Assert.assertEquals(elements.size(), 0);
  }

  @Then("Redo one connection")
  public void redoOneConnection() {
    Commands.clickRedoButton();
  }

  @Then("Verify there's one connection")
  public void verifyThereSOneConnection() {
    List<WebElement> elements = Commands.findElementsByCssSelector(".jsplumb-connector");
    Assert.assertEquals(elements.size(), 1);
  }

  @Then("Undo everything")
  public void undoEverything() {
    for (int i = 0; i < 4; ++i) {
      Commands.clickUndoButton();
    }
  }

  @Then("Verify export button disabled")
  public void verifyExportButtonDisabled() {
    WebElement exportSelector = Helper.locateElementByTestId("pipeline-export-btn");

    Assert.assertFalse(exportSelector.isEnabled());
  }

  @Then("Redo everything")
  public void redoEverything() {
    for (int i = 0; i < 5; ++i) {
      Commands.clickRedoButton();
    }
  }

  @Then("Verify simple pipeline recovered")
  public void verifySimplePipelineRecovered() {
    WebElement exportSelector = Helper.locateElementByTestId("pipeline-export-btn");

    Assert.assertTrue(exportSelector.isEnabled());

    List<WebElement> elements = Commands.findElementsByCssSelector(".jsplumb-connector");
    Assert.assertEquals(elements.size(), 2);
  }

  @Then("Create a complex pipeline")
  public void createAComplexPipeline() {
    Commands.createComplexPipeline();
  }

  @Then("Verify sink nodes are visible")
  public void verifySinkNodesAreVisible() {
    WebElement sink1Selector = Helper.locateElementByTestId("plugin-node-BigQueryMultiTable-batchsink-7");
    WebElement sink2Selector = Helper.locateElementByTestId("plugin-node-BigQueryMultiTable-batchsink-6");

    Assert.assertTrue(sink1Selector.isDisplayed());
    Assert.assertTrue(sink2Selector.isDisplayed());
  }

  @Then("Zoom in seven times")
  public void zoomInFiveTimes() {
    for (int i = 0; i < 10; ++i) {
      Commands.clickZoomInButton();
    }
  }

  @Then("Verify sink nodes are invisible")
  public void verifySinkNodesAreInvisible() {
    WebElement sink1Selector = Helper.locateElementByTestId("plugin-node-BigQueryMultiTable-batchsink-7");
    WebElement sink2Selector = Helper.locateElementByTestId("plugin-node-BigQueryMultiTable-batchsink-6");

    Assert.assertFalse(sink1Selector.isDisplayed());
    Assert.assertFalse(sink2Selector.isDisplayed());
  }

  @Then("Click fit to screen")
  public void clickFitToScreen() {
    Commands.fitPipelineToScreen();
  }

  @Then("Move minimap")
  public void moveMinimap() {
    WebElement minimapViewportBoxSelector = Helper.locateElementByTestId("minimap-viewport-box");
    ElementHelper.dragAndDropByOffset(minimapViewportBoxSelector, 70, 60);
  }

  @Then("Verify source nodes are invisible")
  public void verifySourceNodesAreInvisible() {
    WebElement source1Selector = Helper.locateElementByTestId("plugin-node-Spanner-batchsource-0");
    WebElement source2Selector = Helper.locateElementByTestId("plugin-node-Spanner-batchsource-1");

    Assert.assertFalse(source1Selector.isDisplayed());
    Assert.assertFalse(source2Selector.isDisplayed());
  }

  @Then("Verify source nodes are visible")
  public void verifySourceNodesAreVisible() {
    WebElement source1Selector = Helper.locateElementByTestId("plugin-node-Spanner-batchsource-0");
    WebElement source2Selector = Helper.locateElementByTestId("plugin-node-Spanner-batchsource-1");

    Assert.assertTrue(source1Selector.isDisplayed());
    Assert.assertTrue(source2Selector.isDisplayed());
  }

  @Then("Use shift click to delete two transform nodes")
  public void useShiftClickToDeleteTwoTransformNodes() {
    WebElement transform1Selector = Helper.locateElementByTestId("plugin-node-name-JavaScript-transform-2");
    WebElement transform2Selector = Helper.locateElementByTestId("plugin-node-name-JavaScript-transform-3");

    Actions actions = new Actions(SeleniumDriver.getDriver());
    actions.keyDown(Keys.SHIFT)
      .click(transform1Selector)
      .click(transform2Selector)
      .keyUp(Keys.SHIFT)
      .sendKeys(Keys.DELETE)
      .build()
      .perform();
  }

  @Then("Verify transform nodes do not exist")
  public void verifyTransformNodesDoNotExist() {
    try {
      Helper.locateElementByTestId("plugin-node-JavaScript-transform-2");
    } catch (NoSuchElementException e) {
      // DO NOTHING
    }

    try {
      Helper.locateElementByTestId("plugin-node-JavaScript-transform-3");
    } catch (NoSuchElementException e) {
      // DO NOTHING
    }
  }

  @Then("Undo delete nodes")
  public void undoDeleteNodes() {
    Commands.clickUndoButton();
    Commands.clickUndoButton();

    WebElement transform1Selector = Helper.locateElementByTestId("plugin-node-JavaScript-transform-2");
    WebElement transform2Selector = Helper.locateElementByTestId("plugin-node-JavaScript-transform-3");

    Assert.assertTrue(transform1Selector.isDisplayed());
    Assert.assertTrue(transform2Selector.isDisplayed());
  }
}
