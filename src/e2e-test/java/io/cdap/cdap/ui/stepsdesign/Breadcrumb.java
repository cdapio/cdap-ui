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
  @Given("Navigate to the Wrangle home page")
  public void navigateToTheHomePageBreadcrumb() throws Exception {
    SeleniumDriver.openPage(Constants.WRANGLE_HOME_URL);
    WaitHelper.waitForPageToLoad();
  }

  @Then("Click on the Connector type with {string} and {string}")
  public void clickOnTheConnectorType(String connectionLabel, String connectionTestId) {
    ElementHelper.clickOnElement(Helper.locateElementByTestId("wrangle-card-" + connectionTestId));
    WaitHelper.waitForPageToLoad();
    if (connectionLabel.equals("Add Connections")) {
      ElementHelper.clickOnElement(Helper.locateElementByTestId("wrangle-card-" + connectionTestId));
      String actualText = SeleniumDriver.getDriver().getCurrentUrl();
      Assert.assertEquals(actualText, "http://localhost:11011/cdap/ns/default/connections/create");
    } else {
      String actualText = SeleniumDriver.getDriver().getCurrentUrl();
      Assert.assertEquals(actualText,
              "http://localhost:11011/cdap/ns/default/datasources/" + connectionLabel);
    }
  }

  @Then("Click on the Home link button")
  public void clickOnTheHomeLinkButton() {
      ElementHelper.clickOnElement(Helper.locateElementByTestId("breadcrumb-home-home"));
  }

  @Then("Click on the Exploration card with {string}")
  public void clickOnTheExplorationCard(String testId) {
      WaitHelper.waitForPageToLoad();
      ElementHelper.clickOnElement(Helper.locateElementByTestId
            ("wrangler-home-ongoing-data-exploration-card-" + testId));
  }

  @Then("Click on the Home link of wrangle page")
  public void clickOnTheHomeLink() {
    WaitHelper.waitForPageToLoad();
    SeleniumDriver.getDriver().manage().window().maximize();
    Assert.assertTrue(Helper.urlHasString("cdap/ns/default/wrangler-grid"));
    ElementHelper.clickOnElementUsingJsExecutor(Helper.locateElementByTestId("breadcrumb-home-home"));
  }
}
