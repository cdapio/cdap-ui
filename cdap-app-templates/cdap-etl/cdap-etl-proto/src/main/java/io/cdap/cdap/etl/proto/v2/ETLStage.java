/*
 * Copyright © 2016 Cask Data, Inc.
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

package io.cdap.cdap.etl.proto.v2;

import io.cdap.cdap.etl.proto.ArtifactSelectorConfig;
import io.cdap.cdap.etl.proto.UpgradeContext;

import java.util.Objects;

/**
 * ETL Stage Configuration.
 */
public final class ETLStage {
  private final String name;
  private final ETLPlugin plugin;
  // removed in 5.0.0, but keeping it here so that we can validate that nobody is trying to use it.
  private final String errorDatasetName;

  public ETLStage(String name, ETLPlugin plugin) {
    this.name = name;
    this.plugin = plugin;
    this.errorDatasetName = null;
  }

  public String getName() {
    return name;
  }

  public ETLPlugin getPlugin() {
    return plugin;
  }

  /**
   * Validate correctness. Since this object is created through deserialization, some fields that should not be null
   * may be null.
   *
   * @throws IllegalArgumentException if the object is invalid
   */
  public void validate() {
    if (name == null || name.isEmpty()) {
      throw new IllegalArgumentException(String.format("Invalid stage '%s': name must be specified.",
                                                       toString()));
    }
    if (plugin == null) {
      throw new IllegalArgumentException(String.format("Invalid stage '%s': plugin must be specified.",
                                                       name));
    }
    if (errorDatasetName != null) {
      throw new IllegalArgumentException(
        String.format("Invalid stage '%s'. Error datasets have been replaced by error collectors. " +
                        "Please connect stage '%s' to an error collector, then connect the error collector " +
                        "to a sink.", name, name));
    }
    plugin.validate();
  }

  // used by UpgradeTool to upgrade a 3.4.x stage to 3.5.x, which may include an update of the plugin artifact
  public ETLStage upgradeStage(UpgradeContext upgradeContext) {
    ArtifactSelectorConfig artifactSelectorConfig =
      upgradeContext.getPluginArtifact(plugin.getType(), plugin.getName());
    io.cdap.cdap.etl.proto.v2.ETLPlugin etlPlugin = new io.cdap.cdap.etl.proto.v2.ETLPlugin(
      plugin.getName(), plugin.getType(), plugin.getProperties(), artifactSelectorConfig);
    return new io.cdap.cdap.etl.proto.v2.ETLStage(name, etlPlugin);
  }

  @Override
  public String toString() {
    return "ETLStage{" +
      "name='" + name + '\'' +
      ", plugin=" + plugin +
      '}';
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }

    ETLStage that = (ETLStage) o;

    return Objects.equals(name, that.name) &&
      Objects.equals(plugin, that.plugin);
  }

  @Override
  public int hashCode() {
    return Objects.hash(name, plugin);
  }

}
