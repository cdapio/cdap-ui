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
import io.cdap.e2e.utils.WaitHelper;
import io.cucumber.java.en.Then;
import org.junit.Assert;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.util.List;

public class RecipeStep {

  @Then("Verify if user is on the wrangle page")
  public void verifyIfUserIsOnTheWranglePage() {
    String url = SeleniumDriver.getDriver().getCurrentUrl();
    Assert.assertTrue(url.contains("/cdap/ns/default/wrangler-grid"));
  }
  @Then("Click on Directive button")
  public void clickOnDirectiveButton() {
    if (Helper.isElementExists(By.cssSelector("loading-indicator"))) {
    WaitHelper.waitForElementToBeHidden(Helper.locateElementByTestId("loading-indicator"));
    }
    ElementHelper.clickOnElement(Helper.locateElementByTestId("footer-panel-directives-tab"));
  }

  @Then("Verify if the directive panel is displayed")
  public void directivePanelIsDisplayed() {
    WaitHelper.waitForElementToBeDisplayed(Helper.locateElementByTestId
            ("select-directive-input-search"));
    WebElement panel = Helper.locateElementByTestId("select-directive-input-search");
    Assert.assertTrue(panel.isDisplayed());
  }
  String columnName;

  @Then("read the column elements with \\\"(.,*)\\\"")
  public void readColumnText(int i) {
    List<WebElement> allProductsName = SeleniumDriver.getDriver().findElements(
            By.xpath("//*[starts-with(@data-testid,'grid-header-cell-')]"));
    columnName = allProductsName.get(i).getText();
  }

  @Then("Enter command in the panel with the data {string}")
  public void checkCommandFunction(String command) {
    WebElement panel = Helper.locateElementByTestId("select-directive-input-search");
    panel.click();
    panel.sendKeys(command + columnName);
    String check = panel.getText();
    panel.sendKeys(Keys.ENTER);
    Helper.reloadPage();
  }

  @Then("click on close icon")
  public void closeIcon() {
    Helper.reloadPage();
    ElementHelper.clickOnElement(Helper.locateElementByTestId("drawer-widget-close-round-icon"));
  }

  @Then("Click on 'Recipe steps' button")
  public void clickOnRecipeStepButton() {
    WaitHelper.waitForElementToBeDisplayed(Helper.locateElementByTestId("footer-panel-recipe-steps-tab"));
    ElementHelper.clickOnElement(Helper.locateElementByTestId("footer-panel-recipe-steps-tab"));
  }

  @Then("Verify if recipe panel is displayed")
  public void recipePanelIsDisplayed() {
      WaitHelper.waitForElementToBeDisplayed(Helper.locateElementByTestId("column-view-panel-parent"));
      Assert.assertTrue(ElementHelper.isElementDisplayed(Helper.locateElementByTestId
              ("column-view-panel-parent")));
  }

  @Then("Click on delete icon of any step with \\\"(.,*)\\\"")
  public void verifyByClickingOnDeleteIcon(int stepId) {
      WebElement ele = Helper.locateElementByTestId("recipe-steps-span" + stepId);
      Actions action = new Actions(SeleniumDriver.getDriver());
      action.moveToElement(ele).perform();
      ElementHelper.clickOnElement(Helper.locateElementByTestId("recipe-step-" + stepId + "-delete"));
      Assert.assertTrue(ElementHelper.isElementDisplayed(Helper.locateElementByTestId("snackbar-alert")));
  }
  @Then("Verify if user clicks on download icon of recipe panel")
  public void clickOnDownloadIcon() {
      ElementHelper.clickOnElement(Helper.locateElementByTestId("header-action-download-icon"));
  }

  @Then("Verify if clicking on close icon of recipe panel")
  public void verifyByClickingOnCloseIcon() {
      WebDriverWait ele = new WebDriverWait(SeleniumDriver.getDriver(), 20);
      ele.until(ExpectedConditions.invisibilityOfElementLocated(By.cssSelector("drawer-widget-close-round-icon")));
      ElementHelper.clickOnElement(Helper.locateElementByTestId("drawer-widget-close-round-icon"));
  }
  @Then("verify if recipe step is Deleted with \\\"(.,*)\\\"")
  public void verifyIfRecipeStepDeleted(int stepId) {
    Assert.assertFalse(Helper.isElementExists("recipe-step-row-" + stepId));
  }
}
