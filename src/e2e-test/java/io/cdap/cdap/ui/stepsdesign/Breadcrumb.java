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

import io.cdap.cdap.ui.utils.Helper;
import io.cdap.e2e.utils.ElementHelper;
import io.cdap.e2e.utils.WaitHelper;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import io.cucumber.java.en.When;

public class Breadcrumb {
    ChromeDriver driver;

    @Given("Navigate to the home page")
    public void navigateToTheHomePage() {
        driver = new ChromeDriver();
        driver.get("http://localhost:11011/cdap/ns/default/home");
        WaitHelper.waitForPageToLoad();
    }

    @Then("Click on the Data source")
    public void clickOnTheDatasource() {
        WaitHelper.waitForPageToLoad();
        driver.findElement(By.cssSelector(Helper.getCssSelectorByDataTestId("wranglecard-link-1"))).click();
    }

    @Then("Click on the first tab of second column")
    public void clickOnTheFirstTabOfSecondColumn() {
        WaitHelper.waitForPageToLoad();
        driver.findElement(By.cssSelector(Helper.getCssSelectorByDataTestId("connectionlist-connectiontabs-tabs-loop-1-0"))).click();
    }
    @Then("Click on the first tab of third column")
    public void clickOnTheFirstTabOfThirdColumn() {
        WaitHelper.waitForPageToLoad();
        driver.findElement(By.id("connectionlist-connectiontabs-tabs-loop-2-0")).click();
    }
    @When("Hover&Click on the Wrangler")
    public void hoverAndClickOnTheWrangler() {
        WaitHelper.waitForPageToLoad();
        WebElement ele = driver.findElement(By.id("connectionlist-connectiontabs-label-loop-3-0"));
        Actions action = new Actions(driver);
        WaitHelper.waitForPageToLoad();
        action.moveToElement(ele).perform();
        WaitHelper.waitForPageToLoad();
        driver.findElement(By.id("tablabelcansample-typography-2")).click();
    }
    @Then("Click on the Data Sources link")
    public void clickONTheDataSourcesLink() {
        WaitHelper.waitForPageToLoad();
        driver.findElement(By.id("breadcrumb-data-sources-text")).click();
    }
    @Then("Click on the Home link")
    public void clickOnTheHomeLink() {
        WaitHelper.waitForPageToLoad();
        driver.findElement(By.id("breadcrumb-home-text")).click();
    }
    @Then("Click on the Home link button")
    public void clickOnTheHomeLinkButton() {
        WaitHelper.waitForPageToLoad();
        driver.findElement(By.id("connectionlist-subheader-1")).click();
    }
    @Then("Click on the Exploration card")
    public void clickOnTheExplorationCard() {
        WaitHelper.waitForPageToLoad();
        driver.findElement(By.cssSelector(Helper.getCssSelectorByDataTestId("ongoingdataexplorations-link-1"))).click();
    }
    @Then("Check the user navigated back to home page or not")
    public void dashboard() {
        WaitHelper.waitForPageToLoad();
        WebElement text= driver.findElement(By.id("wranglehome-1"));
    }
}
