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
import io.cdap.e2e.utils.SeleniumDriver;
import org.openqa.selenium.By;
import org.openqa.selenium.Cookie;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class Helper implements CdfHelper {
  private static final Gson gson = new Gson();
  private static final String USERNAME = "admin";
  private static final String PASSWORD = "admin";
  private static boolean isAuthEnabled = false;
  private static String authToken = null;

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
        reqHeaders.put("Accept", "application/json");
        reqHeaders.put("Content-Type", "application/json");
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

  public static WebElement locateElementByCssSelector(String cssSelector) {
    return SeleniumDriver.getDriver()
      .findElement(By.cssSelector(cssSelector));
  }

  public static String getCssSelectorByDataTestId (String dataTestId) {
    return "[data-testid=" + dataTestId + "]";
  }

  public static String getNodeSelectorFromNodeIndentifier (NodeInfo node) {
    return "[data-testid=\"plugin-node-" +
      node.getNodeName() + "-" +
      node.getNodeType() + "-" +
      node.getNodeId() + "\"]";
  }
}
