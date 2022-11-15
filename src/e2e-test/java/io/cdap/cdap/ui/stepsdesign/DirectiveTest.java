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

import com.google.cloud.FieldSelector;
import io.cdap.e2e.utils.SeleniumHelper;
import io.cucumber.java.en.Given;
import io.cdap.e2e.utils.WaitHelper;
import io.cdap.cdap.ui.utils.Constants;
import io.cdap.e2e.utils.SeleniumDriver;
import io.cucumber.java.en.Then;
import org.junit.Assert;
import io.cdap.e2e.utils.ElementHelper;
import io.cdap.cdap.ui.utils.Helper;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;

import java.time.Duration;

public class DirectiveTest {
    @Given("Navigate to the Home page")
    public void navigateToHomePage() {
        SeleniumDriver.openPage(Constants.WRANGLE_HOME_URL);
        WaitHelper.waitForPageToLoad();
    }

    @Then("Click on the Data explorations card")
    public void clickOnTheDataExplorationsCard() {
        try {
            WaitHelper.waitForPageToLoad();
            ElementHelper.clickOnElement(Helper.locateElementByTestId("ongoing-data-explore-card-link-0"));
        } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }

    @Then("Verify if user is on the wrangle page")
    public void verifyIfUserIsOnTheWranglePage() {
        String url = SeleniumDriver.getDriver().getCurrentUrl();
        Assert.assertTrue(url.contains("http://localhost:11011/cdap/ns/default/wrangler-grid"));
    }

    @Then("Verify if the directive panel is displayed")
    public void directivePanelIsDisplayed() {
        try {
            WebElement panel = Helper.locateElementByTestId("directive-input-parent");
            Assert.assertTrue(ElementHelper.isElementDisplayed(panel));
        } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }

    @Then("Enter command in the panel with the data \\\"(.*)\\\"")
    public void checkCommandFunction(int Id) {
        try {
            String text = Helper.locateElementByTestId("table-cell-" + Id).getText();
            String capital = text.toUpperCase();
            WebElement panel = Helper.locateElementByTestId("select-directive-input-search");
            panel.click();
            panel.sendKeys("uppercase:body_2");
            String check = panel.getText();
            panel.sendKeys(Keys.ENTER);
            SeleniumDriver.getDriver().manage().window().maximize();
            SeleniumDriver.getDriver().navigate().refresh();
            WebElement ele = Helper.locateElementByTestId("table-cell-" + Id);
            String newText = ele.getText();
            Assert.assertEquals(capital, newText);
        } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }

    @Then("click on close icon")
    public void closeIcon() {
        try {
            SeleniumDriver.getDriver().navigate().refresh();
            ElementHelper.clickOnElement(Helper.locateElementByTestId("close-directive-panel"));
        } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }
}
