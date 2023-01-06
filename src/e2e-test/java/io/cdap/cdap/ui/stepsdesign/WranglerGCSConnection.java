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


import io.cdap.cdap.ui.utils.Commands;
import io.cdap.cdap.ui.utils.Helper;
import io.cdap.e2e.utils.ElementHelper;
import io.cdap.e2e.utils.SeleniumDriver;
import io.cdap.e2e.utils.WaitHelper;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.junit.Assert;
import org.openqa.selenium.By;

public class WranglerGCSConnection {
    public static final String TYPE_GCS = "GCS";
    public static final String  DEFAULT_GCS_FOLDER = "000cdap-gcp-ui-test";
    public static final String  DEFAULT_GCS_FILE = "purchase_bad.csv";

    @When("Open GCS connection {string} page")
    public static void openGCSConnectionPage(String connectionName) {
        Commands.openConnectionPage(TYPE_GCS, connectionName);
    }

    @Then("Test GCS connection with name {string}")
    public void testGCSConnection(String connectionName) {
        Commands.testConnection(TYPE_GCS, connectionName, null, null);
    }

    @Then("Verify for successful GCS test connection and message")
    public void verifyTestConnectionSuccess() {
        String statusText = ElementHelper.getElementText(
                Helper.locateElementByTestId("connection-test-success"));
        Assert.assertEquals(statusText, "Successfully connected.");
    }

    @Then("Test GCS connection with {string}, {string}, {string}")
    public void testGCSGCPConnection(String connectionName, String projectId, String serviceAccountPath) {
        Commands.testConnection(TYPE_GCS, connectionName, projectId, serviceAccountPath);
    }

    @Then("Verify GCS test connection failure and message")
    public void verifyTestConnectionFailure() {
        String statusText = ElementHelper.getElementText(
                Helper.locateElementByTestId("connection-test-failure"));
        Assert.assertTrue(statusText.contains("Service account provided is not valid"));
    }

    @Then("Create GCS connection with name {string}")
    public static void createGCPGCSConnection(String connectionName) {
        Commands.createConnection(TYPE_GCS, connectionName);
    }

    @Then("Verify navigation to created GCS connection {string}")
    public static void verifyNavigationToConnection1(String connectionName) {
        String cssSelector = "connection-" + "GCS" + "-" + connectionName;
        WaitHelper.waitForElementToBePresent(
                By.cssSelector(
                        Helper.getCssSelectorByDataTestId(cssSelector)));
        Commands.testConnectionNavigation(connectionName, "/");
    }

    @Then("Check for the GCS connection already exists error for {string}")
    public static void checkConnectionAlreadyExistsError1(String connectionName) {
        String errorText = ElementHelper.getElementText(
                Helper.locateElementByCssSelector("div[class*='modal-content'] > div[class*='error']"));
        Assert.assertTrue(errorText.contains("'" + connectionName + "' already exists"));
    }

    @Then("Select GCS connection {string}")
    public static void selectConnection1(String connectionName) {
        Commands.selectConnection(TYPE_GCS, connectionName);
    }

    @Then("Check GCS connection {string} details: Folder, file")
    public static void checkConnectionDetails(String connectionName) {
        ElementHelper.clickOnElement(
                Helper.locateElementByXPath(
                        "//div[@data-testid='connection-browser']//*[text()='" + DEFAULT_GCS_FOLDER + "']"),
                6);
        ElementHelper.clickOnElement(
                Helper.locateElementByXPath(
                        "//div[@data-testid='connection-browser']//*[text()='" + DEFAULT_GCS_FILE + "']"),
                6);
        ElementHelper.clickOnElement(Helper.locateElementByTestId("parsing-config-confirm"));
        WaitHelper.waitForElementToBeHidden(Helper.locateElementByTestId("parsing-config-confirm"));
    }

    @Then("Verify URL navigation for GCS connection")
    public static void verifyURLNavigation1() {
        System.out.println(SeleniumDriver.getDriver().getCurrentUrl());
        Assert.assertTrue(SeleniumDriver.getDriver().getCurrentUrl().contains("/ns/default/wrangler"));
    }

    @Then("Check for GCS connection {string} not found message")
    public static void verifyConnectionPageNotFound1(String connectionName) {
        String errorText = "\"Connection '" + connectionName + "' in namespace 'default' not found\"";
        String xpathExpression = "//*[contains(text(), " + errorText + ")]";
        boolean isElementPresent = ElementHelper.isElementDisplayed(By.xpath(xpathExpression), 5);
        Assert.assertTrue(isElementPresent);
    }

    @Then("Delete GCS connection {string}")
    public static void deleteGCPGCSConnection(String connectionName) {
        Commands.deleteConnection(TYPE_GCS, connectionName);
    }

    @Then("Confirm that the GCS connection {string} is deleted")
    public static void confirmGCSConnectionDelete(String connectionName) {
        String connectionLocatorName = "connection-" + TYPE_GCS + "-" + connectionName;
        WaitHelper.waitForElementToBeHidden(
                By.xpath("//*[@data-testid='" + connectionLocatorName + "']"), 5);
        boolean isConnectionExists = Helper.isElementExists(
                Helper.getCssSelectorByDataTestId(connectionLocatorName));
        Assert.assertFalse(isConnectionExists);
    }
}
