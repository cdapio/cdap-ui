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

import com.google.gson.JsonObject;
import io.cdap.cdap.ui.utils.Commands;
import io.cdap.cdap.ui.utils.Helper;
import io.cdap.e2e.utils.WaitHelper;
import io.cucumber.java.en.Then;
import org.junit.Assert;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

public class WidgetKeyValue {

  public static final String PROPERTY_NAME = "rename";

  @Then("Verify the default structure of KeyValue Widget")
  public void verifyDefaultStructureOfKeyValueWidget() {
    WebElement keyValueRow = Helper.locateElementByCssSelector(
      Helper.getCssSelectorForWidgetRow("0", PROPERTY_NAME));
    Assert.assertNotNull(keyValueRow);
    Assert.assertTrue(Helper.isElementExists(Helper.getCssSelectorForKeyInWidgetRow("0", PROPERTY_NAME)));
    Assert.assertTrue(Helper.isElementExists(Helper.getCssSelectorForValueInWidgetRow("0", PROPERTY_NAME)));
    Assert.assertFalse(Helper.isElementExists(Helper.getCssSelectorForWidgetRow("1", PROPERTY_NAME)));
  }

  @Then("Add keyValue row and verify")
  public void addKeyValueRowAndVerify() {
    Helper.clickAddRowInWidget("0", PROPERTY_NAME);
    WaitHelper.waitForElementToBePresent(
      By.cssSelector(Helper.getCssSelectorForWidgetRow("1", PROPERTY_NAME)));
  }

  @Then("Add key value pairs as {string}, {string} and {string}, {string} respectively")
  public void addKeyValuePairsInWidget(String key1, String value1, String key2, String value2) {
    Helper.clickAddRowInWidget("0", PROPERTY_NAME);
    WaitHelper.waitForElementToBePresent(
      By.cssSelector(Helper.getCssSelectorForWidgetRow("1", PROPERTY_NAME)));

    Helper.locateElementByCssSelector(
      Helper.getCssSelectorForKeyInWidgetRow("0", PROPERTY_NAME)).sendKeys(key1);
    Helper.locateElementByCssSelector(
      Helper.getCssSelectorForValueInWidgetRow("0", PROPERTY_NAME)).sendKeys(value1);
    Helper.locateElementByCssSelector(
      Helper.getCssSelectorForKeyInWidgetRow("1", PROPERTY_NAME)).sendKeys(key2);
    Helper.locateElementByCssSelector(
      Helper.getCssSelectorForValueInWidgetRow("1", PROPERTY_NAME)).sendKeys(value2);
  }

  @Then("Verify key value pairs {string}, {string} and {string}, {string} in the Widget")
  public void verifyKeyValuePairsInWidget(String key1, String value1, String key2, String value2) {
    Assert.assertEquals(key1, Helper.locateElementByCssSelector(
      Helper.getCssSelectorForKeyInWidgetRow("0", PROPERTY_NAME)).getAttribute("value"));
    Assert.assertEquals(value1, Helper.locateElementByCssSelector(
      Helper.getCssSelectorForValueInWidgetRow("0", PROPERTY_NAME)).getAttribute("value"));
    Assert.assertEquals(key2, Helper.locateElementByCssSelector(
      Helper.getCssSelectorForKeyInWidgetRow("1", PROPERTY_NAME)).getAttribute("value"));
    Assert.assertEquals(value2, Helper.locateElementByCssSelector(
      Helper.getCssSelectorForValueInWidgetRow("1", PROPERTY_NAME)).getAttribute("value"));
  }

  @Then("Delete keyValue row 2 and verify")
  public void deleteKeyValueRow() {
    Helper.clickRemoveRowInWidget("1", PROPERTY_NAME);
    Assert.assertFalse(Helper.isElementExists(Helper.getCssSelectorForWidgetRow("1", PROPERTY_NAME)));
  }

  @Then("Verify key value pairs {string} in Pipeline Stage JSON")
  public void verifyKeyValuePairsInPipelineStageJSON(String keyValuePairs) {
    JsonObject projectNode = Commands.getPipelineStageJson("Projection");
    String propertyValues = projectNode.get("plugin").getAsJsonObject()
      .get("properties").getAsJsonObject().get(PROPERTY_NAME).getAsString();
    Assert.assertEquals(propertyValues, keyValuePairs);
  }
}
