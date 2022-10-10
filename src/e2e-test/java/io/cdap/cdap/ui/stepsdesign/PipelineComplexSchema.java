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
import io.cdap.cdap.ui.utils.Commands;
import io.cdap.cdap.ui.utils.Constants;
import io.cdap.cdap.ui.utils.Helper;
import io.cdap.e2e.pages.actions.CdfStudioActions;
import io.cdap.e2e.utils.ElementHelper;
import io.cdap.e2e.utils.SeleniumDriver;
import io.cdap.e2e.utils.WaitHelper;
import io.cucumber.java.After;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.junit.Assert;
import org.openqa.selenium.Alert;
import org.openqa.selenium.NoAlertPresentException;
import org.openqa.selenium.UnhandledAlertException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.WindowType;

import java.util.Date;

public class PipelineComplexSchema {

  @After
  public void afterScenario() {
    Helper.clearLocalStorage();
  }

  private final String schemaFieldSuffix = "-schema-field";
  private final String schemaRow1 = "schema-row-0";
  private final String schemaRow2 = "schema-row-1";
  private final String schemaRow3 = "schema-row-2";
  private final String addButton = "schema-row-add-button";
  private final String removeButton = "schema-row-remove-button";
  private final String sourceOutputSchema = "${source_output_schema}";
  private final NodeInfo projectionNode = new NodeInfo("Projection", "transform", "0");
  private static final String pipelineName = "Test_macros_pipeline_" + new Date().getTime();

  @When("Open Pipeline Studio Page")
  public void openPipelineStudioPage() {
    try {
      tryOpenStudioPage();
    } catch (UnhandledAlertException e) {
      try {
        Alert alert = SeleniumDriver.getDriver().switchTo().alert();
        alert.accept();
      } catch (NoAlertPresentException ex) {
        SeleniumDriver.getDriver().switchTo().newWindow(WindowType.TAB);
        tryOpenStudioPage();
      }
    }
    // wait for rendering to finish otherwise elements are not attached to dom
    Helper.waitSeconds(2);
  }

  private static void tryOpenStudioPage() {
    SeleniumDriver.openPage(Constants.PIPELINE_STUDIO_URL);
    WaitHelper.waitForPageToLoad();
    Helper.setNewSchemaEditor(false);
  }

  @Then("Add Projection Node")
  public void addProjectionNode() {
    Commands.addNodeToCanvas(projectionNode);
  }

  @Then("Click on Projection node property button")
  public void clickOnProjectionNodePropertyButton() {
    CdfStudioActions.navigateToPluginPropertiesPage(projectionNode.getNodeName());
  }

  @Then("Verify there is one empty row")
  public void verifyThereIsOneEmptyRow() {
    WebElement row0Selector = Helper.locateElementByCssSelector(
      Helper.getCssSelectorByDataTestId(schemaRow1));
    Assert.assertTrue(row0Selector.isEnabled());
  }

  @Then("Type in schema field {string}")
  public void typeInSchemaField(String field) {
    WebElement row0Input = Helper.locateElementByCssSelector(
      Helper.getCssSelectorByDataTestId(schemaRow1) + " "
        + Helper.getCssSelectorByDataTestId(schemaFieldSuffix)
    );
    ElementHelper.sendKeys(row0Input, field);
  }

  @Then("Add a new field row under row one")
  public void addANewFieldRow() {
    WebElement addButtonElement = Helper.locateElementByCssSelector(
      Helper.getCssSelectorByDataTestId(schemaRow1) + " "
        + Helper.getCssSelectorByDataTestId(addButton)
    );
    ElementHelper.clickOnElement(addButtonElement);
  }

  @Then("Verify the added row and type in {string}")
  public void verifyTheSecondRow(String input) {
    WebElement schemaRow2Element = Helper.locateElementByTestId(schemaRow2);

    Assert.assertTrue(schemaRow2Element.isDisplayed());

    WebElement schemaRow2FieldElement = Helper.locateElementByCssSelector(
      Helper.getCssSelectorByDataTestId(schemaRow2) + " " + Helper.getCssSelectorByDataTestId(schemaFieldSuffix));

    // Verify the new row is being focused
    Assert.assertEquals(schemaRow2FieldElement, SeleniumDriver.getDriver().switchTo().activeElement());
    ElementHelper.sendKeys(schemaRow2FieldElement, input);
  }

  @Then("Verify the previously typed in field")
  public void verifyThePreviouslyTypedInField() {
    WebElement anotherFieldElement = Helper.locateElementByTestId("another_field" + schemaFieldSuffix);
    Assert.assertEquals(anotherFieldElement.getAttribute("value"), "another_field");
  }

  @Then("Remove row two")
  public void removeRowTwo() {
    WebElement removeButtonElement = Helper.locateElementByCssSelector(
      Helper.getCssSelectorByDataTestId(schemaRow2) + " " + Helper.getCssSelectorByDataTestId(removeButton)
    );
    ElementHelper.clickOnElement(removeButtonElement);
  }

  @Then("Verify row three does not exist")
  public void verifyRowThreeDoesNotExist() {
    Assert.assertFalse(Helper.isElementExists(Helper.getCssSelectorByDataTestId(schemaRow3)));
  }

  @Then("Verify row one and two stay the same")
  public void verifyRowOneAndTwoStayTheSame() {
    WebElement field1Element = Helper.locateElementByTestId("field1" + schemaFieldSuffix);
    Assert.assertEquals(field1Element.getAttribute("value"), "field1");

    WebElement anotherFieldElement = Helper.locateElementByTestId("another_field" + schemaFieldSuffix);
    Assert.assertEquals(anotherFieldElement.getAttribute("value"), "another_field");
  }

  @Then("Open source node property")
  public void openSourceNodeProperty() {
    CdfStudioActions.navigateToPluginPropertiesPage("BigQuery");
  }

  @Then("Configure source node property")
  public void configureSourceNodeProperty() {
    ElementHelper.clickOnElement(Helper.locateElementByTestId("schema-action-button"));
    ElementHelper.clickOnElement(Helper.locateElementByTestId("toggle-schema-editor"));

    ElementHelper.sendKeys(Helper.locateElementByCssSelector("#macro-input-schema"),
                           "source_output_schema");
    Commands.sendKeysToInputElementByTestId("referenceName", "BQ_Source");
    Commands.clearInputAndSendKeysToElementByTestId("project", "source_project");

    Commands.sendKeysToInputElementByTestId("datasetProject", "source_dataset_project");
    Commands.sendKeysToInputElementByTestId("dataset", "cdap_gcp_ui_test");
    Commands.sendKeysToInputElementByTestId("table", "users");

    Commands.clearInputAndSendKeysToElementByTestId("serviceFilePath", "gcp_service_account_path");
  }

  @Then("Open transform node property")
  public void openTransformNodeProperty() {
    CdfStudioActions.navigateToPluginPropertiesPage(Commands.simpleTransformNode.getNodeName());
  }

  @Then("Verify transform node macro")
  public void verifyTransformNodeMacro() {
    WebElement macroInputSchemaElement = Helper.locateElementByTestId("macro-input-schema");
    Assert.assertEquals(macroInputSchemaElement.getText(), sourceOutputSchema);

    WebElement addButtonElement = Helper.locateElementByCssSelector(
      Helper.getCssSelectorByDataTestId(schemaRow1) + " " + Helper.getCssSelectorByDataTestId(addButton)
    );
    ElementHelper.clickOnElement(addButtonElement);
  }

  @Then("Verify sink node fields")
  public void verifySinkNodeFields() {
    WebElement nameFieldElement = Helper.locateElementByTestId("name-schema-field");
    Assert.assertEquals(nameFieldElement.getAttribute("value"), "name");

    WebElement emailFieldElement = Helper.locateElementByTestId("email-schema-field");
    Assert.assertEquals(emailFieldElement.getAttribute("value"), "email");
  }

  @Then("Configure sink node property")
  public void configureSinkNodeProperty() {
    Commands.sendKeysToInputElementByTestId("referenceName", "BQ_Sink");
    Commands.sendKeysToInputElementByTestId("dataset", "cdap_gcp_ui_test");
    ElementHelper.clickOnElement(Helper.locateElementByTestId("switch-truncateTable"));

    Commands.clearInputAndSendKeysToElementByTestId("project", "sink_gcp_project_id");
    Commands.clearInputAndSendKeysToElementByTestId("serviceFilePath", "gcp_service_account_path");
  }

  @Then("Type in pipeline name and description")
  public void typeInPipelineNameAndDescription() {
    ElementHelper.clickOnElement(Helper.locateElementByTestId("pipeline-metadata"));
    ElementHelper.sendKeys(Helper.locateElementByCssSelector("#pipeline-name-input"), pipelineName);
    ElementHelper.clickOnElement(
      Helper.locateElementByTestId("pipeline-metadata-ok-btn"));
  }

  @Then("Click on Deploy the pipeline")
  public void clickOnDeployThePipeline() throws InterruptedException {
    ElementHelper.clickOnElementUsingJsExecutor(Helper.locateElementByTestId("deploy-pipeline-btn"));

    String statusText = ElementHelper.getElementText(
      WaitHelper.waitForElementToBeDisplayed(
        Helper.locateElementByTestId("Deployed"), 200)
    );

    Assert.assertEquals(statusText, "Deployed");
    Assert.assertTrue(SeleniumDriver.getDriver().getCurrentUrl().contains("/view/" + pipelineName));

    WaitHelper.waitForElementToBeDisplayed(
      Helper.locateElementByCssSelector(Helper.getNodeSelectorFromNodeIdentifier(Commands.simpleSinkNode)));

    Thread.sleep(1000);
  }

  @Then("Verify input schema")
  public void verifyInputSchema() {
    WebElement macroInputSchemaElement = Helper.locateElementByCssSelector("#macro-input-schema");
    Assert.assertEquals(macroInputSchemaElement.getAttribute("value"), sourceOutputSchema);
  }

  @Then("Verify transform node schema")
  public void verifyTransformNodeSchema() {
    WebElement macroInputSchemaElement = Helper.locateElementByTestId("macro-input-schema");
    Assert.assertEquals(macroInputSchemaElement.getText(), sourceOutputSchema);

    WebElement nameFieldElement = Helper.locateElementByTestId("name-schema-field");
    Assert.assertEquals(nameFieldElement.getAttribute("value"), "name");

    WebElement emailFieldElement = Helper.locateElementByTestId("email-schema-field");
    Assert.assertEquals(emailFieldElement.getAttribute("value"), "email");
  }
}
