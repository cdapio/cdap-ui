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
import io.cdap.cdap.ui.utils.Commands;
import io.cdap.cdap.ui.utils.Constants;
import io.cdap.cdap.ui.utils.Helper;
import io.cdap.e2e.pages.actions.CdfStudioActions;
import io.cdap.e2e.utils.ElementHelper;
import io.cdap.e2e.utils.SeleniumDriver;
import io.cdap.e2e.utils.WaitHelper;
import io.cucumber.java.en.Then;
import org.junit.Assert;
import org.openqa.selenium.WebElement;

import java.io.IOException;
import java.io.Reader;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Map;
import java.util.UUID;

public class PipelineTriggers {

  public static String pipeline1Name = "trigger_test_pipeline_1";
  public static String pipeline2Name = "trigger_test_pipeline_2";
  public static String simpleTriggerName = "simple_trigger_test";

  @Then("Open inbound trigger and set and delete a simple trigger when pipeline1 succeeds")
  public void openInboundTriggerAndSetAndDeleteASimpleTrigger() {
    ElementHelper.clickOnElement(Helper.locateElementByTestId("inbound-triggers-toggle"));
    WebElement triggerNameInputField = Helper.locateElementByTestId("trigger-name-text-field");
    ElementHelper.clearElementValue(triggerNameInputField);
    ElementHelper.sendKeys(triggerNameInputField, simpleTriggerName);
    ElementHelper.clickOnElement(Helper.locateElementByTestId("enable-group-trigger-btn"));
    Helper.isElementExists(Helper.getCssSelectorByDataTestId(simpleTriggerName + "-collapsed"));
    ElementHelper.clickOnElement(Helper.locateElementByTestId(simpleTriggerName + "-collapsed"));
    Helper.isElementExists(Helper.getCssSelectorByDataTestId(simpleTriggerName + "-expanded"));
    ElementHelper.clickOnElement(Helper.locateElementByTestId("disable-group-trigger-btn"));
    ElementHelper.clickOnElement(Helper.locateElementByTestId("Delete"));
    ElementHelper.clickOnElement(Helper.locateElementByTestId("enabled-triggers-tab"));
    Assert.assertFalse(Helper.isElementExists(Helper.getCssSelectorByDataTestId(simpleTriggerName + "-collapsed")));
    ElementHelper.clickOnElement(Helper.locateElementByTestId("inbound-triggers-toggle"));
  }

  @Then("Cleanup pipeline {string}")
  public void cleanupPipeline(String pipelineName) {
    Helper.cleanupPipelines(pipelineName);
  }
}
