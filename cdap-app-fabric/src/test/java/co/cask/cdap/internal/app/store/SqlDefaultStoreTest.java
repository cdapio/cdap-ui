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
 */

package co.cask.cdap.internal.app.store;

import co.cask.cdap.common.AlreadyExistsException;
import co.cask.cdap.common.conf.CConfiguration;
import co.cask.cdap.data2.dataset2.DatasetFramework;
import co.cask.cdap.data2.sql.PostgresSqlStructuredTableAdmin;
import co.cask.cdap.data2.sql.SqlTransactionRunner;
import co.cask.cdap.internal.AppFabricTestHelper;
import co.cask.cdap.internal.app.namespace.DefaultNamespaceAdmin;
import co.cask.cdap.internal.app.namespace.NamespaceResourceDeleter;
import co.cask.cdap.internal.app.namespace.StorageProviderNamespaceAdmin;
import co.cask.cdap.security.impersonation.Impersonator;
import co.cask.cdap.security.spi.authentication.AuthenticationContext;
import co.cask.cdap.security.spi.authorization.AuthorizationEnforcer;
import co.cask.cdap.spi.data.StructuredTableAdmin;
import co.cask.cdap.spi.data.transaction.TransactionRunner;
import co.cask.cdap.store.DefaultNamespaceStore;
import co.cask.cdap.store.StoreDefinition;
import com.google.inject.Injector;
import com.opentable.db.postgres.embedded.EmbeddedPostgres;
import org.junit.BeforeClass;

import java.io.IOException;
import javax.sql.DataSource;

public class SqlDefaultStoreTest extends DefaultStoreTest {

  @BeforeClass
  public static void beforeClass() throws IOException, AlreadyExistsException {
    Injector injector = AppFabricTestHelper.getInjector();
    // TODO(CDAP-14770): change this when migrating DefaultStore
    store = injector.getInstance(DefaultStore.class);

    EmbeddedPostgres pg = EmbeddedPostgres.start();
    DataSource dataSource = pg.getPostgresDatabase();
    StructuredTableAdmin structuredTableAdmin = new PostgresSqlStructuredTableAdmin(dataSource);
    TransactionRunner transactionRunner = new SqlTransactionRunner(structuredTableAdmin, dataSource);

    nsStore = new DefaultNamespaceStore(transactionRunner);
    nsAdmin = new DefaultNamespaceAdmin(
      nsStore, store, injector.getInstance(DatasetFramework.class),
      injector.getProvider(NamespaceResourceDeleter.class), injector.getProvider(StorageProviderNamespaceAdmin.class),
      injector.getInstance(CConfiguration.class), injector.getInstance(Impersonator.class),
      injector.getInstance(AuthorizationEnforcer.class), injector.getInstance(AuthenticationContext.class));
    StoreDefinition.NamespaceStore.createTables(structuredTableAdmin);
  }

}
