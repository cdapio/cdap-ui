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

import com.google.common.base.Strings;
import io.cdap.cdap.ui.utils.Constants;
import io.cdap.cdap.ui.utils.Helper;
import io.cdap.e2e.utils.PluginPropertyUtils;
import io.cucumber.java.Before;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.UUID;

public class BeforeActions {
  private static final Logger logger = LoggerFactory.getLogger(stepsdesign.BeforeActions.class);

  @Before(order = 0)
  public void loginIfRequired() throws IOException {
    logger.info("-----------------Logging in if required------------------");
    Helper.loginIfRequired();
  }

  @Before(order = 1, value = "@SOURCE_CONTROL_MANAGEMENT_TEST")
  public void setGitBranchConfig() {
    if (Strings.isNullOrEmpty(PluginPropertyUtils.pluginProp(Constants.GIT_BRANCH_PROP_NAME))) {
      String branchName =  "cdf-e2e-test-" + UUID.randomUUID();
      PluginPropertyUtils.addPluginProp(Constants.GIT_BRANCH_PROP_NAME, branchName);
    }

    String gitRepoUrl = System.getenv("SCM_TEST_REPO_URL");
    if (!Strings.isNullOrEmpty(gitRepoUrl)) {
      PluginPropertyUtils.addPluginProp(Constants.GIT_REPO_URL_PROP_NAME, gitRepoUrl);
    }

    String gitPAT = System.getenv("SCM_TEST_REPO_PAT");
    if (!Strings.isNullOrEmpty(gitPAT)) {
      PluginPropertyUtils.addPluginProp(Constants.GIT_PAT_PROP_NAME, gitPAT);
    }
  }
}
