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

import io.cdap.cdap.ui.types.NodeInfo;
import io.cdap.cdap.ui.utils.Commands;
import io.cdap.cdap.ui.utils.Constants;
import io.cdap.cdap.ui.utils.Helper;
import io.cdap.e2e.pages.actions.CdfPluginPropertiesActions;
import io.cdap.e2e.pages.actions.CdfStudioActions;
import io.cdap.e2e.utils.ElementHelper;
import io.cdap.e2e.utils.SeleniumDriver;
import io.cdap.e2e.utils.WaitHelper;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.junit.Assert;
import org.openqa.selenium.Alert;
import org.openqa.selenium.By;
import org.openqa.selenium.NoAlertPresentException;
import org.openqa.selenium.UnhandledAlertException;
import org.openqa.selenium.WindowType;

public class CommonSteps {

  @When("Open CDAP main page")
  public void openCdap() {
    SeleniumDriver.openPage(Constants.CDAP_URL);
    WaitHelper.waitForPageToLoad();
  }

  @When("Open Pipeline Studio Page")
  public void openPipelineStudioPage() {
    try {
      tryOpenStudioPage();
    } catch (UnhandledAlertException e) {
      try {
        Alert alert = SeleniumDriver.getDriver().switchTo().alert();
        alert.accept();
      } catch (NoAlertPresentException ex) {
        SeleniumDriver.getDriver().switchTo().newWindow(WindowType.TAB);
        tryOpenStudioPage();
      }
    }
    // wait for rendering to finish otherwise elements are not attached to dom
    Helper.waitSeconds(4);
  }

  private static void tryOpenStudioPage() {
    SeleniumDriver.openPage(Constants.PIPELINE_STUDIO_URL);
    WaitHelper.waitForPageToLoad();
    Helper.setNewSchemaEditor(false);
  }

  @When("Toggle Transform Panel")
  public static void toggleTransformPanel() {
    ElementHelper.clickOnElement(Helper.locateElementByTestId("plugin-Transform-group-summary"));
  }

  @When("Open Connections Page")
  public static void openConnectionsPage() {
    SeleniumDriver.openPage(Constants.BASE_STUDIO_URL + "connections");
    WaitHelper.waitForPageToLoad();
  }

  @When("Open Configuration Page")
  public void openConfigurationPage() {
    SeleniumDriver.openPage(Constants.CONFIGURATION_URL);
    WaitHelper.waitForPageToLoad();
  }

  @When("Open Source Control Management Page")
  public void openSourceControlManagementPage() {
    SeleniumDriver.openPage(Constants.SOURCE_CONTROL_MANAGEMENT_URL);
    WaitHelper.waitForPageToLoad();
  }

  @When("Open Source Control Sync Page")
  public void openRemotePipelinesPage() {
    SeleniumDriver.openPage(Constants.SOURCE_CONTROL_SYNC_URL);
    WaitHelper.waitForPageToLoad();
  }

  @When("Create a simple pipeline")
  public void createSimplePipeline() {
    Commands.createSimplePipeline();
  }

  @When("Upload pipeline from file {string}")
  public void uploadPipelineFromFile(String filename) {
    Helper.uploadPipelineFromFile(filename);
  }

  @When("Enter preview mode")
  public void enterPreviewMode() {
    ElementHelper.clickOnElement(Helper.locateElementByTestId("pipeline-preview-btn"));
  }

  @When("Start preview run")
  public void startPreviewRun() {
    ElementHelper.clickOnElement(Helper.locateElementByTestId("preview-top-run-btn"));
  }

  @Then("Create a complex pipeline")
  public void createComplexPipeline() {
    Commands.createComplexPipeline();
  }

  @Then("Open {string} panel")
  public void openPluginGroupPanel(String pluginGroupName) {
    Commands.openPluginGroupPanel(pluginGroupName);
  }

  @Then("Close {string} panel")
  public void closePluginGroupPanel(String pluginGroupName) {
    Commands.closePluginGroupPanel(pluginGroupName);
  }

  @Then("Cleanup pipeline graph control")
  public void cleanupPipelineGraphControl() {
    Commands.pipelineCleanUpGraphControl();
  }

  @Then("Zoom in ten times on pipeline canvas")
  public void zoomInTenTimes() {
    for (int i = 0; i < 10; ++i) {
      Commands.clickZoomInButton();
    }
  }

  @Then("Fit pipeline to screen")
  public void fitPipelineToScreen() {
    Commands.fitPipelineToScreen();
  }

  @Then("Open {string} node property")
  public void openNodeProperty(String nodeName) {
    CdfStudioActions.navigateToPluginPropertiesPage(nodeName);
  }

  @Then("Open source node property in simple pipeline")
  public void openSourceNodeProperty() {
    ElementHelper.hoverOverElement(Commands.getNode(Commands.simpleSourceNode));
    WaitHelper.waitForElementToBeDisplayed(Helper.locateElementByTestId("node-properties-btn"));
    ElementHelper.clickOnElement(Helper.locateElementByTestId("node-properties-btn"));
  }

  @Then("Open transform node property in simple pipeline")
  public void openTransformNodeProperty() {
    ElementHelper.hoverOverElement(Commands.getNode(Commands.simpleTransformNode));
    WaitHelper.waitForElementToBeDisplayed(Helper.locateElementByTestId("node-properties-btn"));
    ElementHelper.clickOnElement(Helper.locateElementByTestId("node-properties-btn"));
  }

  @Then("Open sink node property in simple pipeline")
  public void openSinkNodeProperty() {
    ElementHelper.hoverOverElement(Commands.getNode(Commands.simpleSinkNode));
    WaitHelper.waitForElementToBeDisplayed(Helper.locateElementByTestId("node-properties-btn"));
    ElementHelper.clickOnElement(Helper.locateElementByTestId("node-properties-btn"));
  }

  @Then("Close node property")
  public void closeNodeProperty() {
    ElementHelper.clickOnElement(Helper.locateElementByTestId("close-config-popover"));
  }

  @Then("Click on \"Get Schema\" button")
  public void getSchema() {
    CdfPluginPropertiesActions.clickGetSchemaButton();
  }

  @Then("Run the pipeline")
  public void runPipeline() {
    ElementHelper.clickOnElement(Helper.locateElementByTestId("pipeline-run-btn"));
  }

  @Then("Deployed pipeline status is {string}")
  public void deployedPipelineStatusIsString(String status) {
    WaitHelper.waitForElementToBePresent(
      By.cssSelector(Helper.getCssSelectorByDataTestId(status)));
  }

  @Then("Export the pipeline")
  public void exportPipeline() {
    ElementHelper.clickOnElement(Helper.locateElementByTestId("pipeline-export-btn"));
    // Wait for the download to finish
    Helper.waitSeconds(3);
  }

  @Then("Pipeline banner is shown with message {string}")
  public void pipelineBannerIsShownWithMessage(String message) {
    WaitHelper.waitForElementToBeDisplayed(Helper.locateElementByTestId("valium-banner-hydrator"));
    Assert.assertTrue(
      ElementHelper.getElementText(Helper.locateElementByTestId("valium-banner-hydrator")).contains(message));
  }

  @Then("Cleanup pipeline {string}")
  public void cleanupPipeline(String pipelineName) {
    Helper.cleanupPipelines(pipelineName);
  }

  @Then("Visit pipeline {string}")
  public void visitPipeline(String pipelineName) {
    Helper.gotoDeployedPipeline(pipelineName);
  }

  @Then("Reload the page")
  public void reloadPage() {
    Helper.reloadPage();
  }

  @Then("Exit Studio Page")
  public void exitStudioPage() {
    SeleniumDriver.openPage(Constants.BASE_URL);
    Commands.dismissStudioLeaveConfirmationModal();
    WaitHelper.waitForPageToLoad();
  }

  @Then("Save draft and navigate to draft list")
  public void saveDraftAndNavigate() {
    ElementHelper.clickOnElement(Helper.locateElementByTestId("pipeline-draft-save-btn"));
    try {
      SeleniumDriver.openPage(Constants.PIPELINE_DRAFTS_URL);
      WaitHelper.waitForPageToLoad();
    } catch (UnhandledAlertException e) {
      try {
        Alert alert = SeleniumDriver.getDriver().switchTo().alert();
        alert.accept();
      } catch (NoAlertPresentException ex) {
        SeleniumDriver.getDriver().switchTo().newWindow(WindowType.TAB);
        SeleniumDriver.openPage(Constants.PIPELINE_DRAFTS_URL);
        WaitHelper.waitForPageToLoad();
      }
    }
  }

  @When("Open pipeline list page")
  public void openPipelineList() {
    SeleniumDriver.openPage(Constants.PIPELINE_LIST_URL);
    WaitHelper.waitForPageToLoad();
  }

  @When("Open pipeline draft list page")
  public void openPipelineDraftList() {
    SeleniumDriver.openPage(Constants.PIPELINE_DRAFTS_URL);
    WaitHelper.waitForPageToLoad();
  }

  @Then("Open pipeline configure")
  public void openPipelineConfigure() {
    ElementHelper.clickOnElement(Helper.locateElementByTestId("pipeline-configure-btn"));
  }

  @Then("Click on {string} tab in pipeline configure")
  public void clickConfigureTab(String tabName) {
    // Available names: 'Pipeline config', 'Compute config', 'Engine config', 'Transformation Pushdown', 'Resources',
    // 'Pipeline alert'
    ElementHelper.clickOnElement(Helper.locateElementByTestId("tab-head-" + tabName));
  }

  @Then("Toggle instrumentation settings in pipeline config")
  public void toggleInstrumentation() {
    ElementHelper.clickOnElement(Helper.locateElementByTestId(
      "switch-null", Helper.locateElementByTestId("tab-content-Pipeline config")));
  }

  @Then("Save pipeline configure")
  public void savePipelineConfigure() {
    ElementHelper.clickOnElement(Helper.locateElementByTestId("config-apply-close"));
  }

  @Then("Go to pipeline {string} details")
  public void openPipelineDetails(String pipelineName) {
    ElementHelper.clickOnElement(Helper.locateElementByTestId("deployed-" + pipelineName));
  }

  @Then("Add Projection node to canvas")
  public void addProjectionNodeToCanvas() {
    NodeInfo projectionNode = new NodeInfo("Projection", "transform", "0");
    Commands.addNodeToCanvas(projectionNode);
  }

  @Then("Open Projection node properties")
  public void openProjectionNodeProperties() {
    NodeInfo projectionNode = new NodeInfo("Projection", "transform", "0");
    CdfStudioActions.navigateToPluginPropertiesPage(projectionNode.getNodeName());
  }

  @Then("Close Projection node properties")
  public void closeProjectionNodeProperties() {
    Commands.closeConfigPopover();
  }
}
