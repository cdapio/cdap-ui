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

import io.cdap.cdap.ui.utils.Constants;
import io.cdap.cdap.ui.utils.Helper;
import io.cdap.e2e.utils.ElementHelper;
import io.cdap.e2e.utils.WaitHelper;
import io.cucumber.java.en.Then;
import org.junit.Assert;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

/**
 *
 */
public class SourceControlManagement {

  @Then("Click on \"Link Repository\" button")
  public void openAddRepositoryButton() {
    ElementHelper.clickOnElement(Helper.locateElementByTestId("link-repository-button"));
  }

  @Then("Add {string} as Repository URL")
  public void addInputLabel(String repoUrl) {
    WebElement repoUrlInput = Helper.locateElementByTestId("repoUrl");
    ElementHelper.clearElementValue(repoUrlInput);
    ElementHelper.sendKeys(repoUrlInput, repoUrl);
  }

  @Then("Add {string} as Token Name")
  public void addAsTokenName(String tokenName) {
    WebElement profileLabelInput = Helper.locateElementByTestId("tokenName");
    ElementHelper.clearElementValue(profileLabelInput);
    ElementHelper.sendKeys(profileLabelInput, tokenName);
  }

  @Then("Add {string} as Token")
  public void addAsToken(String token) {
    WebElement profileLabelInput = Helper.locateElementByTestId("token");
    ElementHelper.clearElementValue(profileLabelInput);
    ElementHelper.sendKeys(profileLabelInput, token);
  }

  @Then("Click on \"Validate\" button")
  public void clickOnValidateButton() {
    ElementHelper.clickOnElement(Helper.locateElementByTestId("validate-repo-config-button"));
  }

  @Then("Verify failure in validation")
  public void verifyFailureInValidation() {
    WaitHelper.waitForElementToBeDisplayed(Helper.locateElementByTestId("alert"));
    Assert.assertTrue(Helper.locateElementByTestId("alert").getText()
        .contains("Failed to list remotes in remote repository."));
    ElementHelper.clickOnElement(Helper.locateElementByTestId("alert-close"));
  }

  @Then("Click on \"Save and Close\" button")
  public void clickOnSaveButton() {
    ElementHelper.clickOnElement(Helper.locateElementByTestId("save-repo-config-button"));
  }

  @Then("Verify saved repo config")
  public void verifySavedRepoConfig() {
    WaitHelper.waitForElementToBeDisplayed(Helper.locateElementByTestId("actions-popover"));
    Assert.assertTrue(Helper.locateElementByTestId("repository-provider")
        .getText().contains("GITHUB"));
    Assert.assertTrue(Helper.locateElementByTestId("repository-link")
        .getText().contains(Constants.FAKE_REPO_LINK));
    Assert.assertTrue(Helper.locateElementByTestId("repository-auth-type")
        .getText().contains("PAT"));
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
    WebElement repoUrlInput = Helper.locateElementByTestId("repoUrl");
    ElementHelper.clearElementValue(repoUrlInput);
    ElementHelper.sendKeys(repoUrlInput, Constants.FAKE_REPO_LINK);

    WebElement tokenNameInput = Helper.locateElementByTestId("tokenName");
    ElementHelper.clearElementValue(tokenNameInput);
    ElementHelper.sendKeys(tokenNameInput, Constants.FAKE_TOKEN_NAME);

    WebElement tokenInput = Helper.locateElementByTestId("token");
    ElementHelper.clearElementValue(tokenInput);
    ElementHelper.sendKeys(tokenInput, Constants.FAKE_TOKEN);
  }

  @Then("Verify UI directed to initial page")
  public void verifyUIDirectedToInitialPage() {
    Assert.assertTrue(Helper.locateElementByTestId("link-repository-button").isDisplayed());
  }
}
