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
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;

public class MaskData {
    @Given("Navigate to Home Page of Wrangle")
    public void navigateToTheHomePage() {
        SeleniumDriver.openPage(Constants.WRANGLE_HOME_URL);
        WaitHelper.waitForPageToLoad();
    }

    @Then("Click on the Data Explorations card")
    public void clickOnTheDataExplorationCard() {
        try {
            WaitHelper.waitForPageToLoad();
            ElementHelper.clickOnElement(Helper.locateElementByTestId("ongoing-data-explore-card-link-1"));
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

    @Then("Click on the Security icon")
    public void clickOnTheSecurityIcon() {
        try {
            WaitHelper.waitForPageToLoad();
            WaitHelper.waitForElementToBeDisplayed(Helper.locateElementByTestId("toolbar-icon-button-Security"));
            WebElement ele = SeleniumDriver.getDriver()
                    .findElement(By.xpath("//*[@data-testid='toolbar-icon-button-Security']"));
            JavascriptExecutor executor = (JavascriptExecutor) SeleniumDriver.getDriver();
            executor.executeScript("arguments[0].click();", ele);
        } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }

    @Then("Click on the Mask Data")
    public void clickOnTheMaskData() {
        try {
            WaitHelper.waitForPageToLoad();
            WaitHelper.waitForElementToBeDisplayed(Helper.locateElementByTestId("menu-item-mask-data"));
            WebElement ele = SeleniumDriver.getDriver()
                    .findElement(By.xpath("//*[@data-testid='menu-item-mask-data']"));
            JavascriptExecutor executor = (JavascriptExecutor) SeleniumDriver.getDriver();
            executor.executeScript("arguments[0].click();", ele);
        } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }

    @Then("Click on the Show last four characters only")
    public void clickOnTheShowLastFourCharactersOnly() {
        try {
            WaitHelper.waitForPageToLoad();
            WaitHelper.waitForElementToBeDisplayed(Helper.locateElementByTestId("menu-item-mask-data-last-4-digit"));
            WebElement ele = SeleniumDriver.getDriver()
                    .findElement(By.xpath("//*[@data-testid='menu-item-mask-data-last-4-digit']"));
            JavascriptExecutor executor = (JavascriptExecutor) SeleniumDriver.getDriver();
            executor.executeScript("arguments[0].click();", ele);
        } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }

    @Then("Click on the Show two characters only")
    public void clickOnTheShowLastTwoCharactersOnly() {
        try {
            WaitHelper.waitForPageToLoad();
            WaitHelper.waitForElementToBeDisplayed(Helper.locateElementByTestId("menu-item-mask-data-last-2-digit"));
            WebElement ele = SeleniumDriver.getDriver()
                    .findElement(By.xpath("//*[@data-testid='menu-item-mask-data-last-2-digit']"));
            JavascriptExecutor executor = (JavascriptExecutor) SeleniumDriver.getDriver();
            executor.executeScript("arguments[0].click();", ele);
        } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }

    @Then("Click on the Custom selection")
    public void clickOnTheCustomSelection() {
        try {
            WaitHelper.waitForPageToLoad();
            WaitHelper.waitForElementToBeDisplayed(Helper.locateElementByTestId("menu-item-mask-data-custom-selection"));
            WebElement ele = SeleniumDriver.getDriver()
                    .findElement(By.xpath("//*[@data-testid='menu-item-mask-data-custom-selection']"));
            JavascriptExecutor executor = (JavascriptExecutor) SeleniumDriver.getDriver();
            executor.executeScript("arguments[0].click();", ele);
        } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }

    @Then("Click on the By Shuffling")
    public void clickOnTheByShuffling() {
        try {
            WaitHelper.waitForPageToLoad();
            WaitHelper.waitForElementToBeDisplayed(Helper.locateElementByTestId("menu-item-mask-data-shuffle"));
            WebElement ele = SeleniumDriver.getDriver()
                    .findElement(By.xpath("//*[@data-testid='menu-item-mask-data-shuffle']"));
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
            Assert.assertTrue(ElementHelper.isElementDisplayed(
                    Helper.locateElementByTestId("add-transformation-drawer")));
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

    @Then("Click on the radio button of any column with {string}")
    public void clickOnTheRadioButtonOfAnyColumn(String Id) {
        try {
            WaitHelper.waitForPageToLoad();
            ElementHelper.clickOnElement(Helper.locateElementByTestId("radio-input-" + Id));
        } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }

    @Then("Click on the Done button")
    public void clickOnTheDoneButton() {
        try {
            WaitHelper.waitForPageToLoad();
            WaitHelper.waitForElementToBeDisplayed(Helper.locateElementByTestId("button_done"));
            WebElement ele = SeleniumDriver.getDriver().findElement(By.xpath("//*[@data-testid='button_done']"));
            JavascriptExecutor executor = (JavascriptExecutor) SeleniumDriver.getDriver();
            executor.executeScript("arguments[0].click();", ele);
        } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }

    @Then("Click on the Apply Step button")
    public void clickOnTheApplyButton() {
        try {
            WaitHelper.waitForPageToLoad();
            WebElement element = Helper.locateElementByTestId("apply-step-button");
            JavascriptExecutor executor = (JavascriptExecutor)SeleniumDriver.getDriver();
            executor.executeScript("arguments[0].click();", element);
        } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }
    @Then("Click on the Apply mask button")
    public void clickOnApplyMask() {
        try{
        WebElement ele =SeleniumDriver.getDriver().findElement
                (By.xpath("//table//td//p[@data-testid ='grid-text-cell-12']"));
        JavascriptExecutor exe = (JavascriptExecutor)SeleniumDriver.getDriver();
        exe.executeScript("arguments[0].setAttribute('style', 'background: blue;');", ele);
     ele.sendKeys(Keys.CONTROL + "a");
////        ele.sendKeys("A");
        Assert.assertTrue(ElementHelper.isElementDisplayed
                (Helper.locateElementByTestId("mask-selection-parent")));
        WebElement element = Helper.locateElementByTestId("apply-mask-button");
        JavascriptExecutor executor = (JavascriptExecutor)SeleniumDriver.getDriver();
        executor.executeScript("arguments[0].click();", element);
        } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }
}
