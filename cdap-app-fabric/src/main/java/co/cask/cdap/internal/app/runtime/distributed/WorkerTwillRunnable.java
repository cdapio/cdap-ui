/*
 * Copyright © 2015-2016 Cask Data, Inc.
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

package co.cask.cdap.internal.app.runtime.distributed;

import co.cask.cdap.api.data.stream.StreamWriter;
import co.cask.cdap.app.stream.DefaultStreamWriter;
import co.cask.cdap.app.stream.StreamWriterFactory;
import co.cask.cdap.common.conf.CConfiguration;
import co.cask.cdap.internal.app.runtime.worker.WorkerProgramRunner;
import co.cask.cdap.proto.id.ProgramId;
import com.google.inject.AbstractModule;
import com.google.inject.Module;
import com.google.inject.assistedinject.FactoryModuleBuilder;
import org.apache.hadoop.conf.Configuration;
import org.apache.twill.api.TwillContext;

import javax.annotation.Nullable;

/**
 * A TwillRunnable for running Workers in distributed mode.
 */
public class WorkerTwillRunnable extends AbstractProgramTwillRunnable<WorkerProgramRunner> {

  protected WorkerTwillRunnable(String name) {
    super(name);
  }

  @Override
  protected Module createModule(CConfiguration cConf, Configuration hConf, TwillContext context, ProgramId programId,
                                String runId, String instanceId, @Nullable String principal) {
    Module module = super.createModule(cConf, hConf, context, programId, runId, instanceId, principal);

    return new AbstractModule() {
      @Override
      protected void configure() {
        install(module);

        // Bindings for StreamWriter
        install(new FactoryModuleBuilder().implement(StreamWriter.class, DefaultStreamWriter.class)
                  .build(StreamWriterFactory.class));
      }
    };
  }
}
