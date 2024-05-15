/*
 * Copyright © 2024 Cask Data, Inc.
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

package io.cdap.cdap.ui.testconfig.common;

import com.google.common.base.Strings;
import io.cdap.cdap.ui.utils.Constants;
import io.cdap.e2e.utils.PluginPropertyUtils;
import java.util.UUID;

public class ScmConfigHelper {
  public static void setupScmCredentials(String repoUrlVarName, String repoPatVarName) {
    String gitRepoUrl = System.getenv(repoUrlVarName);
    if (!Strings.isNullOrEmpty(gitRepoUrl)) {
      PluginPropertyUtils.addPluginProp(Constants.GIT_REPO_URL_PROP_NAME, gitRepoUrl);
    }

    String gitPAT = System.getenv(repoPatVarName);
    if (!Strings.isNullOrEmpty(gitPAT)) {
      PluginPropertyUtils.addPluginProp(Constants.GIT_PAT_PROP_NAME, gitPAT);
    }

    if (Strings.isNullOrEmpty(PluginPropertyUtils.pluginProp(Constants.GIT_BRANCH_PROP_NAME))) {
      String branchName =  "cdf-e2e-test-" + UUID.randomUUID();
      PluginPropertyUtils.addPluginProp(Constants.GIT_BRANCH_PROP_NAME, branchName);
    }
  }
}
