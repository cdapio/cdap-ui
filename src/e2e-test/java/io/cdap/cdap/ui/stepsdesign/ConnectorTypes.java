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
import io.cdap.e2e.utils.WaitHelper;
import io.cucumber.java.en.Given;
import io.cdap.e2e.utils.SeleniumDriver;
import io.cucumber.java.en.Then;
import org.junit.Assert;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

public class ConnectorTypes {
    @Given("Navigate to the Home Page")
    public void navigateToTheHomePage() {
        SeleniumDriver.openPage(Constants.WRANGLE_HOME_URL);
        WaitHelper.waitForPageToLoad();
    }
    @Then("Click on the connections available")
    public void clickOnConnections() {
        if (Helper.isElementExists(Helper.getCssSelectorByDataTestId("wrangle-card-add-connection"))) {
            System.out.println("Add Connections Element is found successfully");
            ElementHelper.clickOnElement(Helper.locateElementByTestId("wrangle-card-add-connection"));
            System.out.println("Clicked on Add Connections Element");
            WaitHelper.waitForPageToLoad();
            String ActualText = SeleniumDriver.getDriver().getCurrentUrl();
            Assert.assertEquals(ActualText, "http://localhost:11011/cdap/ns/default/connections/create");
            System.out.println("Navigated to Add Connections Page - Old UI");
        } else {
            System.out.println("Add Connections Element does not exist");
        }
        if (Helper.isElementExists(Helper.getCssSelectorByDataTestId("wrangle-card-postgresql"))) {
            System.out.println("PostgreSQL Element is found successfully");
            ElementHelper.clickOnElement(Helper.locateElementByTestId("wrangle-card-postgresql"));
            System.out.println("Clicked on PostgreSQL Element");
            WaitHelper.waitForPageToLoad();
            String text= SeleniumDriver.getDriver().getCurrentUrl();
            Assert.assertEquals(text,"http://localhost:11011/cdap/ns/default/datasources/PostgreSQL");
            System.out.println("Navigated to Data Source page");
            ElementHelper.clickOnElement(Helper.locateElementByTestId("breadcrumb-home-link"));
            System.out.println("Clicked on Home link");
            String textOne= SeleniumDriver.getDriver().getCurrentUrl();
            Assert.assertEquals(textOne,"http://localhost:11011/cdap/ns/default/home");
            System.out.println("Navigated back to Home Page");
        } else {
            System.out.println("PostgreSQL Element does not exist");
        }
        if(Helper.isElementExists(Helper.getCssSelectorByDataTestId("wrangle-card-file"))){
            ElementHelper.clickOnElement(Helper.locateElementByTestId("wrangle-card-file"));
            System.out.println("Clicked on the File Element");
            WaitHelper.waitForPageToLoad();
            String text= SeleniumDriver.getDriver().getCurrentUrl();
            Assert.assertEquals(text,"http://localhost:11011/cdap/ns/default/datasources/File");
            System.out.println("Navigated to Data Source Page");
            ElementHelper.clickOnElement(Helper.locateElementByTestId("breadcrumb-home-link"));
            System.out.println("Clicked on Home link");
            String textOne= SeleniumDriver.getDriver().getCurrentUrl();
            Assert.assertEquals(textOne,"http://localhost:11011/cdap/ns/default/home");
            System.out.println("Navigated back to Home Page");
        } else {
            System.out.println("File Element does not exist");
        }
    }
    @Then("Check if 'Import Data' is displayed by default or not")
    public void importDataByDefault() {
        WaitHelper.waitForPageToLoad();
        if(Helper.isElementExists(Helper.getCssSelectorByDataTestId("wrangle-card-import-data"))){
            System.out.println("Import Data Element is found successfully");
        } else {
            System.out.println("Import Data Element does not exist");
        }
    }
}