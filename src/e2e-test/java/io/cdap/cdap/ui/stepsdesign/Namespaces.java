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
import io.cdap.e2e.utils.PluginPropertyUtils;
import io.cdap.e2e.utils.SeleniumDriver;
import io.cdap.e2e.utils.WaitHelper;
import io.cucumber.java.en.Then;
import org.junit.Assert;
import org.openqa.selenium.WebElement;

import java.util.List;

public class Namespaces {

    @Then("Click on \"Namespaces\" accordion")
    public void openNamespaces() {
        ElementHelper.clickOnElement(Helper.locateElementByTestId("namespaces-accordion"));
    }

    @Then("Verify that the count of namespaces is {int}")
    public void verifyNumberOfNamespace(int count) {
        List<WebElement> rows = Helper.locateElementsByTestId("namespace-row");
        Assert.assertEquals(count, rows.size());
    }

    @Then("Verify that the namespace with the name {string} is present")
    public void verifyNameOfNamespace(String name) {
        List<WebElement> rows = Helper.locateElementsByTestId("namespace-row");
        Assert.assertTrue("Count of namespaces should be > 0.", rows.size() > 0);
        for (WebElement row : rows) {
            if (name.equalsIgnoreCase(ElementHelper.getElementText(row).split("\n")[0])) {
                return;
            }
        }
        Assert.fail(String.format("Namespace with the name '%s' not found.", name));
    }

    @Then("Click on \"Create New Namespace\" button")
    public void createNewNamespace() {
        ElementHelper.clickOnElement(Helper.locateElementByTestId("create-namespace-btn"));
    }

    @Then("Enter {string} as Namespace name")
    public void enterNamespaceName(String name) {
        String namespaceNameInputXPath = "//input[contains(@placeholder, 'Namespace name')]";
        WebElement createNamespaceName = Helper.locateElementByXPath(namespaceNameInputXPath);
        ElementHelper.clearElementValue(createNamespaceName);
        ElementHelper.sendKeysToTextarea(createNamespaceName, name);
    }

    @Then("Enter {string} as Namespace description")
    public void enterNamespaceDescription(String name) {
        String namespaceDescInputXPath = "//input[contains(@placeholder, 'Namespace description')]";
        WebElement createNamespaceDesc = Helper.locateElementByXPath(namespaceDescInputXPath);
        ElementHelper.clearElementValue(createNamespaceDesc);
        ElementHelper.sendKeysToTextarea(createNamespaceDesc, name);
    }

    @Then("Click on the namespace {string} in the namespace list")
    public void clickOnTheNamespace(String namespaceName) {
        List<WebElement> rows = Helper.locateElementsByTestId("namespace-row");
        Assert.assertTrue("Count of namespaces should be > 0.", rows.size() > 0);
        for (WebElement row : rows) {
            if (namespaceName.equalsIgnoreCase(ElementHelper.getElementText(row).split("\n")[0])) {
                ElementHelper.clickOnElement(row);
                WaitHelper.waitForPageToLoad(120);
                return;
            }
        }
        Assert.fail(String.format("Namespace with name '%s' not found.", namespaceName));
    }

    @Then("Open details page of Namespace with name {string}")
    public void openDetailsPageOfNamespace(String namespaceName) {
        String namespaceDetailsUrl = String.format("%s/%s/details", Constants.NAMESPACE_URL, namespaceName);
        SeleniumDriver.openPage(namespaceDetailsUrl);
        WaitHelper.waitForPageToLoad();
    }

    @Then("Verify that the description in the details page matches with {string}")
    public void verifyDetailsDescription(String expectedDetails) {
        String actualDetails = ElementHelper.getElementText(Helper.locateElementByTestId("namespace-description"));
        Assert.assertEquals("Namespace details does not match", actualDetails, expectedDetails);
    }

    @Then("Click on \"Finish\" button")
    public void clickOnFinishCreateNamespace() {
        String wizardFinishButtonXPath = "//button[contains(@data-cy, 'wizard-finish-btn')]";
        ElementHelper.clickOnElement(Helper.locateElementByXPath(wizardFinishButtonXPath));
    }

    @Then("Verify that the namespace creation failed")
    public void verifyNamespaceCreationFailure() {
        String failureMessageXPath = "//span[contains(@class, 'message')]";
        String actualFM = ElementHelper.getElementText(Helper.locateElementByXPath(failureMessageXPath));
        Assert.assertNotNull("Failure message should not be null.", actualFM);
        String expectedFM = (String) PluginPropertyUtils.pluginProp("NamespaceCreationFailureMessage");
        Assert.assertEquals("Failure Error message did not match", expectedFM, actualFM);
    }

    @Then("Verify that the Namespace creation is successful for namespace {string}")
    public void verifyNamespaceCreationSuccess(String namespaceName) {
        String failureMessageXPath = "//span[contains(@class, 'success-message')]";
        String actualSM = ElementHelper.getElementText(Helper.locateElementByXPath(failureMessageXPath));
        Assert.assertNotNull("Failure message should not be null.", actualSM);
        String expectedSM = (String) PluginPropertyUtils.pluginProp("NamespaceCreationSuccessMessage");
        Assert.assertTrue("Failure Error message did not match", actualSM.contains(expectedSM));
    }

    @Then("Close the Create Namespace wizard")
    public void closeCreateNamespaceWizard() {
        String closeCreateNamespaceXPath = "//div[contains(@data-cy, 'wizard-result-icon-close-btn')]";
        ElementHelper.clickOnElement(Helper.locateElementByXPath(closeCreateNamespaceXPath));
    }

    @Then("Verify Namespace not found error for Namespace {string}")
    public void verifyNamespaceNotFoundError(String namespaceName) {
        String actualError = ElementHelper.getElementText(Helper.locateElementByTestId("page-404-error-msg"));
        String expectedError = String.format("'namespace:%s' was not found.", namespaceName);
        Assert.assertEquals("Namespace not found error does not match", actualError, expectedError);
    }
}
