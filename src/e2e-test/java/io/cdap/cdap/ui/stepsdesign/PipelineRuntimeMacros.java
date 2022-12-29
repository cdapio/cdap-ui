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
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.junit.Assert;
import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebElement;

import java.util.List;

public class PipelineRuntimeMacros {

  @Then("Preview runtime arguments dialog is shown")
  public void runtimeArgumentsDialogIsShown() {
    Assert.assertTrue(ElementHelper.isElementDisplayed(
      By.cssSelector(Helper.getCssSelectorByDataTestId("runtimeargs-preview")),
      2));
  }

  @Then("Preview runtime argument row {string} key is disabled")
  public void runtimeArgumentRowIntKeyIsDisabled(String index) {
    WebElement rowKeyElement = Helper.locateElementByCssSelector(
      Helper.getCssSelectorByDataTestId(Constants.RUNTIME_ARGS_PREVIEW_SELECTOR) + " " +
      Helper.getCssSelectorByDataTestId(index) + " " +
      Helper.getCssSelectorByDataTestId(Constants.RUNTIME_ARGS_KEY_SELECTOR) +  " input"
    );
    Assert.assertFalse(rowKeyElement.isEnabled());
  }

  @Then("Preview runtime argument row {string} key field is {string}")
  public void runtimeArgumentRowIntKeyFieldIsString(String index, String fieldValue) {
    WebElement keyFieldElement = Helper.locateElementByCssSelector(
      Helper.getCssSelectorByDataTestId(Constants.RUNTIME_ARGS_PREVIEW_SELECTOR) + " " +
      Helper.getCssSelectorByDataTestId(index) + " " +
      Helper.getCssSelectorByDataTestId(Constants.RUNTIME_ARGS_KEY_SELECTOR) + " input"
    );
    Assert.assertEquals(fieldValue, ElementHelper.getElementAttribute(keyFieldElement, "value"));
  }

  @Then("Preview runtime argument row {string} value field is {string}")
  public void runtimeArgumentRowIntValueFieldIsString(String index, String fieldValue) {
    WebElement valueFieldElement = Helper.locateElementByCssSelector(
      Helper.getCssSelectorByDataTestId(Constants.RUNTIME_ARGS_PREVIEW_SELECTOR) + " " +
      Helper.getCssSelectorByDataTestId(index) + " " +
      Helper.getCssSelectorByDataTestId(Constants.RUNTIME_ARGS_VALUE_SELECTOR) + " textarea"
    );
    Assert.assertEquals(fieldValue, ElementHelper.getElementAttribute(valueFieldElement, "value"));
  }

  @Then("Preview runtime argument row {string} does not exist")
  public void runtimeArgumentRowIntDoesNotExist(String index) {
    try {
      WebElement rowEl = Helper.locateElementByCssSelector(
        Helper.getCssSelectorByDataTestId(Constants.RUNTIME_ARGS_PREVIEW_SELECTOR) + " " +
        Helper.getCssSelectorByDataTestId(index) + " " +
        Helper.getCssSelectorByDataTestId(Constants.RUNTIME_ARGS_KEY_SELECTOR));
      Assert.assertFalse(ElementHelper.isElementDisplayed(rowEl));
    } catch (NoSuchElementException e) {
      // Do nothing; this is the expected outcome
    }
  }

  @When("Add a preview runtime argument from row {string}")
  public void addARuntimeArgumentFromRowInt(String index) {
    ElementHelper.clickOnElement(Helper.locateElementByCssSelector(
      Helper.getCssSelectorByDataTestId(Constants.RUNTIME_ARGS_PREVIEW_SELECTOR) + " " +
      Helper.getCssSelectorByDataTestId(index) + " " +
      Helper.getCssSelectorByDataTestId("add-row")
    ));
  }

  @When("Enter preview runtime argument key {string} in row {string}")
  public void enterRuntimeArgumentKeyStringInRowInt(String key, String index) {
    ElementHelper.sendKeys(Helper.locateElementByCssSelector(
      Helper.getCssSelectorByDataTestId(Constants.RUNTIME_ARGS_PREVIEW_SELECTOR) + " " +
      Helper.getCssSelectorByDataTestId(index) + " " +
      Helper.getCssSelectorByDataTestId(Constants.RUNTIME_ARGS_KEY_SELECTOR) + " input"), key);
  }

  @When("Delete preview runtime argument row {string}")
  public void deleteRuntimeArgumentRowInt(String index) {
    ElementHelper.clickOnElement(Helper.locateElementByCssSelector(
      Helper.getCssSelectorByDataTestId(Constants.RUNTIME_ARGS_PREVIEW_SELECTOR) + " " +
      Helper.getCssSelectorByDataTestId(index) + " " +
      Helper.getCssSelectorByDataTestId("remove-row")
    ));
  }

  @When("Enter preview runtime argument value {string} in row {string}")
  public void enterRuntimeArgumentValueStringInRowInt(String value, String index) {
    ElementHelper.sendKeys(Helper.locateElementByCssSelector(
      Helper.getCssSelectorByDataTestId(Constants.RUNTIME_ARGS_PREVIEW_SELECTOR) + " " +
      Helper.getCssSelectorByDataTestId(index) + " " +
      Helper.getCssSelectorByDataTestId(Constants.RUNTIME_ARGS_VALUE_SELECTOR) + " textarea"), value);
  }

  @When("Click run button from preview runtime arguments")
  public void clickRunButtonFromRuntimeArguments() {
    ElementHelper.clickOnElement(Helper.locateElementByTestId("preview-configure-run-btn"));
  }

  @Then("Deployed runtime arguments dialog is shown")
  public void deployedRuntimeArgumentsDialogIsShown() {
    Assert.assertTrue(ElementHelper.isElementDisplayed(
      By.cssSelector(Helper.getCssSelectorByDataTestId("runtime-args-modeless")),
      2));
  }

  @When("Run down arrow is clicked")
  public void runDownArrowIsClicked() {
    ElementHelper.clickOnElement(Helper.locateElementByTestId("arrow-btn-container"));
    WaitHelper.waitForElementToBePresent(
      By.cssSelector(Helper.getCssSelectorByDataTestId("runtime-args-modeless")));
  }

  @When("Deployed run button is clicked")
  public void deployedRunButtonIsClicked() {
    ElementHelper.clickOnElement(Helper.locateElementByTestId("run-deployed-pipeline-modal-btn"));
  }

  @Then("Deployed pipeline status is {string}")
  public void deployedPipelineStatusIsString(String status) {
    WaitHelper.waitForElementToBePresent(
      By.cssSelector(Helper.getCssSelectorByDataTestId(status)));
  }

  @When("Close the runtime argument dialog")
  public void closeTheRuntimeArgumentDialog() {
    ElementHelper.clickOnElement(Helper.locateElementByTestId("pipeline-modeless-close-btn"));
    WebElement dialog = Helper.locateElementByTestId(Constants.RUNTIME_ARGS_DEPLOYED_SELECTOR);
    WaitHelper.waitForElementToBeHidden(dialog);
  }

  @Given("No pipelines are deployed")
  public void noPipelinesAreDeployed() {
    Helper.openPage(Constants.PIPELINE_LIST_URL);

    List<WebElement> nameEls = Commands.findElementsByCssSelector(Helper.getCssSelectorByDataTestId("pipeline-name"));
    for (WebElement curEl : nameEls) {
      String pipelineName = curEl.getAttribute("title");
      Helper.cleanupPipelines(pipelineName);
    }
  }

  @Then("Deployed runtime argument row {string} key is disabled")
  public void deployedRuntimeArgumentRowIntKeyIsDisabled(String index) {
    WebElement rowKeyElement = Helper.locateElementByCssSelector(
      Helper.getCssSelectorByDataTestId(Constants.RUNTIME_ARGS_DEPLOYED_SELECTOR) + " " +
      Helper.getCssSelectorByDataTestId(index) + " " +
      Helper.getCssSelectorByDataTestId(Constants.RUNTIME_ARGS_KEY_SELECTOR) +  " input"
    );
    Assert.assertFalse(rowKeyElement.isEnabled());
  }

  @Then("Deployed runtime argument row {string} key field is {string}")
  public void deployedRuntimeArgumentRowIntKeyFieldIsString(String index, String fieldValue) {
    WebElement keyFieldElement = Helper.locateElementByCssSelector(
      Helper.getCssSelectorByDataTestId(Constants.RUNTIME_ARGS_DEPLOYED_SELECTOR) + " " +
      Helper.getCssSelectorByDataTestId(index) + " " +
      Helper.getCssSelectorByDataTestId(Constants.RUNTIME_ARGS_KEY_SELECTOR) + " input"
    );
    Assert.assertEquals(fieldValue, keyFieldElement.getAttribute("value"));
  }

  @Then("Deployed runtime argument row {string} value field is {string}")
  public void deployedRuntimeArgumentRowIntValueFieldIsString(String index, String fieldValue) {
    WebElement valueFieldElement = Helper.locateElementByCssSelector(
      Helper.getCssSelectorByDataTestId(Constants.RUNTIME_ARGS_DEPLOYED_SELECTOR) + " " +
      Helper.getCssSelectorByDataTestId(index) + " " +
      Helper.getCssSelectorByDataTestId(Constants.RUNTIME_ARGS_VALUE_SELECTOR) + " textarea"
    );
    Assert.assertEquals(fieldValue, ElementHelper.getElementText(valueFieldElement));
  }

  @Then("Deployed runtime argument row {string} does not exist")
  public void deployedRuntimeArgumentRowIntDoesNotExist(String index) {
    try {
      WebElement rowEl = Helper.locateElementByCssSelector(
        Helper.getCssSelectorByDataTestId(Constants.RUNTIME_ARGS_DEPLOYED_SELECTOR) + " " +
        Helper.getCssSelectorByDataTestId(index) + " " +
        Helper.getCssSelectorByDataTestId(Constants.RUNTIME_ARGS_KEY_SELECTOR));
      Assert.assertFalse(ElementHelper.isElementDisplayed(rowEl));
    } catch (NoSuchElementException e) {
      // Do nothing; this is the expected outcome
    }
  }

  @When("Add a deployed runtime argument from row {string}")
  public void addADeployedRuntimeArgumentFromRowInt(String index) {
    ElementHelper.clickOnElement(Helper.locateElementByCssSelector(
      Helper.getCssSelectorByDataTestId(Constants.RUNTIME_ARGS_DEPLOYED_SELECTOR) + " " +
      Helper.getCssSelectorByDataTestId(index) + " " +
      Helper.getCssSelectorByDataTestId("add-row")
    ));
  }

  @When("Enter deployed runtime argument key {string} in row {string}")
  public void enterDeployedRuntimeArgumentKeyStringInRowInt(String key, String index) {
    ElementHelper.sendKeys(Helper.locateElementByCssSelector(
      Helper.getCssSelectorByDataTestId(Constants.RUNTIME_ARGS_DEPLOYED_SELECTOR) + " " +
      Helper.getCssSelectorByDataTestId(index) + " " +
      Helper.getCssSelectorByDataTestId(Constants.RUNTIME_ARGS_KEY_SELECTOR) + " input"), key);
  }

  @When("Delete deployed runtime argument row {string}")
  public void deleteDeployedRuntimeArgumentRowInt(String index) {
    ElementHelper.clickOnElement(Helper.locateElementByCssSelector(
      Helper.getCssSelectorByDataTestId(Constants.RUNTIME_ARGS_DEPLOYED_SELECTOR) + " " +
      Helper.getCssSelectorByDataTestId(index) + " " +
      Helper.getCssSelectorByDataTestId("remove-row")
    ));
    Helper.waitSeconds(1);
  }

  @When("Enter deployed runtime argument value {string} in row {string}")
  public void enterDeployedRuntimeArgumentValueStringInRowInt(String value, String index) {
    ElementHelper.sendKeys(Helper.locateElementByCssSelector(
      Helper.getCssSelectorByDataTestId(Constants.RUNTIME_ARGS_DEPLOYED_SELECTOR) + " " +
      Helper.getCssSelectorByDataTestId(index) + " " +
      Helper.getCssSelectorByDataTestId(Constants.RUNTIME_ARGS_VALUE_SELECTOR) + " textarea"), value);
  }

  @When("Save deployed arguments button is clicked")
  public void saveDeployedArgumentsButtonIsClicked() {
    ElementHelper.clickOnElement(Helper.locateElementByTestId("save-runtime-args-btn"));
  }

  @When("Wait for runtime arguments dialog to close")
  public void waitForRuntimeArgumentsDialogToClose() {
    WebElement dialog = Helper.locateElementByTestId(Constants.RUNTIME_ARGS_DEPLOYED_SELECTOR);
    WaitHelper.waitForElementToBeHidden(dialog);
  }

  @Then("Deployed runtime arguments dialog shows message {string}")
  public void deployedRuntimeArgumentsDialogShowsMessageString(String message) {
    Assert.assertTrue(
      ElementHelper.getElementText(Helper.locateElementByTestId("pipeline-runtime-args-error")).contains(message));
  }
}
