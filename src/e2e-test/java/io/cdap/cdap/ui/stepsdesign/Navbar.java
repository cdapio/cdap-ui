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
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.junit.Assert;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

import java.util.HashMap;

public class Navbar {

  // Navbar tests constants
  private static final String NAVBAR_BG_COLOR = "rgba(51, 51, 51, 1)";
  private static final String NAVBAR_BG_COLOR_LIGHT = "rgba(59, 120, 231, 1)";
  private static final String NAVBAR_MENU_HIGHLIGHT_COLOR = "rgba(220, 224, 234, 1)";
  private static final String NAVBAR_MENU_FONT_COLOR = "rgba(0, 118, 220, 1)";

  private static final String THEME_FEATURE_NAMES_DASHBOARD = "Operations";
  private static final String THEME_FEATURE_NAMES_HUB = "Hub";
  private static final String THEME_FEATURE_NAMES_PIPELINES = "Pipeline";
  private static final String THEME_FEATURE_NAMES_DATAPREP = "Wrangler";
  private static final String THEME_FEATURE_NAMES_METADATA = "Metadata";
  private static final String THEME_FEATURE_NAMES_PIPELINESTUDIO = "Studio";

  private static final HashMap<String, String> NAVBAR_FEATURE_MAP = getNavbarFeatureMap();

  @Then("Check navbar should have {string} bgcolor")
  public void checkBgColor(String theme) {
    String bgColor = Helper.locateElementByTestId("app-navbar")
      .getCssValue("background-color");
    if (theme.equals("default")) {
      Assert.assertEquals(NAVBAR_BG_COLOR, bgColor);
    } else if (theme.equals("light")) {
      Assert.assertEquals(NAVBAR_BG_COLOR_LIGHT, bgColor);
    }
  }

  @Then("Check drawer invisible")
  public void checkDrawerInvisible() {
    String visibility = Helper.locateElementByTestId("navbar-drawer").getCssValue("visibility");
    Assert.assertEquals("hidden", visibility);
  }

  @Then("Click on hamburger menu")
  public void toggleMenu() {
    ElementHelper.clickOnElement(Helper.locateElementByTestId("navbar-hamburger-icon"));
  }

  @Then("Click on Hub")
  public void clickHub() throws InterruptedException {
    ElementHelper.clickOnElement(
      Helper.locateElementById("navbar-hub")
    );
    // need to waif for animation finishes
    Thread.sleep(1000);
  }

  @Then("Check right features are enabled in {string} theme")
  public void checkFeaturesEnabled(String theme) {
    String xpathTemplate = "//*[contains(text(), '%s')]";
    WebElement element;
    if (theme.equals("default")) {
      element = Helper.locateElementByXPath(String.format(xpathTemplate, THEME_FEATURE_NAMES_DASHBOARD));
    } else if (theme.equals("light")) {
      Assert.assertTrue(ElementHelper.countNumberOfElements(
        By.xpath(String.format(xpathTemplate, THEME_FEATURE_NAMES_DASHBOARD))) < 1);
    }
    element = Helper.locateElementByXPath(String.format(xpathTemplate, THEME_FEATURE_NAMES_HUB));
    toggleMenu();
    element = Helper.locateElementByXPath(String.format(xpathTemplate, THEME_FEATURE_NAMES_PIPELINES));
    element = Helper.locateElementByXPath(String.format(xpathTemplate, THEME_FEATURE_NAMES_DATAPREP));
    element = Helper.locateElementByXPath(String.format(xpathTemplate, THEME_FEATURE_NAMES_METADATA));
    element = Helper.locateElementByXPath(String.format(xpathTemplate, THEME_FEATURE_NAMES_PIPELINESTUDIO));
    toggleMenu();
  }

  @Given("Set {string} theme")
  public void setTheme(String theme) {
    if (theme.equals("default")) {
      Helper.setCdapTheme(Constants.DEFAULT_THEME_PATH);
    } else if (theme.equals("light")) {
      Helper.setCdapTheme(Constants.LIGHT_THEME_PATH);
    }
  }

  public void assertFeatureHighlightHelper(String featureSelector) {
    toggleMenu();
    ElementHelper.clickOnElement(Helper.locateElementByTestId(featureSelector));
    toggleMenu();
    String bgColor = Helper.locateElementByTestId(featureSelector).getCssValue("background-color");
    String color = Helper.locateElementByTestId(featureSelector).getCssValue("color");
    Assert.assertEquals(NAVBAR_MENU_FONT_COLOR, color);
    Assert.assertEquals(NAVBAR_MENU_HIGHLIGHT_COLOR, bgColor);
    toggleMenu();
  }

  @Then("Click and check {string} font and highlight color")
  public void assertFeatureHighlight(String feature) {
    String featureSelector = NAVBAR_FEATURE_MAP.get(feature);
    assertFeatureHighlightHelper(featureSelector);
  }

  private static HashMap<String, String> getNavbarFeatureMap() {
    HashMap<String, String> navbarFeatureMap = new HashMap<>();
    navbarFeatureMap.put("Control Center", "navbar-control-center-link");
    navbarFeatureMap.put("Pipeline List", "navbar-pipelines-link");
    navbarFeatureMap.put("Pipeline Studio", "navbar-pipeline-studio-link");
    navbarFeatureMap.put("Metadata", "navbar-metadata-link");
    navbarFeatureMap.put("Admin", "navbar-project-admin-link");
    return navbarFeatureMap;
  }
}
