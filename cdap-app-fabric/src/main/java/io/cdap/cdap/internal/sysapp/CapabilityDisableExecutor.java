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

import com.google.gson.JsonObject;
import com.google.inject.Inject;
import io.cdap.cdap.internal.capability.CapabilityManager;
import io.cdap.cdap.internal.capability.CapabilityStatus;
import io.cdap.cdap.proto.artifact.AppRequest;

import java.io.IOException;

/**
 * CapabilityDisableExecutor
 */
public class CapabilityDisableExecutor implements CapabilityActionExecutor {

  private CapabilityManager capabilityManager;

  @Inject
  public CapabilityDisableExecutor(CapabilityManager capabilityManager) {
    this.capabilityManager = capabilityManager;
  }

  @Override
  public void execute(CapabilityStep capabilityStep) {
    //capabilityStep.getLabel();
    CapabilityArguments arguments = capabilityStep.getArguments();
    String capability = arguments.getCapability();
    AppRequest<JsonObject> applicationRequest = arguments.getApplicationRequest();
    try {
      boolean hasChanged = CapabilityStatus.DISABLED == capabilityManager.getCapabilityStatus(capability);
      if (hasChanged) {
        //TODO - full steps
        // Update status
        // stop pipelines
        // stop application
      } else {
        //TODO - ensure service is not running if includes an application
      }
    } catch (IOException exception) {
      //TODO - log
    }

  }
}
