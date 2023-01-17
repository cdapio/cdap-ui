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
import io.cdap.e2e.utils.SeleniumDriver;
import io.cucumber.java.en.Then;
import org.junit.Assert;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebElement;

public class TransformationToolbar {
  @Then("Verify if the Transformation Toolbar is displayed on the Grid Page")
  public void verifyIfTheTransformationToolbarIsDisplayedOnTheGridPage() {
        Assert.assertTrue(Helper.isElementExists
                (Helper.getCssSelectorByDataTestId("transformations-toolbar-container")));
  }
  @Then("Verify if all icons are displayed on Toolbar with {string}")
  public void verifyAllTheIconsAreDisplayedOnToolbar(String testId) {
    Assert.assertTrue(Helper.isElementExists(Helper.getCssSelectorByDataTestId("toolbar-icon-"
        + testId)));
  }
  @Then("Click on the function names toggle with testId as {string} and {string}")
  public void clickOnTheSliderButton(String testId, String iconLabelName) {
    ElementHelper.clickOnElementUsingJsExecutor(
            (Helper.locateElementByTestId("transformations-toolbar-icons-function-name-toggler-button")));
    WebElement icon = Helper.locateElementByTestId("toolbar-icon-title-" + testId);
    String text = icon.getText();
    String actual = iconLabelName;
    Assert.assertEquals(text, actual);
  }
  @Then("Verify by Clicking on the Up and Down arrow icon")
  public void clickOnTheUpAndDownArrowButton() {
    WebElement ele = Helper.locateElementByXPath("//*[@data-testid='toolbar-header-toggler']");
    JavascriptExecutor executor = (JavascriptExecutor) SeleniumDriver.getDriver();
    executor.executeScript("arguments[0].click();", ele);
  }
}
