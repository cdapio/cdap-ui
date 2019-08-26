/*
 * Copyright © 2014-2017 Cask Data, Inc.
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

package io.cdap.cdap.data2.transaction.coprocessor;

import io.cdap.cdap.common.lang.ThrowingFunction;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.hbase.TableName;
import org.apache.hadoop.hbase.client.Table;
import org.apache.tephra.coprocessor.TransactionStateCache;
import org.apache.tephra.coprocessor.TransactionStateCacheSupplier;

import java.io.IOException;

/**
 * Provides a single shared instance of
 * {@link DefaultTransactionStateCache} for use by transaction
 * coprocessors.
 */
public class DefaultTransactionStateCacheSupplier extends TransactionStateCacheSupplier {
  public DefaultTransactionStateCacheSupplier(ThrowingFunction<TableName, Table, IOException> tableFunc,
                                              Configuration conf, String tablePrefix) {
    super(() -> {
      TransactionStateCache cache = new DefaultTransactionStateCache(tableFunc, tablePrefix);
      cache.setConf(conf);
      return cache;
    });
  }
}
