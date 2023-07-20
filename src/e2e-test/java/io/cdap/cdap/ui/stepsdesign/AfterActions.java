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
import io.cucumber.java.After;
import org.eclipse.jgit.api.errors.GitAPIException;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * Represents after action.
 */
public class AfterActions {

  @After(order = 0)
  public static void cleanupDownloadDirectory() {
    Path downloadsDirPath = Paths.get(Constants.DOWNLOADS_DIR);
    if (Files.exists(downloadsDirPath)) {
      File downloadsDir = new File(Constants.DOWNLOADS_DIR);
      System.out.println(downloadsDir);
      Helper.cleanupDirectory(downloadsDir);
    }
  }

  @After(order = 1, value = "@SOURCE_CONTROL_MANAGEMENT_TEST")
  public void cleanUpTestBranch() throws IOException, GitAPIException {
    Helper.cleanupSCMTestBranch();
  }
}
