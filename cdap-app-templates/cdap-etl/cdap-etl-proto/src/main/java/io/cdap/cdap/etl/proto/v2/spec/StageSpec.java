/*
 * Copyright © 2019 Cask Data, Inc.
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
 *
 */

package io.cdap.cdap.etl.proto.v2.spec;

import io.cdap.cdap.api.data.schema.Schema;
import io.cdap.cdap.etl.api.SplitterTransform;
import io.cdap.cdap.etl.proto.v2.ETLStage;

import java.io.Serializable;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;
import javax.annotation.Nullable;

/**
 * Specification for a pipeline stage.
 *
 * This is like an {@link ETLStage}, but has additional attributes calculated at configure time of the application.
 * The spec contains the input and output schema (if known) for the stage, as well as any output stages it writes to.
 */
public class StageSpec implements Serializable {
  private static final long serialVersionUID = 4682820901456102283L;
  private final String name;
  private final PluginSpec plugin;
  private final Map<String, Schema> inputSchemas;
  private final Map<String, Port> outputPorts;
  private final Schema outputSchema;
  private final Schema errorSchema;
  private final boolean stageLoggingEnabled;
  private final boolean processTimingEnabled;
  private final int maxPreviewRecords;
  // These are required because GSON will not serialize null values in maps.
  // So the null values originally in inputSchemas will not survive serialization and then deserialization
  private final Set<String> inputStages;
  private transient Map<String, Schema> fullInputSchemas;

  private StageSpec(String name, PluginSpec plugin, Map<String, Schema> inputSchemas, @Nullable Schema outputSchema,
                    Schema errorSchema, Map<String, Port> outputPorts,
                    boolean stageLoggingEnabled, boolean processTimingEnabled, int maxPreviewRecords) {
    this.name = name;
    this.plugin = plugin;
    this.inputSchemas = Collections.unmodifiableMap(new HashMap<>(inputSchemas));
    this.errorSchema = errorSchema;
    this.stageLoggingEnabled = stageLoggingEnabled;
    this.processTimingEnabled = processTimingEnabled;
    this.outputSchema = outputSchema;
    this.outputPorts = Collections.unmodifiableMap(outputPorts);
    this.maxPreviewRecords = maxPreviewRecords;
    this.inputStages = inputSchemas.keySet();
  }

  public String getName() {
    return name;
  }

  public PluginSpec getPlugin() {
    return plugin;
  }

  public String getPluginType() {
    return plugin.getType();
  }

  public Map<String, Schema> getInputSchemas() {
    if (fullInputSchemas == null) {
      fullInputSchemas = new HashMap<>();
      for (String inputStage : inputStages) {
        fullInputSchemas.put(inputStage, inputSchemas.get(inputStage));
      }
    }
    return fullInputSchemas;
  }

  @Nullable
  public Schema getOutputSchema() {
    return outputSchema;
  }

  public Map<String, Port> getOutputPorts() {
    return outputPorts;
  }

  @Nullable
  public Schema getErrorSchema() {
    return errorSchema;
  }

  public boolean isStageLoggingEnabled() {
    return stageLoggingEnabled;
  }

  public boolean isProcessTimingEnabled() {
    return processTimingEnabled;
  }

  public int getMaxPreviewRecords() {
    return maxPreviewRecords;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }

    StageSpec that = (StageSpec) o;

    return Objects.equals(name, that.name) &&
      Objects.equals(plugin, that.plugin) &&
      Objects.equals(inputSchemas, that.inputSchemas) &&
      Objects.equals(outputPorts, that.outputPorts) &&
      Objects.equals(outputSchema, that.outputSchema) &&
      Objects.equals(errorSchema, that.errorSchema) &&
      stageLoggingEnabled == that.stageLoggingEnabled &&
      processTimingEnabled == that.processTimingEnabled;
  }

  @Override
  public int hashCode() {
    return Objects.hash(name, plugin, inputSchemas, outputPorts,
                        outputSchema, errorSchema, stageLoggingEnabled, processTimingEnabled, maxPreviewRecords);
  }

  @Override
  public String toString() {
    return "StageSpec{" +
      "name='" + name + '\'' +
      ", plugin=" + plugin +
      ", inputSchemas=" + inputSchemas +
      ", outputPorts=" + outputPorts +
      ", outputSchema=" + outputSchema +
      ", errorSchema=" + errorSchema +
      ", stageLoggingEnabled=" + stageLoggingEnabled +
      ", processTimingEnabled=" + processTimingEnabled +
      ", maxPreviewRecords=" + maxPreviewRecords +
      '}';
  }

  public static Builder builder(String name, PluginSpec plugin) {
    return new Builder(name, plugin);
  }

  /**
   * Builder for a StageSpec.
   */
  public static class Builder {
    private final String name;
    private final PluginSpec plugin;
    private final boolean isSplitter;
    private Map<String, Schema> inputSchemas;
    private Map<String, Port> outputs;
    private Schema outputSchema;
    private Schema errorSchema;
    private boolean stageLoggingEnabled;
    private boolean processTimingEnabled;
    private int maxPreviewRecords;

    public Builder(String name, PluginSpec plugin) {
      this.name = name;
      this.plugin = plugin;
      this.inputSchemas = new HashMap<>();
      this.outputs = new HashMap<>();
      this.stageLoggingEnabled = true;
      this.processTimingEnabled = true;
      this.isSplitter = plugin.getType().equals(SplitterTransform.PLUGIN_TYPE);
      this.maxPreviewRecords = 100;
    }

    public Builder addInputSchema(String stageName, Schema schema) {
      this.inputSchemas.put(stageName, schema);
      return this;
    }

    public Builder addInputSchemas(Map<String, Schema> inputSchemas) {
      this.inputSchemas.putAll(inputSchemas);
      return this;
    }

    public Builder addOutput(@Nullable Schema outputSchema, String... stages) {
      for (String stage : stages) {
        addOutput(stage, null, outputSchema);
      }
      return this;
    }

    public Builder addOutput(String outputStageName, @Nullable String port, @Nullable Schema outputSchema) {
      this.outputs.put(outputStageName, new Port(port, outputSchema));
      if (!isSplitter) {
        this.outputSchema = outputSchema;
      }
      return this;
    }

    public Builder setOutputSchema(@Nullable Schema outputSchema) {
      this.outputSchema = outputSchema;
      return this;
    }

    public Builder setErrorSchema(@Nullable Schema errorSchema) {
      this.errorSchema = errorSchema;
      return this;
    }

    public Builder setStageLoggingEnabled(boolean stageLoggingEnabled) {
      this.stageLoggingEnabled = stageLoggingEnabled;
      return this;
    }

    public Builder setProcessTimingEnabled(boolean processTimingEnabled) {
      this.processTimingEnabled = processTimingEnabled;
      return this;
    }

    public Builder setMaxPreviewRecords(int maxPreviewRecords) {
      this.maxPreviewRecords = maxPreviewRecords;
      return this;
    }

    public StageSpec build() {
      return new StageSpec(name, plugin, inputSchemas, outputSchema, errorSchema, outputs,
                           stageLoggingEnabled, processTimingEnabled, maxPreviewRecords);
    }

  }

  /**
   * Represents an output port.
   */
  public static class Port implements Serializable {
    private static final long serialVersionUID = -8265114217209734806L;
    private final String port;
    private final Schema schema;

    public Port(@Nullable String port, @Nullable Schema schema) {
      this.port = port;
      this.schema = schema;
    }

    /**
     * @return the output port that the stage is connected to. A null port means all output is sent to the stage
     */
    @Nullable
    public String getPort() {
      return port;
    }

    /**
     * @return the schema of the output port. A null schema means it is variable or unknown
     */
    @Nullable
    public Schema getSchema() {
      return schema;
    }

    @Override
    public boolean equals(Object o) {
      if (this == o) {
        return true;
      }
      if (o == null || getClass() != o.getClass()) {
        return false;
      }

      Port that = (Port) o;

      return Objects.equals(port, that.port) && Objects.equals(schema, that.schema);
    }

    @Override
    public int hashCode() {
      return Objects.hash(port, schema);
    }
  }
}
