/*
 * Copyright © 2020 Cask Data, Inc.
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

package io.cdap.cdap.internal.sysapp;

import com.google.common.util.concurrent.AbstractScheduledService;
import com.google.gson.Gson;
import com.google.inject.Inject;
import io.cdap.cdap.common.conf.CConfiguration;
import io.cdap.cdap.common.conf.Constants;
import io.cdap.cdap.common.utils.DirUtils;
import io.cdap.cdap.internal.capability.CapabilityManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.Reader;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

/**
 * CapabilityManagementService
 */
public class CapabilityManagementService extends AbstractScheduledService {

  private static final long DELAY_MINUTES = 1L;
  private static final long INTERVAL_MINUTES = 1L;
  private CConfiguration cConf;
  private Map<CapabilityActionType, CapabilityActionExecutor> capabilityExecutorMap;
  private static final Gson GSON = new Gson();
  private static final Logger LOG = LoggerFactory.getLogger(CapabilityManagementService.class);


  @Inject
  public CapabilityManagementService(CConfiguration cConf, CapabilityManager manager,
                                     Map<CapabilityActionType, CapabilityActionExecutor> capabilityExecutorMap) {
    this.cConf = cConf;
    this.capabilityExecutorMap = capabilityExecutorMap;
  }

  @Override
  protected void runOneIteration() throws Exception {
    scanConfigDirectory();
  }

  private void scanConfigDirectory() {
    String configDirPath = cConf.get(Constants.SYSTEM_APP_CONFIG_DIR);
    //TODO should each config run in its own thread ?
    //TODO - check for existing runs and skip ?
    //TODO -  may need to do this on startup based on the design
    for (File configFile : DirUtils.listFiles(new File(configDirPath))) {
      //long lastModified = configFile.lastModified();
      try {
        applyConfig(parseConfig(configFile));
      } catch (FileNotFoundException e) {
        LOG.info("Unable to find config file", e);
      }
    }
  }

  private CapabilityConfig parseConfig(File configFile) throws FileNotFoundException {
    Reader reader = new FileReader(configFile);
    return GSON.fromJson(reader, CapabilityConfig.class);
  }



  private void applyConfig(CapabilityConfig config) {
    List<CapabilityStep> steps = config.getSteps();
    steps.forEach(step -> capabilityExecutorMap.get(step.getActionType()).execute(step));
  }

  @Override
  protected Scheduler scheduler() {
    return Scheduler.newFixedRateSchedule(DELAY_MINUTES, INTERVAL_MINUTES, TimeUnit.MINUTES);
  }
}
