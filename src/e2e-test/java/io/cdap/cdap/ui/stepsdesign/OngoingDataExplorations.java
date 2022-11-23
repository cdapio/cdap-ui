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

public class OngoingDataExplorations {
    @Given("Navigate to the Home Page")
    public void navigateToTheHomePage() {
        SeleniumDriver.openPage(Constants.WRANGLE_HOME_URL);
        WaitHelper.waitForPageToLoad();
    }
    @Then("Click on the Data Explorations Card")
    public void clickOnTheDataExplorationsCard() {
        try {
            WaitHelper.waitForPageToLoad();
            WebElement ele = Helper.locateElementByTestId("home-ongoing-explorations-text-0");
            String homeText = ele.getText();
            System.out.println(homeText);
            ElementHelper.clickOnElement(Helper.locateElementByTestId("wrangler-home-ongoing-data-exploration-card-0"));
            String url = SeleniumDriver.getDriver().getCurrentUrl();
            Assert.assertTrue(url.contains("http://localhost:11011/cdap/ns/default/wrangler-grid"));
        } catch (Exception e) {
        System.err.println("ERROR: " + e);
        }
    }
    @Then("Click on the Home link")
    public void clickOnTheHomeLink() {
        WaitHelper.waitForPageToLoad();
        try {
            ElementHelper.clickOnElement(Helper.locateElementByTestId("breadcrumb-home-text"));
            System.out.println("the home link is clicked");
        } catch (Exception e) {
            System.err.println("ERROR: " + e);
        }
    }
    @Then("Check if the user is on the Home Page")
    public void checkIfTheUserIsOnTheHomePage() {
        try {
            String actualText = SeleniumDriver.getDriver().getCurrentUrl();
            Assert.assertEquals(actualText, "http://localhost:11011/cdap/ns/default/home");
            System.out.println("The assertion for home url is passed");
        } catch (Exception e) {
        System.err.println("ERROR: " + e);
        }
    }
}
