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

public class FooterPanel {
    @Given("Navigate to the Home Page")
    public void navigateToTheHomePage() {
        SeleniumDriver.openPage(Constants.WRANGLE_HOME_URL);
        WaitHelper.waitForPageToLoad();
    }
    @Then("Click on the Data Explorations card")
    public void clickOnTheDataExplorationCard() {
        WaitHelper.waitForPageToLoad();
        ElementHelper.clickOnElement(Helper.locateElementByTestId("wrangler-home-ongoing-data-exploration-card-0"));
        String url = SeleniumDriver.getDriver().getCurrentUrl();
        Assert.assertTrue(url.contains("http://localhost:11011/cdap/ns/default/wrangler-grid"));
        System.out.println("Clicked the data exploration card");
    }
    @Then("Verify if the Footer Panel is displayed")
    public void verifyIfTheFooterPanelIsDisplayed() {
        WaitHelper.waitForPageToLoad();
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
    }
    @Then("Verify if the elements on the Footer Panel are displayed")
    public void verifyIfTheElementsOnTheFooterPanelAreDisplayed() {
        WaitHelper.waitForPageToLoad();
        Assert.assertTrue(Helper.isElementExists(Helper.getCssSelectorByDataTestId
                ("footer-panel-column-view-panel-tab")));
        System.out.println("Column icon is displayed");
        Assert.assertTrue(Helper.isElementExists(Helper.getCssSelectorByDataTestId("footer-panel-meta-info-tab")));
        System.out.println("Column Title is displayed");
        Assert.assertTrue(Helper.isElementExists(Helper.getCssSelectorByDataTestId("footer-panel-zoom-tab")));
        System.out.println("Zoom Element is displayed");
        Assert.assertTrue(Helper.isElementExists(Helper.getCssSelectorByDataTestId("footer-panel-directives-tab")));
        System.out.println("Directives element is displayed");
        Assert.assertTrue(Helper.isElementExists(Helper.getCssSelectorByDataTestId("footer-panel-recipe-steps-tab")));
        System.out.println("Recipe element is displayed");
    }
}
