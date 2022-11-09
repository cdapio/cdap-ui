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

package io.cdap.cdap.ui.utils;

import com.google.gson.Gson;
import io.cdap.cdap.ui.types.NodeInfo;
import io.cdap.common.http.HttpMethod;
import io.cdap.common.http.HttpResponse;
import io.cdap.e2e.utils.CdfHelper;
import io.cdap.e2e.utils.ElementHelper;
import io.cdap.e2e.utils.SeleniumDriver;
import io.cdap.e2e.utils.WaitHelper;
import org.apache.commons.io.FileUtils;
import org.junit.Assert;
import org.openqa.selenium.By;
import org.openqa.selenium.Cookie;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.html5.LocalStorage;
import org.openqa.selenium.html5.WebStorage;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class Helper implements CdfHelper {

  private static final Gson gson = new Gson();
  private static final String USERNAME = "admin";
  private static final String PASSWORD = "admin";
  private static boolean isAuthEnabled = false;
  private static String authToken = null;
  private static final Logger logger = LoggerFactory.getLogger(io.cdap.cdap.ui.utils.Helper.class);

  public static void loginIfRequired() throws IOException {
    WebDriver driver = SeleniumDriver.getDriver();
    if (isAuthEnabled && authToken != null) {
      driver.manage().addCookie(new Cookie("CDAP_Auth_Token", authToken));
      driver.manage().addCookie(new Cookie("CDAP_Auth_User", USERNAME));
      return;
    }
    HttpResponse response = HttpRequestHandler.makeHttpRequest(
      HttpMethod.GET, Constants.BASE_SERVER_URL + "/v3/namespaces", null, null, null
    );
    if (response.getResponseCode() == 401) {
      isAuthEnabled = true;
      try {
        Map<String, String> reqHeaders = new HashMap<String, String>();
        reqHeaders.put("Content-Type", "application/x-www-form-urlencoded");
        Map<String, String> reqBody = new HashMap<String, String>();
        reqBody.put("username", USERNAME);
        reqBody.put("password", PASSWORD);
        HttpResponse authResponse = HttpRequestHandler.makeHttpRequest(
          HttpMethod.POST, Constants.BASE_URL + "/login", reqHeaders, reqBody, null
        );
        Map<String, String> authResponseMap
          = gson.fromJson(authResponse.getResponseBodyAsString(),
                          Map.class);
        authToken = authResponseMap.get("access_token");
        driver.manage().addCookie(new Cookie("CDAP_Auth_Token", authToken));
        driver.manage().addCookie(new Cookie("CDAP_Auth_User", USERNAME));
      } catch (IOException e) {
        throw new IOException(e.getMessage());
      }
    }
  }

  public static void copyFile(String sourceFileString,
                                   String destFileString) {
    try {
      File sourceFile = new File(sourceFileString);
      File destFile = new File(destFileString);
      FileUtils.copyFile(sourceFile, destFile);
    } catch (IOException e) {
      logger.info(String.format("Cannot copy %s to %s", sourceFileString, destFileString));
    }
  }

  public static String getSessionToken() throws IOException {
    HttpResponse response = HttpRequestHandler.makeHttpRequest(HttpMethod.GET,
                                                               Constants.BASE_URL + "/sessionToken",
                                                               null,
                                                               null,
                                                               null);
    return response.getResponseBodyAsString();
  }

  public static WebElement locateElementByCssSelector(String cssSelector) {
    return SeleniumDriver.getDriver()
      .findElement(By.cssSelector(cssSelector));
  }

  public static WebElement locateElementByTestId(String testId) {
    return SeleniumDriver.getDriver()
      .findElement(By.cssSelector(Helper.getCssSelectorByDataTestId(testId)));
  }

  public static WebElement locateElementById(String elementId) {
    return SeleniumDriver.getDriver()
      .findElement(By.id(elementId));
  }

  public static WebElement locateElementByLocator(By locator) {
    return SeleniumDriver.getDriver().findElement(locator);
  }

  public static WebElement locateElementByXPath(String xpath) {
    return SeleniumDriver.getDriver()
      .findElement(By.xpath(xpath));
  }

  public static boolean isElementExists(String cssSelector) {
    return SeleniumDriver.getDriver()
      .findElements(By.cssSelector(cssSelector)).size() > 0;
  }

  public static boolean isElementExists(By by, WebElement withinElement) {
    return withinElement.findElements(by).size() > 0;
  }

  public static boolean isElementExists(String cssSelector, WebElement withinElement) {
    return withinElement.findElements(By.cssSelector(cssSelector)).size() > 0;
  }

  public static String getCssSelectorByDataTestId(String dataTestId) {
    return "[data-testid=" + dataTestId + "]";
  }

  public static String getNodeSelectorFromNodeIdentifier(NodeInfo node) {
    return "[data-testid=\"plugin-node-" +
      node.getNodeName() + "-" +
      node.getNodeType() + "-" +
      node.getNodeId() + "\"]";
  }

  public static void deployAndTestPipeline(String filename, String pipelineName) {
    SeleniumDriver.openPage(Constants.BASE_STUDIO_URL + "pipelines");
    WaitHelper.waitForPageToLoad();
    ElementHelper.clickOnElement(locateElementById("resource-center-btn"));
    ElementHelper.clickOnElement(locateElementById("create-pipeline-link"));
    Assert.assertTrue(SeleniumDriver.getDriver().getCurrentUrl().contains("studio"));

    WaitHelper.waitForPageToLoad();
    WebElement uploadFile = SeleniumDriver.getDriver()
      .findElement(By.xpath("//*[@id='pipeline-import-config-link']"));

    File pipelineJSONFile = new File(Constants.FIXTURES_DIR + filename);
    String filePath = pipelineJSONFile.getAbsolutePath();
    uploadFile.sendKeys(filePath);

    String pipelineNameXPathSelector = "//div[contains(@class, 'PipelineName')]";
    SeleniumDriver.getWaitDriver().until(ExpectedConditions
                                           .stalenessOf(locateElementByLocator(By.xpath(pipelineNameXPathSelector))));
    ElementHelper.clickOnElement(locateElementByLocator(By.xpath(pipelineNameXPathSelector)));

    WebElement pipelineNameInput = locateElementById("pipeline-name-input");
    ElementHelper.clearElementValue(pipelineNameInput);
    ElementHelper.sendKeys(pipelineNameInput, pipelineName);
    pipelineNameInput.sendKeys(Keys.RETURN);

    ElementHelper.clickOnElementUsingJsExecutor(locateElementByCssSelector(
      getCssSelectorByDataTestId("deploy-pipeline-btn")));

    String statusText = ElementHelper.getElementText(
      WaitHelper.waitForElementToBeDisplayed(
        locateElementByCssSelector(getCssSelectorByDataTestId("Deployed")), 200)
    );

    Assert.assertEquals(statusText, "Deployed");
    Assert.assertTrue(SeleniumDriver.getDriver().getCurrentUrl().contains("/view/" + pipelineName));
  }

  public static void cleanupPipelines(String pipelineName) {
    try {
      HttpResponse response = HttpRequestHandler
        .makeHttpRequest(HttpMethod.GET,
                         Constants.BASE_SERVER_URL + "/v3/namespaces/default/apps/" + pipelineName,
                         null, null, null);
      if (response.getResponseCode() == 200) {
        HttpRequestHandler.makeHttpRequest(HttpMethod.DELETE,
                                           Constants.BASE_SERVER_URL + "/v3/namespaces/default/apps/" + pipelineName,
                                           null, null, null);
      }
    } catch (IOException e) {
      throw new RuntimeException(e.getMessage());
    }
  }

  public static By locatorOfPluginGroupCollapsed(String pluginGroupName) {
    String xpath = "//div[@data-cy='plugin-" + pluginGroupName
      + "-group' and not(contains(@class, 'Mui-expanded'))]//div[contains(@class, 'expandIcon')]";
    return By.xpath(xpath);
  }

  public static By locatorOfPluginGroupExpanded(String pluginGroupName) {
    String xpath = "//div[@data-cy='plugin-" + pluginGroupName
      + "-group' and contains(@class, 'Mui-expanded')]//div[contains(@class, 'expandIcon')]";
    return By.xpath(xpath);
  }

  public static void expandPluginGroupIfNotAlreadyExpanded(String pluginGroupName) {
    ElementHelper.clickIfDisplayed(locatorOfPluginGroupCollapsed(pluginGroupName));
    WaitHelper.waitForElementToBeDisplayed(
      locateElementByLocator(locatorOfPluginGroupExpanded(pluginGroupName)));
  }

  public static void setCdapTheme(String themePath) {
    Map<String, String> reqHeaders = new HashMap<String, String>();
    reqHeaders.put("Content-Type", "application/x-www-form-urlencoded");
    Map<String, String> reqBody = new HashMap<String, String>();
    reqBody.put("uiThemePath", themePath);
    try {
      reqHeaders.put("Session-Token", getSessionToken());
      HttpResponse response = HttpRequestHandler.makeHttpRequest(HttpMethod.POST,
                                                                 Constants.BASE_URL + "/updateTheme",
                                                                 reqHeaders,
                                                                 reqBody,
                                                                 null);
      if (response.getResponseCode() == 200) {
        System.out.println("Successfully updated theme");
      }
    } catch (IOException e) {
      Assert.fail(e.getMessage());
    }
  }

  public static void setShowWelcomeSessionStorage() {
    JavascriptExecutor js = (JavascriptExecutor) SeleniumDriver.getDriver();
    js.executeScript(String.format(
      "window.sessionStorage.setItem('showWelcome','true');"));
  }

  public static void setNewSchemaEditor(boolean state) {
    LocalStorage local = ((WebStorage) SeleniumDriver.getDriver()).getLocalStorage();

    // set default schema editor to use old schema editor
    local.setItem("schema-editor", String.valueOf(state));
  }

  public static void clearLocalStorage() {
    LocalStorage local = ((WebStorage) SeleniumDriver.getDriver()).getLocalStorage();
    local.clear();
  }

  public static void waitSeconds() {
    waitSeconds(1);
  }

  public static void waitSeconds(long second) {
    try {
      Thread.sleep(1000 * second);
    } catch (InterruptedException e) {
      logger.info("cannot sleep");
    }
  }
}
