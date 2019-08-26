/*
 * Copyright © 2017 Cask Data, Inc.
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

package io.cdap.cdap.data2.util.hbase;

import io.cdap.cdap.common.conf.CConfiguration;
import io.cdap.cdap.common.conf.Constants;
import io.cdap.cdap.common.lang.ThrowingFunction;
import org.apache.hadoop.hbase.TableName;
import org.apache.hadoop.hbase.client.Table;

import java.io.IOException;
import java.util.function.Function;

/**
 * This class implements the reading of the {@link CConfiguration} from HBase, when inside a coprocessor.
 */
public final class CoprocessorCConfigurationReader extends ConfigurationReader implements CConfigurationReader {

  /**
   * Constructor using the coprocessor environment. In order to construct the correct table name,
   * the CDAP table namespace prefix must be provided. This is configured in the {@link CConfiguration}
   * as well as an attribute for the HBase tables created by CDAP; in both cases with the key
   * {@link Constants.Dataset#TABLE_PREFIX}.
   *
   * @param tableFunc a {@link Function} to provide a {@link Table} based on {@link TableName}.
   * @param tablePrefix the namespace prefix used for CDAP tables
   */
  public CoprocessorCConfigurationReader(ThrowingFunction<TableName, Table, IOException> tableFunc,
                                         String tablePrefix) {
    super(new ConfigurationTableProvider() {

      private final TableName tableName =
        TableName.valueOf(HTableNameConverter.getSystemNamespace(tablePrefix), ConfigurationReader.TABLE_NAME);

      @Override
      public Table get() throws IOException {
        return tableFunc.apply(tableName);
      }

      @Override
      public String getTableName() {
        return tableName.toString();
      }
    });
  }

  @Override
  public CConfiguration read() throws IOException {
    return read(Type.DEFAULT);
  }
}
