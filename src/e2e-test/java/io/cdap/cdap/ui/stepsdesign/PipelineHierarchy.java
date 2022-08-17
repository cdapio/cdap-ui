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

import com.google.common.base.Strings;
import io.cdap.cdap.ui.types.NodeInfo;
import io.cdap.cdap.ui.utils.Commands;
import io.cdap.cdap.ui.utils.Constants;
import io.cdap.cdap.ui.utils.Helper;
import io.cdap.e2e.pages.actions.CdfPluginPropertiesActions;
import io.cdap.e2e.pages.actions.CdfStudioActions;
import io.cdap.e2e.utils.ElementHelper;
import io.cdap.e2e.utils.WaitHelper;
import io.cucumber.java.en.Then;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;

public class PipelineHierarchy {
  private String property = "fieldMapping";
  private NodeInfo cloneRecord = new NodeInfo("CloneRecord", "transform", "1");
  private NodeInfo fileSource = new NodeInfo("File", "batchsource", "0");
  private String propertySelector = Helper.getCssSelectorByDataTestId(property);

  private void addField (String row, String name, String type) {
    WebElement field = Helper.locateElementByCssSelector(
      "div" + Helper.getCssSelectorByDataTestId("schema-row-" + row) + " input[placeholder=\"Field name\"]"
    );
    ElementHelper.clearElementValue(field);
    field.sendKeys(name, Keys.ENTER);

    String dropdownCssLocator = "div" +
      Helper.getCssSelectorByDataTestId("schema-row-" + row) +
      " div" +
      Helper.getCssSelectorByDataTestId("select-undefined");

    if (!Strings.isNullOrEmpty(type)) {
      ElementHelper.clickOnElement(
        Helper.locateElementByCssSelector(dropdownCssLocator)
      );
      Helper.locateElementByCssSelector(dropdownCssLocator + " > select > option[value=" + type + "]");
    }
  };

  private void removeField (String row) {
    ElementHelper.clickOnElement(
      Helper.locateElementByCssSelector(
        "div" + Helper.getCssSelectorByDataTestId("schema-row-" + row)
          + "button" + Helper.getCssSelectorByDataTestId("schema-field-remove-button"))
    );
  };

  @Then("Add \"File\" node to canvas")
  public void addFileNodeToCanvas()  {
    Commands.addNodeToCanvas(fileSource);
  }

  @Then("Open transform panel")
  public void openTransformPanel() {
    Helper.expandPluginGroupIfNotAlreadyExpanded("Transform");
  }

  @Then("Close {string} panel")
  public void closePluginGroupPanel(String pluginGroupName) {
    ElementHelper.clickIfDisplayed(Helper.locatorOfPluginGroupExpanded(pluginGroupName));
    WaitHelper.waitForElementToBeDisplayed(Helper.locateElementByLocator(
      Helper.locatorOfPluginGroupCollapsed(pluginGroupName)));
  }

  @Then("Add \"CloneRecord\" node to canvas")
  public void addCloneRecordNodeToCanvas()  {
    Commands.addNodeToCanvas(cloneRecord);
  }

  @Then("Cleanup pipeline graph control")
  public void cleanupPipelineGraphControl() {
    Commands.pipelineCleanUpGraphControl();
  }

  @Then("Fit pipeline to screen")
  public void fitPipelineToScreen() {
    Commands.fitPipelineToScreen();
  }

  @Then("Connect the two added nodes")
  public void connectAddedNodes() {
    Commands.connectTwoNodes(fileSource, cloneRecord);
  }

  @Then("Open {string} node property")
  public void openNodeProperty(String nodeName) {
    CdfStudioActions.navigateToPluginPropertiesPage(nodeName);
  }

  @Then("Close node property")
  public void closeNodeProperty() throws InterruptedException {
    CdfPluginPropertiesActions.clickCloseButton();
  }

  @Then("Add field at row {string} and name {string}")
  public void addFieldToNodeProperty(String row, String name) {
    addField(row, name, "");
  }

  @Then("Click on \"Get Schema\" button")
  public void getSchema() {
    CdfPluginPropertiesActions.clickGetSchemaButton();
  }

  @Then("Verify field mapping exists")
  public void verifyFieldMappingExists() {
    int numOfFieldMappingEls = ElementHelper.countNumberOfElements(By.cssSelector(propertySelector));

    if (numOfFieldMappingEls <= 0) {
      throw new RuntimeException(
        "Unable to find any field mapping elements for node " + cloneRecord.getNodeName()
      );
    }
  }

  @Then("Add a new field mapping row")
  public void addNewFieldMappingRow() {
    ElementHelper.clickOnElement(Helper.locateElementByCssSelector(
      "div" + propertySelector + " div" + Helper.getCssSelectorByDataTestId("add")
    ));
  }

}
