/*
 * Copyright © 2023 Cask Data, Inc.
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
import io.cdap.cdap.ui.utils.Commands;
import io.cdap.cdap.ui.utils.Constants;
import io.cdap.cdap.ui.utils.Helper;
import io.cdap.e2e.utils.ElementHelper;
import io.cdap.e2e.utils.WaitHelper;
import io.cucumber.java.en.Then;
import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebElement;

public class PipelineJoiner {
  // pipeline joiner constants
  private static final NodeInfo[] joinerSourceNodes = {Commands.joinerSourceNode1, Commands.joinerSourceNode2};
  private static final String[] joinerSourceRefNames = {"BQ_Source1", "BQ_Source2"};
  private static final String[] joinerTables = {"ninety_nine_cols", "two_hundred_cols"};
  private static final String joinerTestDataset = "joiner_test";
  private static final String joinerTable3 = "sink_table";
  private static final String joinerField0 = "string_field_0";
  private static final String joinerField1 = "string_field_1";
  private static final String joinerField2 = "string_field_2";
  private static final String joinerFieldAlias = "field";

  @Then("Create the joiner pipeline")
  public void createJoinerPipeline() {
    Helper.setNewSchemaEditor(false);
    Commands.createJoinerPipeline();
  }

  @Then("Configure source node {int} property and validate")
  public void configureSourceNodeProperty(int num) {
    int idx = num - 1;
    ElementHelper.hoverOverElement(Commands.getNode(joinerSourceNodes[idx]));
    WaitHelper.waitForElementToBeDisplayed(Helper.locateElementsByTestId("node-properties-btn").get(idx));
    ElementHelper.clickOnElement(Helper.locateElementsByTestId("node-properties-btn").get(idx));
    Commands.sendKeysToInputElementByTestId("referenceName", joinerSourceRefNames[idx]);
    Commands.clearInputAndSendKeysToElementByTestId("project", Constants.DEFAULT_GCP_PROJECTID);
    Commands.sendKeysToInputElementByTestId("dataset", joinerTestDataset);
    Commands.sendKeysToInputElementByTestId("table", joinerTables[idx]);
    Commands.clearInputAndSendKeysToElementByTestId("serviceFilePath", Constants.DEFAULT_GCP_SERVICEACCOUNT_PATH);
    ElementHelper.clickOnElement(Helper.locateElementByTestId("plugin-properties-validate-btn"));
    WaitHelper.waitForElementToBeDisplayed(Helper.locateElementByTestId("plugin-validation-success-msg"));
    WaitHelper.waitForElementToBeDisplayed(Helper.locateElementByTestId(joinerField0 + "-schema-field"));
    WaitHelper.waitForElementToBeDisplayed(Helper.locateElementByTestId(joinerField1 + "-schema-field"));
    WaitHelper.waitForElementToBeDisplayed(Helper.locateElementByTestId(joinerField2 + "-schema-field"));
    Commands.closeConfigPopover();
  }

  @Then("Check joiner node schemas propagated correctly")
  public void validateJoinerNode() {
    openNodeProperty(Commands.joinerJoinerNode);
    WaitHelper.waitForElementToBeDisplayed(Helper.locateElementByTestId("BigQuery-input-stage"));
    WaitHelper.waitForElementToBeDisplayed(Helper.locateElementByTestId("BigQuery2-input-stage"));
  }

  @Then("Clear default schema selection and change alias of field 1")
  public void clearSchemaAndChangeField() {
    ElementHelper.clickOnElement(Helper.locateElementByTestId("BigQuery-stage-expansion-panel"));
    WaitHelper.waitForElementToBeDisplayed(Helper.locateElementByTestId(joinerField0 + "-field-selector-name"));
    WaitHelper.waitForElementToBeDisplayed(Helper.locateElementByTestId(joinerField1 + "-field-selector-name"));
    WaitHelper.waitForElementToBeDisplayed(Helper.locateElementByTestId(joinerField2 + "-field-selector-name"));
    ElementHelper.clickOnElement(Helper.locateElementByTestId("schema-select-btn"));
    ElementHelper.clickOnElement(Helper.locateElementByTestId("select-none-option"));
    ElementHelper.clickOnElement(Helper.locateElementByTestId(joinerField0 + "-field-selector-checkbox"));
    WebElement element = Helper.locateElementByTestId(joinerField0 + "-field-selector-alias-textbox").
      findElement(By.tagName("input"));
    ElementHelper.clearElementValue(element);
    ElementHelper.sendKeys(element, joinerFieldAlias);
    ElementHelper.clickOnElement(Helper.locateElementByTestId("BigQuery-stage-expansion-panel"));
  }

  @Then("Output schema should have the new field aliases")
  public void checkOutputSchema() {
    ElementHelper.clickOnElement(Helper.locateElementByTestId("get-schema-btn"));
    WaitHelper.waitForElementToBeDisplayed(Helper.locateElementByTestId(joinerFieldAlias + "-schema-field"));
    Commands.closeConfigPopover();
  }

  @Then("Configure sink property and validate")
  public void configureSinkNodeProperty() {
    openNodeProperty(Commands.joinerSinkNode);
    Commands.sendKeysToInputElementByTestId("referenceName", "BQ_Sink");
    Commands.clearInputAndSendKeysToElementByTestId("project", Constants.DEFAULT_GCP_PROJECTID);
    Commands.sendKeysToInputElementByTestId("dataset", joinerTestDataset);
    Commands.sendKeysToInputElementByTestId("table", joinerTable3);
    Commands.clearInputAndSendKeysToElementByTestId("serviceFilePath", Constants.DEFAULT_GCP_SERVICEACCOUNT_PATH);
    WaitHelper.waitForElementToBeDisplayed(Helper.locateElementByTestId(joinerFieldAlias + "-schema-field"));
    Commands.closeConfigPopover();
  }

  @Then("Joiner should still render Get Schema button when numPartitions is a macro")
  public void joinerMacroValidation() {
    openNodeProperty(Commands.joinerJoinerNode);
    WaitHelper.waitForElementToBeDisplayed(Helper.locateElementByTestId("get-schema-btn"));
    Commands.clearInputAndSendKeysToElementByTestId("numPartitions", "${testing.macro}");
    Commands.closeConfigPopover();
    openNodeProperty(Commands.joinerJoinerNode);
    WaitHelper.waitForElementToBeDisplayed(Helper.locateElementByTestId("get-schema-btn"));
    Commands.clearInputAndSendKeysToElementByTestId("numPartitions", "");
    Commands.closeConfigPopover();
  }

  @Then("Should show appropriate message when preview has not been run yet")
  public void beforePreviewRun() {
    ElementHelper.clickOnElement(Helper.locateElementByTestId("pipeline-preview-btn"));
    openPreviewPopover(Commands.joinerJoinerNode);
    Helper.locateElementByXPath("//*[contains(text(),'Run preview to generate preview data')]");
    Commands.closeConfigPopover();
  }

  @Then("Should show appropriate message when preview has been stopped before data is generated")
  public void startAndStopPreview() {
    ElementHelper.clickOnElement(Helper.locateElementByTestId("preview-top-run-btn"));
    ElementHelper.clickOnElement(Helper.locateElementByTestId("stop-preview-btn"));
    WaitHelper.waitForElementToBeDisplayed(Helper.locateElementByTestId("preview-top-run-btn"));
    openPreviewPopover(Commands.joinerSinkNode);
    Helper.locateElementByXPath("//*[contains(text(),'Input records have not been generated')]");
    // close the alert if there is one
    Commands.tryToCloseAlert();
    Commands.closeConfigPopover();
  }

  @Then("Should show preview data with record view by default for sink")
  public void startAndFinishPreview() {
    ElementHelper.clickOnElement(Helper.locateElementByTestId("preview-top-run-btn"));
    WaitHelper.waitForElementToBeDisplayed(Helper.locateElementByTestId("stop-preview-btn"));
    // wait for the run to finish
    WaitHelper.waitForElementToBeHidden(Helper.locateElementByTestId("stop-preview-btn"));
    WaitHelper.waitForElementToBeDisplayed(Helper.locateElementByTestId("preview-top-run-btn"));
    openPreviewPopover(Commands.joinerSinkNode);
    WaitHelper.waitForElementToBeDisplayed(Helper.locateElementByTestId("toggle-Record"));
    WaitHelper.waitForElementToBeDisplayed(Helper.locateElementByTestId("fieldname-field"));
    ElementHelper.clickOnElement(Helper.locateElementByTestId("record-dropdown"));
    ElementHelper.clickOnElement(Helper.locateElementByTestId("option-Record 3"));
    WaitHelper.waitForElementToBeDisplayed(Helper.locateElementByTestId("fieldname-field"));
    ElementHelper.clickOnElement(Helper.locateElementByTestId("previous-record-btn"));
    WaitHelper.waitForElementToBeDisplayed(Helper.locateElementByTestId("fieldname-field"));
    ElementHelper.clickOnElement(Helper.locateElementByTestId("toggle-Record"));
    WaitHelper.waitForElementToBeDisplayed(Helper.locateElementByTestId("toggle-Table"));
    // close the alert if there is one
    Commands.tryToCloseAlert();
    Commands.closeConfigPopover();
  }

  @Then("Should show preview data for all inputs for joiner")
  public void validateJoinerData() {
    openPreviewPopover(Commands.joinerJoinerNode);
    WaitHelper.waitForElementToBeDisplayed(Helper.locateElementByTestId("tab-head-BigQuery"));
    WaitHelper.waitForElementToBeDisplayed(Helper.locateElementByTestId("tab-head-BigQuery2"));
    Commands.closeConfigPopover();
  }

  public void openNodeProperty(NodeInfo node) {
    int nodeId = Integer.parseInt(node.getNodeId());
    ElementHelper.hoverOverElement(Commands.getNode(node));
    WaitHelper.waitForElementToBeDisplayed(Helper.locateElementsByTestId("node-properties-btn").get(nodeId));
    ElementHelper.clickOnElement(Helper.locateElementsByTestId("node-properties-btn").get(nodeId));
  }

  public void openPreviewPopover(NodeInfo node) {
    ElementHelper.clickOnElement(Helper.locateElementByTestId(
      node.getNodeName() + "-preview-data-btn",
      Helper.locateElementByTestId(String.format("plugin-node-%s-%s-%s",
                                                 node.getNodeName(), node.getNodeType(), node.getNodeId()))));
  }
}
