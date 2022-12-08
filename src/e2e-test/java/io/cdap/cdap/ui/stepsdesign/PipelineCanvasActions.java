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
import io.cdap.cdap.ui.utils.Helper;
import io.cdap.e2e.utils.ElementHelper;
import io.cdap.e2e.utils.SeleniumDriver;
import io.cucumber.java.en.Then;
import org.junit.Assert;
import org.openqa.selenium.Keys;
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
  public void verifyThereIsNoPipelineConnection() {
    List<WebElement> elements = Commands.findElementsByCssSelector(".jsplumb-connector");
    Assert.assertEquals(elements.size(), 0);
  }

  @Then("Redo one connection")
  public void redoOneConnection() {
    Commands.clickRedoButton();
  }

  @Then("Verify there's one connection")
  public void verifyThereIsOneConnection() {
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

  @Then("Verify sink nodes are visible")
  public void verifySinkNodesAreVisible() {
    Assert.assertTrue(Commands.getNode(Commands.complexSinkNode1).isDisplayed());
    Assert.assertTrue(Commands.getNode(Commands.complexSinkNode2).isDisplayed());
  }

  @Then("Verify sink nodes are invisible")
  public void verifySinkNodesAreInvisible() {
    Assert.assertFalse(Commands.getNode(Commands.complexSinkNode1).isDisplayed());
    Assert.assertFalse(Commands.getNode(Commands.complexSinkNode2).isDisplayed());
  }

  @Then("Move minimap")
  public void moveMinimap() {
    WebElement minimapViewportBoxSelector = Helper.locateElementByTestId("minimap-viewport-box");
    ElementHelper.dragAndDropByOffset(minimapViewportBoxSelector, 70, 60);
  }

  @Then("Verify source nodes are invisible")
  public void verifySourceNodesAreInvisible() {
    Assert.assertFalse(Commands.getNode(Commands.complexSourceNode1).isDisplayed());
    Assert.assertFalse(Commands.getNode(Commands.complexSourceNode2).isDisplayed());
  }

  @Then("Verify source nodes are visible")
  public void verifySourceNodesAreVisible() {
    Assert.assertTrue(Commands.getNode(Commands.complexSourceNode1).isDisplayed());
    Assert.assertTrue(Commands.getNode(Commands.complexSourceNode2).isDisplayed());
  }

  @Then("Use shift click to delete two transform nodes")
  public void useShiftClickToDeleteTwoTransformNodes() {
    WebElement transform1Selector = Helper.locateElementByCssSelector(
      Helper.getNodeNameSelectorFromNodeIdentifier(Commands.complexTransformNode1)
    );
    WebElement transform2Selector = Helper.locateElementByCssSelector(
      Helper.getNodeNameSelectorFromNodeIdentifier(Commands.complexTransformNode2)
    );
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
    Assert.assertFalse(Helper.isElementExists(
      Helper.getNodeSelectorFromNodeIdentifier(Commands.complexTransformNode1)));
    Assert.assertFalse(Helper.isElementExists(
      Helper.getNodeSelectorFromNodeIdentifier(Commands.complexTransformNode2)));
  }

  @Then("Undo delete nodes")
  public void undoDeleteNodes() {
    Commands.clickUndoButton();
    Commands.clickUndoButton();
    
    Assert.assertTrue(Commands.getNode(Commands.complexTransformNode1).isDisplayed());
    Assert.assertTrue(Commands.getNode(Commands.complexTransformNode2).isDisplayed());
  }
}
