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

public class ViewFullChart {
    @Given("Navigate to the Wrangle Home Page")
    public void navigateToWrangleHomePage() {
        SeleniumDriver.openPage(Constants.WRANGLE_HOME_URL);
        WaitHelper.waitForPageToLoad();
    }

    @Then("Click on the Ongoing Data Explorations card")
    public void clickOnTheDataExplorationsCard() {
        try {
            WaitHelper.waitForPageToLoad();
            ElementHelper.clickOnElement(Helper.locateElementByTestId("wrangler-home-ongoing-data-exploration-card-0"));
            String url = SeleniumDriver.getDriver().getCurrentUrl();
            Assert.assertTrue(url.contains("http://localhost:11011/cdap/ns/default/wrangler-grid"));
        } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }

    @Then("Click on any column from the grid table")
    public void clickOnAnyColumnFromTheGridTable() {
        try {
            WaitHelper.waitForPageToLoad();
            ElementHelper.clickOnElement(Helper.locateElementByTestId("grid-header-cell-1"));
            Assert.assertTrue(ElementHelper.isElementDisplayed(Helper.locateElementByTestId("column-insights-panel")));
        } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }

    @Then("Click on the View full chart button")
    public void clickOnTheViewFullChartButton() {
        try {
            WaitHelper.waitForPageToLoad();
            ElementHelper.clickOnElement(Helper.locateElementByTestId("view-full-chart-link"));
        } catch (Exception e) {
            System.err.println("error" + e);
        }
    }

    @Then("Verify if the user viewing the chart")
    public void verifyIfTheUserViewingTheChart() {
        try {
            WaitHelper.waitForPageToLoad();
            Assert.assertTrue(ElementHelper.isElementDisplayed
                    (Helper.locateElementByTestId("view-full-chart-modal-content")));
        } catch (Exception e) {
            System.err.println("error" + e);
        }
    }

    @Then("Click on the Close icon")
    public void clickOnTheCloseIcon() {
        try {
            WaitHelper.waitForPageToLoad();
            ElementHelper.clickOnElement(Helper.locateElementByTestId("close-icon-button"));
        } catch (Exception e) {
            System.err.println("error" + e);
        }
    }
}
