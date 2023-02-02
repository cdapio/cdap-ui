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


import io.cdap.cdap.ui.utils.Helper;
import io.cdap.e2e.utils.ElementHelper;
import io.cucumber.java.en.Then;
import org.junit.Assert;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.Select;

public class PipelineTriggers {

  public static String pipeline1Name = "trigger_test_pipeline_1";
  public static String pipeline2Name = "trigger_test_pipeline_2";
  public static String simpleTriggerName = "simple_trigger_test";
  public static String complexTriggerName = "complex_trigger_test";

  @Then("Deploy pipeline {string} with pipeline JSON file {string}")
  public void deployPipelineFromJson(String pipelineName, String pipelineJSONfile) {
    Helper.deployAndTestPipeline(pipelineJSONfile, pipelineName);
  }

  @Then("Open inbound trigger and set and delete a simple trigger when pipeline1 succeeds")
  public void openInboundTriggerAndSetAndDeleteASimpleTrigger() {
    ElementHelper.clickOnElement(Helper.locateElementByTestId("inbound-triggers-toggle"));
    WebElement triggerNameInputField = Helper.locateElementByCssSelector(
      "div[data-testid='trigger-name-text-field'] input"
    );
    ElementHelper.clearElementValue(triggerNameInputField);
    ElementHelper.sendKeys(triggerNameInputField, simpleTriggerName);
    ElementHelper.clickOnElement(Helper.locateElementByTestId(pipeline1Name + "-enable-trigger-btn"));
    ElementHelper.clickOnElement(Helper.locateElementByTestId("enable-group-trigger-btn"));
    Helper.isElementExists(Helper.getCssSelectorByDataTestId(simpleTriggerName + "-collapsed"));
    ElementHelper.clickOnElement(Helper.locateElementByTestId(simpleTriggerName + "-collapsed"));
    Helper.isElementExists(Helper.getCssSelectorByDataTestId(simpleTriggerName + "-expanded"));
    ElementHelper.clickOnElement(Helper.locateElementByTestId(simpleTriggerName + "-disable-trigger-btn"));
    ElementHelper.clickOnElement(Helper.locateElementByTestId("Delete"));
    Assert.assertFalse(Helper.isElementExists(Helper.getCssSelectorByDataTestId(simpleTriggerName + "-collapsed")));
    ElementHelper.clickOnElement(Helper.locateElementByTestId("inbound-triggers-toggle"));
  }

  private String getSourceRuntimeArgElement(int index) {
    String selector = Helper.getCssSelectorByDataTestId("row-" + index) +  " " +
      Helper.getCssSelectorByDataTestId("runtime-arg-of-trigger") +  " select";
    return Helper.locateElementByCssSelector(selector);
  }

  private WebElement getTargetRuntimeArgElement(int index) {
    String selector = Helper.getCssSelectorByDataTestId("row-" + index) +  " " +
      Helper.getCssSelectorByDataTestId("runtime-arg-of-triggered") +  " select";
    return Helper.locateElementByCssSelector(selector);
  }

  private void selectRuntimeArg(WebElement element, String value) {
    Select select = new Select(element);
    select.selectByVisibleText(value);
  }

  private void getRuntimeArgSelection(WebElement element) {}

  @Then("Open inbound trigger and set and delete a complex trigger when pipeline1 succeeds")
  public void openInboundTriggerAndSetAndDeleteAComplexTrigger() {
    ElementHelper.clickOnElement(Helper.locateElementByTestId("inbound-triggers-toggle"));
    WebElement triggerNameInputField = Helper.locateElementByCssSelector(
      "div[data-testid='trigger-name-text-field'] input"
    );
    ElementHelper.clearElementValue(triggerNameInputField);
    ElementHelper.sendKeys(triggerNameInputField, complexTriggerName);
    ElementHelper.clickOnElement(Helper.locateElementByTestId(pipeline1Name + "-enable-trigger-btn"));
    //ElementHelper.clickOnElement(Helper.locateElementByTestId("enable-group-trigger-btn"));
    //Helper.isElementExists(Helper.getCssSelectorByDataTestId(complexTriggerName + "-collapsed"));
    //ElementHelper.clickOnElement(Helper.locateElementByTestId(complexTriggerName + "-collapsed"));
    //Helper.isElementExists(Helper.getCssSelectorByDataTestId(complexTriggerName + "-expanded"));
    //ElementHelper.clickOnElement(Helper.locateElementByTestId(complexTriggerName + "-disable-trigger-btn"));
    //ElementHelper.clickOnElement(Helper.locateElementByTestId("Delete"));
    //Assert.assertFalse(Helper.isElementExists(Helper.getCssSelectorByDataTestId(complexTriggerName + "-collapsed")));
    //ElementHelper.clickOnElement(Helper.locateElementByTestId("inbound-triggers-toggle"));

    //cy.get(dataCy(`${TRIGGER_PIPELINE_1}-collapsed`)).click();
    ElementHelper.clickOnElement(Helper.locateElementByTestId(pipeline1Name + "-collapsed"));
    ElementHelper.clickOnElement(Helper.locateElementByTestId(pipeline1Name + "-trigger-config-btn"));

    selectRuntimeArg(getSourceRuntimeArgElement(0), "source_path");
    selectRuntimeArg(getTargetRuntimeArgElement(0), "source_path");
    selectRuntimeArg(getSourceRuntimeArgElement(1), "sink_path");
    selectRuntimeArg(getTargetRuntimeArgElement(1), "sink_path");

    ElementHelper.clickOnElement(Helper.locateElementByTestId("configure-and-enable-trigger-btn"));
    ElementHelper.clickOnElement(Helper.locateElementByTestId("enable-group-trigger-btn"));

    ElementHelper.clickOnElement(Helper.locateElementByTestId(complexTriggerName + "-collapsed"));
    ElementHelper.clickOnElement(Helper.locateElementByTestId(complexTriggerName + "-view-playload-btn"));

    WebElement sourceArg0 = getSourceRuntimeArgElement(0);
    Assert.assertEquals("source_path", sourceArg0.getAttribute("value"));
    WebElement sourceArg1 = getSourceRuntimeArgElement(1);
    Assert.assertEquals("sink_path", sourceArg1.getAttribute("value"));

    WebElement targetArg0 = getTargetRuntimeArgElement(0);
    Assert.assertEquals("source_path", targetArg0.getAttribute("value"));
    WebElement targetArg1 = getTargetRuntimeArgElement(1);
    Assert.assertEquals("sink_path", targetArg1.getAttribute("value"));

    ElementHelper.clickOnElement(Helper.locateElementByTestId("close-payload-config-modal"));
    ElementHelper.clickOnElement(Helper.locateElementByTestId(complexTriggerName + "-disable-trigger-btn"));
    ElementHelper.clickOnElement(Helper.locateElementByTestId("Delete"));
  }

  @Then("Cleanup pipeline {string}")
  public void cleanupPipeline(String pipelineName) {
    Helper.cleanupPipelines(pipelineName);
  }
}
