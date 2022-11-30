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

public class OpenWorkspacesList {
    @Given("Navigate to Home Page of Wrangle for Open Workspaces List")
    public void navigateToTheHomePageDefine() {
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
        } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }

    @Then("Click on the open workspaces list")
    public void ClickOnTheOpenWorkspacesList() {
        try {
            WaitHelper.waitForPageToLoad();
            ElementHelper.clickOnElement(Helper.locateElementByTestId("open-workspaces-list-label"));
        } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }

    @Then("Select the workspace from the list")
    public void SelectTheWorkspaceFromTheList() {
        try {
            WaitHelper.waitForPageToLoad();
            Assert.assertTrue(Helper.isElementExists(Helper.getCssSelectorByDataTestId("open-workspaces-list")));
            ElementHelper.clickOnElement(Helper.locateElementByTestId("open-workspace-list-item-1"));
        } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }
}
