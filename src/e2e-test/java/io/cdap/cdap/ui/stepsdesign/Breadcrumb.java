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

import io.cdap.cdap.ui.utils.Helper;
import io.cdap.e2e.utils.ElementHelper;
import io.cdap.e2e.utils.WaitHelper;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import org.openqa.selenium.interactions.Actions;
import io.cdap.e2e.utils.SeleniumDriver;
import io.cdap.cdap.ui.utils.Constants;
import org.junit.Assert;
import java.time.Duration;
import org.openqa.selenium.WebElement;

public class Breadcrumb {
    @Given("Navigate to the home page")
    public void navigateToTheHomePage() {
        SeleniumDriver.openPage(Constants.WRANGLE_HOME_URL);
        WaitHelper.waitForPageToLoad();
    }

    @Then("Click on the Connector type with \\\"(.*)\\\" and \\\"(.*)\\\"")
    public void clickOnTheConnectorType(String connectionLabel, String connectionTestId) {
        try {
            WaitHelper.waitForElementToBeEnabled(
                    Helper.locateElementByTestId("connector-type-" + connectionTestId));
            ElementHelper.clickOnElement(Helper.locateElementByTestId("connector-type-" + connectionTestId));
            System.out.println("Clicked on " + connectionLabel + " Element");
            WaitHelper.waitForPageToLoad();
            if (connectionLabel.equals("Add Connections")) {
                ElementHelper.clickOnElement(Helper.locateElementByTestId("connector-type-" + connectionTestId));
                System.out.println("Clicked on " + connectionLabel + " Element");
                WaitHelper.waitForPageToLoad();
                String ActualText = SeleniumDriver.getDriver().getCurrentUrl();
                Assert.assertEquals(ActualText, "http://localhost:11011/cdap/ns/default/connections/create");
                System.out.println("Navigated to " + connectionLabel + " Page - Old UI");
            } else {
                WaitHelper.waitForPageToLoad();
                String ActualText = SeleniumDriver.getDriver().getCurrentUrl();
                Assert.assertEquals(ActualText,
                        "http://localhost:11011/cdap/ns/default/datasources/" + connectionLabel);
                System.out.println("Navigated to Data Source page with connection " + connectionLabel + " selected");
            }
        } catch (Exception e) {
            System.out.println(connectionLabel + " Element does not exist");
        }
    }

    @Then("Click on the Home link button")
    public void clickOnTheHomeLinkButton() {
        WaitHelper.waitForPageToLoad();
        SeleniumDriver.getDriver().manage().timeouts().implicitlyWait(Duration.ofSeconds(30));
        ElementHelper.clickOnElement(Helper.locateElementByTestId("breadcrumb-home-Home"));
        System.out.println("clicked on home link from Data source page");
    }

    @Then("Click on the Exploration card with \\\"(.*)\\\"")
    public void clickOnTheExplorationCard(int testId) {
        WaitHelper.waitForPageToLoad();
        SeleniumDriver.getDriver().manage().timeouts().implicitlyWait(Duration.ofSeconds(30));
        ElementHelper.clickOnElement(Helper.locateElementByTestId("ongoing-data-explorations-" + testId));
        System.out.println("clicked on exploration card");
    }

    @Then("Click on the Home link of wrangle page")
    public void clickOnTheHomeLink() {
        System.out.println("inside the function");
        SeleniumDriver.getDriver().manage().window().maximize();
        SeleniumDriver.getDriver().manage().timeouts().implicitlyWait(Duration.ofSeconds(50));
        String url = SeleniumDriver.getDriver().getCurrentUrl();
        Assert.assertTrue(url.contains("http://localhost:11011/cdap/ns/default/wrangler-grid"));
        System.out.println(url);
        boolean flag = true;
        for (int i = 0; flag == true; i++) {
            if (Helper.isElementExists(Helper.getCssSelectorByDataTestId("loading-indicator"))) {
                flag = true;
            } else {
                flag = false;
            }
        }
        WebElement ele = Helper.locateElementByTestId("breadcrumb-home-Home");
        Actions action = new Actions(SeleniumDriver.getDriver());
        action.moveToElement(ele).perform();
        ele.click();
    }
}
