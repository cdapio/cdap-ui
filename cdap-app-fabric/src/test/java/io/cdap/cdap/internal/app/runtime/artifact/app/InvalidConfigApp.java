/*
 * Copyright © 2015 Cask Data, Inc.
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

package io.cdap.cdap.internal.app.runtime.artifact.app;

import io.cdap.cdap.api.Config;
import io.cdap.cdap.api.app.AbstractApplication;

/**
 * App used to test invalid configs.
 */
public class InvalidConfigApp extends AbstractApplication<InvalidConfigApp.InvalidConfig> {

  public static class InvalidConfig<T> extends Config {
    private T x;
  }

  @Override
  public void configure() {
    // nothing since its not a real app
  }
}
