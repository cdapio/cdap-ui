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
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import org.junit.Assert;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;

public class Directives {

  @Then("Verify if user is on the wrangle page")
  public void verifyIfUserIsOnTheWranglePage() {
    String url = SeleniumDriver.getDriver().getCurrentUrl();
    Assert.assertTrue(url.contains("cdap/ns/default/wrangler-grid"));
  }

  @Then("Click on the Directives button")
  public void clickOnDirectivesButton() {
    if (Helper.isElementExists(By.cssSelector("loading-indicator"))) {
      WaitHelper.waitForElementToBeHidden(Helper.locateElementByTestId("loading-indicator"));
    }
      ElementHelper.clickOnElement(Helper.locateElementByTestId("footer-panel-directives-tab"));
  }
  @Then("Verify and Click the directive panel")
  public void verifyAndClickTheDirectivePanel() {
      WebElement panel = Helper.locateElementByTestId("select-directive-input-search");
      Assert.assertTrue(panel.isDisplayed());
      panel.click();
  }

  @Then("Enter command in the panel with the data \\\"(.*)\\\"")
  public void checkCommandFunction(int id) {
    String text = Helper.locateElementByTestId("table-cell-" + id).getText();
    String capital = text.toUpperCase();
    WebElement panel = Helper.locateElementByTestId("select-directive-input-search");
    panel.click();
    WebElement column = Helper.locateElementByTestId("grid-header-cell-1-label");
    String columnName = column.getText();
    panel.sendKeys("uppercase:" + columnName);
    panel.sendKeys(Keys.ENTER);
    WaitHelper.waitForElementToBeHidden(Helper.locateElementByTestId("loading-indicator"));
    Helper.reloadPage();
    WebElement ele = Helper.locateElementByTestId("table-cell-" + id);
    String newText = ele.getText();
    Assert.assertEquals(capital, newText);
  }

  @Then("Click on Close icon of directive panel")
  public void closeIcon() {
    ElementHelper.clickOnElement(Helper.locateElementByTestId("close-directive-panel"));
  }
}
