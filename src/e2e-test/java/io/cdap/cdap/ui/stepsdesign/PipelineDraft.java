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

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import io.cdap.cdap.ui.utils.Commands;;
import io.cdap.cdap.ui.utils.Constants;
import io.cdap.cdap.ui.utils.Helper;
import io.cdap.e2e.pages.actions.CdfPluginPropertiesActions;
import io.cdap.e2e.pages.actions.CdfStudioActions;
import io.cdap.e2e.utils.ElementHelper;
import io.cdap.e2e.utils.SeleniumDriver;
import io.cdap.e2e.utils.WaitHelper;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.junit.Assert;
import org.openqa.selenium.WebElement;

import java.io.IOException;
import java.io.Reader;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Map;
import java.util.UUID;

public class PipelineDraft {

  public static final Gson GSON = new Gson();
  public static final String DUMMY_PROJECT = "DummyProject";
  public static final String DUMMY_DATASET = "DummyDataset";
  public static final String PIPELINE_TYPE = "cdap-data-pipeline";

  public static String pipelineName = "";
  public static String newPipelineDraftName = "";
  public static String oldApiPipelineDraftName = "";
  public static String draftId = "";


  @When("Create simple pipeline")
  public void createSimplePipeline() {
    Commands.createSimplePipeline();
  }

  @Then(" Open source node property")
  public void openSourceNodeProperty() {
    CdfStudioActions.navigateToPluginPropertiesPage(Commands.simpleSourceNode.getNodeName());
  }

  @Then("Add DummyProject as dataset project")
  public void addProject() throws InterruptedException {
    WebElement projectField = Helper.locateElementByXPath("//input[@data-testid='datasetProject']");
    ElementHelper.replaceElementValue(projectField, DUMMY_PROJECT);
  }

  @Then("Add DummyDataset as dataset")
  public void addDataset() {
    WebElement datasetField = Helper.locateElementByXPath("//input[@data-testid='dataset']");
    ElementHelper.clearElementValue(datasetField);
    ElementHelper.replaceElementValue(datasetField, DUMMY_DATASET);
  }

  @Then("Close source node property")
  public void closeSourceNodeProperty() {
    CdfPluginPropertiesActions.clickCloseButton();
  }

  @Then("Fill in pipeline name")
  public void fillInPipelineName() {
    pipelineName = "Test_Draft_Pipeline_" + UUID.randomUUID();
    ElementHelper.clickOnElement(Helper.locateElementByTestId("pipeline-metadata"));
    ElementHelper.clearElementValue(Helper.locateElementByCssSelector("#pipeline-name-input"));
    ElementHelper.sendKeys(Helper.locateElementByCssSelector("#pipeline-name-input"), pipelineName);
    ElementHelper.clickOnElement(
      Helper.locateElementByTestId("pipeline-metadata-ok-btn"));
  }

  @Then("Check url for draftId string")
  public void checkUrlHasDraftId() {
    Helper.waitSeconds();
    boolean hasDraftId = Helper.urlHasString("draftId");
    Assert.assertTrue(hasDraftId);
  }

  @Then("Reload the page")
  public void reloadPage() {
    Helper.reloadPage();
  }

  @Then("Export the pipeline")
  public void exportPipeline() {
    ElementHelper.clickOnElement(Helper.locateElementByTestId("pipeline-export-btn"));
    // Wait for the download to finish
    Helper.waitSeconds(3);
  }

  @Then("Verify the exported pipeline")
  public void verifyExportedJsonPipeline() throws IOException {
    Reader reader = Files.newBufferedReader(Paths.get(
      Constants.DOWNLOADS_DIR + pipelineName + "-" + PIPELINE_TYPE + ".json"));
    JsonObject jsonObject = GSON.fromJson(reader, JsonObject.class);
    JsonArray stages = jsonObject.getAsJsonObject("config").getAsJsonArray("stages");
    String datasetProject = "";
    String datasetName = "";
    for (JsonElement node : stages) {
      JsonObject nodeObj = node.getAsJsonObject();
      JsonObject nodeProps = nodeObj.get("plugin").getAsJsonObject();
      String nodeType = nodeProps.get("type").getAsString();
      String nodeName = nodeProps.get("name").getAsString();
      if (nodeName.equals(Commands.simpleSourceNode.getNodeName()) &&
        nodeType.equals(Commands.simpleSourceNode.getNodeType())) {
        JsonObject pluginProps = nodeProps.get("properties").getAsJsonObject();
        datasetProject = pluginProps.get("datasetProject").getAsString();
        datasetName = pluginProps.get("dataset").getAsString();
      }
    }
    Assert.assertEquals(datasetName, DUMMY_DATASET);
    Assert.assertEquals(datasetProject, DUMMY_PROJECT);
    reader.close();
  }

  @Then("import pipeline from json {string}")
  public void importPipeline(String jsonFile) {
    Helper.uploadPipelineFromFile(jsonFile);
    fillInPipelineName();
  }

  @Then("Navigate to pipeline drafts page and sort by latest")
  public void navigateToDraftsPage() throws InterruptedException {
    SeleniumDriver.openPage(Constants.PIPELINE_DRAFTS_URL);
    WaitHelper.waitForPageToLoad();
    WebElement lastSavedColumnHeader = Helper.locateElementByTestId("lastSaved");
    // Click twice to sort by latest
    ElementHelper.clickOnElement(lastSavedColumnHeader);
    ElementHelper.clickOnElement(lastSavedColumnHeader);
  }

  @Then("Deploy the last saved pipeline")
  public void deployTheNewestDraftPipeline() {
    ElementHelper.clickOnElement(Helper.locateElementByTestId(("draft-" + pipelineName)));

    ElementHelper.clickOnElement(Helper.locateElementByTestId("deploy-pipeline-btn"));
    String statusText = ElementHelper.getElementText(
      WaitHelper.waitForElementToBeDisplayed(
        Helper.locateElementByTestId("Deployed"), 200)
    );
    Assert.assertEquals(statusText, "Deployed");
  }

  @Then("Check url for draft pipeline name")
  public void checkUrlHasDraftPipelineName() {
    boolean hasPipelineName = Helper.urlHasString(pipelineName);
    Assert.assertTrue(hasPipelineName);
  }

  @Then("Verify the deployed pipeline no longer exists in the drafts page")
  public void verifyDeployedPipelineIsNotInDrafts() {
    SeleniumDriver.openPage(Constants.BASE_STUDIO_URL + "pipelines/drafts");
    WaitHelper.waitForPageToLoad();
    Assert.assertFalse(Helper.isElementExists(Helper.getCssSelectorByDataTestId("draft-" + pipelineName)));
  }

  @Then("Upload draft pipeline from json {string}")
  public void uploadDraftFromJson(String jsonFileName) throws IOException {
    Map draftJson = Helper.generateDraftFromPipelineJson(jsonFileName);
    oldApiPipelineDraftName = draftJson.get("pipelineName").toString();
    newPipelineDraftName = "NewTestPipeline2_" + System.currentTimeMillis();
    int responseCode = Commands.uploadPipelineDraftViaApi(GSON.toJson(draftJson.get("pipelineDraft")));
    Assert.assertEquals(200, responseCode);
  }

  @Then("Open the uploaded draft pipeline")
  public void openUploadedDraft() {
    ElementHelper.clickOnElement(
      Helper.locateElementByTestId("draft-" + oldApiPipelineDraftName));
  }

  @Then("Extract draftId value from the url")
  public void extractDraftIdfromUrl() throws URISyntaxException {
    draftId = Helper.extractQueryParamValue("draftId");
  }

  @Then("Rename draft pipeline name")
  public void renameDraftPipelineName() throws InterruptedException {
    ElementHelper.clickOnElement(Helper.locateElementByTestId("pipeline-metadata"));
    ElementHelper.clearElementValue(Helper.locateElementByCssSelector("#pipeline-name-input"));
    ElementHelper.sendKeys(Helper.locateElementByCssSelector("#pipeline-name-input"), newPipelineDraftName);
    ElementHelper.clickOnElement(
      Helper.locateElementByTestId("pipeline-metadata-ok-btn"));
    CdfStudioActions.closeStatusBannerIfDisplayed();
  }

  @Then("Ensure draft pipeline name is updated and exists with the same id in the backend")
  public void ensureUpdatedPipelineExistsAndOldOneIsDeleted() throws IOException {
    Assert.assertTrue(Helper.isElementExists(Helper.getCssSelectorByDataTestId("draft-" + newPipelineDraftName)));
    int responseCode = Commands.checkDraftPipelineExistsViaApi(draftId);
    Assert.assertEquals(200, responseCode);
  }

  @Then("Delete the latest draft pipeline and verify the deletion")
  public void deleteLatestDraftPipeline() throws InterruptedException {
    WebElement lastSavedPipelineActionPopover = Helper.locateElementByTestId("actions-popover");
    ElementHelper.clickOnElement(lastSavedPipelineActionPopover);
    ElementHelper.clickOnElement(Helper.locateElementByTestId("Delete-on-popover"));
    ElementHelper.clickOnElement(Helper.locateElementByTestId("Delete"));
    Helper.waitSeconds();
    Assert.assertFalse(Helper.isElementExists(Helper.getCssSelectorByDataTestId("draft-" + pipelineName)));
  }

  @Then("Ensure the uploaded draft exists")
  public void ensureUpdatedPipelineExists() {
    Assert.assertTrue(Helper.isElementExists(Helper.getCssSelectorByDataTestId("draft-" + oldApiPipelineDraftName)));
  }

  @Then("Delete the latest uploaded draft pipeline and verify the deletion")
  public void deleteLatestUploadedDraftPipeline() throws InterruptedException {
    WebElement lastSavedPipelineActionPopover = Helper.locateElementByTestId("actions-popover");
    ElementHelper.clickOnElement(lastSavedPipelineActionPopover);
    ElementHelper.clickOnElement(Helper.locateElementByTestId("Delete-on-popover"));
    ElementHelper.clickOnElement(Helper.locateElementByTestId("Delete"));
    Helper.waitSeconds();
    Assert.assertFalse(Helper.isElementExists(Helper.getCssSelectorByDataTestId("draft-" + oldApiPipelineDraftName)));
  }
}
