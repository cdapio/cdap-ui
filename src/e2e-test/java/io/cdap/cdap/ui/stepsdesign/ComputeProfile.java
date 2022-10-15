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
import io.cdap.cdap.ui.utils.HttpRequestHandler;
import io.cdap.common.http.HttpMethod;
import io.cdap.e2e.utils.ElementHelper;
import io.cdap.e2e.utils.SeleniumDriver;
import io.cdap.e2e.utils.WaitHelper;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.junit.Assert;
import org.openqa.selenium.WebElement;

import java.io.IOException;

public class ComputeProfile {

  @When("Open system profiles create page")
  public void openSystemProfilesCreate() {
    SeleniumDriver.openPage(Constants.SYSTEM_PROFILES_CREATE_URL);
    WaitHelper.waitForPageToLoad();
  }

  @When("Open default profiles create page")
  public void openDefaultProfilesCreate() {
    SeleniumDriver.openPage(Constants.BASE_STUDIO_URL + "profiles/create");
    WaitHelper.waitForPageToLoad();
  }

  @Then("Click on \"Dataproc\" from the listed provisioners")
  public void openSystemProvisioner() {
    ElementHelper.clickOnElement(Helper.locateElementByTestId("provisioner-gcp-dataproc"));
  }

  @Then("Check that the Create button is disabled")
  public void createButtonDisableCheck() {
    WebElement createBtn = Helper.locateElementByTestId("profile-create-btn");
    Assert.assertFalse(createBtn.isEnabled());
  }

  @Then("Add {string} as label")
  public void addInputLabel(String labelValue) {
    WebElement profileLabelInput = Helper.locateElementByTestId("profileLabel");
    ElementHelper.clearElementValue(profileLabelInput);
    ElementHelper.sendKeys(profileLabelInput, labelValue);
  }

  @Then("Verify name to be same as label")
  public void verifyNameAndLabelValues() {
    String addedLabel = ElementHelper.getElementText(Helper.locateElementByTestId("profileLabel"));
    String addedName = ElementHelper.getElementText(Helper.locateElementByTestId("profileName"));
    Assert.assertEquals(addedLabel, addedName);
  }

  @Then("Add {string} as Description")
  public void addTextAreaDescription(String descriptionValue) {
    WebElement descriptionTextarea = Helper.locateElementByTestId("profileDescription");
    ElementHelper.selectAllTextAndClear(descriptionTextarea);
    ElementHelper.sendKeysToTextarea(descriptionTextarea, descriptionValue);
  }

  @Then("Add {string} as Project Id")
  public void addInputProjectId(String projectIdValue) {
    WebElement projectIdInput = Helper.locateElementByTestId("projectId");
    ElementHelper.clearElementValue(projectIdInput);
    ElementHelper.sendKeys(projectIdInput, projectIdValue);
  }

  @Then("Add {string} as Account Key")
  public void addInputAccountKey(String accountKeyValue) {
    WebElement accountKeyInput = Helper.locateElementByTestId("accountKey");
    ElementHelper.clearElementValue(accountKeyInput);
    ElementHelper.sendKeys(accountKeyInput, accountKeyValue);
  }

  @Then("Click on \"Create\" button")
  public void createProfile() {
    ElementHelper.clickOnElement(
      Helper.locateElementByTestId("profile-create-btn")
    );
  }

  @Then("Verify the profile {string} should present in the list")
  public void verifyProfileInList(String profileName) {
    WebElement profileInList = Helper.locateElementByCssSelector(
      Helper.getCssSelectorByDataTestId("profile-list-" + profileName));
  }

  @Then("Delete system profile {string} as cleanup action")
  public void deleteProfile(String profileName) throws IOException {
    try {
      HttpRequestHandler.makeHttpRequest(HttpMethod.POST,
                                         Constants.BASE_SERVER_URL + "/v3/profiles/" + profileName + "/disable",
                                         null, null, null);
      HttpRequestHandler.makeHttpRequest(HttpMethod.DELETE,
                                         Constants.BASE_SERVER_URL + "/v3/profiles/" + profileName,
                                         null, null, null);
    } catch (IOException e) {
      throw new IOException(e.getMessage());
    }
  }

  @Then("Delete namespace profile {string} as cleanup action")
  public void deleteNsProfile(String profileName) throws IOException {
    try {
      HttpRequestHandler
        .makeHttpRequest(HttpMethod.POST,
                         Constants.BASE_SERVER_URL + "/v3/namespaces/default/profiles/" + profileName + "/disable",
                         null, null, null);
      HttpRequestHandler
        .makeHttpRequest(HttpMethod.DELETE,
                         Constants.BASE_SERVER_URL + "/v3/namespaces/default/profiles/" + profileName,
                         null, null, null);
    } catch (IOException e) {
      throw new IOException(e.getMessage());
    }
  }
}
