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

package io.cdap.cdap.ui.testconfig.bitbucket;

import io.cdap.cdap.ui.utils.Helper;
import io.cdap.cdap.ui.utils.ScmProviderType;
import io.cucumber.java.After;
import java.io.IOException;
import org.eclipse.jgit.api.errors.GitAPIException;

public class AfterActions {
  @After(order = 1, value = "@SCM_BITBUCKET_TEST")
  public void cleanUpTestBranch() throws IOException, GitAPIException {
    Helper.cleanupSCMTestBranch(ScmProviderType.BITBUCKET_CLOUD);
  }
}
