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
import io.cdap.cdap.ui.utils.Constants;
import io.cdap.cdap.ui.utils.Helper;
import io.cdap.e2e.utils.ElementHelper;
import io.cdap.e2e.utils.SeleniumDriver;
import io.cdap.e2e.utils.WaitHelper;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.junit.Assert;
import org.openqa.selenium.By;

public class WranglerSpanner {
    public static final String TYPE_SPANNER = "Spanner";
    public static final String DEFAULT_SPANNER_INSTANCE = "cdap-gcp-ui-test";
    public static final String DEFAULT_SPANNER_DATABASE = "test";
    public static final String DEFAULT_SPANNER_TABLE = "users";

    @When("Open Connections page")
    public static void openConnectionsPage() {
        SeleniumDriver.openPage(Constants.BASE_STUDIO_URL + "connections");
        WaitHelper.waitForPageToLoad();
    }

    @When("Open connection {string} page")
    public static void openSpannerConnectionPage(String connectionName) {
        Commands.openConnectionPage(TYPE_SPANNER, connectionName);
    }

    @Then("Test Spanner Connection with name {string}")
    public void testSpannerConnection(String connectionName) {
        Commands.testConnection(TYPE_SPANNER, connectionName, null, null);
    }

    @Then("Verify for successful test connection and message")
    public void verifyTestConnectionSuccess() {
        String statusText = ElementHelper.getElementText(
                Helper.locateElementByTestId("connection-test-success"));
        Assert.assertEquals(statusText, "Successfully connected.");
    }

    @Then("Test Spanner Connection with {string}, {string}, {string}")
    public void testSpannerGCPConnection(String connectionName, String projectId, String serviceAccountPath) {
        Commands.testConnection(TYPE_SPANNER, connectionName, projectId, serviceAccountPath);
    }

    @Then("Verify test connection failure and message")
    public void verifyTestConnectionFailure() {
        String statusText = ElementHelper.getElementText(
                Helper.locateElementByTestId("connection-test-failure"));
        Assert.assertTrue(statusText.contains("Could not connect to Spanner"));
    }

    @Then("Create Spanner Connection with name {string}")
    public static void createGCPSpannerConnection(String connectionName) {
        Commands.createConnection(TYPE_SPANNER, connectionName);
    }

    @Then("Verify navigation to created connection {string}")
    public static void verifyNavigationToConnection(String connectionName) {
        String cssSelector = "connection-" + "Spanner" + "-" + connectionName;
        WaitHelper.waitForElementToBePresent(
                By.cssSelector(
                        Helper.getCssSelectorByDataTestId(cssSelector)));
        Commands.testConnectionNavigation(connectionName, "/");
    }

    @Then("Check for the connection already exists error for {string}")
    public static void checkConnectionAlreadyExistsError(String connectionName) {
        String errorText = ElementHelper.getElementText(
                Helper.locateElementByCssSelector("div[class*='modal-content'] > div[class*='error']"));
        Assert.assertTrue(errorText.contains("'" + connectionName + "' already exists"));
    }

    @Then("Select Spanner connection {string}")
    public static void selectConnection(String connectionName) {
        Commands.selectConnection(TYPE_SPANNER, connectionName);
    }

    @Then("Check Connection {string} details: Instance, Database, Table")
    public static void checkConnectionDetails(String connectionName) {
        ElementHelper.clickOnElement(
                 Helper.locateElementByXPath(
                         "//div[@data-testid='connection-browser']//*[text()='" + DEFAULT_SPANNER_INSTANCE + "']"),
                1000);
        ElementHelper.clickOnElement(
                Helper.locateElementByXPath(
                        "//div[@data-testid='connection-browser']//*[text()='" + DEFAULT_SPANNER_DATABASE + "']"),
                1000);
        ElementHelper.clickOnElement(
                Helper.locateElementByXPath(
                        "//div[@data-testid='connection-browser']//*[text()='" + DEFAULT_SPANNER_TABLE + "']"),
                1000);

        String elementText = connectionName + " - /" + DEFAULT_SPANNER_INSTANCE
                + "/" + DEFAULT_SPANNER_DATABASE + "/" + DEFAULT_SPANNER_TABLE;
        WaitHelper.waitForElementToBePresent(
                By.xpath("//div[text()='" + elementText + "']"));
    }

    @Then("Verify URL navigation")
    public static void verifyURLNavigation() {
        Assert.assertTrue(SeleniumDriver.getDriver().getCurrentUrl().contains("/ns/default/wrangler"));
    }

    @Then("Check for connection {string} not found message")
    public static void verifyConnectionPageNotFound(String connectionName) {
        String errorText = "\"Connection '" + connectionName + "' in namespace 'default' not found\"";
        String xpathExpression = "//*[contains(text(), " + errorText + ")]";
        boolean isElementPresent = ElementHelper.isElementDisplayed(By.xpath(xpathExpression), 1000);
        Assert.assertTrue(isElementPresent);
    }

    @Then("Delete Connection {string}")
    public static void deleteGCPSpannerConnection(String connectionName) {
        Commands.deleteConnection(TYPE_SPANNER, connectionName);
    }

    @Then("Confirm that the connection {string} is deleted")
    public static void confirmConnectionDelete(String connectionName) {
        String connectionLocatorName = "connection-" + TYPE_SPANNER + "-" + connectionName;
        WaitHelper.waitForElementToBeHidden(
                By.xpath("//*[@data-testid='" + connectionLocatorName + "']"), 200);
        boolean isConnectionExists = Helper.isElementExists(
                Helper.getCssSelectorByDataTestId(connectionLocatorName));
        Assert.assertFalse(isConnectionExists);
    }
}
