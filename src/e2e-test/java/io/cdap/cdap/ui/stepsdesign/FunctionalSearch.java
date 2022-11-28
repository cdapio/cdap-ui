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

public class FunctionalSearch {
       @Given("Navigate to the Home Page of application")
        public void navigateToHomePage() {
            SeleniumDriver.openPage(Constants.WRANGLE_HOME_URL);
            WaitHelper.waitForPageToLoad();
        }

        @Then("Click on the Ongoing Data Explorations card")
        public void clickOnTheOngoingDataExplorationsCard() {
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

        @Then("Click on the Search field and send the values")
        public void clickOnTheSearchField() {
            try {

//                WebElement element = Helper.locateElementByTestId("function-search-input-field");
                WebElement inputElement = SeleniumDriver.getDriver().findElement(By.xpath
                        ("//*[@data-testid='function-search-input-field']/input[@placeholder='Search for functions']"));
                Assert.assertTrue(ElementHelper.isElementDisplayed(inputElement));
                JavascriptExecutor executor = (JavascriptExecutor)SeleniumDriver.getDriver();
                executor.executeScript("arguments[0].click();", inputElement);
                inputElement.sendKeys("lowercase");
            } catch (Exception e) {
                System.err.println("error:" + e);
            }
        }
    @Then("Click on the transformation from results")
    public void clickOnTheTransformationFromResults() {
        try {
//            WebElement ele = Helper.locateElementByTestId("functions-search-recent-results");
            WaitHelper.waitForPageToLoad();
            ElementHelper.clickOnElement(Helper.locateElementByTestId("search-result-lowercase"));
        } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }

        @Then("Click on the Clear icon")
        public void clickOnTheCloseIcon() {
            try {
                WebElement element = Helper.locateElementByTestId("clear-search-icon");
                WaitHelper.waitForPageToLoad();
                element.click();
            } catch (Exception e) {
                System.err.println("error:" + e);
            }
        }

    @Then("Verify if the user is on the Add transformation page")
    public void verifyIfTheUserIsOnTheAddTransformationPanel() {
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

    @Then("Click on the radio button of any column")
    public void clickOnTheRadioButtonOfAnyColumn() {
        try {
            WaitHelper.waitForPageToLoad();
            ElementHelper.clickOnElement(Helper.locateElementByTestId("radio-input-0"));
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

