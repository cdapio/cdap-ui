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

import io.cdap.cdap.ui.types.SecureKeyInfo;
import io.cdap.cdap.ui.utils.Commands;
import io.cdap.cdap.ui.utils.Constants;
import io.cdap.cdap.ui.utils.Helper;
import io.cdap.e2e.utils.ElementHelper;
import io.cdap.e2e.utils.SeleniumDriver;
import io.cdap.e2e.utils.WaitHelper;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.junit.Assert;
import org.openqa.selenium.By;

import java.util.HashMap;
import java.util.Map;

public class SecureKeyManager {
  private final HashMap<Integer, SecureKeyInfo> keyMap = new HashMap<Integer, SecureKeyInfo>() {{
    put(1, new SecureKeyInfo("secure-key-1-id", "Example Secure Key 1",
                             "WARNING: this is secure data"));
    put(2, new SecureKeyInfo("secure-key-2-id", "Example Secure Key 2",
                             "WARNING: this is secure data"));
    put(3, new SecureKeyInfo("secure-key-3-id", "Example Secure Key 3",
                             "WARNING: this is secure data"));
  }};

  @When("Visit Secure keys page")
  public void visitSecureKeysPage() {
    SeleniumDriver.openPage(Constants.SECURE_KEY_MANAGER_URL);
    WaitHelper.waitForPageToLoad();
  }

  @Then("Create key {int}")
  public void createNewKey(int keyId) {
    createKey(keyId);
    WaitHelper.waitForElementToBeDisplayed(Helper.locateElementByTestId("alert-close"));
    ElementHelper.clickOnElement(Helper.locateElementByTestId("alert-close"));
  }

  @Then("Creating a duplicated key {int} should fail")
  public void createDupKey(int keyId) {
    createKey(keyId);
    ElementHelper.clickOnElement(Helper.locateElementByTestId("cancel"));
    WaitHelper.waitForElementToBeDisplayed(Helper.locateElementByTestId("alert"));
    Assert.assertTrue(Helper.locateElementByTestId("alert").getText().contains("Error: Duplicate key name"));
    ElementHelper.clickOnElement(Helper.locateElementByTestId("alert-close"));
  }

  @Then("Editing key {int} should work")
  public void editKey(int keyId) {
    SecureKeyInfo key = keyMap.get(keyId);
    ElementHelper.clickOnElement(Helper.locateElementByTestId("secure-key-row-" + key.getName()));
    Helper.locateElementByTestId("secure-key-description").findElement(By.tagName("input")).clear();
    ElementHelper.sendKeys(Helper.locateElementByTestId("secure-key-description").findElement(By.tagName("input")),
                           "1");
    ElementHelper.sendKeys(Helper.locateElementByTestId("secure-key-data").findElement(By.tagName("input")),
                           key.getData());
    ElementHelper.clickOnElement(Helper.locateElementByTestId("save-secure-key"));
    WaitHelper.waitForElementToBeDisplayed(Helper.locateElementByTestId("alert-close"));
    ElementHelper.clickOnElement(Helper.locateElementByTestId("alert-close"));
    ElementHelper.clickOnElement(Helper.locateElementByTestId("secure-key-row-" + key.getName()));
    Assert.assertEquals("1", Helper.locateElementByTestId("secure-key-description").findElement(
      By.tagName("input")).getAttribute("value"));
    ElementHelper.clickOnElement(Helper.locateElementByTestId("close-edit-dialog"));
  }

  @Then("Delete key {int}")
  public void deleteKey(int keyId) {
    SecureKeyInfo key = keyMap.get(keyId);
    ElementHelper.clickOnElement(
      Helper.locateElementByTestId("menu-icon",
                                   Helper.locateElementByTestId("secure-key-row-" + key.getName())));
    ElementHelper.clickOnElement(Helper.locateElementByTestId("delete-secure-key"));
    WaitHelper.waitForElementToBeDisplayed(Helper.locateElementByTestId("Delete"));
    ElementHelper.clickOnElement(Helper.locateElementByTestId("Delete"));
    WaitHelper.waitForElementToBeDisplayed(Helper.locateElementByTestId("alert-close"));
    ElementHelper.clickOnElement(Helper.locateElementByTestId("alert-close"));
  }

  @Then("Search key {string} should show corresponding results")
  public void searchKey(String query) {
    ElementHelper.sendKeys(Helper.locateElementByTestId("search-secure-key").findElement(By.tagName("input")), query);
    for (Map.Entry<Integer, SecureKeyInfo> set : keyMap.entrySet()) {
      Helper.locateElementByTestId("secure-key-row-" + set.getValue().getName());
    }
  }

  public void createKey(int keyId) {
    SecureKeyInfo key = keyMap.get(keyId);
    ElementHelper.clickOnElement(Helper.locateElementByTestId("create-secure-key"));
    ElementHelper.sendKeys(Helper.locateElementByTestId("secure-key-name").findElement(By.tagName("input")),
                           key.getName());
    ElementHelper.sendKeys(Helper.locateElementByTestId("secure-key-description").findElement(By.tagName("input")),
                           key.getDescription());
    ElementHelper.sendKeys(Helper.locateElementByTestId("secure-key-data").findElement(By.tagName("input")),
                           key.getData());
    ElementHelper.clickOnElement(Helper.locateElementByTestId("save-secure-key"));
  }
}
