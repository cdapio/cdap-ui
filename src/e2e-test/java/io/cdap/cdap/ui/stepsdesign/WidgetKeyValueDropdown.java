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
import io.cdap.e2e.utils.ElementHelper;
import io.cdap.e2e.utils.WaitHelper;
import io.cucumber.java.en.Then;
import org.junit.Assert;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

public class WidgetKeyValueDropdown {

  public static final String PROPERTY_NAME = "convert";

  private String getCssSelectorForValueDropDownInWidgetRow(String rowIndex) {
    return Helper.getCssSelectorForWidgetRow(rowIndex, PROPERTY_NAME)
      + " " + Helper.getCssSelectorByDataTestId("value");
  }

  @Then("Verify default structure of KeyValue Dropdown Widget")
  public void verifyDefaultStructureOfKeyValueDropdownWidget() {
    WebElement keyValueRow = Helper.locateElementByCssSelector(Helper.getCssSelectorForWidgetRow("0", PROPERTY_NAME));
    Assert.assertNotNull(keyValueRow);
    Assert.assertTrue(Helper.isElementExists(Helper.getCssSelectorForKeyInWidgetRow("0", PROPERTY_NAME)));
    Assert.assertTrue(Helper.isElementExists(getCssSelectorForValueDropDownInWidgetRow("0")));
    Assert.assertFalse(Helper.isElementExists(Helper.getCssSelectorForWidgetRow("1", PROPERTY_NAME)));
  }

  @Then("Click add row in KeyValue Dropdown Widget and verify")
  public void clickAddRowInKeyValueDropdownWidgetAndVerify() {
    Helper.clickAddRowInWidget("0", PROPERTY_NAME);
    WaitHelper.waitForElementToBePresent(By.cssSelector(Helper.getCssSelectorForWidgetRow("1", PROPERTY_NAME)));
  }

  @Then("Enter key {string} with {string} type in row {string}")
  public void enterKeyWithType(String key, String type, String rowIndex) {
    Helper.locateElementByCssSelector(Helper.getCssSelectorForKeyInWidgetRow(rowIndex, PROPERTY_NAME)).sendKeys(key);
    ElementHelper.clickOnElement(
      Helper.locateElementByCssSelector(getCssSelectorForValueDropDownInWidgetRow(rowIndex)));
    ElementHelper.clickOnElement(Helper.locateElementByTestId("value-" + type));
  }

  @Then("Verify key {string} with {string} type for row {string} in the Widget")
  public void verifyKeyWithTypeInTheWidget(String key, String type, String rowIndex) {
    Assert.assertEquals(key, Helper.locateElementByCssSelector
      (Helper.getCssSelectorForKeyInWidgetRow(rowIndex, PROPERTY_NAME)).getAttribute("value"));
    Assert.assertEquals(type, Helper.locateElementByCssSelector
      (Helper.getCssSelectorForValueInWidgetRow(rowIndex, PROPERTY_NAME)).getAttribute("value"));
  }

  @Then("Verify key value types {string} in Pipeline Stage JSON")
  public void verifyKeyValueTypesInPipelineStageJSON(String keyTypePairs) {
    JsonObject projectNode = Commands.getPipelineStageJson("Projection");
    String propertyValues = projectNode.get("plugin").getAsJsonObject()
      .get("properties").getAsJsonObject().get("convert").getAsString();
    Assert.assertEquals(propertyValues, keyTypePairs);
  }

  @Then("Delete row 2 in KeyValue Dropdown Widget and verify")
  public void deleteRowInKeyValueDropdownWidgetAndVerify() {
    Helper.clickRemoveRowInWidget("1", PROPERTY_NAME);
    Assert.assertFalse(Helper.isElementExists(Helper.getCssSelectorForWidgetRow("1", PROPERTY_NAME)));
  }
}
