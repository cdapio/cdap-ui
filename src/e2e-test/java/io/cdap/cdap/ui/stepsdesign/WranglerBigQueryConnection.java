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

public class WranglerBigQueryConnection {
    public static final String TYPE_BIGQUERY = "BigQuery";
    public static final String DEFAULT_BIGQUERY_INSTANCE = "cdap_gcp_ui_test";

    public static final String DEFAULT_BIGQUERY_TABLE = "users";

    @When("Open BigQuery connection {string} page")
    public static void openBigQueryConnectionPage(String connectionName) {
        Commands.openConnectionPage(TYPE_BIGQUERY, connectionName);
    }

    @Then("Test BigQuery connection with name {string}")
    public void testBigQueryConnection(String connectionName) {
        Commands.testConnection(TYPE_BIGQUERY, connectionName, null, null);
    }

    @Then("Verify for successful BigQuery test connection and message")
    public void verifyTestConnectionSuccess() {
        String statusText = ElementHelper.getElementText(
                Helper.locateElementByTestId("connection-test-success"));
        Assert.assertEquals(statusText, "Successfully connected.");
    }

    @Then("Test BigQuery connection with {string}, {string}, {string}")
    public void testBigQueryGCPConnection(String connectionName, String projectId, String serviceAccountPath) {
        Commands.testConnection(TYPE_BIGQUERY, connectionName, projectId, null);
    }

    @Then("Verify BigQuery test connection failure and message")
    public void verifyTestConnectionFailure() {
        String statusText = ElementHelper.getElementText(
                Helper.locateElementByTestId("connection-test-failure"));
        Assert.assertTrue(statusText.contains("Could not connect to BigQuery:"));
    }

    @Then("Create BigQuery connection with name {string}")
    public static void createGCPBigQueryConnection(String connectionName) {
        Commands.createConnection(TYPE_BIGQUERY, connectionName);
    }

    @Then("Verify navigation to created BigQuery connection {string}")
    public static void verifyNavigationToConnection1(String connectionName) {
        String cssSelector = "connection-" + "BigQuery" + "-" + connectionName;
        WaitHelper.waitForElementToBePresent(
                By.cssSelector(
                        Helper.getCssSelectorByDataTestId(cssSelector)));
        Commands.testConnectionNavigation(connectionName, "/");
    }

    @Then("Check for the BigQuery connection already exists error for {string}")
    public static void checkConnectionAlreadyExistsError1(String connectionName) {
        String errorText = ElementHelper.getElementText(
                Helper.locateElementByCssSelector("div[class*='modal-content'] > div[class*='error']"));
        Assert.assertTrue(errorText.contains("'" + connectionName + "' already exists"));
    }

    @Then("Select BigQuery connection {string}")
    public static void selectConnection1(String connectionName) {
        Commands.selectConnection(TYPE_BIGQUERY, connectionName);
    }

    @Then("Check BigQuery connection {string} details: Instance, Database, Table")
    public static void checkConnectionDetails(String connectionName) {
        ElementHelper.clickOnElement(
                 Helper.locateElementByXPath(
                         "//div[@data-testid='connection-browser']//*[text()='" + DEFAULT_BIGQUERY_INSTANCE + "']"),
                5);

        ElementHelper.clickOnElement(
                Helper.locateElementByXPath(
                        "//div[@data-testid='connection-browser']//*[text()='" + DEFAULT_BIGQUERY_TABLE + "']"),
                5);

        String elementText = connectionName + " - /" + DEFAULT_BIGQUERY_INSTANCE
                +  "/" + DEFAULT_BIGQUERY_TABLE;
        WaitHelper.waitForElementToBePresent(
                By.xpath("//div[text()='" + elementText + "']"));
    }

    @Then("Verify URL navigation for BigQuery connection")
    public static void verifyURLNavigation1() {
        Assert.assertTrue(SeleniumDriver.getDriver().getCurrentUrl().contains("/ns/default/wrangler"));
    }

    @Then("Check for BigQuery connection {string} not found message")
    public static void verifyConnectionPageNotFound1(String connectionName) {
        String errorText = "\"Connection '" + connectionName + "' in namespace 'default' not found\"";
        String xpathExpression = "//*[contains(text(), " + errorText + ")]";
        boolean isElementPresent = ElementHelper.isElementDisplayed(By.xpath(xpathExpression), 5);
        Assert.assertTrue(isElementPresent);
    }

    @Then("Delete BigQuery connection {string}")
    public static void deleteGCPBigQueryConnection(String connectionName) {
        Commands.deleteConnection(TYPE_BIGQUERY, connectionName);
    }

    @Then("Confirm that the BigQuery connection {string} is deleted")
    public static void confirmBigQueryConnectionDelete(String connectionName) {
        String connectionLocatorName = "connection-" + TYPE_BIGQUERY + "-" + connectionName;
        WaitHelper.waitForElementToBeHidden(
                By.xpath("//*[@data-testid='" + connectionLocatorName + "']"), 5);
        boolean isConnectionExists = Helper.isElementExists(
                Helper.getCssSelectorByDataTestId(connectionLocatorName));
        Assert.assertFalse(isConnectionExists);
    }
}
