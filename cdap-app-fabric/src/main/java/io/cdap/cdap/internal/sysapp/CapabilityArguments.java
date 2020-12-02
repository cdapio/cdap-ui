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
import io.cdap.cdap.proto.artifact.AppRequest;

import javax.annotation.Nullable;

/**
 * Arguments for doing specific action on capability
 */
public class CapabilityArguments {

  private String capability;
  private String namespace;
  private String applicationName;
  private AppRequest<JsonObject> applicationRequest;

  public CapabilityArguments(String capability, String namespace, String applicationName,
                             @Nullable AppRequest<JsonObject> applicationRequest) {
    this.capability = capability;
    this.namespace = namespace;
    this.applicationName = applicationName;
    this.applicationRequest = applicationRequest;
  }

  public String getCapability() {
    return capability;
  }

  public String getNamespace() {
    return namespace;
  }

  public String getApplicationName() {
    return applicationName;
  }

  @Nullable
  public AppRequest<JsonObject> getApplicationRequest() {
    return applicationRequest;
  }
}
