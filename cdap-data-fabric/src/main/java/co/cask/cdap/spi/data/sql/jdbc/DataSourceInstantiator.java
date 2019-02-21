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

package co.cask.cdap.spi.data.sql.jdbc;


import co.cask.cdap.common.conf.CConfiguration;
import co.cask.cdap.common.conf.Constants;
import co.cask.cdap.common.conf.SConfiguration;
import co.cask.cdap.common.lang.DirectoryClassLoader;
import com.google.common.base.Throwables;
import com.google.inject.Inject;
import org.apache.commons.dbcp2.ConnectionFactory;
import org.apache.commons.dbcp2.DriverManagerConnectionFactory;
import org.apache.commons.dbcp2.PoolableConnection;
import org.apache.commons.dbcp2.PoolableConnectionFactory;
import org.apache.commons.dbcp2.PoolingDataSource;
import org.apache.commons.pool2.ObjectPool;
import org.apache.commons.pool2.impl.GenericObjectPool;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.sql.Driver;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Map;
import java.util.Properties;
import java.util.function.Supplier;
import javax.sql.DataSource;

/**
 * Class to instantiate the {@link DataSource} for the sql related structured table.
 */
public class DataSourceInstantiator implements Supplier<DataSource> {
  private static final Logger LOG = LoggerFactory.getLogger(DataSourceInstantiator.class);

  private final CConfiguration cConf;
  private final SConfiguration sConf;

  private volatile DataSource dataSource;

  @Inject
  public DataSourceInstantiator(CConfiguration cConf, SConfiguration sConf) {
    this.cConf = cConf;
    this.sConf = sConf;
  }

  @Override
  public DataSource get() {
    if (dataSource != null) {
      return dataSource;
    }
    return constructDataSource();
  }

  private synchronized DataSource constructDataSource() {
    // this is needed to prevent recreation of the DataSource if the get() method is called concurrently
    if (dataSource != null) {
      return dataSource;
    }
    if (!cConf.get(Constants.Dataset.DATA_STORAGE_IMPLEMENTATION).equals(Constants.Dataset.DATA_STORAGE_SQL)) {
      throw new IllegalArgumentException("Cannot instantiate the data source if the storage implementation is nosql.");
    }

    loadJDBCDriver();

    String jdbcUrl = cConf.get(Constants.Dataset.DATA_STORAGE_SQL_JDBC_CONNECTION_URL);
    if (jdbcUrl == null) {
      throw new IllegalArgumentException("The jdbc connection url is not specified.");
    }
    Properties properties = retrieveJDBCConnectionProperties();
    LOG.info("Creating the DataSource with jdbc url: {}", jdbcUrl);

    ConnectionFactory connectionFactory = new DriverManagerConnectionFactory(jdbcUrl, properties);
    PoolableConnectionFactory poolableConnectionFactory = new PoolableConnectionFactory(connectionFactory, null);
    // The GenericObjectPool is thread safe according to the javadoc,
    // the PoolingDataSource will be thread safe as long as the connectin pool is thread-safe
    ObjectPool<PoolableConnection> connectionPool = new GenericObjectPool<>(poolableConnectionFactory);
    poolableConnectionFactory.setPool(connectionPool);
    dataSource = new PoolingDataSource<>(connectionPool);
    return dataSource;
  }

  private Properties retrieveJDBCConnectionProperties() {
    Properties properties = new Properties();
    String username = sConf.get(Constants.Dataset.DATA_STORAGE_SQL_USERNAME);
    String password = sConf.get(Constants.Dataset.DATA_STORAGE_SQL_PASSWORD);
    if ((username == null) != (password == null)) {
      throw new IllegalArgumentException("The username and password for the jdbc connection must both be set" +
                                           " or both not be set.");
    }

    if (username != null) {
      properties.setProperty("user", username);
      properties.setProperty("password", password);
    }

    for (Map.Entry<String, String> cConfEntry : cConf) {
      if (cConfEntry.getKey().startsWith(Constants.Dataset.DATA_STORAGE_SQL_PROPERTY_PREFIX)) {
        properties.put(cConfEntry.getKey().substring(Constants.Dataset.DATA_STORAGE_SQL_PROPERTY_PREFIX.length()),
                       cConfEntry.getValue());
      }
    }
    return properties;
  }

  private void loadJDBCDriver() {
    String driverExtensionPath = cConf.get(Constants.Dataset.DATA_STORAGE_SQL_DRIVER_DIRECTORY);
    String driverName = cConf.get(Constants.Dataset.DATA_STORAGE_SQL_JDBC_DRIVER_NAME);
    if (driverExtensionPath == null || driverName == null) {
      throw new IllegalArgumentException("The JDBC driver directory and driver name must be specified.");
    }
    DirectoryClassLoader directoryClassLoader =
      new DirectoryClassLoader(new File(driverExtensionPath), DataSourceInstantiator.class.getClassLoader());
    try {
      Driver driver = (Driver) Class.forName(driverName, true, directoryClassLoader).newInstance();

      // wrap the driver class and register it ourselves since the driver manager will not use driver from other
      // classloader
      JDBCDriverShim driverShim = new JDBCDriverShim(driver);
      DriverManager.registerDriver(driverShim);
    } catch (InstantiationException | IllegalAccessException | ClassNotFoundException | SQLException e) {
      Throwables.propagate(e);
    }

    LOG.info("Successfully loaded {} from {}", driverName, driverExtensionPath);
  }
}
