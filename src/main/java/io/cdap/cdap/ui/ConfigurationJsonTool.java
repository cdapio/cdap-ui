/*
 * Copyright © 2014-2015 Cask Data, Inc.
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

package io.cdap.cdap.ui;

import com.google.common.collect.Maps;
import com.google.common.collect.Sets;

import com.google.common.io.ByteStreams;
import com.google.gson.GsonBuilder;
import io.cdap.cdap.common.conf.CConfiguration;
import io.cdap.cdap.common.conf.Configuration;
import io.cdap.cdap.common.conf.SConfiguration;

import java.io.PrintStream;
import java.util.Map;
import java.util.Set;

/**
 * A tool to save the CConfiguration as Json.
 */
public class ConfigurationJsonTool {
  private static final String CDAP_CONFIG = "--cdap";
  private static final String SECURITY_CONFIG = "--security";


  private static void exportToJson(String configParam, Appendable output) {
    Configuration config;
    if (configParam.equals(CDAP_CONFIG)) {
      config = CConfiguration.create();
    } else if (configParam.equals(SECURITY_CONFIG)) {
      config = SConfiguration.create();
    } else {
      return;
    }
    exportToJson(config, output);
  }

  public static void exportToJson(Configuration configuration, Appendable output) {
    Map<String, String> map = Maps.newHashMapWithExpectedSize(configuration.size());
    for (Map.Entry<String, String> entry : configuration) {
      map.put(entry.getKey(), entry.getValue());
    }
    new GsonBuilder().setPrettyPrinting().create().toJson(map, output);
  }

  public static void main(String[] args) {
    String programName = System.getProperty("script", "ConfigurationJsonTool");
    Set<String> validArgument = Sets.newHashSet();
    validArgument.add(CDAP_CONFIG);
    validArgument.add(SECURITY_CONFIG);
    if (args.length != 1 || !(validArgument.contains(args[0]))) {
      System.err.println(String.format("Usage: %s (%s | %s)", programName, CDAP_CONFIG, SECURITY_CONFIG));
      System.exit(1);
    }

    PrintStream stdout = System.out;

    // Redirect the stdout to null to suppress any log outputs generated during the json generation
    System.setOut(new PrintStream(ByteStreams.nullOutputStream()));
    StringBuilder output = new StringBuilder();
    exportToJson(args[0], output);

    // Restore the stdout
    System.setOut(stdout);
    System.out.print(output);
  }
}
