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
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.openqa.selenium.WebElement;

public class ControlCenter {

    @When("Deploy and test pipeline {string} with pipeline JSON file {string}")
    public void deployAndTestPipeline(String pipelineName, String pipelineJSONfile) {
        Helper.deployAndTestPipeline(pipelineJSONfile, pipelineName);
    }

    @When("Open control center page")
    public void openControlCenterPage() {
        SeleniumDriver.openPage(Constants.BASE_STUDIO_URL + "control");
        WaitHelper.waitForPageToLoad();
    }

    @Then("Find the pipeline {string} in the results")
    public void findPipelineInResults(String pipelineName) {
        WebElement pipelineInResults = Helper.locateElementByCssSelector(
                Helper.getCssSelectorByDataTestId(pipelineName + "-header"));
    }

    @Then("Find filter dropdown and unselect \"applications\"")
    public void unCheckFilterOption() {
        WebElement filterDropdown = Helper.locateElementByTestId("filter-dropdown");
        ElementHelper.clickOnElement(filterDropdown);
        ElementHelper.selectCheckbox(Helper.locateElementByTestId("Applications-input"));
    }

    @Then("Verify that pipeline {string} should not present")
    public void verifyPipeLineNotDisplayed(String pipelineName) {
        String cssSelector = "div[class*='entities-all-list-container'] > "
                + Helper.getCssSelectorByDataTestId(pipelineName + "-header");
        boolean isPipelineFound = Helper.isElementExists(cssSelector);
        if (isPipelineFound) {
            throw new RuntimeException("Applications filter is not working.");
        }
    }

    @Then("Clean up pipeline {string} which is created for testing")
    public static void cleanupPipelinesCreatedForTesting(String pipelineName) {
        Helper.cleanupPipelines(pipelineName);
    }
}
