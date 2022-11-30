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

public class Zoom {
    @Given("Navigate to the Home Page for Zoom")
    public void navigateToTheHomePageForZoom() {
        SeleniumDriver.openPage(Constants.WRANGLE_HOME_URL);
        WaitHelper.waitForPageToLoad();
    }

    @Then("Click on the Data Explorations card")
    public void clickOnTheDataExplorationCard() {
        try {
            WaitHelper.waitForPageToLoad();
            ElementHelper.clickOnElement(Helper.locateElementByTestId("ongoing-data-exploration-card-0"));
            String url = SeleniumDriver.getDriver().getCurrentUrl();
            Assert.assertTrue(url.contains("http://localhost:11011/cdap/ns/default/wrangler-grid"));
            System.out.println("Clicked the data exploration card");
        } catch (Exception e) {
            System.err.println("error" + e);
        }
    }

    @Then("Verify if the Footer Panel is displayed")
    public void verifyIfTheFooterPanelIsDisplayed() {
        WaitHelper.waitForPageToLoad();
        try {
            boolean flag = true;
            while (flag == true) {
                if (Helper.isElementExists(Helper.getCssSelectorByDataTestId("loading-indicator"))) {
                    flag = true;
                } else {
                    flag = false;
                }
            }
            boolean test = Helper.isElementExists("footer-panel-container");
            boolean footer = Helper.isElementExists(Helper.getCssSelectorByDataTestId("footer-panel-container"));
            if (test == footer) {
                System.out.println("Footer panel is displayed");
            } else {
                System.out.println("Footer panel is not displayed");
            }
        } catch (Exception e) {
            System.err.println("error" + e);
        }
    }

    @Then("Verify if the Zoom element is displayed on the Footer Panel")
    public void verifyIfTheElementsOnTheFooterPanelAreDisplayed() {
        try {
            WaitHelper.waitForPageToLoad();
            Assert.assertTrue(Helper.isElementExists(Helper.getCssSelectorByDataTestId("footer-panel-zoom-tab")));
            System.out.println("Zoom Element is displayed");
        } catch (Exception e) {
            System.err.println("error" + e);
        }
    }

    @Then("Click on the Zoom")
    public void clickOnTheZoom() {
        try {
            WaitHelper.waitForPageToLoad();
            ElementHelper.clickOnElement(Helper.locateElementByTestId("footer-panel-zoom-tab"));
        } catch (Exception e) {
            System.err.println("error" + e);
        }
    }

    @Then("Click on the Increasing zoom element")
    public void clickOnTheIncreasingZoomElement() {
        try {
            WaitHelper.waitForPageToLoad();
            ElementHelper.clickOnElement(Helper.locateElementByTestId("zoom-list-menu-item-6"));
        } catch (Exception e) {
            System.err.println("error" + e);
        }
    }

    @Then("Click on the Decreasing zoom element")
    public void clickOnTheDecreasingZoomElement() {
        try {
            WaitHelper.waitForPageToLoad();
            ElementHelper.clickOnElement(Helper.locateElementByTestId("zoom-list-menu-item-0"));
        } catch (Exception e) {
            System.err.println("error" + e);
        }
    }
}
