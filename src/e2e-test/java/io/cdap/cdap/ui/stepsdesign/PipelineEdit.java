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

import io.cdap.cdap.ui.types.NodeInfo;
import io.cdap.cdap.ui.utils.Helper;
import io.cdap.e2e.pages.actions.CdfStudioActions;
import io.cdap.e2e.utils.ElementHelper;
import io.cdap.e2e.utils.WaitHelper;
import io.cucumber.java.en.Then;
import org.junit.Assert;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

import java.util.List;
import java.util.stream.Collectors;

public class PipelineEdit {
  private final String cantDeployMessage = "You have not made any changes to the pipeline, deployment is not allowed.";
  private final NodeInfo fileSourceNode = new NodeInfo("logs_data_source", "source", "0");
  private final String latestVersion = "Latest version";
  private final String olderVersion = "Older version";
  private final String testString = "somechanges";

  @Then("Check Pipeline History Button exists")
  public void checkHistoryExists() {
    Assert.assertTrue(Helper.isElementExists(Helper.getCssSelectorByDataTestId(
      "pipeline-history-btn"
    )));
  }

  @Then("Click edit button in Actions dropdown")
  public void clickEdit() {
    ElementHelper.clickOnElement(
      Helper.locateElementByTestId("pipeline-actions-btn")
    );
    ElementHelper.clickOnElement(
      Helper.locateElementByTestId("pipeline-edit-btn")
    );
  }

  @Then("Edit should redirect to studio page")
  public void editRedirectToStudio() {
    Assert.assertTrue(Helper.isElementExists(Helper.getCssSelectorByDataTestId(
      "plugin-Source-group"
    )));
    Assert.assertEquals("Editing in progress", Helper.locateElementByTestId("pipeline-edit-status").getText());
  }

  @Then("Click deploy without any changes should fail")
  public void deployWithoutChanges() {
    ElementHelper.clickOnElement(
      Helper.locateElementByTestId("deploy-pipeline-btn")
    );
    WebElement alertEle = Helper.locateElementByTestId("alert");
    WaitHelper.waitForElementToBeDisplayed(alertEle);
    Assert.assertEquals(cantDeployMessage, alertEle.getText());
    ElementHelper.clickOnElement(Helper.locateElementByTestId("alert-close"));
  }

  @Then("Click on file source node property button")
  public void openFileSourceProperty() {
    CdfStudioActions.navigateToPluginPropertiesPage(fileSourceNode.getNodeName());
  }

  @Then("Modify reference name")
  public void modifyReferenceName() {
    WebElement referenceEle = Helper.locateElementByCssSelector("input[data-testid=referenceName]");
    ElementHelper.clearElementValue(referenceEle);
    ElementHelper.sendKeys(referenceEle, testString);
    ElementHelper.clickOnElement(Helper.locateElementByTestId("close-config-popover"));
  }

  @Then("Click deploy should succeed")
  public void deployWithChanges() {
    ElementHelper.clickOnElement(
      Helper.locateElementByTestId("deploy-pipeline-btn")
    );
    WaitHelper.waitForElementToBeDisplayed(Helper.locateElementByTestId("confirmation-modal"));
    WebElement changeSummaryEle = Helper.locateElementByTestId("change-summary-input");
    ElementHelper.sendKeys(changeSummaryEle, testString);
    ElementHelper.clickOnElement(Helper.locateElementByTestId("Deploy"));
    WaitHelper.waitForPageToLoad();
    Assert.assertTrue(Helper.isElementExists(Helper.getCssSelectorByDataTestId("Deployed")));
  }

  @Then("Pipeline should show latest details")
  public void pipelineShowLatestDetails() {
    Assert.assertEquals(testString, getPipelineDetails("referenceName"));
  }

  @Then("History should show correct number of entries and info")
  public void countHistoryVersions() {
    openHistoryModalIfNotOpen();
    List<WebElement> rows = Helper.locateElementsByTestId("pipeline-history-row");
    Assert.assertEquals(2, rows.size());
    Assert.assertEquals(latestVersion, rows.get(0).findElement(By.cssSelector(
      Helper.getCssSelectorByDataTestId("pipeline-history-date-label")
    )).getText());
    Assert.assertEquals(testString, rows.get(0).findElement(By.cssSelector(
      Helper.getCssSelectorByDataTestId("pipeline-history-description")
    )).getText());
    Assert.assertEquals(olderVersion, rows.get(1).findElement(By.cssSelector(
      Helper.getCssSelectorByDataTestId("pipeline-history-date-label")
    )).getText());
  }

  @Then("View older version should show different details")
  public void viewOlderVersion() {
    List<WebElement> rows = Helper.locateElementsByTestId("pipeline-history-row");
    ElementHelper.clickOnElement(rows.get(1).findElement(By.cssSelector(
      Helper.getCssSelectorByDataTestId("pipeline-history-view")
    )));
    WaitHelper.waitForPageToLoad();
    Assert.assertFalse(testString.equals(getPipelineDetails("referenceName")));
  }

  @Then("Restore an older version should work")
  public void restoreVersion() {
    openHistoryModalIfNotOpen();
    List<WebElement> rows = Helper.locateElementsByTestId("pipeline-history-row");
    ElementHelper.clickOnElement(rows.get(1).findElement(By.cssSelector(
      Helper.getCssSelectorByDataTestId("pipeline-history-restore")
    )));
    Helper.waitSeconds(10);
    Assert.assertFalse(testString.equals(getPipelineDetails("referenceName")));
    openHistoryModalIfNotOpen();
    rows = Helper.locateElementsByTestId("pipeline-history-row");
    Assert.assertEquals(3, rows.size());
    Assert.assertTrue(rows.get(0).findElement(By.cssSelector(
      Helper.getCssSelectorByDataTestId("pipeline-history-description")
    )).getText().contains("Restore version at"));
  }

  @Then("Draft {string} status should be {string}")
  public void getDraftStatus(String pipelineName, String status) {
    Assert.assertEquals(status, Helper.locateElementByTestId(
      "draft-status", Helper.locateElementByTestId("draft-" + pipelineName)).getText());
  }

  @Then("Edit should open a discard modal")
  public void editDiscardModal() {
    WaitHelper.waitForElementToBeDisplayed(Helper.locateElementByTestId("confirmation-modal"));
    Assert.assertTrue(Helper.isElementExists(Helper.getCssSelectorByDataTestId("Discard")));
    Assert.assertTrue(Helper.isElementExists(Helper.getCssSelectorByDataTestId("Continue")));
  }

  @Then("Click Discard draft")
  public void clickDiscardDraft() {
    ElementHelper.clickOnElement(Helper.locateElementByTestId("Discard"));
    WaitHelper.waitForPageToLoad();
  }

  @Then("Click Continue draft")
  public void clickContinueDraft() {
    ElementHelper.clickOnElement(Helper.locateElementByTestId("Continue"));
    WaitHelper.waitForPageToLoad();
  }

  @Then("Verify changes were saved")
  public void verifyChanges() {
    Assert.assertEquals(testString, getPipelineDetails("referenceName"));
  }

  @Then("Draft {string} should not exist")
  public void draftShouldNotExist(String pipelineName) {
    Assert.assertTrue(!Helper.isElementExists(Helper.getCssSelectorByDataTestId("draft-" + pipelineName)));
  }

  @Then("Generated runtime arguments should be empty")
  public void checkRuntimeArgsEmpty() {
    Assert.assertTrue(Helper.locateElementByTestId("generated-runtimeargs-count").getText().charAt(0) == '0');
    ElementHelper.clickOnElement(Helper.locateElementByTestId("generated-runtimeargs"));
    List<WebElement> keys = Helper.locateElementsByTestId("runtimeargs-key");
    List<String> stringKeys = keys.stream()
      .map(element -> element.findElement(By.tagName("input")).getAttribute("value"))
      .collect(Collectors.toList());
    Assert.assertTrue(stringKeys.size() == 1);
    Assert.assertTrue(!stringKeys.contains("app.pipeline.overwriteConfig"));
    Assert.assertTrue(!stringKeys.contains("app.pipeline.instrumentation"));
    ElementHelper.clickOnElement(Helper.locateElementByTestId("pipeline-modeless-close-btn"));
  }

  @Then("Generated runtime arguments should not be empty")
  public void checkRuntimeArgsNotEmpty() {
    Assert.assertFalse(Helper.locateElementByTestId("generated-runtimeargs-count").getText().charAt(0) == '0');
    ElementHelper.clickOnElement(Helper.locateElementByTestId("generated-runtimeargs"));
    List<WebElement> keys = Helper.locateElementsByTestId("runtimeargs-key");
    List<String> stringKeys = keys.stream()
      .map(element -> element.findElement(By.tagName("input")).getAttribute("value"))
      .collect(Collectors.toList());
    Assert.assertTrue(stringKeys.size() > 1);
    Assert.assertTrue(stringKeys.contains("app.pipeline.overwriteConfig"));
    Assert.assertTrue(stringKeys.contains("app.pipeline.instrumentation"));
    ElementHelper.clickOnElement(Helper.locateElementByTestId("pipeline-modeless-close-btn"));
  }

  public String getPipelineDetails(String dataTestId) {
    Helper.waitSeconds();
    CdfStudioActions.navigateToPluginPropertiesPage(fileSourceNode.getNodeName());
    String value = Helper.locateElementByCssSelector("input[data-testid=" + dataTestId + "]").getAttribute("value");
    ElementHelper.clickOnElement(Helper.locateElementByTestId("close-config-popover"));
    return value;
  }

  public void openHistoryModalIfNotOpen() {
    if (!Helper.isElementExists(Helper.getCssSelectorByDataTestId("pipeline-history-modal"))) {
      ElementHelper.clickOnElement(
        Helper.locateElementByTestId("pipeline-history-btn")
      );
      Helper.waitSeconds();
    }
  }
}
