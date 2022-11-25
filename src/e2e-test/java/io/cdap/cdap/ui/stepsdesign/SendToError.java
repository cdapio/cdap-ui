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

public class SendToError {
        @Given("Navigate to Home Page")
        public void navigateToTheHomePage() {
            SeleniumDriver.openPage(Constants.WRANGLE_HOME_URL);
            WaitHelper.waitForPageToLoad();
        }

        @Then("Click on the Data Explorations card")
        public void clickOnTheDataExplorationCard() {
            try {
                WaitHelper.waitForPageToLoad();
                ElementHelper.clickOnElement(Helper.locateElementByTestId("ongoing-data-exploration-card-1  "));
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

        @Then("Click on the Other icon")
        public void clickOnTheOtherIcon() {
            try {
                WaitHelper.waitForPageToLoad();
                ElementHelper.clickOnElement(Helper.locateElementByTestId("toolbar-icon-button-Other"));
            } catch (Exception e) {
                System.err.println("error:" + e);
            }
        }

        @Then("Click on the Send to error")
        public void clickOnTheSendToErrorOption() {
            try {
                WaitHelper.waitForPageToLoad();
                WaitHelper.waitForElementToBeDisplayed(Helper.locateElementByTestId("toolbar-icon-button-send-to-error"));
                WebElement ele=Helper.locateElementByTestId("toolbar-icon-button-send-to-error");
                JavascriptExecutor executor = (JavascriptExecutor) SeleniumDriver.getDriver();
                executor.executeScript("arguments[0].click();", ele);
            } catch (Exception e) {
                System.err.println("error:" + e);
            }
        }

        @Then("Verify if the user is on the Add transformation page")
        public void verifyIfTheUserIsOnTheAddTransformationPanel() {
            try {
                WaitHelper.waitForPageToLoad();
                Assert.assertTrue(ElementHelper.isElementDisplayed(
                        Helper.locateElementByTestId("add-transformation-panel")));
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
                ElementHelper.clickOnElement(Helper.locateElementByTestId("radio-input-1"));
            } catch (Exception e) {
                System.err.println("error:" + e);
            }
        }

        @Then("Click on the Done button")
        public void clickOnTheDoneButton() {
            try {
                WaitHelper.waitForPageToLoad();
                WebElement ele = SeleniumDriver.getDriver().findElement(By.xpath("//*[@data-testid='button_done']"));
                JavascriptExecutor executor = (JavascriptExecutor)SeleniumDriver.getDriver();
                executor.executeScript("arguments[0].click();", ele);
            } catch (Exception e) {
                System.err.println("error:" + e);
            }
        }

        @Then("Click on the value input field")
        public void clickOnTheValueInputField() {
            try {
                WaitHelper.waitForPageToLoad();
                JavascriptExecutor js = (JavascriptExecutor) SeleniumDriver.getDriver();
                js.executeScript("window.scrollTo(0, document.body.scrollHeight)");
                WaitHelper.waitForElementToBeDisplayed(Helper.locateElementByTestId("select-input-root"));
                ElementHelper.clickOnElement(Helper.locateElementByTestId("select-input-root"));
            } catch (Exception e) {
                System.err.println("error:" + e);
            }
        }
    @Then("enter value in the field")
    public void enterValueInField() {
        try {
            WaitHelper.waitForPageToLoad();
            JavascriptExecutor js = (JavascriptExecutor) SeleniumDriver.getDriver();
            js.executeScript("window.scrollTo(0, document.body.scrollHeight)");
            WaitHelper.waitForElementToBeDisplayed(Helper.locateElementByTestId("form-input-send-to-error-custom-input"));
            WebElement ele = Helper.locateElementByTestId("send-to-error-custom-input");
            JavascriptExecutor executor = (JavascriptExecutor)SeleniumDriver.getDriver();
            executor.executeScript("arguments[0].click();", ele);
            ele.sendKeys("Jarred");
        } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }

        @Then("Select any value from the dropdown")
        public void selectAnyValueFromTheDropdown() {
            try {
                WaitHelper.waitForPageToLoad();
                WaitHelper.waitForElementToBeDisplayed(Helper.locateElementByTestId("select-option-list-1"));
                ElementHelper.clickOnElement(Helper.locateElementByTestId("select-option-list-1"));
            } catch (Exception e) {
                System.err.println("error:" + e);
            }
        }

        @Then("Click on the Apply step button")
        public void clickOnTheApplyButton() {
            try {
                WaitHelper.waitForPageToLoad();
                ElementHelper.clickOnElement(Helper.locateElementByTestId("apply-step-button"));
            } catch (Exception e) {
                System.err.println("error:" + e);
            }
        }
    }
