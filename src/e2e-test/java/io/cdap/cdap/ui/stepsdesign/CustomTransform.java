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

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebElement;

public class CustomTransform {
    String text;

    @Given("Navigate to the Home page")
    public void navigateToHomePage() {
        SeleniumDriver.openPage(Constants.WRANGLE_HOME_URL);
        WaitHelper.waitForPageToLoad();
    }
    @Then("Click on ongoing data exploration card")
    public void clickOnTheDataExplorationCard() {
        try {
            WaitHelper.waitForPageToLoad();
            ElementHelper.clickOnElement(Helper.locateElementByTestId
                    ("ongoing-data-explore-card-link-0"));
            String url = SeleniumDriver.getDriver().getCurrentUrl();
            Assert.assertTrue(url.contains("http://localhost:11011/cdap/ns/default/wrangler-grid"));
            System.out.println("Clicked on the data explorations card");
        } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }
    @Then("Click on the other icon")
    public void clickOnOtherIcon() {
        try {
            boolean flag = true;
            while (flag == true) {
                if (Helper.isElementExists(Helper.getCssSelectorByDataTestId("loading-indicator"))) {
                    flag = true;
                } else {
                    flag = false;
                }
            }
            text = Helper.locateElementByTestId("grid-cellData-00").getText();
            WaitHelper.waitForElementToBeDisplayed(Helper.locateElementByTestId("toolbar-icon-button-Other"));
            ElementHelper.clickOnElement(Helper.locateElementByTestId
                    ("toolbar-icon-button-Other"));
        } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }
    @Then("Click on the custom transform")
    public void clickOnCustomTransform() {
        try {
            WaitHelper.waitForElementToBeDisplayed(Helper.locateElementByTestId("toolbar-icon-button-customTransform"));
            WebElement ele = SeleniumDriver.getDriver().findElement
                    (By.xpath("//*[@data-testid='toolbar-icon-button-customTransform']"));
            JavascriptExecutor executor = (JavascriptExecutor) SeleniumDriver.getDriver();
            executor.executeScript("arguments[0].click();", ele);
        } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }

    @Then("Verify if the Add transformation panel is displayed")
    public void directivePanelIsDisplayed() {
        try {
            WebElement panel = Helper.locateElementByTestId("add-transformation-drawer");
            Assert.assertTrue(ElementHelper.isElementDisplayed(panel));
        } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }
    @Then("Click on select column and select integer type column")
    public void clickOnSelectColumn() {
        try {
            WaitHelper.waitForElementToBeDisplayed(Helper.locateElementByTestId("select-column-button"));
            ElementHelper.clickOnElement(Helper.locateElementByTestId
                    ("select-column-button"));
            WaitHelper.waitForElementToBeDisplayed(Helper.locateElementByTestId("radio-input-0"));
            ElementHelper.clickOnElement(Helper.locateElementByTestId
                    ("radio-input-0"));
            WaitHelper.waitForElementToBeDisplayed(Helper.locateElementByTestId("button_done"));
            ElementHelper.clickOnElement(Helper.locateElementByTestId
                    ("button_done"));
        } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }
    @Then("Enter custom function \\\"(.*)\\\" in field with a selected column name")
    public void enterCustomFunction(String transform) {
        try {
            WaitHelper.waitForElementToBeDisplayed(Helper.locateElementByTestId("custom-input-value"));
            WebElement field = Helper.locateElementByTestId("custom-input-value");
            field.click();
            field.sendKeys(transform);
        } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }
    @Then("Click on ApplyStep button")
    public void clickOnApplyStepButton() {
        try {
            WaitHelper.waitForElementToBeDisplayed(Helper.locateElementByTestId("apply-step-button"));
            ElementHelper.clickOnElement(Helper.locateElementByTestId
                    ("apply-step-button"));
        } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }

    @Then("verify the transform result of applied column")
    public void resultOfTransform() {
        try {
            SeleniumDriver.getDriver().navigate().refresh();
            String newValue = Helper.locateElementByTestId("grid-cellData-00").getText();
            Assert.assertNotEquals(text, newValue);
        } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }
}
