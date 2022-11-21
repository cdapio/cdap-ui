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
import io.cdap.e2e.utils.SeleniumDriver;
import io.cucumber.java.en.Given;
import io.cdap.e2e.utils.WaitHelper;
import io.cucumber.java.en.Then;
import io.cdap.e2e.utils.ElementHelper;
import io.cdap.cdap.ui.utils.Helper;
import org.junit.Assert;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;

public class ColumnViewPanel {
    @Given("Navigate to Home Page")
    public void navigateToHomePage() {
        SeleniumDriver.openPage(Constants.WRANGLE_HOME_URL);
        WaitHelper.waitForPageToLoad();

    }
    @Then("Click on the Data Explorations card")
    public void dataExplorationsCard() {
        try {
            WaitHelper.waitForPageToLoad();
            ElementHelper.clickOnElement(Helper.locateElementByTestId("ongoing-data-exploration0"));
            String url=SeleniumDriver.getDriver().getCurrentUrl();
            Assert.assertTrue(url.contains("http://localhost:11011/cdap/ns/default/wrangler-grid"));
        } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }
    @Then("Verify if the column view button is displayed on the Grid Page")
    public void verifyColumnViewButtonDisplayed() {
        try {
            WaitHelper.waitForPageToLoad();
            boolean flag = true;
            while (flag == true) {
                if (Helper.isElementExists(Helper.getCssSelectorByDataTestId("loading-indicator"))) {
                    flag = true;
                } else {
                    flag = false;
                }
            }
            Assert.assertTrue(Helper.isElementExists(Helper.getCssSelectorByDataTestId
                    ("footer-panel-column-view-panel-tab")));
        } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }

    @Then("Click on columnview button")
    public void clickCloumnButton() {
        try {
            WaitHelper.waitForPageToLoad();
            ElementHelper.clickOnElement(Helper.locateElementByTestId("footer-panel-column-view-panel-tab"));
            Assert.assertTrue(ElementHelper.isElementDisplayed
                    (Helper.locateElementByTestId("column-view-panel-parent")));
        } catch (Exception e) {
            System.err.println("error:" + e);
        }

    }
    @Then("Verify column names of that file displayed in panel")
    public void verifyColumnsName() {
        try {
            WaitHelper.waitForPageToLoad();
            String text = Helper.locateElementByTestId("grid-header-cell-0").getText();
            String paneltext = Helper.locateElementByTestId("each-column-label-type-0").getText();
            if (text.equals(paneltext)) {
                System.out.println("The column name is present in the panel");
            }
        } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }
    @Then("Enter any existing name of the columns in the search field {string}")
    public void verifySearchField(String columnName) {
        try {
            WaitHelper.waitForPageToLoad();
            ElementHelper.clickOnElement(Helper.locateElementByTestId("search-icon"));
            WebDriverWait ele = new WebDriverWait(SeleniumDriver.getDriver(), 10);
                    ele.until(ExpectedConditions.elementToBeClickable(Helper.locateElementByTestId("search-term-input"))).click();
            Helper.locateElementByTestId("search-term-input").sendKeys(columnName);
            Assert.assertTrue(ElementHelper.isElementDisplayed
                    (Helper.locateElementByTestId("each-column-label-type-0")));
        } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }
    @Then("Verify if the search result is displayed as {string}")
    public void verifySearchResult(String columnName) {
      try {
          String text = Helper.locateElementByTestId("each-column-label-type-0").getText();
          if (columnName.equals(text))
          {
              System.out.println("The column name is displayed as per search");
          }
      } catch (Exception e) {
          System.err.println("error:" + e);
      }
    }
    @Then("Click on cross icon")
    public void clickOnCrossIcon() {
        try {
            WaitHelper.waitForPageToLoad();
            ElementHelper.clickOnElement(Helper.locateElementByTestId("column-view-panel-close"));
        } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }
    @Then("Again click on columnview button and verify if the panel is closed")
    public void verifyPanelClosed() {
        try {
            ElementHelper.clickOnElement(Helper.locateElementByTestId("footer-panel-column-view-panel-tab"));
            Assert.assertFalse((Helper.isElementExists("column-view-panel-parent")));
        } catch (Exception e) {
            System.err.println("error:" + e);
        }
    }
}
