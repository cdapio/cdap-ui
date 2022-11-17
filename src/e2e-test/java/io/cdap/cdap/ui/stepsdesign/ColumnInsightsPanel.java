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

public class ColumnInsightsPanel {
    @Given("Navigate to Home Page")
    public void navigateToTheHomePage() {
        SeleniumDriver.openPage(Constants.WRANGLE_HOME_URL);
        WaitHelper.waitForPageToLoad();
    }

    @Then("Click on the Data Explorations card")
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

    @Then("Click on any column from grid table")
    public void clickOnAnyColumnFromGridTable() {
        try {
            WaitHelper.waitForPageToLoad();
            ElementHelper.clickOnElement(Helper.locateElementByTestId("grid-header-cell-1"));
            Assert.assertTrue(ElementHelper.isElementDisplayed(Helper.locateElementByTestId("column-insights-panel")));
        } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }

    @Then("Verify if user changes the data type")
    public void verifyIfUserChangesTheDataType() {
        try {
            WaitHelper.waitForPageToLoad();
            ElementHelper.clickOnElement(Helper.locateElementByTestId("input-select-column-insights"));
            WaitHelper.waitForPageToLoad();
            ElementHelper.clickOnElement(Helper.locateElementByTestId("select-1"));
        } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }

    @Then("verify if selected datatype is displayed for column as per \\\"(.*)\\\"")
    public void datatypeDisplayed(int id) {
        try {
            String text = Helper.locateElementByTestId("input-select-column-insights").getText();
            ElementHelper.clickOnElement(Helper.locateElementByTestId("input-select-column-insights"));
            String edited = Helper.locateElementByTestId("select-" + id).getText();
            if (edited.equals(text)) {
                ElementHelper.clickOnElement(Helper.locateElementByTestId("close-icon"));
                String columnType = Helper.locateElementByTestId("typography-component-" + edited).getText();
                Assert.assertEquals(columnType, edited);
            }
        } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }

    @Then("Click on the Cross icon")
    public void clickOnTheCrossIcon() {
        try {
            WaitHelper.waitForPageToLoad();
            ElementHelper.clickOnElement(Helper.locateElementByTestId("close-icon"));
        } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }
}
