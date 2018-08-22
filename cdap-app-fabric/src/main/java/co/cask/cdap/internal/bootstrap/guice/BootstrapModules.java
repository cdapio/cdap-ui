/*
 * Copyright © 2018 Cask Data, Inc.
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

package co.cask.cdap.internal.bootstrap.guice;

import co.cask.cdap.internal.bootstrap.BootstrapConfig;
import co.cask.cdap.internal.bootstrap.BootstrapConfigProvider;
import co.cask.cdap.internal.bootstrap.BootstrapService;
import co.cask.cdap.internal.bootstrap.BootstrapStep;
import co.cask.cdap.internal.bootstrap.FileBootstrapConfigProvider;
import co.cask.cdap.internal.bootstrap.InMemoryBootstrapConfigProvider;
import co.cask.cdap.internal.bootstrap.executor.BootstrapStepExecutor;
import co.cask.cdap.internal.bootstrap.executor.DefaultNamespaceCreator;
import co.cask.cdap.internal.bootstrap.executor.NativeProfileCreator;
import co.cask.cdap.internal.bootstrap.executor.SystemArtifactLoader;
import co.cask.cdap.internal.bootstrap.executor.SystemProfileCreator;
import com.google.inject.AbstractModule;
import com.google.inject.Module;
import com.google.inject.Scopes;
import com.google.inject.multibindings.MapBinder;

/**
 * Guice bindings for bootstrap classes. Binds {@link BootstrapService} as a singleton and binds
 * {@link BootstrapStep.Type} to a {@link BootstrapStepExecutor} responsible for executing that type of step.
 * For unit tests, the in memory module should be used, which will create the default namespace and native profile.
 * For actual CDAP instances, the file based module should be used.
 */
public class BootstrapModules {

  /**
   * @return bootstrap module for use in unit tests
   */
  public static Module getInMemoryModule() {
    return new BaseModule() {
      @Override
      protected void configure() {
        super.configure();
        BootstrapConfigProvider inMemoryProvider = new InMemoryBootstrapConfigProvider(BootstrapConfig.DEFAULT);
        bind(BootstrapConfigProvider.class).toInstance(inMemoryProvider);
      }
    };
  }

  /**
   * @return bootstrap module for use in sandbox and distributed
   */
  public static Module getFileBasedModule() {
    return new BaseModule() {
      @Override
      protected void configure() {
        super.configure();
        bind(BootstrapConfigProvider.class).to(FileBootstrapConfigProvider.class);
      }
    };
  }

  /**
   * Bindings common to all modules
   */
  private abstract static class BaseModule extends AbstractModule {

    @Override
    protected void configure() {
      bind(BootstrapService.class).in(Scopes.SINGLETON);
      MapBinder<BootstrapStep.Type, BootstrapStepExecutor> mapBinder = MapBinder.newMapBinder(
        binder(), BootstrapStep.Type.class, BootstrapStepExecutor.class);
      mapBinder.addBinding(BootstrapStep.Type.CREATE_DEFAULT_NAMESPACE).to(DefaultNamespaceCreator.class);
      mapBinder.addBinding(BootstrapStep.Type.CREATE_NATIVE_PROFILE).to(NativeProfileCreator.class);
      mapBinder.addBinding(BootstrapStep.Type.CREATE_SYSTEM_PROFILE).to(SystemProfileCreator.class);
      mapBinder.addBinding(BootstrapStep.Type.LOAD_SYSTEM_ARTIFACTS).to(SystemArtifactLoader.class);
    }
  }
}
