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
import org.openqa.selenium.WebElement;

import java.util.ArrayList;
import java.util.List;

public class SnackBar {
  @Given("Navigate to Home Page")
  public void navigateToHomePage() {
    try {
      SeleniumDriver.openPage(Constants.WRANGLE_HOME_URL);
      WaitHelper.waitForPageToLoad();
    } catch (Exception e) {
      System.err.println("error:" + e);
    }
  }

  @Then("Click on the data exploration card")
  public void clickOnTheDataExplorationCard() {
    try {
      WaitHelper.waitForPageToLoad();
      List<String> productName = new ArrayList<String>();
      List<WebElement> allProductsName = SeleniumDriver.getDriver().findElements(
              By.xpath(".//*[@data-testid='wrangler-home-ongoing-data-exploration-card']"));
      ElementHelper.clickOnElement(allProductsName.get(0));
      String url = SeleniumDriver.getDriver().getCurrentUrl();
      Assert.assertTrue(url.contains("http://localhost:11011/cdap/ns/default/wrangler-grid"));
    } catch (Exception e) {
      System.err.println("error:" + e);
    }
  }

  @Then("Click on the Snackbar close icon")
  public void verifyTheSnackbarPopUpIsComingOrNot() {
    try {
      WaitHelper.waitForPageToLoad();
      WaitHelper.waitForElementToBeDisplayed(Helper.locateElementByTestId("snackbar-close-icon"));
      WaitHelper.waitForElementToBeClickable(Helper.locateElementByTestId("snackbar-close-icon"));
      WebElement ele = SeleniumDriver.getDriver().findElement
              (By.xpath("//*[@data-testid = 'snackbar-close-icon']"));
      ElementHelper.clickOnElement(ele);
    } catch (Exception e) {
      System.err.println("error:" + e);
    }
  }
}
