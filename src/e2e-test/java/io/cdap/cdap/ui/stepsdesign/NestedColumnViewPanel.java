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

public class NestedColumnViewPanel {
    @Given("Navigate to the Home Page")
    public void navigateToTheHomePage() {
        SeleniumDriver.openPage(Constants.WRANGLE_HOME_URL);
        WaitHelper.waitForPageToLoad();
    }

    @Then("Click on the Ongoing Data Explorations card")
    public void clickOnTheOngoingDataExplorationsCard() {
        try {
            WaitHelper.waitForPageToLoad();
            ElementHelper.clickOnElement(Helper.locateElementByTestId("ongoing-data-exploration0"));
            String url = SeleniumDriver.getDriver().getCurrentUrl();
            Assert.assertTrue(url.contains("http://localhost:11011/cdap/ns/default/wrangler-grid"));
        } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }

    @Then("Verify if the column view button is displayed or not")
    public void verifyIfTheColumnViewButtonDisplayedOrNot() {
        try {
            WaitHelper.waitForPageToLoad();
            boolean flag = true;
            while (flag == true) {
                if (Helper.isElementExists(Helper.getCssSelectorByDataTestId("loading-indicator"))) {
                    flag = true;
                } else {
                    flag = false;
                }
            }
            Assert.assertTrue(
                    Helper.isElementExists(Helper.getCssSelectorByDataTestId("footer-panel-column-view-panel-tab")));
        } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }

    @Then("Click on the Column View button")
    public void clickOnTheColumnViewButton() {
        try {
            WaitHelper.waitForPageToLoad();
            ElementHelper.clickOnElement(Helper.locateElementByTestId("footer-panel-column-view-panel-tab"));
        } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }

    @Then("Verify column names of that file")
    public void verifyColumnNamesOfThatFile() {
        try {
            WaitHelper.waitForPageToLoad();
            String text = Helper.locateElementByTestId("select-column-list-parent").getText();
            String paneltext = Helper.locateElementByTestId("each-column-label-type-2").getText();
            if (text.equals(paneltext)) {
                System.out.println("The column name is present in the panel");
            }
        } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }

    @Then("Click on the any column name from the column view popup")
    public void clickOnTheAnyColumnNameFromTheColumnViewPopup() {
        try {
            WaitHelper.waitForPageToLoad();
            ElementHelper.clickOnElement(Helper.locateElementByTestId("each-column-label-type-2"));
        } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }

    @Then("Verify if the column insights popup is displayed")
    public void verifyIfTheColumnInsightsPopupIsDisplayed() {
        try {
            WaitHelper.waitForPageToLoad();
            Assert.assertTrue(ElementHelper.isElementDisplayed(
                    Helper.locateElementByTestId("column-insights-panel-parent")));
        } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }
}
