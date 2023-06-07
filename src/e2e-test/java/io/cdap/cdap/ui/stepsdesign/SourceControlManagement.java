/*
 * Copyright © 2023 Cask Data, Inc.
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
import io.cdap.e2e.utils.PluginPropertyUtils;
import io.cdap.e2e.utils.WaitHelper;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.junit.Assert;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

/**
 *
 */
public class SourceControlManagement {
  private static final int ALERT_DISPLAY_TIMEOUT = 7;

  @Then("Click on \"Link Repository\" button")
  public void openAddRepositoryButton() {
    ElementHelper.clickOnElement(Helper.locateElementByTestId("link-repository-button"));
  }

  private void addRepoUrl(String repoUrl) {
    WebElement repoUrlInput = Helper.locateElementByTestId("repoUrl");
    ElementHelper.clearElementValue(repoUrlInput);
    ElementHelper.sendKeys(repoUrlInput, repoUrl);
  }

  private void addTokenName(String tokenName) {
    WebElement profileLabelInput = Helper.locateElementByTestId("tokenName");
    ElementHelper.clearElementValue(profileLabelInput);
    ElementHelper.sendKeys(profileLabelInput, tokenName);
  }

  private void addToken(String token) {
    WebElement profileLabelInput = Helper.locateElementByTestId("token");
    ElementHelper.clearElementValue(profileLabelInput);
    ElementHelper.sendKeys(profileLabelInput, token);
  }

  private void addPathPrefix(String path) {
    WebElement input = Helper.locateElementByTestId("pathPrefix");
    ElementHelper.clearElementValue(input);
    ElementHelper.sendKeys(input, path);
  }

  private void addDefaultBranch(String branch) {
    WebElement input = Helper.locateElementByTestId("defaultBranch");
    ElementHelper.clearElementValue(input);
    ElementHelper.sendKeys(input, branch);
  }

  @Then("Click on \"Validate\" button")
  public void clickOnValidateButton() {
    ElementHelper.clickOnElement(Helper.locateElementByTestId("validate-repo-config-button"));
  }

  @Then("Verify {string} message in validation")
  public void verifyAlertMessageInValidation(String alertMessage) {
    WaitHelper.waitForElementToBeDisplayed(Helper.locateElementByTestId("alert"));
    Assert.assertTrue(Helper.locateElementByTestId("alert").getText().contains(alertMessage));
    ElementHelper.clickOnElement(Helper.locateElementByTestId("alert-close"));
  }

  @Then("Click on \"Save and Close\" button")
  public void clickOnSaveButton() {
    ElementHelper.clickOnElement(Helper.locateElementByTestId("save-repo-config-button"));
  }

  @Then("Verify saved fake repo config")
  public void verifySavedRepoConfig() {
    WaitHelper.waitForElementToBeDisplayed(Helper.locateElementByTestId("actions-popover"));
    Assert.assertTrue(Helper.locateElementByTestId("repository-provider").getText().contains("GITHUB"));
    Assert.assertTrue(Helper.locateElementByTestId("repository-link").getText().contains(Constants.FAKE_REPO_LINK));
    Assert.assertTrue(Helper.locateElementByTestId("repository-auth-type").getText().contains("PAT"));
    Assert.assertTrue(Helper.locateElementByTestId("repository-auth-token")
        .findElement(By.cssSelector("input")).getAttribute("value")
        .contains(Constants.FAKE_TOKEN));
  }

  @Then("Delete the repo config")
  public void deleteTheRepoConfig() {
    ElementHelper.clickOnElement(Helper.locateElementByTestId("actions-popover"));
    ElementHelper.clickOnElement(Helper.locateElementByTestId("Delete-on-popover"));
    ElementHelper.clickOnElement(Helper.locateElementByTestId("Delete"));
  }

  @Then("Add fake repository configuration")
  public void addFakeRepositoryConfiguration() {
    addRepoUrl(Constants.FAKE_REPO_LINK);
    addTokenName(Constants.FAKE_TOKEN_NAME);
    addToken(Constants.FAKE_TOKEN);
  }

  @Then("Add test repository configuration")
  public void addTestRepositoryConfiguration() {
    addRepoUrl(PluginPropertyUtils.pluginProp(Constants.GIT_REPO_URL_PROP_NAME));
    addTokenName(Constants.FAKE_TOKEN_NAME);
    addToken(PluginPropertyUtils.pluginProp(Constants.GIT_PAT_PROP_NAME));
  }

  @Then("Add created test branch")
  public void addCreatedTestBranch() {
    addDefaultBranch(PluginPropertyUtils.pluginProp(Constants.GIT_BRANCH_PROP_NAME));
  }

  @Then("Add non-existing branch")
  public void addNonExistingBranch() {
    addDefaultBranch(Constants.NON_EXISTS_DEFAULT_BRANCH);
  }

  @Then("Verify UI directed to initial page")
  public void verifyUIDirectedToInitialPage() {
    Assert.assertTrue(Helper.locateElementByTestId("link-repository-button").isDisplayed());
  }

  @Then("Click push button in Actions dropdown")
  public void clickPushAction () {
    ElementHelper.clickOnElement(Helper.locateElementByTestId("pipeline-actions-btn"));
    ElementHelper.clickOnElement(Helper.locateElementByTestId("push-pipeline"));
  }

  @Then("Click pull button in Actions dropdown")
  public void clickPullAction() {
    ElementHelper.clickOnElement(Helper.locateElementByTestId("pipeline-actions-btn"));
    ElementHelper.clickOnElement(Helper.locateElementByTestId("pull-pipeline"));
    Commands.waitForLoading();
    WaitHelper.waitForPageToLoad();
  }

  @Then("Commit changes with message {string}")
  public void commitPipeline(String message) {
    ElementHelper.clickOnElement(Helper.locateElementByTestId("commit-message-input"));
    ElementHelper.sendKeys(Helper.locateElementByTestId("commit-message-input"), message);
    ElementHelper.clickOnElement(Helper.locateElementByTestId("OK"));
  }

  @Then("Banner is shown with message {string}")
  public void pipelineBannerIsShownWithMessage(String message) {
    WebElement alert = Helper.locateElementByTestId("alert");
    WaitHelper.waitForElementToBeDisplayed(alert);
    Assert.assertTrue(ElementHelper.getElementText(Helper.locateElementByTestId("alert")).contains(message));
    WaitHelper.waitForElementToBeHidden(alert, ALERT_DISPLAY_TIMEOUT);
  }

  @When("Initialize the repository config")
  public void initializeRepoConfig() {
    openAddRepositoryButton();
    addRepoUrl(PluginPropertyUtils.pluginProp(Constants.GIT_REPO_URL_PROP_NAME));
    addToken(PluginPropertyUtils.pluginProp(Constants.GIT_PAT_PROP_NAME));
    addTokenName("e2e-test-token");
    addDefaultBranch(PluginPropertyUtils.pluginProp(Constants.GIT_BRANCH_PROP_NAME));
    addPathPrefix(PluginPropertyUtils.pluginProp(Constants.GIT_PATH_PREFIX_PROP_NAME));
    clickOnSaveButton();
  }

  @When("Select remote pipelines tab")
  public void selectRemotePipelinesTab() {
    ElementHelper.clickOnElement(Helper.locateElementByTestId("remote-pipeline-tab"));
    WaitHelper.waitForPageToLoad();
  }

  @When("Select local pipelines tab")
  public void selectLocalPipelinesTab() {
    ElementHelper.clickOnElement(Helper.locateElementByTestId("local-pipeline-tab"));
    WaitHelper.waitForPageToLoad();
  }

  @Then("Verify pipeline list size {int}")
  public void verifyPipelineList(int size) {
    Assert.assertEquals(
        Helper.locateElementsByXPath("//table[@data-testid=\"remote-pipelines-table\"]/tbody/tr").size(),
        size
    );
  }

  @Then("Verify {string} pipeline exist in list")
  public void verifyPipelineList(String pipeline) {
    Assert.assertTrue(
        Helper.isElementExists(Helper.getCssSelectorByDataTestId("remote-" + pipeline))
    );
  }

  @When("Select {string} pipeline and push")
  public void pushPipelineInRemotePage(String pipeline) {
    ElementHelper.clickOnElement(Helper.locateElementByTestId("local-" + pipeline));
    ElementHelper.clickOnElement(Helper.locateElementByTestId("remote-push-button"));
  }

  @Then("Push success indicator is shown for pipeline {string}")
  public void verifyPushSuccessInLocalTable(String pipeline) {
    String pushStatusXpath = String.format(
        "//*[@data-testid=\"local-%s\"]//*[@data-testid=\"push-success-status\"]",
        pipeline
    );
    ElementHelper.isElementDisplayed(Helper.locateElementByXPath(pushStatusXpath));
  }

  @When("Select {string} pipeline and pull")
  public void pullPipelineInRemotePage(String pipeline) {
    ElementHelper.clickOnElement(Helper.locateElementByTestId("remote-" + pipeline));
    ElementHelper.clickOnElement(Helper.locateElementByTestId("remote-pull-button"));
  }

  @Then("Pull success indicator is shown for pipeline {string}")
  public void verifyPullSuccessInRemoteTable(String pipeline) {
    String pushStatusXpath = String.format(
        "//*[@data-testid=\"remote-%s\"]//*[@data-testid=\"pull-success-status\"]",
        pipeline
    );
    ElementHelper.isElementDisplayed(Helper.locateElementByXPath(pushStatusXpath));
  }
}
