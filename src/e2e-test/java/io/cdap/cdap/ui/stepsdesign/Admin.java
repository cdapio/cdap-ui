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
import io.cdap.e2e.utils.ElementHelper;
import io.cdap.e2e.utils.SeleniumDriver;
import io.cdap.e2e.utils.WaitHelper;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.junit.Assert;
import org.openqa.selenium.By;
import org.openqa.selenium.StaleElementReferenceException;
import org.openqa.selenium.WebElement;


public class Admin {

  @When("Open configuration page")
  public void openCdap() {
    SeleniumDriver.openPage(Constants.CONFIGURATION_URL);
    WaitHelper.waitForPageToLoad();
  }

  @Then("Click on \"System Preferences\" accordion")
  public void openSystemPreferences() {
    ElementHelper.clickOnElement(Helper.locateElementByTestId("system-prefs-accordion"));
  }

  @Then("Click on \"Edit System Preferences\" button")
  public void editSystemPreferences() {
    ElementHelper.clickOnElement(Helper.locateElementByTestId("edit-system-prefs-btn"));
  }

  @Then("Add {string} as key")
  public void addInputKey(String keyValue) {
    WebElement keyInput = Helper.locateElementByCssSelector(
      "div[class='key-value-pair-preference'] > input[class='form-control key-input']"
    );
    ElementHelper.clearElementValue(keyInput);
    ElementHelper.sendKeys(keyInput, keyValue);
  }

  @Then("Add {string} as value")
  public void addInputValue(String value) {
    WebElement valueInput = Helper.locateElementByCssSelector(
      "div[class='key-value-pair-preference'] > input[class='form-control value-input']"
    );
    ElementHelper.clearElementValue(valueInput);
    ElementHelper.sendKeys(valueInput, value);
  }

  @Then("Click on \"Save Preferences\" button")
  public void saveSystemPreferences() {
    ElementHelper.clickOnElement(Helper.locateElementByTestId("save-prefs-btn"));
  }

  @Then("Verify failure in saving changes")
  public void checkForErrorInSavingPreferences() {
    ElementHelper.clickOnElement(
      Helper.locateElementByCssSelector("div[class=\"preferences-error\"]")
    );
  }

  @Then("Verify successful saving of preferences with {string} as key and {string} as value")
  public void checkForSuccessfulSavingOfPreferences(String key, String value) throws RuntimeException {
    try {
      tryCheckForSuccessfulSavingOfPreferences(key, value);
    } catch (StaleElementReferenceException ex) {
      tryCheckForSuccessfulSavingOfPreferences(key, value);
    }
  }

  private void tryCheckForSuccessfulSavingOfPreferences(String key, String value) {
    String addedKeyCssLocator = "div[class*='grid-row'] > div";
    String addedKey = ElementHelper.getElementText(
      WaitHelper.waitForElementToBePresent(By.cssSelector(addedKeyCssLocator))
    );
    String addedValue = ElementHelper.getElementText(
      WaitHelper.waitForElementToBePresent(By.cssSelector(addedKeyCssLocator + "+ div"))
    );

    Assert.assertEquals(addedKey, key);
    Assert.assertEquals(addedValue, value);
  }
}
