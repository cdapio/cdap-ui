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

public class ImportSchema {
    @Given("Navigate to the Home Page")
    public void navigateToTheHomePage() {
        SeleniumDriver.openPage(Constants.WRANGLE_HOME_URL);
        WaitHelper.waitForPageToLoad();
    }

    @Then("Click on the Connector type card \\\"(.*)\\\"")
    public void clickOnTheConnectorTypeCard(String type) {
        WaitHelper.waitForPageToLoad();
        ElementHelper.clickOnElement(Helper.locateElementByTestId("connector-type-" + type));
    }


    @Then("Click on the Wrangle button \\\"(.*)\\\" and \\\"(.*)\\\"")
    public void clickOnFirstTabOfTheSecondColumn2(int fTab, int fFile) {
        try {
            for (int i = 1; i <= 10; i++) {
                WebElement ele = Helper.locateElementByTestId("connection-tab-each-" + i + "0");
                try {
                    if(i == fTab){
                        JavascriptExecutor js = (JavascriptExecutor) SeleniumDriver.getDriver();
                        js.executeScript("window.scrollTo(0, document.body.scrollHeight)");
                        Helper.locateElementByTestId("connection-tab-each-" + i + "12").click();
                        Helper.locateElementByTestId("connection-tab-each-" + fFile);
                        WebElement button = Helper.locateElementByTestId("connections-label-" + fFile);
                        System.out.println("label button found");
                        ElementHelper.hoverOverElement(button);
//                     WaitHelper.waitForElementToBePresent(By.cssSelector("load-to-grid-wrapper"));
                        WebElement gridBtn = SeleniumDriver.getDriver().findElement(By.xpath
                                ("//button[@data-testid='load-to-grid-wrapper']//p[@data-testid='load-to-grid-button']"));
//                     ElementHelper.hoverOverElement(gridBtn);
                        JavascriptExecutor executor = (JavascriptExecutor)SeleniumDriver.getDriver();
                        executor.executeScript("arguments[0].click();", gridBtn);
                        boolean flag = true;
                        while (flag == true) {
                            flag = Helper.isElementExists(Helper.getCssSelectorByDataTestId("loading-indicator"));
                        }
                        System.out.println("wrangle clicked");
                        break;
                    }
                } catch (Exception e) {
                    System.err.println("error: " + e);
                }
                if (Helper.isElementExists("snackbar-alert")) {
                    ElementHelper.clickOnElement(Helper.locateElementByTestId("snackbar-close-icon"));
                    break;
                }

                else {
                    ele.click();
                    System.out.println("folder clicked");
                }
            }

        } catch (Exception e) {
            System.err.println("error: " + e);
        }
    }

    @Then("Verify if grid page is displayed")
    public void parsingPanel() {
        try {

            String url = SeleniumDriver.getDriver().getCurrentUrl();
            System.out.println(url);
            Assert.assertTrue(url.contains
                    ("http://localhost:11011/cdap/ns/default/wrangler-grid"));
        } catch (Exception e) {
            System.err.println("error: " + e);
        }
    }

    @Then("Verify if snackbar is displayed")
    public void clickOnTheSnackBar() {
        try {
            WaitHelper.waitForPageToLoad();
            WebElement ele = Helper.locateElementByTestId("snackbar-alert");
            String message = ele.getText();
            Assert.assertTrue(message.contains("Success"));
        } catch (Exception e) {
            System.err.println("error: " + e);
        }
    }

    @Then("Click on the importschema button and select file {string}")
    public void clickOnImportSchemaButton(String file) {
        try {
            WaitHelper.waitForPageToLoad();
            ElementHelper.clickOnElement(Helper.locateElementByTestId("import-schema-text"));
            Helper.locateElementByTestId("fileinput").sendKeys(file);
        } catch (Exception e) {
            System.err.println("error: " + e);
        }
    }

    @Then("Click on the Apply button")
    public void clickOnTheApplyButton() {
        try {
            WaitHelper.waitForPageToLoad();
            ElementHelper.clickOnElement(Helper.locateElementByTestId("parsing-apply-button"));
        } catch (Exception e) {
            System.err.println("error: " + e);
        }
    }
}
