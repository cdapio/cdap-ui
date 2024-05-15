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

package io.cdap.cdap.ui.testconfig.github;

import io.cdap.cdap.ui.testconfig.common.ScmConfigHelper;
import io.cdap.cdap.ui.utils.Constants;
import io.cdap.cdap.ui.utils.Helper;
import io.cdap.cdap.ui.utils.ScmProviderType;
import io.cdap.e2e.utils.PluginPropertyUtils;
import io.cucumber.java.Before;
import java.io.IOException;
import org.eclipse.jgit.api.errors.GitAPIException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class BeforeActions {
  private static final Logger logger = LoggerFactory.getLogger(stepsdesign.BeforeActions.class);

  @Before(order = 1, value = "@SCM_GITHUB_TEST")
  public void createGithubBranchConfig() throws GitAPIException, IOException {
    logger.info("----------------- Using Github for SCM ------------------");
    PluginPropertyUtils.addPluginProp(Constants.SCM_PROVIDER_PROP_NAME, "GITHUB");
    ScmConfigHelper.setupScmCredentials(
        "SCM_TEST_REPO_URL",
        "SCM_TEST_REPO_PAT");
    Helper.createSCMRemoteBranch(ScmProviderType.GITHUB);
  }
}
