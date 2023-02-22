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

import com.google.gson.JsonObject;
import io.cdap.cdap.ui.utils.Commands;
import io.cdap.cdap.ui.utils.Helper;
import io.cdap.e2e.utils.ElementHelper;
import io.cdap.e2e.utils.WaitHelper;
import io.cucumber.java.en.Then;
import org.junit.Assert;
import org.openqa.selenium.By;

public class WidgetCSV {

  private void clickAddRow(String rowIndex) {
    ElementHelper.clickOnElement(Helper.locateElementByCssSelector(
      getCssSelectorForRow(rowIndex) + " " + Helper.getCssSelectorByDataTestId("add-row")));
  }

  private String getCssSelectorForRow(String rowIndex) {
    return Helper.getCssSelectorByDataTestId("drop") + " " + Helper.getCssSelectorByDataTestId(rowIndex);
  }
  @Then("Click add row and verify that the row 2 is present")
  public void addNewRowInCSVWidget() {
    clickAddRow("0");
    WaitHelper.waitForElementToBePresent(By.cssSelector(getCssSelectorForRow("1")));
  }

  @Then("Verify that the CSV Widget contains only one row by default")
  public void verifyDefaultCSVWidget() {
    Assert.assertTrue(
      Helper.isElementExists(getCssSelectorForRow("0")));
    Assert.assertFalse(
      Helper.isElementExists(getCssSelectorForRow("1")));
  }

  @Then("Click add row and enter {string}, {string} for row 1 and row 2 respectively")
  public void enterValuesInCSVWidget(String val1, String val2) {
    clickAddRow("0");
    WaitHelper.waitForElementToBePresent(By.cssSelector(getCssSelectorForRow("1")));

    Helper.locateElementByCssSelector(getCssSelectorForRowInput("0")).sendKeys((val1));
    Helper.locateElementByCssSelector(getCssSelectorForRowInput("1")).sendKeys((val2));
  }

  private String getCssSelectorForRowInput(String rowIndex) {
    return getCssSelectorForRow(rowIndex) + " " + Helper.getCssSelectorByDataTestId("key") + " input";
  }

  @Then("Check whether the properties {string}, {string} exists in row 1 and row 2 respectively")
  public void checkCSVWidgetValues(String field1Value, String field2Value) {
    Assert.assertEquals(field1Value,
      Helper.locateElementByCssSelector(getCssSelectorForRowInput("0")).getAttribute("value"));
    Assert.assertEquals(field2Value,
      Helper.locateElementByCssSelector(getCssSelectorForRowInput("1")).getAttribute("value"));
  }

  @Then("Delete row 2")
  public void deleteRowInCSVWidget() {
    ElementHelper.clickOnElement(
      Helper.locateElementByCssSelector(
        getCssSelectorForRow("1") + " " + Helper.getCssSelectorByDataTestId("remove-row")));
  }

@Then("Verify Pipeline Stage JSON for values {string}")
  public void verifyCSVWidgetValuesInPipelineStageJSON(String values) {
    JsonObject projectNode = Commands.getPipelineStageJson("Projection");
    String propertyValues = projectNode.get("plugin").getAsJsonObject()
      .get("properties").getAsJsonObject().get("drop").getAsString();
    Assert.assertEquals(propertyValues, values);
  }
}
