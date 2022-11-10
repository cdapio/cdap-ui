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

public class ImportData {
    @Given("Navigate to Home Page")
    public void navigateToTheHomePage() {
        SeleniumDriver.openPage(Constants.WRANGLE_HOME_URL);
        WaitHelper.waitForPageToLoad();
    }
    @Then("Click on the Connector type card with \\\"(.*)\\\"")
    public void clickOnTheConnectionTypeCard( String testId) {
        try {
            WaitHelper.waitForPageToLoad();
            ElementHelper.clickOnElement(Helper.locateElementByTestId(testId + "-connector-type"));
            String url=SeleniumDriver.getDriver().getCurrentUrl();
            Assert.assertTrue(url.contains("http://localhost:11011/cdap/ns/default/datasources/" + testId));
        } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }
    @Then("Click on the Import Data button")
    public void clickOnTheImportDataCard() {
        try {
        WaitHelper.waitForPageToLoad();
        ElementHelper.clickOnElement(Helper.locateElementByTestId("import-data"));
    } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }
    @Then("Click on the file drop zone to upload a file with {string}")
    public void clickOnTheFileDropZoneToUploadAFile(String file) {
        try {
            WaitHelper.waitForPageToLoad();
            Helper.locateElementByTestId("file-drop-zone").sendKeys(file);
        } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }
    @Then("Click on the Delete icon")
    public void clickOnTheDeleteIon() {
        try {
        WaitHelper.waitForPageToLoad();
        ElementHelper.clickOnElement(Helper.locateElementByTestId("delete-svg"));
    } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }
    @Then("Click on the Cross icon")
    public void clickOnTheCrossIcon() {
        try {
        WaitHelper.waitForPageToLoad();
        ElementHelper.clickOnElement(Helper.locateElementByTestId("drawer-widget-close-round-icon"));
    } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }
    @Then("Click on the Wrangle button")
    public void clickOnTheWrangleIcon() {
        try {
        WaitHelper.waitForPageToLoad();
        ElementHelper.clickOnElement(Helper.locateElementByTestId("upload-button"));
    } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }
}
