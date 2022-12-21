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

import com.google.common.base.Joiner;
import com.google.gson.Gson;
import io.cdap.cdap.ui.types.NodeInfo;
import io.cdap.common.http.HttpMethod;
import io.cdap.common.http.HttpResponse;
import io.cdap.e2e.utils.CdfHelper;
import io.cdap.e2e.utils.ElementHelper;
import io.cdap.e2e.utils.SeleniumDriver;
import io.cdap.e2e.utils.WaitHelper;
import org.apache.commons.io.FileUtils;
import org.apache.http.NameValuePair;
import org.apache.http.client.utils.URIBuilder;
import org.junit.Assert;
import org.openqa.selenium.Alert;
import org.openqa.selenium.By;
import org.openqa.selenium.Cookie;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.NoAlertPresentException;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.StaleElementReferenceException;
import org.openqa.selenium.UnhandledAlertException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.WindowType;
import org.openqa.selenium.html5.LocalStorage;
import org.openqa.selenium.html5.WebStorage;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;
import java.io.Reader;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

public class Helper implements CdfHelper {

  private static final Gson GSON = new Gson();
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
          HttpMethod.POST, Constants.BASE_URL + "/login", reqHeaders, convertMapToString(reqBody), null
        );
        Map<String, String> authResponseMap
          = GSON.fromJson(authResponse.getResponseBodyAsString(),
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
    return isElementExists(By.cssSelector(cssSelector));
  }

  public static boolean isElementExists(By by) {
    try {
      return ElementHelper.isElementDisplayed(SeleniumDriver.getDriver().findElement(by));
    } catch (StaleElementReferenceException | NoSuchElementException e) {
      return false;
    }
  }

  public static boolean isElementExists(By by, WebElement withinElement) {
    try {
      return ElementHelper.isElementDisplayed(withinElement.findElement(by));
    } catch (StaleElementReferenceException | NoSuchElementException e) {
      return false;
    }
  }

  public static boolean isElementExists(String cssSelector, WebElement withinElement) {
    return isElementExists(By.cssSelector(cssSelector), withinElement);
  }

  public static String getCssSelectorByDataTestId(String dataTestId) {
    return "[data-testid=\"" + dataTestId + "\"]";
  }

  public static String getNodeSelectorFromNodeIdentifier(NodeInfo node) {
    return "[data-testid=\"plugin-node-" +
      node.getNodeName() + "-" +
      node.getNodeType() + "-" +
      node.getNodeId() + "\"]";
  }

  public static String getNodeNameSelectorFromNodeIdentifier(NodeInfo node) {
    return "[data-testid=\"plugin-node-name-" +
      node.getNodeName() + "-" +
      node.getNodeType() + "-" +
      node.getNodeId() + "\"]";
  }

  public static void uploadPipelineFromFile(String filename) {
    WebElement uploadFile = SeleniumDriver.getDriver()
      .findElement(By.xpath("//*[@id='pipeline-import-config-link']"));

    File pipelineJSONFile = new File(Constants.FIXTURES_DIR + filename);
    String filePath = pipelineJSONFile.getAbsolutePath();
    uploadFile.sendKeys(filePath);

    String pipelineNameXPathSelector = "//div[contains(@class, 'PipelineName')]";
    SeleniumDriver.getWaitDriver().until(ExpectedConditions
                                           .stalenessOf(locateElementByLocator(By.xpath(pipelineNameXPathSelector))));
  }

  public static void deployAndTestPipeline(String filename, String pipelineName) {
    SeleniumDriver.openPage(Constants.BASE_STUDIO_URL + "pipelines");
    WaitHelper.waitForPageToLoad();
    ElementHelper.clickOnElement(locateElementById("resource-center-btn"));
    ElementHelper.clickOnElement(locateElementById("create-pipeline-link"));
    Assert.assertTrue(SeleniumDriver.getDriver().getCurrentUrl().contains("studio"));

    WaitHelper.waitForPageToLoad();
    Helper.uploadPipelineFromFile(filename);

    Commands.fillInPipelineName(pipelineName);
    Commands.dismissTopBanner();

    ElementHelper.clickOnElement(locateElementByCssSelector(
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
    String jsonBody = GSON.toJson(reqBody);
    try {
      reqHeaders.put("Session-Token", getSessionToken());
      HttpResponse response = HttpRequestHandler.makeHttpRequest(HttpMethod.POST,
                                                                 Constants.BASE_URL + "/updateTheme",
                                                                 reqHeaders,
                                                                 convertMapToString(reqBody),
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

  private static void tryOpenPage(String url) {
    SeleniumDriver.openPage(url);
    WaitHelper.waitForPageToLoad();
  }

  public static void openPage(String url) {
    try {
      tryOpenPage(url);
    } catch (UnhandledAlertException e) {
      try {
        Alert alert = SeleniumDriver.getDriver().switchTo().alert();
        alert.accept();
      } catch (NoAlertPresentException ex) {
        SeleniumDriver.getDriver().switchTo().newWindow(WindowType.TAB);
        tryOpenPage(url);
      }
    }
    // wait for rendering to finish otherwise elements are not attached to dom
    Helper.waitSeconds(2);
  }
  
  public static boolean urlHasString(String targetString) {
    String strUrl = SeleniumDriver.getDriver().getCurrentUrl();
    return strUrl.contains(targetString);
  }

  public static void reloadPage() {
    SeleniumDriver.getDriver().navigate().refresh();
  }

  public static void cleanupDirectory(File dir) {
    for (File file : dir.listFiles()) {
      if (file.isDirectory()) {
        cleanupDirectory(file);
      }
      file.delete();
    }
  }

  public static Map generateDraftFromPipelineJson(String pipelineJsonFileName) throws IOException {
    Reader reader = Files.newBufferedReader(Paths.get(Constants.FIXTURES_DIR + pipelineJsonFileName));
    Map jsonMap = GSON.fromJson(reader, Map.class);
    UUID draftId = UUID.randomUUID();

    // build draft pipeline map
    Map uiPropMap = new HashMap();
    uiPropMap.put("draftId", draftId.toString());
    uiPropMap.put("lastSaved", System.currentTimeMillis());
    String pipelineName = jsonMap.get("name").toString() + System.currentTimeMillis();
    jsonMap.put("__ui__", uiPropMap);
    jsonMap.put("name", pipelineName);

    // build response map
    Map pipelineDraft = new HashMap();
    Map defaultObj = new HashMap();
    Map draftIdObj = new HashMap();
    draftIdObj.put(draftId.toString(), jsonMap);
    defaultObj.put("default", draftIdObj);
    pipelineDraft.put("hydratorDrafts", defaultObj);

    Map response = new HashMap();
    response.put("pipelineDraft", pipelineDraft);
    response.put("pipelineName", pipelineName);

    return response;
  }

  public static String convertMapToString(Map map) {
    return Joiner.on(",").withKeyValueSeparator("=").join(map);
  }

  public static String extractQueryParamValue (String queryParam) throws URISyntaxException {
    String strUrl = SeleniumDriver.getDriver().getCurrentUrl();
    URIBuilder uriBuilder = new URIBuilder(strUrl);
    List<NameValuePair> queryParameters = uriBuilder.getQueryParams()
      .stream()
      .filter(p -> p.getName().equals(queryParam))
      .collect(Collectors.toList());
    return queryParameters.get(0).getValue();
  }

  public static void rightClickOnElement(WebElement element) {
    rightClickOnElement(element, 0, 0);
  }

  public static void rightClickOnElement(WebElement element, int xOffset, int yOffset) {
    Actions actions = new Actions(SeleniumDriver.getDriver());
    actions.moveToElement(element, xOffset, yOffset).contextClick().perform();
  }
}
