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
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

import java.util.List;

public class SelectColumnPanel {
  @Then("Click on the ChangeDataType")
  public void clickOnTheStructureIcon() {
    ElementHelper.clickOnElement(Helper.locateElementByTestId("toolbar-icon-structure"));
    ElementHelper.clickOnElement(Helper.locateElementByTestId("menu-item-changeDatatype"));
    ElementHelper.clickOnElement(Helper.locateElementByTestId("menu-item-boolean"));
  }
  @Then("Verify if the user is on the select column panel")
  public void verifyIfTheUserIsOnTheSelectColumnPanel() {
    Assert.assertTrue(ElementHelper.isElementDisplayed(Helper.locateElementByTestId("select-column-drawer")));
  }

  @Then("Click on the Back icon")
  public void clickOnTheBackIcon() {
    ElementHelper.clickOnElement(Helper.locateElementByTestId("back-icon"));
  }

  @Then("Click on the Cross icon")
  public void clickOnTheCrossIcon() {
    ElementHelper.clickOnElement(Helper.locateElementByTestId("close-icon"));
  }

  @Then("Click on the Search icon")
  public void clickOnTheSearchIcon() {
    ElementHelper.clickOnElement(Helper.locateElementByTestId("click-handle-focus"));
  }

  @Then("Enter name of any column from the List")
  public void enterNameOfAnyColumnFromTheList() {
    List<WebElement> allProductsName = SeleniumDriver.getDriver().findElements(
            By.xpath("//*[starts-with(@data-testid,'grid-header-cell-')]"));
    String columnName = allProductsName.get(1).getText();
    Helper.locateElementByTestId("input-search-id").sendKeys(columnName);
    Assert.assertTrue(ElementHelper.isElementDisplayed(Helper.locateElementByTestId("radio-input-0")));
  }
  @Then("Click on close icon of search")
  public void clickOnCloseOfSearch() {
    ElementHelper.clickOnElement(Helper.locateElementByTestId("click-handle-blur"));
  }

  @Then("Click on the radio button of any column")
  public void clickOnTheRadioButtonOfAnyColumn() {
    ElementHelper.clickOnElement(Helper.locateElementByTestId("radio-input-0"));
  }

  @Then("Click on the Done button")
  public void clickOnTheDoneButton() {
    ElementHelper.clickOnElement(Helper.locateElementByTestId("button-done"));
  }

  @Then("Verify if the select column panel is closed")
  public void verifyIfTheSelectColumnIsClosed() {
    Assert.assertFalse(Helper.isElementExists("select-column-drawer"));
  }
}
