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

public class Hash {
    @Given("Navigate to Home Page")
    public void navigateToHomePage() {
        SeleniumDriver.openPage(Constants.WRANGLE_HOME_URL);
        WaitHelper.waitForPageToLoad();
    }

    @Then("Click on the Data Explorations card")
    public void dataExplorationsCard() {
        try {
            WaitHelper.waitForPageToLoad();
            ElementHelper.clickOnElement(Helper.locateElementByTestId("ongoing-data-exploration-card-0"));
            String url = SeleniumDriver.getDriver().getCurrentUrl();
            Assert.assertTrue(url.contains("http://localhost:11011/cdap/ns/default/wrangler-grid"));
        } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }

    @Then("Verify if the Transformation Toolbar is displayed on the Grid Page")
    public void verifyIfTheTransformationToolbarIsDisplayedOnTheGridPage() {
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
            Assert.assertTrue(
                    Helper.isElementExists(Helper.getCssSelectorByDataTestId("transformations-toolbar-container")));
        } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }

    @Then("Click on Security icon")
    public void clickOnSecurityIcon() {
        try {
            WaitHelper.waitForPageToLoad();
            ElementHelper.clickOnElement(Helper.locateElementByTestId("toolbar-icon-button-Security"));
        } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }

    @Then("Click on the Hash")
    public void clickOnTheHash() {
        try {
            WaitHelper.waitForPageToLoad();
            WaitHelper.waitForElementToBeDisplayed(Helper.locateElementByTestId("toolbar-icon-button-hash"));
            WebElement ele = SeleniumDriver.getDriver()
                    .findElement(By.xpath("//*[@data-testid='toolbar-icon-button-hash']"));
            JavascriptExecutor executor = (JavascriptExecutor) SeleniumDriver.getDriver();
            executor.executeScript("arguments[0].click();", ele);
        } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }

    @Then("Verify if the user is on the Add transformation step panel")
    public void verifyIfTheUserIsOnTheAddTransformationStepPanel() {
        try {
            WaitHelper.waitForPageToLoad();
            Assert.assertTrue(
                    ElementHelper.isElementDisplayed(Helper.locateElementByTestId("add-transformation-drawer")));
        } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }

    @Then("Click on the Select Column button")
    public void clickOnTheSelectColumnButton() {
        try {
            WaitHelper.waitForPageToLoad();
            ElementHelper.clickOnElement(Helper.locateElementByTestId("select-column-button"));
        } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }

    @Then("Click on the radio button of any column")
    public void clickOnTheRadioButtonOfAnyColumn() {
        try {
            WaitHelper.waitForPageToLoad();
            ElementHelper.clickOnElement(Helper.locateElementByTestId("radio-input-2"));
        } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }

    @Then("Click on the Done button")
    public void clickOnTheDoneButton() {
        try {
            WaitHelper.waitForPageToLoad();
            WaitHelper.waitForElementToBeDisplayed(Helper.locateElementByTestId("button_done"));
            WebElement ele = SeleniumDriver.getDriver().findElement(
                    By.xpath("//*[@data-testid='button_done']"));
            JavascriptExecutor executor = (JavascriptExecutor) SeleniumDriver.getDriver();
            executor.executeScript("arguments[0].click();", ele);
        } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }

    @Then("Click on Hash algorithm dropdown")
    public void clickOnHashAlgorithmFromDropdown() {
        try {
            WaitHelper.waitForPageToLoad();
            Assert.assertTrue(ElementHelper.isElementDisplayed(Helper.locateElementByTestId("hash-container")));
            WebElement element = SeleniumDriver.getDriver()
                    .findElement(By.xpath("//*[@data-testid='select-input-root']"));
            ElementHelper.clickOnElement(element);
        } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }

    @Then("Select value from the Hash algorithm \\\"(.*)\\\"")
    public void selectValueFromTheHashAlgorithm(int testId) {
        try {
            WaitHelper.waitForPageToLoad();
            Assert.assertTrue(ElementHelper.isElementDisplayed(
                    Helper.locateElementByXPath("//div[@data-testid='select-filter-paper']")));
            WebElement element = Helper.locateElementByTestId("select-option-list-" + testId);
            ElementHelper.clickOnElement(element);
        } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }

    @Then("Click on the Checkbox Encode")
    public void clickOnTheCheckboxesEncode() {
        try {
            WaitHelper.waitForPageToLoad();
            ElementHelper.clickOnElement(Helper.locateElementByTestId("input-checkbox-Encode"));
        } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }

    @Then("Click on the Apply Step button")
    public void clickOnTheApplyButton() {
        try {
            WaitHelper.waitForPageToLoad();
            WebElement element = Helper.locateElementByTestId("apply-step-button");
            JavascriptExecutor executor = (JavascriptExecutor) SeleniumDriver.getDriver();
            executor.executeScript("arguments[0].click();", element);
        } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }
}
