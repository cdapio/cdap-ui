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

import io.cdap.cdap.ui.utils.Commands;
import io.cdap.cdap.ui.utils.Constants;
import io.cdap.cdap.ui.utils.HttpRequestHandler;
import io.cdap.common.http.HttpMethod;
import io.cdap.common.http.HttpResponse;
import io.cdap.e2e.utils.ConstantsUtil;
import io.cdap.e2e.utils.SeleniumDriver;
import io.cdap.e2e.utils.SeleniumHelper;
import io.cucumber.core.api.Scenario;
import io.cucumber.java.After;
import io.cucumber.java.AfterStep;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.Collection;

public class AfterActions {
  private static final Logger logger = LoggerFactory.getLogger(stepsdesign.BeforeActions.class);

  @After
  public void resetNuxtourSettings() {
    logger.info("Reset Nuxtour settings");
    try {
      HttpResponse response = HttpRequestHandler.makeHttpRequest(HttpMethod.PUT,
                                                                 Constants.BASE_SERVER_URL + "/v3/configuration/user",
                                                                 null,
                                                                 null,
                                                                 null);
    } catch (IOException e) {
      logger.info(e.getMessage());
    }
  }

//  @After
//  public void takeScreenShotOnFailure(Scenario scenario) {
//    if (scenario.isFailed()) {
//      String uri = scenario.getUri();
//      Commands.takeScreenshot(uri.substring(uri.lastIndexOf("/") + 1, uri.lastIndexOf(".")),
//                              scenario.getName(),
//                              scenario.getLine().toString());
//    }
//  }

}
