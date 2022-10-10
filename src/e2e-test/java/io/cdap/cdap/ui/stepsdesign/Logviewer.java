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

import io.cdap.cdap.ui.utils.Constants;
import io.cdap.cdap.ui.utils.Helper;
import io.cdap.e2e.pages.actions.CdfPipelineRunAction;
import io.cdap.e2e.utils.ElementHelper;
import io.cdap.e2e.utils.SeleniumDriver;
import io.cdap.e2e.utils.WaitHelper;
import io.cucumber.java.Before;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.junit.Assert;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebElement;

import java.util.List;

public class Logviewer {

  @Before
  public void copySourceFile() {
    Helper.copyFile(Constants.FIXTURES_DIR + "airports.csv", Constants.PIPELINE_FILES_DIR + "airports.csv");
  }

  @When("Deploy and test pipeline {string} with timestamp with pipeline JSON file {string}")
  public void deployAndTestPipeline(String pipelineName, String pipelineJSONfile) {
    Helper.deployAndTestPipeline(pipelineJSONfile, pipelineName + System.currentTimeMillis());
  }

  @Then("Check pipeline is running")
  public void isRunning() {
    WaitHelper.waitForElementToBeDisplayed(
      Helper.locateElementByCssSelector(Helper.getCssSelectorByDataTestId("Running"))
    );
  }

  @Then("Run Pipeline")
  public void runPipeline() {
    ElementHelper.clickOnElement(
      Helper.locateElementByCssSelector(Helper.getCssSelectorByDataTestId("pipeline-run-btn"))
    );
  }

  @Then("Click on log viewer button")
  public void clickLogViewer() {
    ElementHelper.clickOnElement(
      Helper.locateElementByCssSelector(Helper.getCssSelectorByDataTestId("log-viewer-btn-toggle"))
    );
    waitForLoading();
  }

  @Then("Log viewer container should exist")
  public void logViewerContainerShouldExist() {
    Assert.assertTrue(Helper.isElementExists(Helper.getCssSelectorByDataTestId("log-viewer")));
  }

  @Then("Scroll to latest should exist")
  public void scrollToLatestShouldExist() {
    Assert.assertTrue(Helper.isElementExists(Helper.getCssSelectorByDataTestId("scroll-to-latest")));
  }

  @Then("Scroll to latest should be disabled")
  public void scrollTolatestShouldBeDisabled() {
    Assert.assertFalse(
      Helper.locateElementByCssSelector(Helper.getCssSelectorByDataTestId("scroll-to-latest")).isEnabled());
  }

  @Then("Scroll to latest should be enabled")
  public void scrollTolatestShouldBeEnabled() {
    WaitHelper.waitForElementToBeEnabled(
      Helper.locateElementByCssSelector(Helper.getCssSelectorByDataTestId("scroll-to-latest")));
    Assert.assertTrue(
      Helper.locateElementByCssSelector(Helper.getCssSelectorByDataTestId("scroll-to-latest")).isEnabled());
  }

  @Then("Advanced logs should exist")
  public void advancedLogsShouldExist() {
    Assert.assertTrue(Helper.isElementExists(Helper.getCssSelectorByDataTestId("view-advanced-logs")));
  }

  @Then("Download should exist")
  public void downloadShouldExist() {
    Assert.assertTrue(Helper.isElementExists(Helper.getCssSelectorByDataTestId("download-all")));
  }

  @Then("Log viewer close should exist")
  public void logViewerCloseShouldExist() {
    Assert.assertTrue(Helper.isElementExists(Helper.getCssSelectorByDataTestId("log-viewer-close-btn")));
  }

  @Then("Click on log level toggle")
  public void clickLogLevelToggle() {
    WebElement element = Helper.locateElementByCssSelector(
      Helper.getCssSelectorByDataTestId("log-viewer-log-level-toggle")
    );
    WaitHelper.waitForElementToBeDisplayed(element);
    ElementHelper.clickOnElement(element);
  }

  @Then("Log level {string} should exist")
  public void logLevelItemShouldExist(String item) {
    Assert.assertTrue(Helper.isElementExists(Helper.getCssSelectorByDataTestId("log-level-row-" + item)));
  }

  @Then("Log level {string} checkmark should exist")
  public void logLevelItemCheckShouldExist(String item) {
    Assert.assertTrue(
      Helper.isElementExists(Helper.getCssSelectorByDataTestId("log-level-check"),
        Helper.locateElementByCssSelector(Helper.getCssSelectorByDataTestId("log-level-row-" + item))
      )
    );
  }

  @Then("Log level {string} checkmark should not exist")
  public void logLevelItemCheckShouldNotExist(String item) {
    Assert.assertFalse(
      Helper.isElementExists(Helper.getCssSelectorByDataTestId("log-level-check"),
        Helper.locateElementByCssSelector(Helper.getCssSelectorByDataTestId("log-level-row-" + item))
      )
    );
  }

  @Then("Log viewer content should contain message {string}")
  public void logViewerContentMessageExists(String message) {
    Assert.assertTrue(
      Helper.isElementExists(By.xpath("//*[contains(text(), '" + message + "')]"),
        Helper.locateElementByCssSelector(Helper.getCssSelectorByDataTestId("log-viewer-content"))
      )
    );
  }

  @Then("Log viewer content should not contain message {string}")
  public void logViewerContentMessageNotExists(String message) {
    Assert.assertFalse(
      Helper.isElementExists(By.xpath("//*[contains(text(), '" + message + "')]"),
        Helper.locateElementByCssSelector(Helper.getCssSelectorByDataTestId("log-viewer-content"))
      )
    );
  }

  @Then("Click on advanced logs")
  public void clickAdvancedLogs() {
    ElementHelper.clickOnElement(Helper.locateElementByCssSelector(
      Helper.getCssSelectorByDataTestId("view-advanced-logs")
    ));
    waitForLoading();
  }

  @Then("Click on log level {string}")
  public void clickLogLevelItem(String item) {
    ElementHelper.clickOnElement(Helper.locateElementByCssSelector(
      Helper.getCssSelectorByDataTestId("log-level-row-" + item)
    ));
    waitForLoading();
  }

  @Then("Log level popover should not show")
  public void logLevelPopoverShouldHide() {
    WaitHelper.waitForElementToBeHidden(Helper.locateElementByCssSelector(
      Helper.getCssSelectorByDataTestId("log-viewer-log-level-popover")
    ));
  }

  @Then("Scroll up to center")
  public void scrollUpToCenter() {
    JavascriptExecutor js = (JavascriptExecutor) SeleniumDriver.getDriver();
    WebElement element = Helper.locateElementByCssSelector(
      Helper.getCssSelectorByDataTestId("log-viewer-content")
    );
    js.executeScript("arguments[0].scrollBy(0, -1500);", element);
    waitForLoading();
  }

  @Then("Debug message should update")
  public void debugMessageShouldUpdate() {
    List<WebElement> rows = SeleniumDriver.getDriver().findElements(
      By.cssSelector(Helper.getCssSelectorByDataTestId("log-viewer-row"))
    );
    String message = rows.get(rows.size() - 1).findElement(
      By.cssSelector(Helper.getCssSelectorByDataTestId("log-message"))
    ).getText();
    // wait for debug message to update
    Helper.waitSeconds(10);
    clickScrollToLatest();
    List<WebElement> newRows = SeleniumDriver.getDriver().findElements(
      By.cssSelector(Helper.getCssSelectorByDataTestId("log-viewer-row"))
    );
    String newMessage = newRows.get(newRows.size() - 1).findElement(
      By.cssSelector(Helper.getCssSelectorByDataTestId("log-message"))
    ).getText();
    Assert.assertTrue(!message.equals(newMessage));
  }

  @Then("Click on scroll to latest button")
  public void clickScrollToLatest() {
    ElementHelper.clickOnElement(
      Helper.locateElementByCssSelector(Helper.getCssSelectorByDataTestId("scroll-to-latest"))
    );
    waitForLoading();
  }

  @Then("Previous logs should show")
  public void previousLogsShouldShow() {
    JavascriptExecutor js = (JavascriptExecutor) SeleniumDriver.getDriver();
    List<WebElement> rows = SeleniumDriver.getDriver().findElements(
      By.cssSelector(Helper.getCssSelectorByDataTestId("log-viewer-row"))
    );
    String message = rows.get(0).findElement(
      By.cssSelector(Helper.getCssSelectorByDataTestId("log-message"))
    ).getText();
    WebElement element = Helper.locateElementByCssSelector(
      Helper.getCssSelectorByDataTestId("log-viewer-content")
    );
    js.executeScript("arguments[0].scrollBy(0, -1500);", element);
    waitForLoading();
    js.executeScript("arguments[0].scrollBy(0, -5000);", element);
    Helper.waitSeconds(5);
    List<WebElement> newRows = SeleniumDriver.getDriver().findElements(
      By.cssSelector(Helper.getCssSelectorByDataTestId("log-viewer-row"))
    );
    String newMessage = newRows.get(0).findElement(
      By.cssSelector(Helper.getCssSelectorByDataTestId("log-message"))
    ).getText();
    Assert.assertTrue(!message.equals(newMessage));
  }

  public void waitForLoading() {
    if (Helper.isElementExists(Helper.getCssSelectorByDataTestId("loading-indicator"))) {
      WaitHelper.waitForElementToBeHidden(
        Helper.locateElementByCssSelector(Helper.getCssSelectorByDataTestId("loading-indicator"))
      );
    }
  }
}
