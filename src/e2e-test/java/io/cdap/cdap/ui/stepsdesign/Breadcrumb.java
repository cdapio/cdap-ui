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
import org.openqa.selenium.WebElement;

public class Breadcrumb {
  @Given("Navigate to the home page to test breadcrumb")
  public void navigateToTheHomePageBreadcrumb() throws Exception {
    SeleniumDriver.openPage(Constants.WRANGLE_HOME_URL);
    WaitHelper.waitForPageToLoad();
  }

  @Then("Click on the Connector type with \\\"(.*)\\\" and \\\"(.*)\\\"")
  public void clickOnTheConnectorType(String connectionLabel, String connectionTestId) {
    try {
      WaitHelper.waitForElementToBeEnabled(
      Helper.locateElementByTestId("wrangle-card-" + connectionTestId));
      ElementHelper.clickOnElement(Helper.locateElementByTestId("wrangle-card-" + connectionTestId));
      WaitHelper.waitForPageToLoad();
        if (connectionLabel.equals("Add Connections")) {
          ElementHelper.clickOnElement(Helper.locateElementByTestId("wrangle-card-" + connectionTestId));
          WaitHelper.waitForPageToLoad();
          String actualText = SeleniumDriver.getDriver().getCurrentUrl();
          Assert.assertEquals(actualText, "http://localhost:11011/cdap/ns/default/connections/create");
        } else {
          WaitHelper.waitForPageToLoad();
          String actualText = SeleniumDriver.getDriver().getCurrentUrl();
          Assert.assertEquals(actualText,
                  "http://localhost:11011/cdap/ns/default/datasources/" + connectionLabel);
        }
    } catch (Exception e) {
      System.err.println("error:" + e);
    }
  }

  @Then("Click on the Home link button")
  public void clickOnTheHomeLinkButton() {
    try {
      WaitHelper.waitForPageToLoad();
      Helper.waitSeconds(30);
      WaitHelper.waitForElementToBeDisplayed(Helper.locateElementByTestId("breadcrumb-home-home"));
      WaitHelper.waitForElementToBeClickable(Helper.locateElementByTestId("breadcrumb-home-home"));
      ElementHelper.clickOnElement(Helper.locateElementByTestId("breadcrumb-home-home"));
    } catch (Exception e) {
      System.err.println("error:" + e);
    }
  }

  @Then("Click on the Exploration card with \\\"(.*)\\\"")
  public void clickOnTheExplorationCard(int testId) {
    try {
      WaitHelper.waitForPageToLoad();
      Helper.waitSeconds(30);
      ElementHelper.clickOnElement(Helper.locateElementByTestId
              ("wrangler-home-ongoing-data-exploration-card-" + testId));
    } catch (Exception e) {
      System.err.println("error:" + e);
    }
  }

  @Then("Click on the Home link of wrangle page")
  public void clickOnTheHomeLink() {
  try {
    SeleniumDriver.getDriver().manage().window().maximize();
    Helper.waitSeconds(50);
    String url = SeleniumDriver.getDriver().getCurrentUrl();
    Assert.assertTrue(url.contains("cdap/ns/default/wrangler-grid"));
    WaitHelper.waitForElementToBeDisplayed(Helper.locateElementByTestId("breadcrumb-home-home"));
    WaitHelper.waitForElementToBeClickable(Helper.locateElementByTestId("breadcrumb-home-home"));
    WebElement ele = Helper.locateElementByTestId("breadcrumb-home-home");
    ElementHelper.clickOnElement(ele);
    } catch (Exception e) {
      System.err.println("error:" + e);
    }
  }
}
