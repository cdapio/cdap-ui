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
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class RecipeStep {
    @Given("Navigate to the Home page")
    public void navigateToHomePage() {
        SeleniumDriver.openPage(Constants.WRANGLE_HOME_URL);
        WaitHelper.waitForPageToLoad();
    }

    @Then("Click on the Data explorations card")
    public void clickOnTheDataExplorationsCard() {
        try {
            WaitHelper.waitForPageToLoad();
            ElementHelper.clickOnElement(Helper.locateElementByTestId("ongoing-data-explore-0"));
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

    @Then("Enter command in the panel with the data {string}")
    public void checkCommandFunction(String command) {
        try {
            WebElement panel = Helper.locateElementByTestId("select-directive-input-search");
            panel.click();
            panel.sendKeys(command);
            String check = panel.getText();
            panel.sendKeys(Keys.ENTER);
            SeleniumDriver.getDriver().manage().window().maximize();
            SeleniumDriver.getDriver().navigate().refresh();
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

    @Then("Click on 'Recipe steps' button")
    public void clickOnRecipeStepButton() {
        try {
            ElementHelper.clickOnElement(Helper.locateElementByTestId("footerpanel-recipe-steps-label"));
        } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }

    @Then("Verify if recipe panel is displayed")
    public void recipePanelIsDisplayed() {
        try {
        Assert.assertTrue(ElementHelper.isElementDisplayed(Helper.locateElementByTestId("parsing-drawer-container")));
    } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }

    @Then("Click on delete icon of any step with \\\"(.,*)\\\"")
    public void verifyByClickingOnDeleteIcon(int stepId) {
        try {
            WebElement ele = Helper.locateElementByTestId("recipe-step-row-" + stepId);
            Actions action = new Actions(SeleniumDriver.getDriver());
            action.moveToElement(ele).perform();
            ElementHelper.clickOnElement(Helper.locateElementByTestId("recipe-step-1-delete"));
        } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }
    @Then("Verify if user clicks on download icon of recipe panel")
    public void clickOnDownloadIcon() {
        try {
            ElementHelper.clickOnElement(Helper.locateElementByTestId("download-icon"));
        } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }

    @Then("Verify if clicking on close icon of panel")
    public void verifyByClickingOnCloseIcon() {
        try {
            WebDriverWait ele = new WebDriverWait(SeleniumDriver.getDriver(),20);
            ele.until(ExpectedConditions.invisibilityOfElementLocated
                    (By.cssSelector("drawer-widget-close-round-icon")));
            ElementHelper.clickOnElement(Helper.locateElementByTestId("drawer-widget-close-round-icon"));
        } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }
    @Then("verify if recipe step is Deleted with \\\"(.,*)\\\"")
    public void verifyIfRecipeStepDeleted(int stepId) {
        try {
        Assert.assertFalse(Helper.isElementExists("recipe-step-row-" + stepId));
    }catch (Exception e) {
            System.err.println("error:" + e);
        }
    }
}
