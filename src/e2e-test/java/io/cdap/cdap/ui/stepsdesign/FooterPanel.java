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

import io.cdap.cdap.ui.utils.Constants;
import io.cdap.cdap.ui.utils.Helper;
import io.cdap.e2e.utils.ElementHelper;
import io.cdap.e2e.utils.SeleniumDriver;
import io.cdap.e2e.utils.WaitHelper;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.junit.Assert;

public class FooterPanel {
  String url;

  @Then("Click on the Data Explorations card")
  public void clickOnTheDataExplorationCard() {
    try {
      if (Helper.isElementExists(Helper.getCssSelectorByDataTestId("wrangler-home-ongoing-data-exploration-card-0"))) {
        ElementHelper.clickOnElement(Helper.locateElementByTestId("wrangler-home-ongoing-data-exploration-card-0"));
        waitForLoading();
        url = SeleniumDriver.getDriver().getCurrentUrl();
        System.out.println("The page URL is:" + url);
        Assert.assertTrue(url.contains("cdap/ns/default/wrangler-grid"));
      } else {
        System.out.println("Element is not existed");
      }
    } catch (Exception e) {
      System.err.println("error" + e);
    }
  }

  @Then("Verify if the Footer Panel is displayed")
  public void verifyIfTheFooterPanelIsDisplayed() {
    try {
      System.out.println(url);
      if (url.contains("cdap/ns/default/wrangler-grid")) {
        System.out.println("if triggered");
        Assert.assertTrue(ElementHelper.isElementDisplayed(Helper.locateElementByTestId("footer-panel-wrapper")));
        Assert.assertTrue(
            Helper.isElementExists(Helper.getCssSelectorByDataTestId("footer-panel-column-view-panel-tab")));
        Assert.assertTrue(Helper.isElementExists(Helper.getCssSelectorByDataTestId("footer-panel-meta-info-tab")));
        Assert.assertTrue(Helper.isElementExists(Helper.getCssSelectorByDataTestId("footer-panel-zoom-tab")));
        Assert.assertTrue(Helper.isElementExists(Helper.getCssSelectorByDataTestId("footer-panel-directives-tab")));
        Assert.assertTrue(
            Helper.isElementExists(Helper.getCssSelectorByDataTestId("footer-panel-recipe-steps-tab")));
      } else {
        System.out.println("Element is not Displayed");
      }
    } catch (Exception e) {
      System.err.println("error" + e);
    }
  }

  @Then("Verify if the elements on the Footer Panel are displayed")
  public void verifyIfTheElementsOnTheFooterPanelAreDisplayed() {
    try {
      if (Helper.isElementExists(Helper.getCssSelectorByDataTestId("footer-panel-wrapper"))) {
        Assert.assertTrue(
            Helper.isElementExists(Helper.getCssSelectorByDataTestId("footer-panel-column-view-panel-tab")));
        Assert.assertTrue(Helper.isElementExists(Helper.getCssSelectorByDataTestId("footer-panel-meta-info-tab")));
        Assert.assertTrue(Helper.isElementExists(Helper.getCssSelectorByDataTestId("footer-panel-zoom-tab")));
        Assert.assertTrue(Helper.isElementExists(Helper.getCssSelectorByDataTestId("footer-panel-directives-tab")));
        Assert.assertTrue(
            Helper.isElementExists(Helper.getCssSelectorByDataTestId("footer-panel-recipe-steps-tab")));
      } else {
        System.out.println("Footer panel is not displayed");
      }
    } catch (Exception e) {
      System.err.println("error" + e);
    }
  }

  public void waitForLoading() {
    if (Helper.isElementExists(Helper.getCssSelectorByDataTestId("loading-indicator"))) {
      WaitHelper.waitForElementToBeHidden(
          Helper.locateElementByCssSelector(Helper.getCssSelectorByDataTestId("loading-indicator")));
    }
  }
}
