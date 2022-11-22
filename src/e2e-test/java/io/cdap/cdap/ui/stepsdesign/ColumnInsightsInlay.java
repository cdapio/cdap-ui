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

public class ColumnInsightsInlay {
    @Given("Navigate to the Home Page")
    public void navigateToTheHomePage() {
        SeleniumDriver.openPage(Constants.WRANGLE_HOME_URL);
        WaitHelper.waitForPageToLoad();
    }
    @Then("Click on the Ongoing Data Explorations card")
    public void clickOnTheDataExplorationCard() {
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
    public void clickOnAnyColumnFromGridTable() {
        try {
            WaitHelper.waitForPageToLoad();
            ElementHelper.clickOnElement(Helper.locateElementByTestId("grid-header-cell-1"));
            Assert.assertTrue(ElementHelper.isElementDisplayed(Helper.locateElementByTestId("column-insights-panel-parent")));
        } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }
    @Then("Again click on any other column from the grid table without closing insight panel")
    public void againClickOnAnyColumnFromGridTable() {
        try {
            WaitHelper.waitForPageToLoad();
            ElementHelper.clickOnElement(Helper.locateElementByTestId("grid-header-cell-3"));
        } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }
    @Then("Verify the column data is showing in the Inlay popup")
    public void verifyTheColumnDataIsShowingInTheInlayPopup() {
        try {
            WaitHelper.waitForPageToLoad();
            Assert.assertTrue(ElementHelper.isElementDisplayed(Helper.locateElementByTestId("column-details-parent")));
        } catch (Exception e) {
            System.err.println("error" + e);
        }
    }
    @Then("Click on the cross icon on the inlay popup")
    public void clickOnTheCrossIconOnTheInlayPopup() {
        try {
            WaitHelper.waitForPageToLoad();
            ElementHelper.clickOnElement(Helper.locateElementByTestId("close-icon"));
        } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }
}
