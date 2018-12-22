/*
 * Copyright © 2015-2018 Cask Data, Inc.
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

package co.cask.cdap.data.view;

import co.cask.cdap.api.metrics.MetricsCollectionService;
import co.cask.cdap.common.conf.CConfiguration;
import co.cask.cdap.common.guice.ConfigModule;
import co.cask.cdap.common.guice.InMemoryDiscoveryModule;
import co.cask.cdap.common.guice.LocationRuntimeModule;
import co.cask.cdap.common.guice.NamespaceAdminTestModule;
import co.cask.cdap.common.metrics.NoOpMetricsCollectionService;
import co.cask.cdap.data.runtime.DataFabricModules;
import co.cask.cdap.data.runtime.DataSetServiceModules;
import co.cask.cdap.data.runtime.DataSetsModules;
import co.cask.cdap.data2.datafabric.dataset.service.DatasetService;
import co.cask.cdap.explore.client.ExploreClient;
import co.cask.cdap.explore.client.MockExploreClient;
import co.cask.cdap.security.auth.context.AuthenticationContextModules;
import co.cask.cdap.security.authorization.AuthorizationEnforcementModule;
import co.cask.cdap.security.authorization.AuthorizationTestModule;
import co.cask.cdap.security.impersonation.DefaultOwnerAdmin;
import co.cask.cdap.security.impersonation.OwnerAdmin;
import co.cask.cdap.security.impersonation.UGIProvider;
import co.cask.cdap.security.impersonation.UnsupportedUGIProvider;
import com.google.inject.AbstractModule;
import com.google.inject.Guice;
import com.google.inject.Injector;
import com.google.inject.Scopes;
import com.google.inject.Singleton;
import org.apache.hadoop.conf.Configuration;
import org.apache.tephra.TransactionManager;
import org.junit.AfterClass;
import org.junit.BeforeClass;

/**
 * Test the {@link InMemoryViewStore} implementation.
 */
public class MDSViewStoreTest extends ViewStoreTestBase {

  private static ViewStore viewStore;
  private static DatasetService datasetService;
  private static TransactionManager transactionManager;

  @BeforeClass
  public static void init() {
    Injector injector = Guice.createInjector(
      new ConfigModule(CConfiguration.create(), new Configuration()),
      new DataSetServiceModules().getInMemoryModules(),
      new DataSetsModules().getStandaloneModules(),
      new DataFabricModules().getInMemoryModules(),
      new InMemoryDiscoveryModule(),
      new NamespaceAdminTestModule(),
      new LocationRuntimeModule().getInMemoryModules(),
      new AuthorizationTestModule(),
      new AuthorizationEnforcementModule().getInMemoryModules(),
      new AuthenticationContextModules().getMasterModule(),
      new AbstractModule() {
        @Override
        protected void configure() {
          bind(OwnerAdmin.class).to(DefaultOwnerAdmin.class);
          bind(MetricsCollectionService.class).to(NoOpMetricsCollectionService.class).in(Singleton.class);
          bind(ExploreClient.class).to(MockExploreClient.class);
          bind(ViewStore.class).to(MDSViewStore.class).in(Scopes.SINGLETON);
          bind(UGIProvider.class).to(UnsupportedUGIProvider.class);
        }
      }
    );

    viewStore = injector.getInstance(ViewStore.class);
    transactionManager = injector.getInstance(TransactionManager.class);
    transactionManager.startAndWait();
    datasetService = injector.getInstance(DatasetService.class);
    datasetService.startAndWait();
  }

  @AfterClass
  public static void destroy() throws Exception {
    datasetService.stopAndWait();
    transactionManager.stopAndWait();
  }

  @Override
  protected ViewStore getExploreViewStore() {
    return viewStore;
  }
}
